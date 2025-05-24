import pg from 'pg';
import { dbConfig } from '../config/database.js';

const { Pool } = pg;

// Criar pool de conexões
const pool = new Pool(dbConfig);

// Evento para log de erros
pool.on('error', (err) => {
    console.error('Erro inesperado no cliente do pool:', err);
});

export async function query(text, params) {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('Query executada:', { text, duration, rows: res.rowCount });
        return res;
    } catch (err) {
        console.error('Erro ao executar query:', err);
        throw err;
    }
} 