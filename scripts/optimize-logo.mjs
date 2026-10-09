/**
 * Script: quitar fondo blanco del logo y exportar como WebP optimizado.
 * Uso: node scripts/optimize-logo.mjs
 */
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const input = path.join(root, 'src', 'assets', 'logo-original.png');
const output = path.join(root, 'src', 'assets', 'logo.webp');

async function removeBackgroundAndOptimize() {
  // Leer la imagen original
  const image = sharp(input);
  const { width, height } = await image.metadata();

  // Extraer los canales RGBA
  const raw = await image.ensureAlpha().raw().toBuffer();

  // Recorrer cada píxel: si es "casi blanco" → hacerlo transparente
  const threshold = 240; // píxeles con R,G,B > 240 se consideran fondo
  for (let i = 0; i < raw.length; i += 4) {
    const r = raw[i], g = raw[i + 1], b = raw[i + 2];
    if (r > threshold && g > threshold && b > threshold) {
      raw[i + 3] = 0; // alpha = 0 (transparente)
    }
  }

  // Reconstruir imagen sin fondo, recortar y exportar WebP
  await sharp(raw, { raw: { width, height, channels: 4 } })
    .trim()       // eliminar espacio transparente sobrante
    .webp({
      quality: 85,
      effort: 6,       // mayor compresión (0-6)
      alphaQuality: 90 // calidad del canal alpha
    })
    .toFile(output);

  const info = await sharp(output).metadata();
  console.log(`✓ Logo optimizado: ${info.width}x${info.height} | ${(info.size / 1024).toFixed(1)} KB → ${output}`);
}

removeBackgroundAndOptimize().catch(console.error);
