/**
 * Script de teste para verificar renderização de texto nas imagens
 * Execute com: node test-text-rendering.js
 */

import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Registra as fontes
const fontsDir = path.join(__dirname, 'public', 'fonts');

console.log('='.repeat(60));
console.log('TESTE DE RENDERIZACAO DE TEXTO EM IMAGENS');
console.log('='.repeat(60));
console.log('');

// Verifica se as fontes existem
const robotoRegular = path.join(fontsDir, 'Roboto-Regular.ttf');
const robotoBold = path.join(fontsDir, 'Roboto-Bold.ttf');

console.log('Verificando fontes...');
console.log(`  - Roboto-Regular.ttf: ${fs.existsSync(robotoRegular) ? 'OK' : 'NAO ENCONTRADA'}`);
console.log(`  - Roboto-Bold.ttf: ${fs.existsSync(robotoBold) ? 'OK' : 'NAO ENCONTRADA'}`);
console.log('');

if (!fs.existsSync(robotoRegular) || !fs.existsSync(robotoBold)) {
  console.error('ERRO: Fontes nao encontradas! Certifique-se de que as fontes estao em public/fonts/');
  process.exit(1);
}

// Registra as fontes
GlobalFonts.registerFromPath(robotoRegular, 'Roboto-Regular');
GlobalFonts.registerFromPath(robotoBold, 'Roboto-Bold');

console.log('Fontes registradas com sucesso!');
console.log('');

/**
 * Teste 1: Imagem com texto simples sobre fundo sólido
 */
async function testeSimplesTexto() {
  console.log('TESTE 1: Texto simples sobre fundo solido');
  console.log('-'.repeat(40));

  const width = 800;
  const height = 400;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Fundo azul escuro
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, width, height);

  // Texto principal com Roboto-Bold
  ctx.font = '48px Roboto-Bold';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Teste de Renderizacao', width / 2, height / 2 - 30);

  // Subtítulo com Roboto-Regular
  ctx.font = '24px Roboto-Regular';
  ctx.fillStyle = '#8892b0';
  ctx.fillText('Verificando se o texto aparece corretamente', width / 2, height / 2 + 30);

  const buffer = canvas.toBuffer('image/png');
  const outputPath = path.join(__dirname, 'test-output-1-texto-simples.png');
  fs.writeFileSync(outputPath, buffer);

  console.log(`  Imagem salva em: ${outputPath}`);
  console.log('  Resultado: OK');
  console.log('');
}

/**
 * Teste 2: Imagem com gradiente e múltiplos textos
 */
async function testeGradienteMultiplosTextos() {
  console.log('TESTE 2: Gradiente com multiplos textos');
  console.log('-'.repeat(40));

  const width = 1200;
  const height = 630;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Gradiente de fundo
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#4A90E2');
  gradient.addColorStop(1, '#8E2DE2');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Título grande
  ctx.font = '72px Roboto-Bold';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Image Processing', width / 2, height / 2 - 60);

  // Subtítulo
  ctx.font = '36px Roboto-Regular';
  ctx.fillStyle = '#E0E0E0';
  ctx.fillText('Microservice API v1.0', width / 2, height / 2 + 20);

  // Texto inferior
  ctx.font = '24px Roboto-Regular';
  ctx.fillStyle = '#CCCCCC';
  ctx.fillText('Teste de renderizacao de fontes Roboto', width / 2, height / 2 + 80);

  const buffer = canvas.toBuffer('image/png');
  const outputPath = path.join(__dirname, 'test-output-2-gradiente-textos.png');
  fs.writeFileSync(outputPath, buffer);

  console.log(`  Imagem salva em: ${outputPath}`);
  console.log('  Resultado: OK');
  console.log('');
}

/**
 * Teste 3: Diferentes tamanhos e estilos de fonte
 */
