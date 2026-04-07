// Generate 4 draft PDFs for signature/stamp QA
// Usage: node scripts/generate_drafts.mjs
// Strategy: esbuild bundles each generator → Node runs the bundle

import { build } from 'esbuild'
import { writeFileSync, mkdirSync, readFileSync, rmSync, existsSync } from 'fs'
import { resolve, join } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { createRequire } from 'module'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const root = resolve(__dirname, '..')
const tmp = resolve(root, '.draft_tmp')
const draftsDir = resolve(root, 'drafts')
mkdirSync(tmp, { recursive: true })
mkdirSync(draftsDir, { recursive: true })

// ── Polyfills for browser APIs (localStorage is noop in Node) ──
globalThis.localStorage = {
  _store: {},
  getItem(k) { return this._store[k] ?? null },
  setItem(k, v) { this._store[k] = v },
  removeItem(k) { delete this._store[k] },
}

// ── esbuild bundle helper ────────────────────────────────────
async function bundleModule(entryPath, outPath) {
  await build({
    entryPoints: [entryPath],
    bundle: true,
    platform: 'node',
    target: 'node18',
    format: 'esm',
    outfile: outPath,
    jsx: 'automatic',
    jsxImportSource: 'react',
    alias: {
      // Resolve src alias (if any). Direct paths are used here so no alias needed.
    },
    external: [
      // Keep these as Node-resolvable externals — they are CJS and must load natively
      '@react-pdf/renderer',
      'react',
      'react-dom',
    ],
    logLevel: 'silent',
  })
}

// ── Demo data ──────────────────────────────────────────────────
const ADVISOR = { id: '1', name: 'אייל ברנר', idNumber: '012345678', license: '65432' }
const CLIENT = { fullName: 'ישראל ישראלי', idNumber: '305678901' }

const DEMO_MEETING = {
  clientName: CLIENT.fullName, clientId: CLIENT.idNumber,
  advisorName: ADVISOR.name, advisorId: ADVISOR.idNumber,
  advisorUserId: ADVISOR.id, advisorLicense: ADVISOR.license,
  address: 'רחוב הרצל 15, תל אביב', phone: '03-1234567',
  email: 'israel@example.com', mobile: '050-1234567',
  meetingReason: 'client_request', meetingType: 'in_person',
  meetingInitiator: 'client', initiatorOther: '', meetingDuration: '60',
  topics: [
    { label: 'עדכון פרטים אישיים', answer: 'yes' },
    { label: 'סקירת תיק', answer: 'yes' },
    { label: 'שינוי מדיניות', answer: 'no' },
    { label: 'מוצרים חדשים', answer: 'no' },
    { label: 'אחר', answer: null },
  ],
  summary: 'נערכה פגישת מעקב. נסקרו ביצועי התיק לרבעון האחרון.',
  recommendation: 'המשך מדיניות קיימת. בחינת הגדלת חשיפה לאג"ח.',
  conflictOfInterest: false,
  decision: 'הלקוח אישר המשך מדיניות ללא שינוי.',
  tasks: 'שליחת סיכום, תיאום פגישה הבאה.',
}

const DEMO_QUALIFIED = {
  clientName: CLIENT.fullName, clientId: CLIENT.idNumber,
  advisorUserId: ADVISOR.id,
  option1: true, option2: false, option3: false,
}

const DEMO_DESK = {
  clientName: CLIENT.fullName, clientId: CLIENT.idNumber,
  advisorName: ADVISOR.name, advisorUserId: ADVISOR.id,
  date: '07/04/2026',
  instructions: [
    { id: 1, type: 'new_investment', investmentType: 'portfolio', manager: 'מיטב דש', amount: '₪500,000', action: '', from: '', to: '', notes: '', extraNotes: 'לפי מדיניות המוסכמת' },
    { id: 2, type: 'transfer', investmentType: '', manager: '', amount: '₪100,000', action: '', from: 'בנק הפועלים', to: 'תיק ניהול אישי', notes: '', extraNotes: '' },
  ],
}

