import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import path from 'path';
import { getImageMetadata } from './sharp-utils.js';

// Registra as fontes na inicialização
const fontsDir = path.join(process.cwd(), 'fonts');
GlobalFonts.registerFromPath(path.join(fontsDir, 'Roboto-Regular.ttf'), 'Roboto-Regular');
GlobalFonts.registerFromPath(path.join(fontsDir, 'Roboto-Bold.ttf'), 'Roboto-Bold');

/**
 * Adiciona texto sobre uma imagem
 */
export async function addTextToImage(imageBuffer, textConfig) {
  const {
    text,
    x,
    y,
    fontSize = 48,
    fontFamily = 'Roboto-Regular',
    color = '#FFFFFF'
  } = textConfig;

  // Obtém dimensões da imagem
  const metadata = await getImageMetadata(imageBuffer);
  const { width, height } = metadata;

  // Cria canvas com as dimensões da imagem
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Carrega e desenha a imagem original
  const image = await loadImage(imageBuffer);
  ctx.drawImage(image, 0, 0, width, height);

  // Configura e desenha o texto
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.fillStyle = color;
  ctx.textBaseline = 'top';
  ctx.fillText(text, x, y);

  // Retorna buffer
  return canvas.toBuffer('image/png');
}

/**
 * Cria um background com gradiente
 */
export function createGradientBackground(width, height, colors = ['#4A90E2', '#8E2DE2']) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Cria gradiente linear
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, colors[0]);
  gradient.addColorStop(1, colors[1]);

  // Preenche canvas com gradiente
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  return canvas.toBuffer('image/png');
}

/**
 * Cria um background sólido
 */
export function createSolidBackground(width, height, color = '#FFFFFF') {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);

  return canvas.toBuffer('image/png');
}

/**
 * Adiciona múltiplos textos sobre uma imagem
 */
export async function addMultipleTexts(imageBuffer, textsConfig) {
  const metadata = await getImageMetadata(imageBuffer);
  const { width, height } = metadata;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Carrega e desenha a imagem original
  const image = await loadImage(imageBuffer);
  ctx.drawImage(image, 0, 0, width, height);

  // Desenha cada texto
  for (const textConfig of textsConfig) {
    const {
      text,
      x,
      y,
      fontSize = 48,
      fontFamily = 'Roboto-Regular',
      color = '#FFFFFF',
      align = 'left'
    } = textConfig;

    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.textBaseline = 'top';
    ctx.fillText(text, x, y);
  }

  return canvas.toBuffer('image/png');
}

/**
 * Cria um template de marketing completo
 */
export async function createMarketingTemplate(config) {
  const {
    width,
    height,
    title,
    subtitle,
    gradientColors = ['#4A90E2', '#8E2DE2'],
    titleColor = '#FFFFFF',
    subtitleColor = '#E0E0E0',
    titleFontSize = 72,
    subtitleFontSize = 36
  } = config;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Cria gradiente de fundo
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, gradientColors[0]);
  gradient.addColorStop(1, gradientColors[1]);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Adiciona título (centralizado)
  if (title) {
    ctx.font = `bold ${titleFontSize}px Roboto-Bold`;
    ctx.fillStyle = titleColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(title, width / 2, height / 2 - 50);
  }

  // Adiciona subtítulo (centralizado)
  if (subtitle) {
    ctx.font = `${subtitleFontSize}px Roboto-Regular`;
    ctx.fillStyle = subtitleColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(subtitle, width / 2, height / 2 + 50);
  }

  return canvas.toBuffer('image/png');
}

/**
 * Mede o tamanho do texto
 */
export function measureText(text, fontSize, fontFamily = 'Roboto-Regular') {
  const canvas = createCanvas(100, 100);
  const ctx = canvas.getContext('2d');

  ctx.font = `${fontSize}px ${fontFamily}`;
  const metrics = ctx.measureText(text);

  return {
    width: metrics.width,
    height: fontSize
  };
}