async function testeDiferentesTamanhos() {
  console.log('TESTE 3: Diferentes tamanhos e estilos de fonte');
  console.log('-'.repeat(40));

  const width = 800;
  const height = 600;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Fundo branco
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  // Textos em diferentes tamanhos
  const textos = [
    { size: 12, y: 50, text: 'Roboto Regular 12px - Texto pequeno' },
    { size: 16, y: 100, text: 'Roboto Regular 16px - Texto normal' },
    { size: 24, y: 160, text: 'Roboto Regular 24px - Texto medio' },
    { size: 32, y: 230, text: 'Roboto Regular 32px - Texto grande' },
    { size: 48, y: 320, text: 'Roboto Regular 48px' },
    { size: 64, y: 420, text: 'Roboto Bold 64px', bold: true },
    { size: 72, y: 520, text: 'Bold 72px', bold: true },
  ];

  ctx.fillStyle = '#000000';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  for (const item of textos) {
    ctx.font = `${item.size}px ${item.bold ? 'Roboto-Bold' : 'Roboto-Regular'}`;
    ctx.fillText(item.text, 30, item.y);
  }

  const buffer = canvas.toBuffer('image/png');
  const outputPath = path.join(__dirname, 'test-output-3-tamanhos.png');
  fs.writeFileSync(outputPath, buffer);

  console.log(`  Imagem salva em: ${outputPath}`);
  console.log('  Resultado: OK');
  console.log('');
}

/**
 * Teste 4: Caracteres especiais e acentuacao
 */
async function testeCaracteresEspeciais() {
  console.log('TESTE 4: Caracteres especiais e acentuacao');
  console.log('-'.repeat(40));

  const width = 800;
  const height = 400;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Fundo escuro
  ctx.fillStyle = '#2d3436';
  ctx.fillRect(0, 0, width, height);

  ctx.font = '32px Roboto-Regular';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  const textos = [
    'Acentuacao: a e i o u A E I O U',
    'Cedilha: Caca Cacador',
    'Til: Nao Mao Pao Cao',
    'Circunflexo: Voce Frances Tres',
    'Simbolos: @ # $ % & * ! ? = + -',
    'Numeros: 0 1 2 3 4 5 6 7 8 9',
  ];

  let y = 40;
  for (const texto of textos) {
    ctx.fillText(texto, 40, y);
    y += 55;
  }

  const buffer = canvas.toBuffer('image/png');
  const outputPath = path.join(__dirname, 'test-output-4-caracteres-especiais.png');
  fs.writeFileSync(outputPath, buffer);

  console.log(`  Imagem salva em: ${outputPath}`);
  console.log('  Resultado: OK');
  console.log('');
}

/**
 * Teste 5: Texto com sombra e efeitos
 */
async function testeTextoComSombra() {
  console.log('TESTE 5: Texto com sombra');
  console.log('-'.repeat(40));

  const width = 800;
  const height = 300;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Fundo gradiente
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#ff6b6b');
  gradient.addColorStop(1, '#ee5a5a');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.font = '64px Roboto-Bold';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Sombra
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillText('Texto com Sombra', width / 2 + 4, height / 2 + 4);

  // Texto principal
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('Texto com Sombra', width / 2, height / 2);

  const buffer = canvas.toBuffer('image/png');
  const outputPath = path.join(__dirname, 'test-output-5-sombra.png');
  fs.writeFileSync(outputPath, buffer);

  console.log(`  Imagem salva em: ${outputPath}`);
  console.log('  Resultado: OK');
  console.log('');
}

// Executa todos os testes
async function runAllTests() {
  try {
    await testeSimplesTexto();
    await testeGradienteMultiplosTextos();
    await testeDiferentesTamanhos();
    await testeCaracteresEspeciais();
    await testeTextoComSombra();

    console.log('='.repeat(60));
    console.log('TODOS OS TESTES CONCLUIDOS COM SUCESSO!');
    console.log('='.repeat(60));
    console.log('');
    console.log('Imagens geradas:');
    console.log('  1. test-output-1-texto-simples.png');
    console.log('  2. test-output-2-gradiente-textos.png');
    console.log('  3. test-output-3-tamanhos.png');
    console.log('  4. test-output-4-caracteres-especiais.png');
    console.log('  5. test-output-5-sombra.png');
    console.log('');
    console.log('Verifique as imagens para confirmar que os textos');
    console.log('estao sendo renderizados corretamente!');

  } catch (error) {
    console.error('ERRO durante os testes:', error);
    process.exit(1);
  }
}

runAllTests();
