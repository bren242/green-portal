// ═══════════════════════════════════════════════════
// GREEN Portal — Demo PDF Generator
// מייצר את כל 5 הטפסים עם נתוני דמות
// ═══════════════════════════════════════════════════

import { generatePDF } from '../components/pdf/generatePDF'
import { generateMarketingAgreementStyled } from '../components/pdf/generateMarketingAgreement'
import { generateMeetingSummaryStyled } from '../components/pdf/generateMeetingSummary'
import { generateQualifiedInvestorStyled } from '../components/pdf/generateQualifiedInvestor'
import { generateQualifiedAdvisorStyled } from '../components/pdf/generateQualifiedAdvisor'

// ── Demo User (Advisor) ──
const DEMO_USER = {
  id: 'eyal',
  name: 'אייל ברנר',
  role: 'advisor',
  license: '65432',
  idNumber: '012345678',
}

// ── Demo KYC Form Data ──
const DEMO_KYC_FORM = {
  signerType: 'single',
  clientA: {
    fullName: 'ישראל ישראלי',
    idNumber: '305678901',
    phone: '050-1234567',
    email: 'israel@example.com',
    birthDate: '15/03/1978',
    maritalStatus: 'married',
    dependents: '3',
    occupation: 'מנהל פיתוח עסקי',
  },
  clientB: { fullName: '', idNumber: '', phone: '', email: '' },

  // Income
  income: {
    salary:     { has: true, amount: '45000' },
    pension:    { has: true, amount: '8000' },
    realEstate: { has: true, amount: '12000' },
    other:      { has: true, amount: '3000', notes: 'הכנסה מדמי שכירות — 2 דירות' },
  },

  // Expenses
  expenses: {
    housing:   { has: true, amount: '8000' },
    living:    { has: true, amount: '15000' },
    education: { has: true, amount: '5000' },
    insurance: { has: true, amount: '3000' },
    loans:     { has: true, amount: '7000' },
    other:     { has: true, amount: '2000' },
  },

  // Assets
  assets: {
    cash:              { has: true, amount: '350000' },
    deposits:          { has: true, amount: '500000' },
    moneyMarket:       { has: true, amount: '200000' },
    managedPortfolio:  { has: true, amount: '1200000' },
    stocks:            { has: true, amount: '850000' },
    mutualFunds:       { has: true, amount: '1000000' },
    etf:               { has: false, amount: '' },
    bonds:             { has: false, amount: '' },
    providentFund:     { has: true, amount: '450000' },
    studyFund:         { has: true, amount: '380000' },
    pensionSavings:    { has: true, amount: '250000' },
    lifeInsurance:     { has: false, amount: '' },
    realEstate:        { has: true, amount: '3500000' },
    crypto:            { has: false, amount: '' },
    otherAssets:       { has: true, amount: '150000' },
  },
  cashNotes: 'חלק בפק"מ צמוד מדד',

  // Liabilities
  liabilities: {
    mortgage:     { has: true, amount: '1200000' },
    loans:        { has: true, amount: '180000' },
    creditCards:  { has: false, amount: '' },
    otherLiab:    { has: false, amount: '' },
  },

  // Investment goals & horizon
  goals: ['growth', 'income', 'preserve'],
  horizon: '5_to_10',
  liquidityTimeline: 'over_5',
  liquidityNext3: 'up_to_30',
  portfolioPortion: '35_to_70',

  // Risk questionnaire
  riskQ1: 'b',
  riskQ2: 'b',
  riskQ3: 'c',
  riskQ4: 'c',
  priorExperience: 'yes',
  priorExperienceDetails: 'ניסיון של כ-12 שנה בשוק ההון. תיק מנוהל ותיק עצמאי. חשיפה למניות, אג"ח ונגזרים.',
  calculatedRiskLevel: 3,
  finalRiskLevel: 3,

  // Advisor recommendation
  advisorSummary: 'לקוח בעל ניסיון בשוק ההון, עם תיק נכסים מגוון ומצב כלכלי יציב. מעדיף גישה מאוזנת המשלבת צמיחה לטווח ארוך עם שמירה על יציבות. רמת הסיכון המומלצת תואמת את פרופיל ההשקעה ואת הצרכים שהוצגו.',
  clientPreferences: 'אין רצון בחשיפה למטבעות קריפטו. ESG ללא השקעה בתעשיית הנשק, העדפה לקרנות.',
  equityPct: '30',
  corporateBondsPct: '50',
  forex: true,
  lowRatedBonds: false,

  finalRiskJustification: 'דרגת סיכון 3 (מאוזן) מתאימה ללקוח על בסיס ניסיונו, גילו, אופק ההשקעה הארוך, ומצבו הכלכלי היציב. הלקוח מודע לתנודתיות ומעדיף גישה מבוקרת.',

  // Refusals
  refusals: [],
}

// ── Demo Marketing Agreement Data ──
const DEMO_AGREEMENT = {
  advisorName: 'אייל ברנר',
  advisorId: '012345678',
  advisorLicense: '65432',
  clientAName: 'ישראל ישראלי',
  clientAId: '305678901',
  clientAPhone: '050-1234567',
  clientAEmail: 'israel@example.com',
  clientAAddress: 'רחוב הרצל 15, תל אביב',
  clientBName: '',
  clientBId: '',
  clientBPhone: '',
  clientBEmail: '',
  clientBAddress: '',
  city: 'תל אביב',
}

