import {
  validateBase64,
  validateLayers,
  validateFormat,
  validateQuality
} from '../../../lib/validators.js';
import {
  base64ToBuffer,
  bufferToBase64,
  compositeImages,
  applyOutputFormat
} from '../../../lib/sharp-utils.js';
import {
  handleError,
  validateMethod,
  handleCORS,
  withTimeout,
  APIError
} from '../../../lib/error-handler.js';
import { ERROR_CODES } from '../../../lib/constants.js';
import sharp from 'sharp';

export default async function handler(req, res) {
  // Handle CORS preflight
  if (handleCORS(req, res)) return;

  // Valida método HTTP
  if (!validateMethod(req, res, ['POST'])) return;

  try {
    const { baseImage, layers, format, quality } = req.body;

    // Valida parâmetros obrigatórios
    if (!baseImage) {
      throw new APIError(
        'Parâmetro "baseImage" é obrigatório',
        ERROR_CODES.MISSING_PARAMETER,
        400
      );
    }

    if (!layers) {
      throw new APIError(
        'Parâmetro "layers" é obrigatório',
        ERROR_CODES.MISSING_PARAMETER,
        400
      );
    }

    // Valida inputs
    const base64Data = validateBase64(baseImage);
    const validatedLayers = validateLayers(layers);
    const validatedFormat = validateFormat(format);
    const validatedQuality = validateQuality(quality);

    // Processa imagem com timeout
    const processImage = async () => {
      // Converte base64 para buffer
      const baseBuffer = base64ToBuffer(base64Data);

      // Combina imagens
      const compositeBuffer = await compositeImages(baseBuffer, validatedLayers);

      // Aplica formato final
      let sharpInstance = sharp(compositeBuffer);
      sharpInstance = applyOutputFormat(sharpInstance, validatedFormat, validatedQuality);
      const outputBuffer = await sharpInstance.toBuffer();

      // Converte de volta para base64
      return bufferToBase64(outputBuffer, validatedFormat);
    };

    const resultBase64 = await withTimeout(processImage());

    // Retorna resultado
    res.status(200).json({
      success: true,
      data: {
        image: resultBase64,
        format: validatedFormat,
        layersCount: validatedLayers.length
      }
    });
  } catch (error) {
    handleError(error, res);
  }
}
