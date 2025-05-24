import { env } from '$env/dynamic/private';

export const dbConfig = {
    host: env.DB_HOST,
    port: parseInt(env.DB_PORT),
    database: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    // Configurações adicionais do pool
    max: parseInt(env.DB_MAX_POOL), // número máximo de clientes no pool
    idleTimeoutMillis: parseInt(env.DB_IDLE_TIMEOUT), // tempo máximo que um cliente pode ficar ocioso
    connectionTimeoutMillis: parseInt(env.DB_CONNECTION_TIMEOUT), // tempo máximo para estabelecer uma conexão
}; 