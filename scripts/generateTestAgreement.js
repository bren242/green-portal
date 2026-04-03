/**
 * Generate test marketing agreement PDFs (print + styled)
 * Usage: npx tsx scripts/generateTestAgreement.js
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { Font } from '@react-pdf/renderer'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const projectRoot = fs.existsSync(path.join(root, 'public/fonts/Assistant-Regular.ttf')) ? root : process.cwd()

// Polyfill URL.createObjectURL for Node
if (typeof URL.createObjectURL !== 'function') {
  URL.createObjectURL = () => 'blob:node-mock'
}

// Intercept Font.register
const _origRegister = Font.register.bind(Font)
Font.register = (descriptor) => {
  if (descriptor.family === 'Assistant') return
  _origRegister(descriptor)
}

const { generateMarketingAgreement, generateMarketingAgreementStyled, generateMarketingAgreementBlank } = await import('../src/components/pdf/generateMarketingAgreement.jsx')

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

// ── Test Data ─────────────────────────────────────────────────
const testData = {
  advisorName: 'אייל גרין',
  advisorId: '012345678',
  advisorLicense: '12345',
  clientAName: 'ישראל ישראלי',
  clientAId: '987654321',
  clientAAddress: 'רחוב הרצל 10, תל אביב',
  clientAPhone: '050-1234567',
  clientAEmail: 'israel@example.com',
  clientBName: 'שרה ישראלי',
  clientBId: '123456789',
  clientBAddress: 'רחוב הרצל 10, תל אביב',
  clientBPhone: '050-7654321',
  clientBEmail: 'sarah@example.com',
  city: 'תל אביב',
  date: '03 באפריל 2026',
  compensationModel: 'i',
  compensationPercent: '1.0',
  compensationAmount: '15,000',
  isEligible: true,
}

// ── Helper ────────────────────────────────────────────────────
async function writeResult(result, outPath, label) {
  try {
    fs.writeFileSync(outPath, Buffer.from(result.pdfBytes))
  } catch (e) {
    if (e.code === 'EBUSY') {
      outPath = outPath.replace('.pdf', `_${Date.now()}.pdf`)
      fs.writeFileSync(outPath, Buffer.from(result.pdfBytes))
    } else throw e
  }
  const buf = fs.readFileSync(outPath)
  const pages = (buf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length
  const kb = Math.round(fs.statSync(outPath).size / 1024)
  console.log(`[${label}] ${outPath} — ${pages} pages, ${kb}KB`)
}

// ── Generate Both ─────────────────────────────────────────────
console.log('Generating marketing agreement PDFs...')
const start = Date.now()

try {
  const [print, styled, blank] = await Promise.all([
    generateMarketingAgreement(testData),
    generateMarketingAgreementStyled(testData),
    generateMarketingAgreementBlank(),
  ])

  fs.mkdirSync(path.join(projectRoot, 'טפסים_ידניים'), { recursive: true })

  await writeResult(print, path.join(projectRoot, 'agreement_print.pdf'), 'PRINT')
  await writeResult(styled, path.join(projectRoot, 'agreement_styled.pdf'), 'STYLED')
  await writeResult(blank, path.join(projectRoot, 'agreement_blank.pdf'), 'BLANK')

  console.log(`Done in ${Date.now() - start}ms`)
} catch (err) {
  console.error('Agreement PDF generation failed:', err)
  process.exit(1)
}
