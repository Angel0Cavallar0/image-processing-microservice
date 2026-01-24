// Limites de segurança
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
export const MAX_IMAGE_DIMENSION = 4096; // pixels
export const MIN_IMAGE_DIMENSION = 10; // pixels
export const MAX_LAYERS = 10; // Máximo de camadas em composite
export const MAX_PIPELINE_STEPS = 20; // Máximo de operações em pipeline

// Configurações de qualidade
export const DEFAULT_JPEG_QUALITY = 85;
export const DEFAULT_WEBP_QUALITY = 85;
export const DEFAULT_PNG_COMPRESSION = 6;

// Formatos suportados
export const SUPPORTED_FORMATS = ['jpeg', 'jpg', 'png', 'webp'];

// Modos de fit para resize
export const FIT_MODES = ['cover', 'contain', 'fill', 'inside', 'outside'];

// Códigos de erro
export const ERROR_CODES = {
  INVALID_INPUT: 'INVALID_INPUT',
  IMAGE_TOO_LARGE: 'IMAGE_TOO_LARGE',
  INVALID_DIMENSION: 'INVALID_DIMENSION',
  INVALID_FORMAT: 'INVALID_FORMAT',
  PROCESSING_ERROR: 'PROCESSING_ERROR',
  TIMEOUT: 'TIMEOUT',
  MISSING_PARAMETER: 'MISSING_PARAMETER',
  TOO_MANY_LAYERS: 'TOO_MANY_LAYERS',
  TOO_MANY_STEPS: 'TOO_MANY_STEPS',
  INVALID_OPERATION: 'INVALID_OPERATION'
};

// Configurações de timeout
export const DEFAULT_TIMEOUT_MS = 25000; // 25 segundos (margem antes do timeout da Vercel)

// Configurações de fontes
export const DEFAULT_FONT_FAMILY = 'Roboto-Regular';
export const DEFAULT_FONT_SIZE = 48;
export const DEFAULT_TEXT_COLOR = '#FFFFFF';

// Configurações de template marketing
export const MARKETING_TEMPLATE_DEFAULTS = {
  width: 1200,
  height: 630,
  gradientColors: ['#4A90E2', '#8E2DE2'],
  titleFontSize: 72,
  subtitleFontSize: 36,
  logoSize: 200,
  titleColor: '#FFFFFF',
  subtitleColor: '#E0E0E0'
};
