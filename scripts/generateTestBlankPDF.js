/**
 * Generate a test blank PDF
 * Usage: npx tsx scripts/generateTestBlankPDF.js
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { Font } from '@react-pdf/renderer'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
// When bundled by esbuild, __dirname changes — fallback to cwd
const projectRoot = fs.existsSync(path.join(root, 'public/fonts/Assistant-Regular.ttf')) ? root : process.cwd()

// Polyfill URL.createObjectURL for Node
if (typeof URL.createObjectURL !== 'function') {
  URL.createObjectURL = () => 'blob:node-mock'
}

// Intercept Font.register — block web-path registration from PDFTemplate
const _origRegister = Font.register.bind(Font)
Font.register = (descriptor) => {
  if (descriptor.family === 'Assistant') return // skip web paths
  _origRegister(descriptor)
}

// Import (PDFTemplate's Font.register for Assistant is now a no-op)
const { generateBlankPDF } = await import('../src/components/pdf/generateBlankPDF.jsx')

// Restore and register with filesystem paths
Font.register = _origRegister
Font.register({
  family: 'Assistant',
  fonts: [
    { src: path.join(projectRoot, 'public/fonts/Assistant-Regular.ttf'), fontWeight: 'normal' },
    { src: path.join(projectRoot, 'public/fonts/Assistant-Bold.ttf'), fontWeight: 'bold' },
  ],
})
Font.registerHyphenationCallback((word) => [word])

// ── Generate ───────────────────────────────────────────────────
console.log('Generating blank PDF...')
const start = Date.now()

try {
  const result = await generateBlankPDF()
  let outPath = path.join(projectRoot, 'blank_output.pdf')
  try {
    fs.writeFileSync(outPath, Buffer.from(result.pdfBytes))
  } catch (writeErr) {
    if (writeErr.code === 'EBUSY') {
      outPath = path.join(projectRoot, `blank_output_${Date.now()}.pdf`)
      fs.writeFileSync(outPath, Buffer.from(result.pdfBytes))
    } else throw writeErr
  }

  const sizeKB = Math.round(fs.statSync(outPath).size / 1024)
  const elapsed = Date.now() - start
  console.log(`Done in ${elapsed}ms`)
  console.log(`File: ${outPath}`)
  console.log(`Size: ${sizeKB}KB`)
  console.log(`Name: ${result.fileName}`)
} catch (err) {
  console.error('Blank PDF generation failed:', err)
  process.exit(1)
}
