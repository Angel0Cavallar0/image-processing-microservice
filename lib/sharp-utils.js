import sharp from 'sharp';
import { DEFAULT_JPEG_QUALITY, DEFAULT_WEBP_QUALITY, DEFAULT_PNG_COMPRESSION } from './constants.js';

/**
 * Converte base64 para Buffer
 */
export function base64ToBuffer(base64String) {
  // Remove data URI prefix se existir
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
  return Buffer.from(base64Data, 'base64');
}

/**
 * Converte Buffer para base64
 */
export function bufferToBase64(buffer, format = 'jpeg') {
  const base64 = buffer.toString('base64');
  const mimeType = format === 'jpeg' ? 'image/jpeg' : `image/${format}`;
  return `data:${mimeType};base64,${base64}`;
}

/**
 * Redimensiona uma imagem
 */
export async function resizeImage(buffer, width, height, options = {}) {
  const {
    fit = 'cover',
    quality = DEFAULT_JPEG_QUALITY,
    format = 'jpeg'
  } = options;

  let sharpInstance = sharp(buffer).resize(width, height, {
    fit,
    withoutEnlargement: false
  });

  sharpInstance = applyOutputFormat(sharpInstance, format, quality);

  return await sharpInstance.toBuffer();
}

/**
 * Combina múltiplas imagens (composite)
 */
export async function compositeImages(baseBuffer, layers) {
  // Converte layers para formato do Sharp
  const compositeInputs = await Promise.all(
    layers.map(async (layer) => {
      const layerBuffer = base64ToBuffer(layer.image);
      return {
        input: layerBuffer,
        top: layer.y,
        left: layer.x
      };
    })
  );

  const result = await sharp(baseBuffer)
    .composite(compositeInputs)
    .toBuffer();

  return result;
}

/**
 * Aplica formato de saída à imagem
 */
export function applyOutputFormat(sharpInstance, format, quality) {
  switch (format) {
    case 'jpeg':
      return sharpInstance.jpeg({ quality });

    case 'png':
      return sharpInstance.png({
        compressionLevel: DEFAULT_PNG_COMPRESSION,
        quality
      });

    case 'webp':
      return sharpInstance.webp({
        quality: quality || DEFAULT_WEBP_QUALITY
      });

    default:
      return sharpInstance.jpeg({ quality: DEFAULT_JPEG_QUALITY });
  }
}

/**
 * Obtém metadados da imagem
 */
export async function getImageMetadata(buffer) {
  const metadata = await sharp(buffer).metadata();
  return {
    width: metadata.width,
    height: metadata.height,
    format: metadata.format,
    space: metadata.space,
    channels: metadata.channels,
    hasAlpha: metadata.hasAlpha
  };
}

/**
 * Converte imagem para formato específico
 */
export async function convertFormat(buffer, targetFormat, quality) {
  let sharpInstance = sharp(buffer);
  sharpInstance = applyOutputFormat(sharpInstance, targetFormat, quality);
  return await sharpInstance.toBuffer();
}

/**
 * Extrai região específica da imagem
 */
export async function extractRegion(buffer, left, top, width, height) {
  return await sharp(buffer)
    .extract({ left, top, width, height })
    .toBuffer();
}
