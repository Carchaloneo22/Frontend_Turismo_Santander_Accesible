/**
 * ayuda.mjs — imprime todos los scripts de npm con su descripción.
 *
 * JSON no admite comentarios, así que las descripciones viven en el bloque
 * "scripts-info" del package.json (convención de npm-scripts-info). Este script
 * las cruza con "scripts" y las muestra alineadas:
 *
 *   npm run ayuda
 *
 * Si agregas un script nuevo, agrega también su entrada en "scripts-info" —
 * este comando delata los que queden sin documentar.
 */
import { readFileSync } from 'node:fs'

const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
const scripts = pkg.scripts ?? {}
const info = pkg['scripts-info'] ?? {}

const ancho = Math.max(...Object.keys(scripts).map((s) => s.length))
console.log(`\nScripts de ${pkg.name} — uso: npm run <script>\n`)
for (const nombre of Object.keys(scripts)) {
  const descripcion = info[nombre] ?? '⚠️  (sin descripción — agrégala en "scripts-info")'
  console.log(`  ${nombre.padEnd(ancho)}  ${descripcion}`)
}
const huerfanas = Object.keys(info).filter((n) => !scripts[n])
if (huerfanas.length) {
  console.log(`\n⚠️  En "scripts-info" pero sin script: ${huerfanas.join(', ')}`)
}
console.log()
