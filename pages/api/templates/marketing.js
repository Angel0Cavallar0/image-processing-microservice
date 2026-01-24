import {
  validateBase64,
  validateDimensions,
  validateFormat,
  validateQuality,
  sanitizeString
} from '../../../lib/validators.js';
import {
  base64ToBuffer,
  bufferToBase64,
  resizeImage,
  applyOutputFormat
} from '../../../lib/sharp-utils.js';
import { createMarketingTemplate } from '../../../lib/canvas-utils.js';
import {
  handleError,
  validateMethod,
  handleCORS,
  withTimeout
} from '../../../lib/error-handler.js';
import { MARKETING_TEMPLATE_DEFAULTS } from '../../../lib/constants.js';
import sharp from 'sharp';

export default async function handler(req, res) {
  // Handle CORS preflight
  if (handleCORS(req, res)) return;

  // Valida método HTTP
  if (!validateMethod(req, res, ['POST'])) return;

  try {
    const {
      title,
      subtitle,
      logo,
      gradientColors,
      width,
      height,
      format,
      quality
    } = req.body;

    // Usa valores padrão do template
    const templateConfig = {
      width: width || MARKETING_TEMPLATE_DEFAULTS.width,
      height: height || MARKETING_TEMPLATE_DEFAULTS.height,
      gradientColors: gradientColors || MARKETING_TEMPLATE_DEFAULTS.gradientColors,
      titleColor: MARKETING_TEMPLATE_DEFAULTS.titleColor,
      subtitleColor: MARKETING_TEMPLATE_DEFAULTS.subtitleColor,
      titleFontSize: MARKETING_TEMPLATE_DEFAULTS.titleFontSize,
      subtitleFontSize: MARKETING_TEMPLATE_DEFAULTS.subtitleFontSize,
      title: title ? sanitizeString(title) : null,
      subtitle: subtitle ? sanitizeString(subtitle) : null
    };

    // Valida dimensões
    validateDimensions(templateConfig.width, templateConfig.height);
    const validatedFormat = validateFormat(format);
    const validatedQuality = validateQuality(quality || 90);

    // Processa imagem com timeout
    const processImage = async () => {
      // Cria background com gradiente e textos
      const canvasBuffer = await createMarketingTemplate(templateConfig);

      let finalBuffer = canvasBuffer;

      // Se houver logo, adiciona ela
      if (logo) {
        const logoBase64 = validateBase64(logo);
        const logoBuffer = base64ToBuffer(logoBase64);

        // Redimensiona logo para 200x200
        const resizedLogo = await resizeImage(logoBuffer, 200, 200, {
          fit: 'contain',
          format: 'png',
          quality: 100
        });

        // Adiciona logo no canto superior esquerdo (50px de margem)
        finalBuffer = await sharp(canvasBuffer)
          .composite([{
            input: resizedLogo,
            top: 50,
            left: 50
          }])
          .toBuffer();
      }

      // Aplica formato final
      let sharpInstance = sharp(finalBuffer);
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
        width: templateConfig.width,
        height: templateConfig.height,
        format: validatedFormat
      }
    });
  } catch (error) {
    handleError(error, res);
  }
}
