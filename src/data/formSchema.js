// Initial empty form state
export function createEmptyForm() {
  return {
    signerType: '',
    clientA: createEmptyClient(),
    clientB: createEmptyClient(),
    familyNetWorth: '',

    // Income & expenses — dropdown ranges
    incomeRange: '',
    expenseRange: '',

    // Legacy income fields (synced from incomeRange for PDF)
    income: {
      salary: { has: false, amount: '' },
      pension: { has: false, amount: '' },
      realEstate: { has: false, amount: '' },
      other: { has: false, amount: '' },
    },

    // Grouped assets
    assetGroups: {
      cashDeposits: { amount: '', notes: '' },
      securities: { amount: '', notes: '' },
      pensionSavings: { amount: '', notes: '' },
      realEstate: { amount: '', notes: '' },
      other: { amount: '', notes: '' },
    },

    // Legacy asset fields (synced from assetGroups for PDF)
    assets: {
      cash: { has: false, amount: '' },
      deposits: { has: false, amount: '' },
      moneyMarket: { has: false, amount: '' },
      managedPortfolio: { has: false, amount: '' },
      stocks: { has: false, amount: '' },
      etf: { has: false, amount: '' },
      foreignBroker: { has: false, amount: '' },
      hishtalmut: { has: false, amount: '' },
      gemel: { has: false, amount: '' },
      gemelInvestment: { has: false, amount: '' },
      savingsPolicy: { has: false, amount: '' },
      pensionFund: { has: false, amount: '' },
      bituachMenahalim: { has: false, amount: '', guaranteedYield: false },
      investmentRealEstate: { has: false, amount: '' },
      residenceRealEstate: { has: false, amount: '' },
      business: { has: false, amount: '' },
      other: { has: false, amount: '' },
    },

    liabilities: {
      mortgage: { has: false, monthly: '', total: '' },
      loans: { has: false, monthly: '', total: '' },
      monthlyExpenses: '',
    },
    managedPortion: '',

    incomeNotes: '',
    cashNotes: '',
    securitiesNotes: '',
    savingsNotes: '',
    pensionNotes: '',
    realEstateNotes: '',
    otherAssetsNotes: '',
    liabilitiesNotes: '',

    investmentGoals: [],
    investmentGoalOther: '',
    investmentHorizon: '',

    liquidityTimeline: '',
    liquidityNext3Years: '',

    riskQ1: '',
    riskQ2: '',
    riskQ3: '',
    riskQ4: '',
    priorExperience: '',
    priorExperienceDetails: '',

    advisorSummary: '',
    clientPreferences: '',
    calculatedRiskLevel: 0,
    finalRiskLevel: 0,
    finalRiskJustification: '',
    riskLevelReason: '',
    forex: false,
    lowRatedBonds: false,
    corporateBondsPct: '',
    equityPct: '',

    refusals: [],
    refusalsConfirmed: false,
  }
}

function createEmptyClient() {
  return {
    fullName: '',
    idNumber: '',
    birthDate: '',
    maritalStatus: '',
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

  let hasGap = false
  let gapDetails = ''
  for (let i = 0; i < scores.length; i++) {
    for (let j = i + 1; j < scores.length; j++) {
      if (scores[i] !== scores[j] && Math.abs(scores[i] - scores[j]) >= 2) {
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
  { level: 1, name: 'שמרן', maxLoss: 'עד 5%', maxStocks: '0%', corpBonds: 'עד 25%', description: 'שמירת ערך מקסימלית, תנודות מינימליות, תשואה צנועה מעל פקדון' },
  { level: 2, name: 'שמרן-מתון', maxLoss: 'עד 10%', maxStocks: 'עד 15%', corpBonds: 'עד 50%', description: 'חשיפה מוגבלת לסיכון, תשואה מעל אינפלציה לאורך זמן' },
  { level: 3, name: 'מאוזן', maxLoss: 'עד 15%', maxStocks: 'עד 25%', corpBonds: 'עד 100%', description: 'איזון בין סיכון לתשואה, תנודות מובנות ומקובלות' },
  { level: 4, name: 'צמיחה', maxLoss: 'מעל 15%', maxStocks: 'עד 35%', corpBonds: 'עד 100%', description: 'נכונות לסיכון גבוה לטובת תשואה עודפת לטווח ארוך' },
  { level: 5, name: 'אגרסיבי', maxLoss: 'משמעותי', maxStocks: 'עד 100%', corpBonds: '100%', description: 'חשיפה מקסימלית, מתאים למשקיע מנוסה עם אופק ארוך' },
]

// Step validation
export function validateStep(stepId, formData) {
  const errors = []

  if (stepId === 'gate') {
    if (!formData.signerType) errors.push({ field: 'signerType', message: 'נא לבחור סוג חותם' })
  }

  if (stepId === 'personal') {
    if (!formData.clientA.fullName) errors.push({ field: 'clientA.fullName', message: 'נא למלא שם מלא' })
    if (!formData.clientA.idNumber) errors.push({ field: 'clientA.idNumber', message: 'נא למלא תעודת זהות' })
    if (!formData.clientA.phone) errors.push({ field: 'clientA.phone', message: 'נא למלא טלפון נייד' })
    if (!formData.clientA.email) errors.push({ field: 'clientA.email', message: 'נא למלא דוא״ל' })

    if (formData.signerType === 'couple') {
      if (!formData.clientB.fullName) errors.push({ field: 'clientB.fullName', message: 'נא למלא שם מלא (לקוח ב׳)' })
      if (!formData.clientB.idNumber) errors.push({ field: 'clientB.idNumber', message: 'נא למלא תעודת זהות (לקוח ב׳)' })
      if (!formData.clientB.phone) errors.push({ field: 'clientB.phone', message: 'נא למלא טלפון נייד (לקוח ב׳)' })
      if (!formData.clientB.email) errors.push({ field: 'clientB.email', message: 'נא למלא דוא״ל (לקוח ב׳)' })
    }
  }

  return errors
}

export const WIZARD_STEPS = [
  { id: 'gate', title: 'שלב מקדים', subtitle: 'מי חותם על ההסכם?' },
  { id: 'personal', title: 'פרטים מזהים', subtitle: 'פרטים אישיים' },
  { id: 'financial', title: 'תמונה כלכלית', subtitle: 'מאזן התא המשפחתי' },
  { id: 'goals', title: 'מטרות ואופק', subtitle: 'מטרות השקעה ואופק' },
  { id: 'liquidity', title: 'נזילות', subtitle: 'צרכי נזילות' },
  { id: 'risk', title: 'יחס לסיכון', subtitle: 'מחשבון רמת סיכון' },
  { id: 'advisor', title: 'סיכום בעל הרישיון', subtitle: 'סיכום והמלצה' },
]
