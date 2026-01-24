import {
  MAX_IMAGE_SIZE_BYTES,
  MAX_IMAGE_DIMENSION,
  MIN_IMAGE_DIMENSION,
  SUPPORTED_FORMATS,
  FIT_MODES,
  MAX_LAYERS,
  MAX_PIPELINE_STEPS,
  ERROR_CODES
} from './constants.js';
import { APIError } from './error-handler.js';

/**
 * Valida uma string base64 de imagem
 */
export function validateBase64(str) {
  if (!str || typeof str !== 'string') {
    throw new APIError(
      'Imagem base64 é obrigatória',
      ERROR_CODES.INVALID_INPUT,
      400
    );
  }

  // Remove data URI prefix se existir
  const base64Data = str.replace(/^data:image\/\w+;base64,/, '');

  // Valida formato base64
  const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
  if (!base64Regex.test(base64Data)) {
    throw new APIError(
      'Formato base64 inválido',
      ERROR_CODES.INVALID_INPUT,
      400
    );
  }

  // Calcula tamanho aproximado em bytes
  const sizeInBytes = (base64Data.length * 3) / 4;
  if (sizeInBytes > MAX_IMAGE_SIZE_BYTES) {
    throw new APIError(
      `Imagem muito grande. Máximo: ${MAX_IMAGE_SIZE_BYTES / 1024 / 1024}MB`,
      ERROR_CODES.IMAGE_TOO_LARGE,
      413
    );
  }

  return base64Data;
}

/**
 * Valida dimensões de imagem
 */
export function validateDimensions(width, height) {
  if (typeof width !== 'number' || typeof height !== 'number') {
    throw new APIError(
      'Largura e altura devem ser números',
      ERROR_CODES.INVALID_DIMENSION,
      400
    );
  }

  if (width < MIN_IMAGE_DIMENSION || width > MAX_IMAGE_DIMENSION) {
    throw new APIError(
      `Largura deve estar entre ${MIN_IMAGE_DIMENSION}px e ${MAX_IMAGE_DIMENSION}px`,
      ERROR_CODES.INVALID_DIMENSION,
      400
    );
  }

  if (height < MIN_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
    throw new APIError(
      `Altura deve estar entre ${MIN_IMAGE_DIMENSION}px e ${MAX_IMAGE_DIMENSION}px`,
      ERROR_CODES.INVALID_DIMENSION,
      400
    );
  }

  return { width, height };
}

/**
 * Valida formato de saída
 */
export function validateFormat(format) {
  if (!format) {
    return 'jpeg'; // Default
  }

  const normalizedFormat = format.toLowerCase();
  if (!SUPPORTED_FORMATS.includes(normalizedFormat)) {
    throw new APIError(
      `Formato inválido. Suportados: ${SUPPORTED_FORMATS.join(', ')}`,
      ERROR_CODES.INVALID_FORMAT,
      400
    );
  }

  // Normaliza 'jpg' para 'jpeg'
  return normalizedFormat === 'jpg' ? 'jpeg' : normalizedFormat;
}

/**
 * Valida modo de fit para resize
 */
export function validateFitMode(fit) {
  if (!fit) {
    return 'cover'; // Default
  }

  if (!FIT_MODES.includes(fit)) {
    throw new APIError(
      `Modo de fit inválido. Suportados: ${FIT_MODES.join(', ')}`,
      ERROR_CODES.INVALID_INPUT,
      400
    );
  }

  return fit;
}

/**
 * Valida configuração de texto
 */
export function validateTextConfig(config) {
  if (!config || typeof config !== 'object') {
    throw new APIError(
      'Configuração de texto é obrigatória',
      ERROR_CODES.INVALID_INPUT,
      400
    );
  }

  if (!config.text || typeof config.text !== 'string') {
    throw new APIError(
      'Texto é obrigatório',
      ERROR_CODES.INVALID_INPUT,
      400
    );
  }

  // Sanitiza o texto
  const sanitizedText = sanitizeString(config.text);

  if (typeof config.x !== 'number' || typeof config.y !== 'number') {
    throw new APIError(
      'Posição x e y são obrigatórias e devem ser números',
      ERROR_CODES.INVALID_INPUT,
      400
    );
  }

  return {
    text: sanitizedText,
    x: config.x,
    y: config.y,
    fontSize: config.fontSize || 48,
    fontFamily: config.fontFamily || 'Roboto-Regular',
    color: config.color || '#FFFFFF'
  };
}

/**
 * Valida array de camadas para composite
 */
export function validateLayers(layers) {
  if (!Array.isArray(layers)) {
    throw new APIError(
      'Layers deve ser um array',
      ERROR_CODES.INVALID_INPUT,
      400
    );
  }

  if (layers.length === 0) {
    throw new APIError(
      'Pelo menos uma camada é necessária',
      ERROR_CODES.INVALID_INPUT,
      400
    );
  }

  if (layers.length > MAX_LAYERS) {
    throw new APIError(
      `Máximo de ${MAX_LAYERS} camadas permitidas`,
      ERROR_CODES.TOO_MANY_LAYERS,
      400
    );
  }

  return layers.map((layer, index) => {
    if (!layer.image) {
      throw new APIError(
        `Layer ${index}: imagem é obrigatória`,
        ERROR_CODES.INVALID_INPUT,
        400
      );
    }

    if (typeof layer.x !== 'number' || typeof layer.y !== 'number') {
      throw new APIError(
        `Layer ${index}: posição x e y são obrigatórias`,
        ERROR_CODES.INVALID_INPUT,
        400
      );
    }

    return {
      image: validateBase64(layer.image),
      x: layer.x,
      y: layer.y
    };
  });
}

/**
 * Valida steps do pipeline
 */
export function validatePipelineSteps(steps) {
  if (!Array.isArray(steps)) {
    throw new APIError(
      'Steps deve ser um array',
      ERROR_CODES.INVALID_INPUT,
      400
    );
  }

  if (steps.length === 0) {
    throw new APIError(
      'Pelo menos uma operação é necessária',
      ERROR_CODES.INVALID_INPUT,
      400
    );
  }

  if (steps.length > MAX_PIPELINE_STEPS) {
    throw new APIError(
      `Máximo de ${MAX_PIPELINE_STEPS} operações permitidas`,
      ERROR_CODES.TOO_MANY_STEPS,
      400
    );
  }

  const validOperations = ['resize', 'add-text', 'composite'];

  return steps.map((step, index) => {
    if (!step.op || !validOperations.includes(step.op)) {
      throw new APIError(
        `Step ${index}: operação inválida. Válidas: ${validOperations.join(', ')}`,
        ERROR_CODES.INVALID_OPERATION,
        400
      );
    }

    return step;
  });
}

/**
 * Sanitiza string para prevenir XSS
 */
export function sanitizeString(str) {
  if (typeof str !== 'string') {
    return '';
  }

  // Remove caracteres perigosos
  return str
    .replace(/[<>]/g, '')
    .trim()
    .substring(0, 500); // Limita tamanho
}

/**
 * Valida qualidade de imagem
 */
export function validateQuality(quality) {
  if (quality === undefined || quality === null) {
    return 85; // Default
  }

  const q = Number(quality);
  if (isNaN(q) || q < 1 || q > 100) {
    throw new APIError(
      'Qualidade deve estar entre 1 e 100',
      ERROR_CODES.INVALID_INPUT,
      400
    );
  }

  return q;
}