// ── Demo Meeting Summary Data ──
const DEMO_MEETING = {
  clientName: 'ישראל ישראלי',
  clientId: '305678901',
  advisorName: 'אייל ברנר',
  advisorId: '012345678',
  advisorLicense: '65432',
  address: 'רחוב הרצל 15, תל אביב',
  phone: '050-1234567',
  email: 'israel@example.com',
  mobile: '050-1234567',
  meetingReason: 'פגישת היכרות ובניית תיק השקעות',
  meetingType: 'פגישה ראשונה',
  meetingInitiator: 'לקוח',
  initiatorOther: '',
  meetingDuration: '60',
  topics: ['סקירת מצב כלכלי', 'בניית תיק השקעות', 'בחירת מסלול סיכון', 'חתימה על הסכם שיווק'],
  summary: 'נערכה פגישת היכרות מקיפה עם הלקוח. סקרנו את המצב הכלכלי הכולל, העדפות ההשקעה ורמת הסיכון הרצויה. הלקוח הביע עניין בתיק מאוזן עם דגש על צמיחה ארוכת טווח. נחתם הסכם שיווק השקעות ובוצע אפיון צרכים מלא.',
  recommendation: 'בניית תיק מאוזן (דרגת סיכון 3) עם חשיפה של עד 30% למניות. העדפה לקרנות ESG. הימנעות מקריפטו ותעשיית נשק. פגישת מעקב בעוד 3 חודשים.',
  conflictOfInterest: false,
  decision: 'הלקוח אישר את המלצת המשווק לתיק מאוזן. נחתמו כל המסמכים הרלוונטיים.',
  tasks: 'פתיחת תיק השקעות, העברת כספים מפקדון בנקאי, תיאום פגישת מעקב.',
}

// ── Demo Qualified Investor Data ──
const DEMO_QUALIFIED_INVESTOR = {
  clientName: 'ישראל ישראלי',
  clientId: '305678901',
  option1: true,
  option2: true,
  option3: false,
}

// ── Demo Qualified Advisor Data ──
const DEMO_QUALIFIED_ADVISOR = {
  clientName: 'ישראל ישראלי',
  clientId: '305678901',
  advisorName: 'אייל ברנר',
  advisorId: '012345678',
  advisorLicense: '65432',
  condition1: true,
  condition2: 'self',
  condition2Other: '',
  q1: 'yes',
  q2: 'yes',
  q3: 'yes',
  q4: 'yes',
  q5: 'yes',
}

// ── Download helper ──
function downloadPDF(url, fileName) {
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.click()
  URL.revokeObjectURL(url)
}

// ── Generate All Demo PDFs ──
export async function generateAllDemoPDFs() {
  const results = []

  // 1. KYC
  try {
    const kyc = await generatePDF(DEMO_KYC_FORM, DEMO_USER)
    downloadPDF(kyc.url, kyc.fileName)
    results.push({ name: 'KYC', success: true, fileName: kyc.fileName })
  } catch (e) {
    results.push({ name: 'KYC', success: false, error: e.message })
  }

  // Small delay between downloads
  await new Promise(r => setTimeout(r, 500))

  // 2. Marketing Agreement
  try {
    const agreement = await generateMarketingAgreementStyled(DEMO_AGREEMENT)
    downloadPDF(agreement.url, agreement.fileName)
    results.push({ name: 'Agreement', success: true, fileName: agreement.fileName })
  } catch (e) {
    results.push({ name: 'Agreement', success: false, error: e.message })
  }

  await new Promise(r => setTimeout(r, 500))

  // 3. Meeting Summary
  try {
    const meeting = await generateMeetingSummaryStyled(DEMO_MEETING)
    downloadPDF(meeting.url, meeting.fileName)
    results.push({ name: 'Meeting', success: true, fileName: meeting.fileName })
  } catch (e) {
    results.push({ name: 'Meeting', success: false, error: e.message })
  }

  await new Promise(r => setTimeout(r, 500))

  // 4. Qualified Investor
  try {
    const qualified = await generateQualifiedInvestorStyled(DEMO_QUALIFIED_INVESTOR)
    downloadPDF(qualified.url, qualified.fileName)
    results.push({ name: 'Qualified Investor', success: true, fileName: qualified.fileName })
  } catch (e) {
    results.push({ name: 'Qualified Investor', success: false, error: e.message })
  }

  await new Promise(r => setTimeout(r, 500))

  // 5. Qualified Advisor
  try {
    const qualifiedAdv = await generateQualifiedAdvisorStyled(DEMO_QUALIFIED_ADVISOR)
    downloadPDF(qualifiedAdv.url, qualifiedAdv.fileName)
    results.push({ name: 'Qualified Advisor', success: true, fileName: qualifiedAdv.fileName })
  } catch (e) {
    results.push({ name: 'Qualified Advisor', success: false, error: e.message })
  }

  return results
}
