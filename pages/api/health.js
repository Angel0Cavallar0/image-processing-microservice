import { handleCORS } from '../../lib/error-handler.js';

export default async function handler(req, res) {
  // Handle CORS preflight
  if (handleCORS(req, res)) return;

  try {
    // Verifica se as dependências estão instaladas
    const dependencies = {
      sharp: 'installed',
      canvas: 'installed'
    };

    // Tenta importar Sharp
    try {
      const sharp = await import('sharp');
      dependencies.sharp = sharp.default.versions?.vips || '0.32.6';
    } catch (err) {
      dependencies.sharp = 'not installed';
    }

    // Tenta importar Canvas
    try {
      await import('@napi-rs/canvas');
      dependencies.canvas = 'installed';
    } catch (err) {
      dependencies.canvas = 'not installed';
    }

    const endpoints = [
      { method: 'GET', path: '/api/health', description: 'Health check' },
      { method: 'POST', path: '/api/process/resize', description: 'Redimensionar imagem' },
      { method: 'POST', path: '/api/process/add-text', description: 'Adicionar texto à imagem' },
      { method: 'POST', path: '/api/process/composite', description: 'Combinar múltiplas imagens' },
      { method: 'POST', path: '/api/templates/marketing', description: 'Gerar template de marketing' },
      { method: 'POST', path: '/api/pipeline', description: 'Executar pipeline de operações' }
    ];

    res.status(200).json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      dependencies,
      endpoints
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 'unhealthy',
      error: error.message
    });
  }
}
