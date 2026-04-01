import jsPDF from 'jspdf'
import { RISK_LEVELS } from '../../data/formSchema'

// Hebrew text helper - jsPDF doesn't support RTL natively
// We'll use a simple approach: reverse text for display
function hebrewText(text) {
  return text
}

export async function generatePDF(formData, user) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = 210
  const margin = 20
  const contentWidth = pageWidth - margin * 2
  let y = 20

  // Helper functions
  const addLine = (text, fontSize = 12, fontStyle = 'normal', align = 'right') => {
    doc.setFontSize(fontSize)
    doc.setFont('helvetica', fontStyle)
    if (align === 'right') {
      doc.text(text, pageWidth - margin, y, { align: 'right' })
    } else if (align === 'center') {
      doc.text(text, pageWidth / 2, y, { align: 'center' })
    }
    y += fontSize * 0.5
  }

  const addSpacer = (size = 5) => { y += size }

  const checkPageBreak = (needed = 30) => {
    if (y + needed > 270) {
      doc.addPage()
      y = 20
    }
  }

  // === COVER ===
  addLine('GREEN Wealth Management', 22, 'bold', 'center')
  addSpacer(8)
  addLine('Needs Assessment / Client KYC', 16, 'normal', 'center')
  addSpacer(4)
  addLine(`Date: ${new Date().toLocaleDateString('he-IL')}`, 11, 'normal', 'center')
  addLine(`Advisor: ${user.name}`, 11, 'normal', 'center')
  addSpacer(10)

  doc.setDrawColor(27, 58, 47)
  doc.setLineWidth(0.5)
  doc.line(margin, y, pageWidth - margin, y)
  addSpacer(8)

  // === SECTION 1: Personal Details ===
  addLine('Section 1: Personal Details', 14, 'bold')
  addSpacer(3)

  const clientFields = [
    ['Full Name', 'fullName'],
    ['ID Number', 'idNumber'],
    ['Date of Birth', 'birthDate'],
    ['Marital Status', 'maritalStatus'],
    ['Dependents', 'dependents'],
    ['Phone', 'phone'],
    ['Email', 'email'],
    ['Occupation', 'occupation'],
  ]

  const printClient = (client, title) => {
    addLine(title, 12, 'bold')
    addSpacer(2)
    clientFields.forEach(([label, key]) => {
      const val = client[key] || '---'
      addLine(`${label}: ${val}`, 10)
    })
    addSpacer(3)
  }

  printClient(formData.clientA, formData.signerType === 'couple' ? 'Client A' : 'Client')
  if (formData.signerType === 'couple') {
    printClient(formData.clientB, 'Client B')
  }

  // === SECTION 2: Financial Balance ===
  checkPageBreak(60)
  doc.setDrawColor(27, 58, 47)
  doc.line(margin, y, pageWidth - margin, y)
  addSpacer(5)
  addLine('Section 2: Financial Balance (Household)', 14, 'bold')
  addSpacer(3)

  // Income
  addLine('Income:', 11, 'bold')
  if (formData.income.salary.has) addLine(`  Salary: ${formData.income.salary.amount}`, 10)
  if (formData.income.pension.has) addLine(`  Pension: ${formData.income.pension.amount}`, 10)
  if (formData.income.realEstate.has) addLine(`  Real Estate Income: ${formData.income.realEstate.amount}`, 10)
  if (formData.income.other.has) addLine(`  Other: ${formData.income.other.amount}`, 10)
  addSpacer(3)

  // Assets summary
  addLine('Assets:', 11, 'bold')
  const assetLabels = {
    cash: 'Cash', deposits: 'Deposits', moneyMarket: 'Money Market',
    managedPortfolio: 'Managed Portfolio', stocks: 'Stocks/Bonds', etf: 'ETF', foreignBroker: 'Foreign Broker',
    hishtalmut: 'Keren Hishtalmut', gemel: 'Kupat Gemel', gemelInvestment: 'Gemel LeHashkaa', savingsPolicy: 'Savings Policy',
    pensionFund: 'Pension Fund', bituachMenahalim: 'Bituach Menahalim',
    investmentRealEstate: 'Investment Real Estate', residenceRealEstate: 'Residence',
    business: 'Business', other: 'Other',
  }

  Object.entries(formData.assets).forEach(([key, asset]) => {
    if (asset.has) {
      let line = `  ${assetLabels[key] || key}: ${asset.amount}`
      if (asset.guaranteedYield) line += ' (Guaranteed Yield)'
      addLine(line, 10)
    }
  })
  addSpacer(3)

  // Liabilities
  addLine('Liabilities:', 11, 'bold')
  if (formData.liabilities.mortgage.has) addLine(`  Mortgage: Monthly ${formData.liabilities.mortgage.monthly}, Total ${formData.liabilities.mortgage.total}`, 10)
  if (formData.liabilities.loans.has) addLine(`  Loans: Monthly ${formData.liabilities.loans.monthly}, Total ${formData.liabilities.loans.total}`, 10)
  if (formData.liabilities.monthlyExpenses) addLine(`  Monthly Expenses: ${formData.liabilities.monthlyExpenses}`, 10)
  addSpacer(3)

  if (formData.managedPortion) {
    const portionLabels = { up_to_35: 'Up to 35%', '35_to_70': '35%-70%', over_70: 'Over 70%' }
    addLine(`Managed Portion: ${portionLabels[formData.managedPortion]}`, 10)
  }

  // === SECTION 3: Goals ===
  checkPageBreak(40)
  doc.line(margin, y, pageWidth - margin, y)
  addSpacer(5)
  addLine('Section 3: Investment Goals & Horizon', 14, 'bold')
  addSpacer(3)

  const goalLabels = {
    preserve: 'Preserve Value', income: 'Regular Income', growth: 'Long-term Growth',
    pension: 'Pension', education: 'Children Education', intergenerational: 'Intergenerational Transfer', other: 'Other',
  }
  addLine(`Goal: ${goalLabels[formData.investmentGoal] || '---'}`, 10)
  if (formData.investmentGoalOther) addLine(`  Details: ${formData.investmentGoalOther}`, 10)

  const horizonLabels = { up_to_2: 'Up to 2 years', '2_to_5': '2-5 years', '5_to_10': '5-10 years', over_10: 'Over 10 years' }
  addLine(`Horizon: ${horizonLabels[formData.investmentHorizon] || '---'}`, 10)

  // === SECTION 4: Liquidity ===
  addSpacer(3)
  const timelineLabels = { up_to_2: 'Up to 2 years', '2_to_5': '2-5 years', over_5: 'Over 5 years' }
  const next3Labels = { '0': '0%', up_to_30: 'Up to 30%', up_to_50: 'Up to 50%', over_50: 'Over 50%' }
  addLine(`Liquidity Timeline: ${timelineLabels[formData.liquidityTimeline] || '---'}`, 10)
  addLine(`Next 3 Years Need: ${next3Labels[formData.liquidityNext3Years] || '---'}`, 10)

  // === SECTION 5: Risk ===
  checkPageBreak(50)
  doc.line(margin, y, pageWidth - margin, y)
  addSpacer(5)
  addLine('Section 5: Risk Assessment', 14, 'bold')
  addSpacer(3)

  const riskAnswerLabels = {
    riskQ1: { a: 'A - Conservative', b: 'B - Moderate', c: 'C - Balanced', d: 'D - Aggressive' },
    riskQ2: { a: 'A - Safety first', b: 'B - Accept volatility', c: 'C - Long-term investor' },
    riskQ3: { a: 'A - Exit', b: 'B - Reduce risk', c: 'C - Hold', d: 'D - Add more' },
    riskQ4: { a: 'A - No loss', b: 'B - Beat inflation', c: 'C - Long-term growth' },
  }

  for (let i = 1; i <= 4; i++) {
    const key = `riskQ${i}`
    const answer = formData[key]
    addLine(`Q${i}: ${answer ? riskAnswerLabels[key][answer] : '---'}`, 10)
  }
  addSpacer(2)

  if (formData.finalRiskLevel > 0) {
    const rl = RISK_LEVELS[formData.finalRiskLevel - 1]
    addLine(`Final Risk Level: ${formData.finalRiskLevel} (${rl.name})`, 12, 'bold')
    addLine(`Max Loss: ${rl.maxLoss} | Max Stocks: ${rl.maxStocks} | Corp Bonds: ${rl.corpBonds}`, 10)
  }

  if (formData.finalRiskJustification) {
    addSpacer(2)
    addLine(`Justification: ${formData.finalRiskJustification}`, 10)
  }

  addSpacer(3)
  addLine(`Forex: ${formData.forex ? 'Yes' : 'No'} | Low-rated Bonds: ${formData.lowRatedBonds ? 'Yes' : 'No'} | Corp Bonds: ${formData.corporateBondsPct || '---'}%`, 10)
  if (formData.equityPct) addLine(`Max Equity: ${formData.equityPct}%`, 10)

  // === REFUSALS ===
  if (formData.refusals.length > 0) {
    checkPageBreak(30)
    doc.line(margin, y, pageWidth - margin, y)
    addSpacer(5)
    addLine('Refused Questions:', 12, 'bold')
    addSpacer(2)
    formData.refusals.forEach((r) => {
      addLine(`  - ${r.label}`, 10)
    })
    addSpacer(3)
    addLine('The client refused to answer the above questions.', 10)
    addLine('It was explained that this may affect the quality of the recommendation.', 10)
  }

  // === SIGNATURES ===
  checkPageBreak(50)
  addSpacer(10)
  doc.line(margin, y, pageWidth - margin, y)
  addSpacer(8)
  addLine('Signatures', 14, 'bold', 'center')
  addSpacer(8)

  // Client A signature
  const sigY = y
  doc.line(margin, sigY + 15, margin + 60, sigY + 15)
  addLine(`${formData.clientA.fullName || 'Client'}`, 10)
  y = sigY + 20
  addLine('Date: ____________', 9)

  if (formData.signerType === 'couple') {
    addSpacer(5)
    const sigY2 = y
    doc.line(margin, sigY2 + 15, margin + 60, sigY2 + 15)
    addLine(`${formData.clientB.fullName || 'Client B'}`, 10)
    y = sigY2 + 20
    addLine('Date: ____________', 9)
  }

  // Advisor signature
  addSpacer(5)
  const sigYAdvisor = y
  doc.line(margin, sigYAdvisor + 15, margin + 60, sigYAdvisor + 15)
  addLine(`${user.name} - Licensed Investment Marketer`, 10)
  y = sigYAdvisor + 20
  addLine('Date: ____________', 9)

  // Save
  const clientName = formData.clientA.fullName || 'client'
  const date = new Date().toISOString().split('T')[0]
  doc.save(`KYC_${date}_${clientName}.pdf`)
}
