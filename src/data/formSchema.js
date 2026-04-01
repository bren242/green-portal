// Initial empty form state
export function createEmptyForm() {
  return {
    // Gate
    signerType: '', // 'single' | 'couple'

    // Section 1 - Personal details
    clientA: createEmptyClient(),
    clientB: createEmptyClient(),
    familyNetWorth: '', // total family financial worth (text)

    // Section 2 - Financial balance sheet (always household)
    income: {
      salary: { has: false, amount: '' },
      pension: { has: false, amount: '' },
      realEstate: { has: false, amount: '' },
      other: { has: false, amount: '' },
    },
    assets: {
      // Cash & equivalents
      cash: { has: false, amount: '' },         // עו"ש, מזומן
      deposits: { has: false, amount: '' },      // פקדונות בנקאיים
      moneyMarket: { has: false, amount: '' },   // קרנות כספיות

      // Securities Israel & abroad
      managedPortfolio: { has: false, amount: '' },  // תיק מנוהל
      stocks: { has: false, amount: '' },            // מניות / אג"ח ישיר
      etf: { has: false, amount: '' },               // ETF
      foreignBroker: { has: false, amount: '' },     // ברוקר זר / חו"ל

      // Savings, Gemel & Hishtalmut
      hishtalmut: { has: false, amount: '' },        // קרן השתלמות
      gemel: { has: false, amount: '' },             // קופת גמל
      gemelInvestment: { has: false, amount: '' },   // גמל להשקעה
      savingsPolicy: { has: false, amount: '' },     // פוליסת חיסכון

      // Pension
      pensionFund: { has: false, amount: '' },       // קרן פנסיה
      bituachMenahalim: { has: false, amount: '', guaranteedYield: false }, // ביטוח מנהלים

      // Real estate
      investmentRealEstate: { has: false, amount: '' }, // נדל"ן להשקעה
      residenceRealEstate: { has: false, amount: '' },  // נדל"ן מגורים

      // Other
      business: { has: false, amount: '' },          // עסק
      other: { has: false, amount: '' },             // אחר
    },
    liabilities: {
      mortgage: { has: false, monthly: '', total: '' },
      loans: { has: false, monthly: '', total: '' },
      monthlyExpenses: '',
    },
    managedPortion: '', // 'up_to_35' | '35_to_70' | 'over_70'

    // Section 3 - Goals & Horizon
    investmentGoal: '', // 'preserve' | 'income' | 'growth' | 'pension' | 'education' | 'intergenerational' | 'other'
    investmentGoalOther: '',
    investmentHorizon: '', // 'up_to_2' | '2_to_5' | '5_to_10' | 'over_10'

    // Section 4 - Liquidity
    liquidityTimeline: '', // 'up_to_2' | '2_to_5' | 'over_5'
    liquidityNext3Years: '', // '0' | 'up_to_30' | 'up_to_50' | 'over_50'

    // Section 5 - Risk calculator
    riskQ1: '', // 'a' | 'b' | 'c' | 'd'
    riskQ2: '', // 'a' | 'b' | 'c'
    riskQ3: '', // 'a' | 'b' | 'c' | 'd'
    riskQ4: '', // 'a' | 'b' | 'c'
    priorExperience: '', // 'yes' | 'no'
    priorExperienceDetails: '',

    // Section 6 - Advisor summary
    advisorSummary: '',
    clientPreferences: '',
    calculatedRiskLevel: 0,
    finalRiskLevel: 0,
    finalRiskJustification: '',
    forex: false,
    lowRatedBonds: false,
    corporateBondsPct: '', // '50' | '100'
    equityPct: '',

    // Refusals tracking
    refusals: [], // array of { field, label }
  }
}

function createEmptyClient() {
  return {
    fullName: '',
    idNumber: '',
    birthDate: '',
    maritalStatus: '', // 'single' | 'married' | 'divorced' | 'widowed'
    dependents: '',
    phone: '',
    email: '',
    occupation: '',
  }
}

// Risk scoring
export const RISK_SCORES = {
  riskQ1: { a: 1, b: 2, c: 3, d: 5 },
  riskQ2: { a: 1, b: 3, c: 5 },
  riskQ3: { a: 1, b: 2, c: 3, d: 5 },
  riskQ4: { a: 1, b: 3, c: 5 },
}

export function calculateRiskScore(form) {
  const scores = []
  if (form.riskQ1) scores.push(RISK_SCORES.riskQ1[form.riskQ1])
  if (form.riskQ2) scores.push(RISK_SCORES.riskQ2[form.riskQ2])
  if (form.riskQ3) scores.push(RISK_SCORES.riskQ3[form.riskQ3])
  if (form.riskQ4) scores.push(RISK_SCORES.riskQ4[form.riskQ4])

  if (scores.length === 0) return { average: 0, level: 0, hasGap: false, gapDetails: '' }

  const average = scores.reduce((a, b) => a + b, 0) / scores.length

  let level
  if (average < 2) level = 1
  else if (average < 3) level = 2
  else if (average < 3.8) level = 3
  else if (average < 4.5) level = 4
  else level = 5

  // Gap detection
  let hasGap = false
  let gapDetails = ''
  const questions = ['riskQ1', 'riskQ2', 'riskQ3', 'riskQ4']
  for (let i = 0; i < scores.length; i++) {
    for (let j = i + 1; j < scores.length; j++) {
      if (Math.abs(scores[i] - scores[j]) >= 2) {
        hasGap = true
        gapDetails = `שים לב — יש פער בין שאלה ${i + 1} לשאלה ${j + 1}. כדאי לדון עם הלקוח לפני קביעת הדרגה.`
        break
      }
    }
    if (hasGap) break
  }

  return { average: Math.round(average * 10) / 10, level, hasGap, gapDetails }
}

export const RISK_LEVELS = [
  { level: 1, name: 'שמרן', maxLoss: 'עד 5%', maxStocks: '0%', corpBonds: 'עד 25%' },
  { level: 2, name: 'שמרן-מתון', maxLoss: 'עד 10%', maxStocks: 'עד 15%', corpBonds: 'עד 50%' },
  { level: 3, name: 'מאוזן', maxLoss: 'עד 15%', maxStocks: 'עד 25%', corpBonds: 'עד 100%' },
  { level: 4, name: 'צמיחה', maxLoss: 'מעל 15%', maxStocks: 'עד 35%', corpBonds: 'עד 100%' },
  { level: 5, name: 'אגרסיבי', maxLoss: 'משמעותי', maxStocks: 'עד 100%', corpBonds: '100%' },
]

export const WIZARD_STEPS = [
  { id: 'gate', title: 'שלב מקדים', subtitle: 'מי חותם על ההסכם?' },
  { id: 'personal', title: 'פרטים מזהים', subtitle: 'פרטים אישיים' },
  { id: 'financial', title: 'תמונה כלכלית', subtitle: 'מאזן התא המשפחתי' },
  { id: 'goals', title: 'מטרות ואופק', subtitle: 'מטרות השקעה ואופק' },
  { id: 'liquidity', title: 'נזילות', subtitle: 'צרכי נזילות' },
  { id: 'risk', title: 'יחס לסיכון', subtitle: 'מחשבון רמת סיכון' },
  { id: 'advisor', title: 'סיכום בעל הרישיון', subtitle: 'סיכום והמלצה' },
]
