import dotenv from 'dotenv';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Função para obter uma variável de ambiente com validação
function getEnvVar(name, required = true) {
    const value = process.env[name];
    if (required && !value) {
        throw new Error(`Variável de ambiente ${name} não está definida`);
    }
    return value;
}

// Exporta as variáveis de ambiente validadas
export const env = {
    DB_HOST: getEnvVar('DB_HOST'),
    DB_PORT: parseInt(getEnvVar('DB_PORT')),
    DB_NAME: getEnvVar('DB_NAME'),
    DB_USER: getEnvVar('DB_USER'),
    DB_PASSWORD: getEnvVar('DB_PASSWORD'),
    DB_MAX_POOL: parseInt(getEnvVar('DB_MAX_POOL')),
    DB_IDLE_TIMEOUT: parseInt(getEnvVar('DB_IDLE_TIMEOUT')),
    DB_CONNECTION_TIMEOUT: parseInt(getEnvVar('DB_CONNECTION_TIMEOUT'))
}; 