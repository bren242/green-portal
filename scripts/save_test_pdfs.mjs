import { createServer } from 'vite'
import { writeFileSync, mkdirSync } from 'fs'
import { resolve, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const root = resolve(__dirname, '..')

async function main() {
  const server = await createServer({
    root,
    server: { port: 5199 },
    publicDir: join(root, 'public'),
  })
  await server.listen()

  // Step 1: Load Font from @react-pdf/renderer and register fonts with absolute paths FIRST
  const renderer = await server.ssrLoadModule('@react-pdf/renderer')
  const { Font } = renderer

  // Override Font.register to intercept relative paths
  const origRegister = Font.register.bind(Font)
  Font.register = (config) => {
    if (config.fonts) {
      config.fonts = config.fonts.map(f => {
        if (typeof f.src === 'string' && f.src.startsWith('/fonts/')) {
          return { ...f, src: join(root, 'public', f.src) }
        }
        return f
      })
    }
    if (typeof config.src === 'string' && config.src.startsWith('/fonts/')) {
      config.src = join(root, 'public', config.src)
    }
    return origRegister(config)
  }

  // Step 2: NOW load the module - its Font.register calls will use our patched version
  const mod = await server.ssrLoadModule('/src/components/pdf/generateMarketingAgreement.jsx')
  const { generateMarketingAgreementStyled, generateMarketingAgreementBlank } = mod

  const testData = {
    advisorName: 'אייל ברנר', advisorId: '032821050', advisorLicense: '9271',
    city: 'רמת גן', date: '5 בחודש אפריל 2026',
    clientAName: 'ישראל ישראלי', clientAId: '305678901',
    clientAAddress: 'הרצל 1 תל אביב', clientAPhone: '050-1234567', clientAEmail: 'israel@test.com',
    clientBName: 'שרה ישראלי', clientBId: '305678902',
    clientBAddress: 'הרצל 1 תל אביב', clientBPhone: '050-7654321', clientBEmail: 'sarah@test.com',
    compensationModel: 'i', isEligible: true,
  }

  mkdirSync(resolve(root, 'drafts'), { recursive: true })

  console.log('Generating styled PDF...')
  const styled = await generateMarketingAgreementStyled(testData)
  writeFileSync(resolve(root, 'drafts/agreement_styled_test.pdf'), Buffer.from(styled.pdfBytes))
  console.log('Styled saved: drafts/agreement_styled_test.pdf (' + Math.round(styled.pdfBytes.byteLength/1024) + 'KB)')

  console.log('Generating blank PDF...')
  const blank = await generateMarketingAgreementBlank()
  writeFileSync(resolve(root, 'drafts/agreement_blank_test.pdf'), Buffer.from(blank.pdfBytes))
  console.log('Blank saved: drafts/agreement_blank_test.pdf (' + Math.round(blank.pdfBytes.byteLength/1024) + 'KB)')

  await server.close()
  console.log('Done!')
}

main().catch(e => { console.error(e); process.exit(1) })
