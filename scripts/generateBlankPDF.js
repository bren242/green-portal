/**
 * Generate blank KYC form PDF
 * Usage: npx tsx scripts/generateBlankPDF.js
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { Font } from '@react-pdf/renderer'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

// Polyfill
if (typeof URL.createObjectURL !== 'function') {
  URL.createObjectURL = () => 'blob:node-mock'
}

// Intercept Font.register
const _origRegister = Font.register.bind(Font)
Font.register = (descriptor) => {
  if (descriptor.family === 'Assistant') return
  _origRegister(descriptor)
}

const { generateBlankPDF } = await import('../src/components/pdf/generateBlankPDF.jsx')

Font.register = _origRegister
Font.register({
  family: 'Assistant',
  fonts: [
    { src: path.join(root, 'public/fonts/Assistant-Regular.ttf'), fontWeight: 'normal' },
    { src: path.join(root, 'public/fonts/Assistant-Bold.ttf'), fontWeight: 'bold' },
  ],
})
Font.registerHyphenationCallback((word) => [word])

console.log('Generating blank PDF...')
const start = Date.now()

try {
  const result = await generateBlankPDF()
  const outDir = path.join(root, 'טפסים_ידניים')
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
  const outPath = path.join(outDir, 'אפיון_צרכים_2026.pdf')
  fs.writeFileSync(outPath, Buffer.from(result.pdfBytes))
  const sizeKB = Math.round(fs.statSync(outPath).size / 1024)
  console.log(`Done in ${Date.now() - start}ms`)
  console.log(`File: ${outPath}`)
  console.log(`Size: ${sizeKB}KB`)
} catch (err) {
  console.error('Blank PDF generation failed:', err)
  process.exit(1)
}
