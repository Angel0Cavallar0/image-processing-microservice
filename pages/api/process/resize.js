import {
  validateBase64,
  validateDimensions,
  validateFormat,
  validateFitMode,
  validateQuality
} from '../../../lib/validators.js';
import {
  base64ToBuffer,
  bufferToBase64,
  resizeImage
} from '../../../lib/sharp-utils.js';
import {
  handleError,
  validateMethod,
  handleCORS,
  withTimeout,
  APIError
} from '../../../lib/error-handler.js';
import { ERROR_CODES } from '../../../lib/constants.js';

export default async function handler(req, res) {
  // Handle CORS preflight
  if (handleCORS(req, res)) return;

  // Valida método HTTP
  if (!validateMethod(req, res, ['POST'])) return;

  try {
    const { image, width, height, fit, format, quality } = req.body;

    // Valida parâmetros obrigatórios
    if (!image) {
      throw new APIError(
        'Parâmetro "image" é obrigatório',
        ERROR_CODES.MISSING_PARAMETER,
        400
      );
    }

    if (!width || !height) {
      throw new APIError(
        'Parâmetros "width" e "height" são obrigatórios',
        ERROR_CODES.MISSING_PARAMETER,
        400
      );
    }

    // Valida inputs
    const base64Data = validateBase64(image);
    validateDimensions(width, height);
    const validatedFormat = validateFormat(format);
    const validatedFit = validateFitMode(fit);
    const validatedQuality = validateQuality(quality);

    // Processa imagem com timeout
    const processImage = async () => {
      // Converte base64 para buffer
      const inputBuffer = base64ToBuffer(base64Data);

      // Redimensiona
      const outputBuffer = await resizeImage(inputBuffer, width, height, {
        fit: validatedFit,
        format: validatedFormat,
        quality: validatedQuality
      });

      // Converte de volta para base64
      return bufferToBase64(outputBuffer, validatedFormat);
    };

    const resultBase64 = await withTimeout(processImage());

    // Retorna resultado
    res.status(200).json({
      success: true,
      data: {
        image: resultBase64,
        width,
        height,
        format: validatedFormat
      }
    });
  } catch (error) {
    handleError(error, res);
  }
}
