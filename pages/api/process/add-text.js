import {
  validateBase64,
  validateTextConfig,
  validateFormat,
  validateQuality
} from '../../../lib/validators.js';
import {
  base64ToBuffer,
  bufferToBase64,
  applyOutputFormat
} from '../../../lib/sharp-utils.js';
import { addTextToImage } from '../../../lib/canvas-utils.js';
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
    const { image, text, format, quality } = req.body;

    // Valida parâmetros obrigatórios
    if (!image) {
      throw new APIError(
        'Parâmetro "image" é obrigatório',
        ERROR_CODES.MISSING_PARAMETER,
        400
      );
    }

    if (!text) {
      throw new APIError(
        'Parâmetro "text" é obrigatório',
        ERROR_CODES.MISSING_PARAMETER,
        400
      );
    }

    // Valida inputs
    const base64Data = validateBase64(image);
    const validatedTextConfig = validateTextConfig(text);
    const validatedFormat = validateFormat(format);
    const validatedQuality = validateQuality(quality);

    // Processa imagem com timeout
    const processImage = async () => {
      // Converte base64 para buffer
      const inputBuffer = base64ToBuffer(base64Data);

      // Adiciona texto usando Canvas
      const canvasBuffer = await addTextToImage(inputBuffer, validatedTextConfig);

      // Converte para formato final usando Sharp
      let sharpInstance = sharp(canvasBuffer);
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
        format: validatedFormat
      }
    });
  } catch (error) {
    handleError(error, res);
  }
}
