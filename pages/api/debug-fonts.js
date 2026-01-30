import { GlobalFonts } from '@napi-rs/canvas';
import path from 'path';
import fs from 'fs';

export default async function handler(req, res) {
  try {
    const debug = {
      cwd: process.cwd(),
      fontsPath: path.join(process.cwd(), 'fonts'),
      publicPath: path.join(process.cwd(), 'public', 'fonts'),
      fontsExist: {},
      publicFontsExist: {},
      registeredFonts: GlobalFonts.families,
      envInfo: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL,
        VERCEL_ENV: process.env.VERCEL_ENV
      }
    };

    // Verificar se fontes existem em /fonts/
    try {
      debug.fontsExist.regular = fs.existsSync(path.join(process.cwd(), 'fonts', 'Roboto-Regular.ttf'));
      debug.fontsExist.bold = fs.existsSync(path.join(process.cwd(), 'fonts', 'Roboto-Bold.ttf'));

      if (debug.fontsExist.regular) {
        const stats = fs.statSync(path.join(process.cwd(), 'fonts', 'Roboto-Regular.ttf'));
        debug.fontsExist.regularSize = stats.size;
      }
    } catch (error) {
      debug.fontsExist.error = error.message;
    }

    // Verificar se fontes existem em /public/fonts/
    try {
      debug.publicFontsExist.regular = fs.existsSync(path.join(process.cwd(), 'public', 'fonts', 'Roboto-Regular.ttf'));
      debug.publicFontsExist.bold = fs.existsSync(path.join(process.cwd(), 'public', 'fonts', 'Roboto-Bold.ttf'));
    } catch (error) {
      debug.publicFontsExist.error = error.message;
    }

    // Listar arquivos no diretório fonts se existir
    try {
      if (fs.existsSync(path.join(process.cwd(), 'fonts'))) {
        debug.fontsDir = fs.readdirSync(path.join(process.cwd(), 'fonts'));
      }
    } catch (error) {
      debug.fontsDirError = error.message;
    }

    res.status(200).json({
      success: true,
      debug
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
}