const DEMO_KYC = {
  signerType: 'single',
  clientA: { fullName: CLIENT.fullName, idNumber: CLIENT.idNumber, phone: '050-1234567', email: 'israel@example.com', birthDate: '1975-05-20', maritalStatus: 'married', dependents: '2', occupation: 'שכיר', address: 'רחוב הרצל 15, תל אביב' },
  clientB: {},
  familyNetWorth: '3000000',
  incomeRange: '15,001-20,000',
  expenseRange: '10,001-15,000',
  income: {
    salary: { has: true, amount: '25000' },
    pension: { has: false, amount: '' },
    realEstate: { has: true, amount: '5000' },
    other: { has: false, amount: '' },
  },
  assetGroups: {
    cashDeposits: { amount: '500000', notes: '' },
    securities: { amount: '800000', notes: '' },
    pensionSavings: { amount: '600000', notes: '' },
    realEstate: { amount: '1500000', notes: '' },
    other: { amount: '', notes: '' },
  },
  assets: {
    cash: { has: true, amount: '100000' },
    deposits: { has: true, amount: '400000' },
    moneyMarket: { has: false, amount: '' },
    managedPortfolio: { has: true, amount: '800000' },
    stocks: { has: false, amount: '' },
    etf: { has: false, amount: '' },
    foreignBroker: { has: false, amount: '' },
    hishtalmut: { has: false, amount: '' },
    gemel: { has: false, amount: '' },
    gemelInvestment: { has: false, amount: '' },
    savingsPolicy: { has: false, amount: '' },
    pensionFund: { has: true, amount: '600000' },
    bituachMenahalim: { has: false, amount: '', guaranteedYield: false },
    investmentRealEstate: { has: false, amount: '' },
    residenceRealEstate: { has: true, amount: '1500000' },
    business: { has: false, amount: '' },
    other: { has: false, amount: '' },
  },
  liabilities: {
    mortgage: { has: true, monthly: '5000', total: '400000' },
    loans: { has: false, monthly: '', total: '' },
    monthlyExpenses: '15000',
  },
  managedPortion: '500000',
  incomeNotes: '', cashNotes: '', securitiesNotes: '', savingsNotes: '',
  pensionNotes: '', realEstateNotes: '', otherAssetsNotes: '', liabilitiesNotes: '',
  investmentGoals: ['growth', 'retirement'],
  investmentGoalOther: '',
  investmentHorizon: '7-10',
  liquidityTimeline: '3-5',
  liquidityNext3Years: '100000',
  riskQ1: 'b', riskQ2: 'b', riskQ3: 'c', riskQ4: 'b',
  priorExperience: 'yes', priorExperienceDetails: 'תיק מנוהל 5 שנים',
  advisorSummary: 'לקוח מנוסה עם הבנה טובה של שוק ההון.',
  clientPreferences: 'ללא מניות צבאיות, ללא קריפטו.',
  calculatedRiskLevel: 3, finalRiskLevel: 4,
  finalRiskJustification: '',
  riskLevelReason: '',
  forex: false, lowRatedBonds: false, corporateBondsPct: '20', equityPct: '30',
  refusals: [], refusalsConfirmed: true,
}

const DEMO_USER = { id: ADVISOR.id, name: ADVISOR.name, idNumber: ADVISOR.idNumber, license: ADVISOR.license, role: 'admin' }

// ── Font path patcher (for Node — resolve /fonts/ to disk) ────
function patchFonts(mod) {
  const { Font } = mod
  if (!Font) return
  const orig = Font.register.bind(Font)
  Font.register = (config) => {
    const patch = (src) => (typeof src === 'string' && src.startsWith('/fonts/'))
      ? join(root, 'public', src) : src
    if (config.fonts) config.fonts = config.fonts.map(f => ({ ...f, src: patch(f.src) }))
    if (config.src) config.src = patch(config.src)
    return orig(config)
  }
}

// ── Run one generator ─────────────────────────────────────────
async function run(label, srcPath, generatorFn, outFile) {
  const bundlePath = join(tmp, `${label}.mjs`)
  try {
    await bundleModule(srcPath, bundlePath)
    const mod = await import(pathToFileURL(bundlePath).href + `?t=${Date.now()}`)
    patchFonts(mod)
    const result = await generatorFn(mod)
    const fullPath = join(draftsDir, outFile)
    writeFileSync(fullPath, Buffer.from(result.pdfBytes))
    return { label, ok: true, path: `drafts/${outFile}`, kb: Math.round(result.pdfBytes.byteLength / 1024) }
  } catch (e) {
    return { label, ok: false, error: e.message }
  }
}

async function main() {
  const tasks = [
    run('meeting',   join(root, 'src/components/pdf/generateMeetingSummary.jsx'),    m => m.generateMeetingSummaryStyled(DEMO_MEETING),   'draft_meeting_summary.pdf'),
    run('qualified', join(root, 'src/components/pdf/generateQualifiedInvestor.jsx'), m => m.generateQualifiedInvestorStyled(DEMO_QUALIFIED),'draft_qualified_investor.pdf'),
    run('desk',      join(root, 'src/components/pdf/generateDeskReferral.jsx'),       m => m.generateDeskReferralPDF(DEMO_DESK),            'draft_desk_referral.pdf'),
    run('kyc',       join(root, 'src/components/pdf/generatePDF.jsx'),               m => m.generatePDF(DEMO_KYC, DEMO_USER),              'draft_kyc.pdf'),
  ]
  const results = await Promise.allSettled(tasks)

  console.log('\n── Draft Generation Results ──')
  for (const r of results) {
    const v = r.value || r.reason
    if (v.ok) console.log(`✅ ${v.label}: ${v.path} (${v.kb}KB)`)
    else console.log(`❌ ${v.label}: ${v.error}`)
  }

  // Cleanup tmp
  if (existsSync(tmp)) rmSync(tmp, { recursive: true, force: true })
}

main().catch(e => { console.error(e); process.exit(1) })
