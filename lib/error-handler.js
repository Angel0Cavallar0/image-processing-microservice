import { ERROR_CODES, DEFAULT_TIMEOUT_MS } from './constants.js';

/**
 * Classe de erro customizada para a API
 */
export class APIError extends Error {
  constructor(message, code = ERROR_CODES.PROCESSING_ERROR, statusCode = 500) {
    super(message);
    this.name = 'APIError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

/**
 * Tratamento padronizado de erros
 */
export function handleError(error, res) {
  console.error('Error:', error);

  // Se já é um APIError, usa statusCode e code
  if (error instanceof APIError) {
    return res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message
      }
    });
  }

  // Erros do Sharp
  if (error.message?.includes('Input buffer') || error.message?.includes('sharp')) {
    return res.status(400).json({
      success: false,
      error: {
        code: ERROR_CODES.INVALID_INPUT,
        message: 'Imagem inválida ou corrompida'
      }
    });
  }

  // Erro genérico
  return res.status(500).json({
    success: false,
    error: {
      code: ERROR_CODES.PROCESSING_ERROR,
      message: 'Erro ao processar imagem'
    }
  });
}

/**
 * Adiciona timeout a uma promise
 */
export function withTimeout(promise, timeoutMs = DEFAULT_TIMEOUT_MS) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => {
        reject(new APIError(
          'Operação excedeu o tempo limite',
          ERROR_CODES.TIMEOUT,
          504
        ));
      }, timeoutMs)
    )
  ]);
}

/**
 * Handler para validar método HTTP
 */
export function validateMethod(req, res, allowedMethods = ['POST']) {
  if (!allowedMethods.includes(req.method)) {
    res.status(405).json({
      success: false,
      error: {
        code: ERROR_CODES.INVALID_INPUT,
        message: `Método ${req.method} não permitido. Use: ${allowedMethods.join(', ')}`
      }
    });
    return false;
  }
  return true;
}

/**
 * Handler para CORS preflight
 */
export function handleCORS(req, res) {
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  return false;
}
