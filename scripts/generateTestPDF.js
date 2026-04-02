/**
 * Generate a test PDF with full mock data (couple, all sectors, refusals)
 * Usage: npx tsx scripts/generateTestPDF.js
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { Font } from '@react-pdf/renderer'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

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
const { generatePDF } = await import('../src/components/pdf/generatePDF.jsx')

// Restore and register with filesystem paths
Font.register = _origRegister
Font.register({
  family: 'Assistant',
  fonts: [
    { src: path.join(root, 'public/fonts/Assistant-Regular.ttf'), fontWeight: 'normal' },
    { src: path.join(root, 'public/fonts/Assistant-Bold.ttf'), fontWeight: 'bold' },
  ],
})
Font.registerHyphenationCallback((word) => [word])

// ── Full Mock Data ─────────────────────────────────────────────
const mockFormData = {
  signerType: 'couple',

  clientA: {
    fullName: 'ישראל כהן',
    idNumber: '012345678',
    phone: '050-1234567',
    email: 'israel@example.com',
    birthDate: '15.03.1978',
    maritalStatus: 'married',
    dependents: '3',
    occupation: 'מהנדס תוכנה',
  },
  clientB: {
    fullName: 'דליה כהן',
    idNumber: '087654321',
    phone: '050-7654321',
    email: 'dalia@example.com',
    birthDate: '22.07.1980',
    maritalStatus: 'married',
    dependents: '3',
    occupation: 'רואת חשבון',
  },

  // ── Income ────────────────────────────────────────────────────
  income: {
    salary:     { has: true, amount: '45000' },
    pension:    { has: true, amount: '8000' },
    realEstate: { has: true, amount: '12000' },
    other:      { has: true, amount: '3000' },
  },
  incomeNotes: 'הכנסה מדמי שכירות — 2 דירות',

  // ── Assets (all sectors populated) ────────────────────────────
  assets: {
    cash:               { has: true, amount: '350000' },
    deposits:           { has: true, amount: '500000' },
    moneyMarket:        { has: true, amount: '200000' },
    managedPortfolio:   { has: true, amount: '1200000' },
    stocks:             { has: true, amount: '800000' },
    etf:                { has: true, amount: '450000' },
    foreignBroker:      { has: true, amount: '600000' },
    hishtalmut:         { has: true, amount: '380000' },
    gemel:              { has: true, amount: '250000' },
    gemelInvestment:    { has: true, amount: '150000' },
    savingsPolicy:      { has: true, amount: '300000' },
    pensionFund:        { has: true, amount: '1800000' },
    bituachMenahalim:   { has: true, amount: '400000', guaranteedYield: true },
    investmentRealEstate: { has: true, amount: '2500000' },
    residenceRealEstate:  { has: true, amount: '3200000' },
    business:           { has: true, amount: '900000' },
    other:              { has: true, amount: '150000' },
  },
  cashNotes: 'חלק בפק"מ צמוד מדד',
  securitiesNotes: 'תיק מנוהל ב-IBI, חשבון ב-Interactive Brokers',
  savingsNotes: 'השתלמות מגיעה לפדיון ב-2025',
  pensionNotes: 'פנסיה במגדל, ביטוח מנהלים בהראל עם תשואה מובטחת',
  realEstateNotes: 'דירה בת"א + דירה בנתניה להשקעה',
  otherAssetsNotes: 'שותפות בחברת הייטק',

  // ── Liabilities ───────────────────────────────────────────────
  liabilities: {
    mortgage: { has: true, total: '1200000', monthly: '6500' },
    loans:    { has: true, total: '80000', monthly: '2200' },
    monthlyExpenses: '22000',
  },
  liabilitiesNotes: 'משכנתא על דירת מגורים, הלוואה לרכב',

  familyNetWorth: '',
  managedPortion: '35_to_70',

  // ── Goals & Horizon ───────────────────────────────────────────
  investmentGoals: ['growth', 'income', 'education', 'pension'],
  investmentGoalOther: '',
  investmentHorizon: '5_to_10',

  // ── Liquidity ─────────────────────────────────────────────────
  liquidityTimeline: 'over_5',
  liquidityNext3Years: 'up_to_30',

  // ── Risk ──────────────────────────────────────────────────────
  riskQ1: 'c',
  riskQ2: 'b',
  riskQ3: 'c',
  riskQ4: 'c',
  priorExperience: 'yes',
  priorExperienceDetails: 'משקיע בשוק ההון מזה 12 שנה, כולל מסחר עצמאי במניות וקרנות סל',
  calculatedRiskLevel: 4,
  finalRiskLevel: 3,

  // ── Advisor Section ───────────────────────────────────────────
  advisorSummary: 'זוג בגילאי 40+ עם הכנסה משפחתית גבוהה ונכסים מגוונים. חשיפה קיימת לשוק ההון דרך תיק מנוהל וברוקר זר. מטרות עיקריות — צמיחה ארוכת טווח וחינוך ילדים. הלקוח מנוסה ומבין תנודתיות, אך מעוניין באיזון. המלצה — פרופיל מאוזן (3) עם נטייה לצמיחה.',
  clientPreferences: 'ללא השקעה בתעשיית הנשק, העדפה לקרנות ESG. אין רצון בחשיפה למטבעות קריפטו.',
  equityPct: '30',
  corporateBondsPct: '50',
  forex: true,
  lowRatedBonds: false,
  finalRiskJustification: 'למרות שהציון המחושב הניב דרגה 4, הלקוח ביקש להוריד לדרגה 3 (מאוזן) בשל רצון לשמור על יציבות יחסית לקראת הוצאות חינוך צפויות בשנים הקרובות.',

  // ── Refusals ──────────────────────────────────────────────────
  refusals: [
    { field: 'familyNetWorth', label: 'שווי נקי משפחתי כולל' },
    { field: 'liabilities.creditCards', label: 'חובות כרטיסי אשראי' },
    { field: 'otherIncome', label: 'הכנסות נוספות מחו"ל' },
  ],
}

const mockUser = {
  id: '1',
  username: 'eyal',
  name: 'אייל גרין',
  idNumber: '301234567',
  license: '54321',
  role: 'admin',
}

// ── Generate ───────────────────────────────────────────────────
console.log('Generating PDF...')
const start = Date.now()

try {
  const result = await generatePDF(mockFormData, mockUser)
  let outPath = path.join(root, 'test_output.pdf')
  try {
    fs.writeFileSync(outPath, Buffer.from(result.pdfBytes))
  } catch (writeErr) {
    if (writeErr.code === 'EBUSY') {
      outPath = path.join(root, `test_output_${Date.now()}.pdf`)
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
  console.error('PDF generation failed:', err)
  process.exit(1)
}
