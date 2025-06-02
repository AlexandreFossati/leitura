import { query } from './client.js';

/**
 * Registra um erro no banco de dados
 * @param {string} errorName - Identificador do erro (letras minúsculas separadas por underline)
 * @param {string} details - Detalhes do erro
 * @returns {Promise<void>}
 */
export async function logError(errorName, details) {
    try {
        await query(
            'INSERT INTO log_errors (time, error_name, details) VALUES (NOW(), $1, $2)',
            [errorName, details]
        );
    } catch (err) {
        console.error('Erro ao registrar log:', err);
        // Não propaga o erro pois é uma operação secundária
    }
} 