/**
 * WiseDeck: parse .pptx to JSON via bundled forked pptxtojson (placeholder fields + imageMode none).
 * Usage: node run.mjs <absolute-path-to.pptx>
 * Writes UTF-8 JSON to stdout.
 *
 * Bundle: npm run build (esbuild → bundle/wisedeck-pptx-parse.mjs)
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from './bundle/wisedeck-pptx-parse.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
process.chdir(__dirname)

const pptxPath = process.argv[2]
if (!pptxPath) {
  console.error('usage: node run.mjs <path-to.pptx>')
  process.exit(2)
}

const buf = fs.readFileSync(pptxPath)
const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
const json = await parse(ab, {
  imageMode: 'none',
  videoMode: 'none',
  audioMode: 'none',
})
process.stdout.write(JSON.stringify(json))
