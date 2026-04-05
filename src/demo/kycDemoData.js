// Demo data for KYC PDF generation testing
// Couple scenario, all fields populated, risk level 3

export const demoFormData = {
  signerType: 'couple',
  clientA: {
    fullName: 'דוד כהן',
    idNumber: '012345678',
    birthDate: '1978-03-15',
    maritalStatus: 'married',
    dependents: '3',
    phone: '0501234567',
    email: 'david@example.com',
    occupation: 'מהנדס תוכנה',
  },
  clientB: {
    fullName: 'שרה כהן',
    idNumber: '023456789',
    birthDate: '1980-07-22',
    maritalStatus: 'married',
    dependents: '3',
    phone: '0529876543',
    email: 'sarah@example.com',
    occupation: 'רואת חשבון',
  },
  familyNetWorth: '',

  // Income & expenses
  incomeRange: '30_50',
  expenseRange: '20_30',

  // Legacy income (synced from incomeRange midpoint = 40000)
  income: {
    salary: { has: true, amount: '40000' },
    pension: { has: false, amount: '' },
    realEstate: { has: false, amount: '' },
    other: { has: false, amount: '' },
  },

  // Grouped assets
  assetGroups: {
    cashDeposits: { amount: '500000', notes: 'פקדון בבנק לאומי' },
    securities: { amount: '1200000', notes: 'תיק מנוהל IBI' },
    pensionSavings: { amount: '800000', notes: '' },
    realEstate: { amount: '3500000', notes: 'דירה בתל אביב' },
    other: { amount: '200000', notes: 'עסק משפחתי' },
  },

  // Legacy assets (synced from assetGroups)
  assets: {
    cash: { has: true, amount: '500000' },
    deposits: { has: false, amount: '' },
    moneyMarket: { has: false, amount: '' },
    managedPortfolio: { has: true, amount: '1200000' },
    stocks: { has: false, amount: '' },
    etf: { has: false, amount: '' },
    foreignBroker: { has: false, amount: '' },
    hishtalmut: { has: false, amount: '' },
    gemel: { has: false, amount: '' },
    gemelInvestment: { has: false, amount: '' },
    savingsPolicy: { has: false, amount: '' },
    pensionFund: { has: true, amount: '800000' },
    bituachMenahalim: { has: false, amount: '', guaranteedYield: false },
    investmentRealEstate: { has: true, amount: '3500000' },
    residenceRealEstate: { has: false, amount: '' },
    business: { has: false, amount: '' },
    other: { has: true, amount: '200000' },
  },

  liabilities: {
    mortgage: { has: true, monthly: '6500', total: '1200000' },
    loans: { has: true, monthly: '2000', total: '80000' },
    monthlyExpenses: '25000',
  },
  managedPortion: '35_to_70',

  incomeNotes: 'שכר שני בני הזוג',
  cashNotes: 'פקדון בבנק לאומי',
  securitiesNotes: 'תיק מנוהל IBI',
  savingsNotes: '',
  pensionNotes: '',
  realEstateNotes: 'דירה בתל אביב',
  otherAssetsNotes: 'עסק משפחתי',
  liabilitiesNotes: 'משכנתא על דירת מגורים',

  investmentGoals: ['growth', 'education', 'pension'],
  investmentGoalOther: '',
  investmentHorizon: '5_to_10',

  liquidityTimeline: 'over_5',
  liquidityNext3Years: 'up_to_30',

  riskQ1: 'c',
  riskQ2: 'b',
  riskQ3: 'c',
  riskQ4: 'c',
  priorExperience: 'yes',
  priorExperienceDetails: 'ניסיון של 10 שנים בשוק ההון, כולל מניות ואג"ח',

  advisorSummary: 'זוג עם פרופיל כלכלי יציב, הכנסה גבוהה מהוצאות, תיק נכסים מגוון. מתאימים לדרגת סיכון מאוזנת עם נטייה לצמיחה. אופק השקעה ארוך, צרכי נזילות נמוכים.',
  clientPreferences: 'העדפה לתיק מגוון עם חשיפה בינלאומית. ללא השקעה בתעשיית הנשק.',
  calculatedRiskLevel: 3,
  finalRiskLevel: 3,
  finalRiskJustification: '',
  riskLevelReason: 'דרגת סיכון מאוזנת התואמת את הניסיון, האופק הארוך, ורמת הנוחות עם תנודות',
  forex: true,
  lowRatedBonds: false,
  corporateBondsPct: '100',
  equityPct: '25',

  refusals: [
    { field: 'income.pension', label: 'הכנסה מפנסיה/קצבה' },
  ],
  refusalsConfirmed: true,
}

export const demoUser = {
  name: 'אייל ישראלי',
  idNumber: '987654321',
  license: '12345',
  role: 'advisor',
}
