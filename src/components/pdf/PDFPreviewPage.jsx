import { useState, useEffect } from 'react'
import { generatePDF } from './generatePDF'

const mockUser = {
  id: '1',
  name: 'אייל גרין',
  idNumber: '012345678',
  license: '54321',
  role: 'admin',
}

const mockFormData = {
  signerType: 'couple',
  clientA: {
    fullName: 'ישראל כהן',
    idNumber: '012345678',
    birthDate: '15.03.1975',
    maritalStatus: 'married',
    dependents: '3',
    phone: '050-1234567',
    email: 'israel@example.com',
    occupation: 'מנהל חשבונות',
  },
  clientB: {
    fullName: 'דליה כהן',
    idNumber: '087654321',
    birthDate: '22.07.1978',
    maritalStatus: 'married',
    dependents: '3',
    phone: '050-7654321',
    email: 'dalia@example.com',
    occupation: 'עורכת דין',
  },
  income: {
    salary: { has: true, amount: '45000' },
    pension: { has: false, amount: '' },
    realEstate: { has: true, amount: '8000' },
    other: { has: false, amount: '' },
  },
  incomeNotes: '',
  assets: {
    cash: { has: true, amount: '350000' },
    deposits: { has: true, amount: '500000' },
    moneyMarket: { has: false, amount: '' },
    managedPortfolio: { has: true, amount: '1200000' },
    stocks: { has: true, amount: '800000' },
    etf: { has: true, amount: '300000' },
    foreignBroker: { has: false, amount: '' },
    hishtalmut: { has: true, amount: '420000' },
    gemel: { has: true, amount: '180000' },
    gemelInvestment: { has: false, amount: '' },
    savingsPolicy: { has: true, amount: '250000' },
    pensionFund: { has: true, amount: '1100000' },
    bituachMenahalim: { has: false, amount: '' },
    investmentRealEstate: { has: true, amount: '2500000' },
    residenceRealEstate: { has: true, amount: '3200000' },
    business: { has: false, amount: '' },
    other: { has: false, amount: '' },
  },
  cashNotes: '',
  securitiesNotes: 'תיק מנוהל בבנק לאומי',
  savingsNotes: '',
  pensionNotes: '',
  realEstateNotes: 'דירה בתל אביב + דירה להשקעה בנתניה',
  otherAssetsNotes: '',
  liabilities: {
    mortgage: { has: true, monthly: '7500', total: '1200000' },
    loans: { has: true, monthly: '2000', total: '80000' },
    monthlyExpenses: '18000',
  },
  liabilitiesNotes: '',
  investmentGoals: ['growth', 'income', 'education'],
  investmentGoalOther: '',
  investmentHorizon: '5_to_10',
  liquidityTimeline: 'over_5',
  liquidityNext3Years: 'up_to_30',
  riskQ1: 'c',
  riskQ2: 'b',
  riskQ3: 'c',
  riskQ4: 'c',
  priorExperience: 'yes',
  priorExperienceDetails: 'ניסיון של 10 שנים בשוק ההון, כולל מסחר עצמאי',
  finalRiskLevel: 4,
  advisorSummary: 'הלקוח בעל ניסיון רב בשוק ההון, מצב כלכלי יציב עם הכנסות שוטפות גבוהות. מתאים לפרופיל סיכון צמיחה עם חשיפה מנייתית גבוהה יחסית. יש לוודא שמירה על נזילות מספקת לאור התחייבויות משכנתא.',
  clientPreferences: 'מעוניין בחשיפה לשוק האמריקאי. לא מעוניין בהשקעות בתחום הנפט.',
  equityPct: '35',
  corporateBondsPct: '50',
  forex: true,
  lowRatedBonds: false,
  finalRiskJustification: 'בהתאם לניסיון הלקוח, אופק ההשקעה הארוך, והיציבות הכלכלית — דרגת סיכון 4 (צמיחה) מתאימה. הלקוח מבין את התנודתיות ומוכן לקבלה.',
  managedPortion: '35_to_70',
  refusals: [
    { label: 'פירוט הכנסות מעסק' },
    { label: 'פירוט חובות נוספים' },
  ],
  refusalsConfirmed: true,
}

export default function PDFPreviewPage() {
  const [pdfUrl, setPdfUrl] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    generatePDF(mockFormData, mockUser)
      .then((result) => {
        setPdfUrl(result.url)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (error) return <div style={{ padding: 40, color: 'red', fontSize: 18 }}>Error: {error}</div>
  if (loading) return <div style={{ padding: 40, fontSize: 18 }}>Generating PDF...</div>

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <iframe src={pdfUrl} style={{ width: '100%', height: '100%', border: 'none' }} title="PDF Preview" />
    </div>
  )
}
