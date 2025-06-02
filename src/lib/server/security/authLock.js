import { logError } from '../db/logs.js';
import { ERRORS } from '../../constants/errors.js';

/**
 * Controle de bloqueio do endpoint de autenticação
 * @type {{ failedAttempts: number, firstFailure: number | null, lockedUntil: number | null }}
 */
const authLockState = {
    failedAttempts: 0,
    firstFailure: null,
    lockedUntil: null
};

const MAX_FAILURES = 6;
const LOCK_DURATION = 60 * 60 * 1000; // 1 hora em ms

/**
 * Verifica se o endpoint está bloqueado
 * @returns {boolean}
 */
export function isEndpointLocked() {
    const now = Date.now();

    // Se está bloqueado, verifica se já pode ser desbloqueado
    if (authLockState.lockedUntil) {
        if (now < authLockState.lockedUntil) {
            return true;
        }
        // Reseta o estado se o bloqueio expirou
        resetLockState();
    }

    // Se passou 1 hora desde a primeira falha, reseta o contador
    if (authLockState.firstFailure && (now - authLockState.firstFailure >= LOCK_DURATION)) {
        resetLockState();
    }

    return false;
}

/**
 * Registra uma falha de autenticação
 * @returns {boolean} - Retorna true se o endpoint foi bloqueado
 */
export function registerAuthFailure() {
    const now = Date.now();

    // Registra a primeira falha
    if (!authLockState.firstFailure) {
        authLockState.firstFailure = now;
    }

    // Incrementa contador de falhas
    authLockState.failedAttempts++;

    // Se atingiu o limite, bloqueia o endpoint
    if (authLockState.failedAttempts >= MAX_FAILURES) {
        authLockState.lockedUntil = now + LOCK_DURATION;
        const lockEndTime = new Date(authLockState.lockedUntil).toISOString();
        console.warn(`Endpoint de autenticação bloqueado até ${lockEndTime}`);

        // Registra o bloqueio no banco de dados
        logError(
            ERRORS.AUTH_ENDPOINT_BLOCKED,
            `Authentication endpoint blocked after ${MAX_FAILURES} failed attempts. ` +
            `Blocked until ${lockEndTime}`
        );

        return true;
    }

    return false;
}

/**
 * Reseta o estado do bloqueio
 */
function resetLockState() {
    authLockState.failedAttempts = 0;
    authLockState.firstFailure = null;
    authLockState.lockedUntil = null;
} 