import {
  validateBase64,
  validatePipelineSteps,
  validateFormat,
  validateQuality,
  validateDimensions,
  validateTextConfig,
  validateFitMode,
  validateLayers
} from '../../lib/validators.js';
import {
  base64ToBuffer,
  bufferToBase64,
  resizeImage,
  compositeImages,
  applyOutputFormat
} from '../../lib/sharp-utils.js';
import { addTextToImage } from '../../lib/canvas-utils.js';
import {
  handleError,
  validateMethod,
  handleCORS,
  withTimeout,
  APIError
} from '../../lib/error-handler.js';
import { ERROR_CODES } from '../../lib/constants.js';
import sharp from 'sharp';

export default async function handler(req, res) {
  // Handle CORS preflight
  if (handleCORS(req, res)) return;

  // Valida método HTTP
  if (!validateMethod(req, res, ['POST'])) return;

  try {
    const { baseImage, steps, format, quality } = req.body;

    // Valida parâmetros obrigatórios
    if (!baseImage) {
      throw new APIError(
        'Parâmetro "baseImage" é obrigatório',
        ERROR_CODES.MISSING_PARAMETER,
        400
      );
    }

    if (!steps) {
      throw new APIError(
        'Parâmetro "steps" é obrigatório',
        ERROR_CODES.MISSING_PARAMETER,
        400
      );
    }

    // Valida inputs
    const base64Data = validateBase64(baseImage);
    const validatedSteps = validatePipelineSteps(steps);
    const validatedFormat = validateFormat(format);
    const validatedQuality = validateQuality(quality);

    // Processa pipeline com timeout
    const processPipeline = async () => {
      let currentBuffer = base64ToBuffer(base64Data);

      // Executa cada operação em sequência
      for (let i = 0; i < validatedSteps.length; i++) {
        const step = validatedSteps[i];

        switch (step.op) {
          case 'resize':
            {
              if (!step.width || !step.height) {
                throw new APIError(
                  `Step ${i}: resize requer width e height`,
                  ERROR_CODES.MISSING_PARAMETER,
                  400
                );
              }

              validateDimensions(step.width, step.height);
              const fit = validateFitMode(step.fit);

              currentBuffer = await resizeImage(currentBuffer, step.width, step.height, {
                fit,
                format: 'png',
                quality: 100
              });
            }
            break;

          case 'add-text':
            {
              if (!step.text) {
                throw new APIError(
                  `Step ${i}: add-text requer configuração de texto`,
                  ERROR_CODES.MISSING_PARAMETER,
                  400
                );
              }

              const textConfig = validateTextConfig(step.text);
              currentBuffer = await addTextToImage(currentBuffer, textConfig);
            }
            break;

          case 'composite':
            {
              if (!step.layers) {
                throw new APIError(
                  `Step ${i}: composite requer layers`,
                  ERROR_CODES.MISSING_PARAMETER,
                  400
                );
              }

              const layers = validateLayers(step.layers);
              currentBuffer = await compositeImages(currentBuffer, layers);
            }
            break;

          default:
            throw new APIError(
              `Step ${i}: operação "${step.op}" não reconhecida`,
              ERROR_CODES.INVALID_OPERATION,
              400
            );
        }
      }

      // Aplica formato final
      let sharpInstance = sharp(currentBuffer);
      sharpInstance = applyOutputFormat(sharpInstance, validatedFormat, validatedQuality);
      const outputBuffer = await sharpInstance.toBuffer();

      // Converte de volta para base64
      return bufferToBase64(outputBuffer, validatedFormat);
    };

    const resultBase64 = await withTimeout(processPipeline());

    // Retorna resultado
    res.status(200).json({
      success: true,
      data: {
        image: resultBase64,
        format: validatedFormat,
        stepsExecuted: validatedSteps.length
      }
    });
  } catch (error) {
    handleError(error, res);
  }
}
