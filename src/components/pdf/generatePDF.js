import jsPDF from 'jspdf'
import { assistantRegular, assistantBold } from '../../assets/fonts/assistantFonts'
import { RISK_LEVELS } from '../../data/formSchema'
import { logoPng } from '../../assets/logoBase64'

// Hebrew RTL helper for jsPDF
// jsPDF renders LTR only. We reverse logical order so LTR rendering looks RTL.
// Numbers, English, and symbols stay in their natural LTR order.
function rtl(text) {
  if (!text) return ''
  const str = String(text)
  // Match Hebrew runs vs non-Hebrew runs (numbers, English, punctuation, spaces)
  const segments = str.match(/[\u0590-\u05FF\uFB1D-\uFB4F]+|[^\u0590-\u05FF\uFB1D-\uFB4F]+/g) || []
  return segments
    .reverse()
    .map((seg) => {
      if (/[\u0590-\u05FF]/.test(seg)) {
        return seg.split('').reverse().join('')
      }
      return seg // numbers, English, symbols stay LTR
    })
    .join('')
}

// Colors from DESIGN.md
const COLORS = {
  primary: [27, 58, 47],
  secondary: [62, 122, 92],
  gold: [184, 151, 90],
  goldLight: [212, 180, 131],
  offWhite: [244, 243, 239],
  cream: [248, 245, 238],
  surfaceLight: [246, 245, 241],
  border: [221, 213, 191],
  textPrimary: [26, 26, 26],
  textMuted: [90, 90, 90],
  negative: [192, 57, 43],
  white: [255, 255, 255],
  black: [0, 0, 0],
}

export async function generatePDF(formData, user) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  // Register fonts
  doc.addFileToVFS('Assistant-Regular.ttf', assistantRegular)
  doc.addFont('Assistant-Regular.ttf', 'Assistant', 'normal')
  doc.addFileToVFS('Assistant-Bold.ttf', assistantBold)
  doc.addFont('Assistant-Bold.ttf', 'Assistant', 'bold')

  const pageWidth = 210
  const pageHeight = 297
  const margin = 20
  const rightX = pageWidth - margin
  const contentWidth = pageWidth - margin * 2
  let y = 0
  let totalPages = 0

  // ==================== HELPERS ====================
  const setColor = (color) => doc.setTextColor(...color)
  const setFill = (color) => doc.setFillColor(...color)
  const setDraw = (color) => doc.setDrawColor(...color)

  const text = (str, x, yPos, options = {}) => {
    doc.text(rtl(String(str || '')), x, yPos, { align: 'right', ...options })
  }

  const checkPage = (needed = 25) => {
    if (y + needed > pageHeight - 30) {
      doc.addPage()
      addPageHeader()
    }
  }

  const addPageHeader = () => {
    // Dark green header bar
    setFill(COLORS.primary)
    doc.rect(0, 0, pageWidth, 14, 'F')

    // Gold accent line
    setFill(COLORS.gold)
    doc.rect(0, 14, pageWidth, 1, 'F')

    // Logo on left side of header
    try {
      doc.addImage(logoPng, 'PNG', margin, 2, 28, 10)
    } catch (e) { /* logo unavailable */ }

    // Title text on right
    doc.setFont('Assistant', 'bold')
    doc.setFontSize(9)
    setColor(COLORS.goldLight)
    text('איפיון צרכים — GREEN Wealth Management', rightX - 3, 9)

    y = 22
  }

  const sectionTitle = (title) => {
    checkPage(20)
    setFill(COLORS.primary)
    doc.roundedRect(margin, y, contentWidth, 10, 2, 2, 'F')
    doc.setFont('Assistant', 'bold')
    doc.setFontSize(12)
    setColor(COLORS.white)
    text(title, rightX - 5, y + 7)
    y += 16
    setColor(COLORS.black)
    doc.setFont('Assistant', 'normal')
  }

  const labelValue = (label, value, labelColor = COLORS.black) => {
    checkPage(8)
    doc.setFont('Assistant', 'bold')
    doc.setFontSize(9)
    setColor(labelColor)
    text(label, rightX, y)
    doc.setFont('Assistant', 'normal')
    doc.setFontSize(10)
    setColor(COLORS.black)
    text(String(value || '---'), rightX - 55, y)
    y += 7
  }

  const spacer = (s = 4) => { y += s }

  // Manual table drawing
  const drawTable = (rows) => {
    if (!rows || rows.length === 0) return
    const rowHeight = 8

    for (let i = 0; i < rows.length; i++) {
      checkPage(rowHeight + 2)
      const rowY = y

      if (i % 2 === 0) {
        setFill(COLORS.surfaceLight)
        doc.rect(margin, rowY - 4, contentWidth, rowHeight, 'F')
      }

      setDraw(COLORS.border)
      doc.setLineWidth(0.15)
      doc.line(margin, rowY + rowHeight - 4, margin + contentWidth, rowY + rowHeight - 4)

      doc.setFont('Assistant', 'bold')
      doc.setFontSize(9)
      setColor(COLORS.black)
      text(rows[i][0], rightX - 3, rowY)

      doc.setFont('Assistant', 'normal')
      doc.setFontSize(9)
      setColor(COLORS.black)
      text(String(rows[i][1] || '---'), rightX - 90, rowY)

      y += rowHeight
    }
    y += 2
  }

  // Summary table (3 columns: label, value, highlighted)
  const drawSummaryTable = (rows) => {
    const rowHeight = 10
    for (let i = 0; i < rows.length; i++) {
      checkPage(rowHeight + 2)
      const rowY = y
      const isHighlight = rows[i][2]

      if (isHighlight) {
        setFill(COLORS.primary)
        doc.rect(margin, rowY - 5, contentWidth, rowHeight, 'F')
        doc.setFont('Assistant', 'bold')
        doc.setFontSize(10)
        setColor(COLORS.white)
      } else {
        setFill(i % 2 === 0 ? COLORS.surfaceLight : COLORS.white)
        doc.rect(margin, rowY - 5, contentWidth, rowHeight, 'F')
        doc.setFont('Assistant', 'bold')
        doc.setFontSize(9)
        setColor(COLORS.black)
      }

      setDraw(COLORS.border)
      doc.setLineWidth(0.15)
      doc.line(margin, rowY + rowHeight - 5, margin + contentWidth, rowY + rowHeight - 5)

      text(rows[i][0], rightX - 3, rowY)

      doc.setFont('Assistant', 'normal')
      text(String(rows[i][1] || '---'), rightX - 90, rowY)

      y += rowHeight
    }
    y += 3
  }

  const addNote = (noteText) => {
    if (!noteText) return
    checkPage(12)
    doc.setFont('Assistant', 'normal')
    doc.setFontSize(8)
    setColor(COLORS.textMuted)
    text(`הערות: ${noteText}`, rightX, y)
    y += 6
  }

  // Helper to parse amount string to number
  const parseAmount = (str) => {
    if (!str) return 0
    const num = parseFloat(String(str).replace(/[^\d.-]/g, ''))
    return isNaN(num) ? 0 : num
  }

  // ==================== COVER PAGE ====================
  setFill(COLORS.primary)
  doc.rect(0, 0, pageWidth, 90, 'F')

  setFill(COLORS.gold)
  doc.rect(0, 90, pageWidth, 3, 'F')

  // Logo on cover
  try {
    doc.addImage(logoPng, 'PNG', pageWidth / 2 - 25, 18, 50, 19)
  } catch (e) {
    doc.setFont('Assistant', 'bold')
    doc.setFontSize(32)
    setColor(COLORS.white)
    doc.text('GREEN', pageWidth / 2, 35, { align: 'center' })
  }

  doc.setFont('Assistant', 'normal')
  doc.setFontSize(11)
  setColor(COLORS.goldLight)
  doc.text('WEALTH MANAGEMENT', pageWidth / 2, 48, { align: 'center' })

  doc.setFont('Assistant', 'bold')
  doc.setFontSize(22)
  setColor(COLORS.white)
  text('איפיון צרכים והתאמת מדיניות השקעה', pageWidth / 2, 70, { align: 'center' })

  // Info box
  y = 105
  setFill(COLORS.cream)
  setDraw(COLORS.border)
  doc.roundedRect(margin + 20, y, contentWidth - 40, 42, 3, 3, 'FD')

  doc.setFont('Assistant', 'normal')
  doc.setFontSize(11)
  setColor(COLORS.black)

  const date = new Date().toLocaleDateString('he-IL')
  const clientName = formData.clientA.fullName || '---'

  text(`תאריך: ${date}`, pageWidth / 2 + 30, y + 13)
  text(`לקוח: ${clientName}`, pageWidth / 2 + 30, y + 24)
  text(`בעל הרישיון: ${user.name}`, pageWidth / 2 + 30, y + 35)

  // Footer disclaimer
  y = 260
  doc.setFontSize(8)
  setColor(COLORS.textMuted)
  text('מסמך זה הופק באמצעות מערכת איפיון צרכים דיגיטלית של GREEN Wealth Management', pageWidth / 2, y, { align: 'center' })
  text('כל הנתונים נמסרו על ידי הלקוח ובאחריותו', pageWidth / 2, y + 5, { align: 'center' })

  // ==================== PAGE 2: PERSONAL DETAILS ====================
  doc.addPage()
  addPageHeader()

  sectionTitle('פרטים מזהים')

  const printClient = (client, title) => {
    checkPage(55)
    doc.setFont('Assistant', 'bold')
    doc.setFontSize(11)
    setColor(COLORS.secondary)
    text(title, rightX, y)
    y += 8
    doc.setFont('Assistant', 'normal')

    labelValue('שם מלא', client.fullName)
    labelValue('תעודת זהות', client.idNumber)
    labelValue('תאריך לידה', client.birthDate)
    labelValue('מצב משפחתי', translateMarital(client.maritalStatus))
    labelValue('נפשות תלויות', client.dependents)
    labelValue('טלפון', client.phone)
    labelValue('דוא״ל', client.email)
    labelValue('עיסוק', client.occupation)
    spacer(6)
  }

  printClient(formData.clientA, formData.signerType === 'couple' ? 'לקוח א׳' : 'פרטי הלקוח')
  if (formData.signerType === 'couple') {
    printClient(formData.clientB, 'לקוח ב׳')
  }

  // ==================== FINANCIAL BALANCE ====================
  sectionTitle('תמונה כלכלית — התא המשפחתי')

  let totalAssets = 0
  let totalLiabilities = 0

  // Income
  const incomeRows = []
  if (formData.income.salary.has) incomeRows.push(['שכר נטו חודשי', formData.income.salary.amount])
  if (formData.income.pension.has) incomeRows.push(['פנסיה / קצבה', formData.income.pension.amount])
  if (formData.income.realEstate.has) incomeRows.push(['הכנסות מנדל״ן', formData.income.realEstate.amount])
  if (formData.income.other.has) incomeRows.push(['אחר', formData.income.other.amount])

  if (incomeRows.length > 0) {
    checkPage(30)
    doc.setFont('Assistant', 'bold')
    doc.setFontSize(10)
    setColor(COLORS.primary)
    text('הכנסות (חודשי)', rightX, y)
    y += 7
    drawTable(incomeRows)
  }
  addNote(formData.incomeNotes)

  // Assets
  const assetSections = [
    { title: 'עו״ש, מזומן ופקדונות', items: [
      ['עו״ש / מזומן', formData.assets.cash],
      ['פקדונות בנקאיים', formData.assets.deposits],
      ['קרנות כספיות', formData.assets.moneyMarket],
    ], notes: formData.cashNotes },
    { title: 'ני״ע בארץ ובחו״ל', items: [
      ['תיק מנוהל', formData.assets.managedPortfolio],
      ['מניות / אג״ח', formData.assets.stocks],
      ['ETF', formData.assets.etf],
      ['ברוקר זר / חו״ל', formData.assets.foreignBroker],
    ], notes: formData.securitiesNotes },
    { title: 'חיסכון, גמל והשתלמות', items: [
      ['קרן השתלמות', formData.assets.hishtalmut],
      ['קופת גמל', formData.assets.gemel],
      ['גמל להשקעה', formData.assets.gemelInvestment],
      ['פוליסת חיסכון', formData.assets.savingsPolicy],
    ], notes: formData.savingsNotes },
    { title: 'פנסיה', items: [
      ['קרן פנסיה', formData.assets.pensionFund],
      ['ביטוח מנהלים' + (formData.assets.bituachMenahalim && formData.assets.bituachMenahalim.guaranteedYield ? ' (תשואה מובטחת)' : ''), formData.assets.bituachMenahalim],
    ], notes: formData.pensionNotes },
    { title: 'נדל״ן', items: [
      ['נדל״ן להשקעה', formData.assets.investmentRealEstate],
      ['נדל״ן מגורים', formData.assets.residenceRealEstate],
    ], notes: formData.realEstateNotes },
    { title: 'אחר', items: [
      ['עסק / שותפות', formData.assets.business],
      ['אחר', formData.assets.other],
    ], notes: formData.otherAssetsNotes },
  ]

  for (const section of assetSections) {
    const rows = section.items
      .filter(([, asset]) => asset && asset.has)
      .map(([label, asset]) => {
        totalAssets += parseAmount(asset.amount)
        return [label, asset.amount || '---']
      })
    if (rows.length > 0) {
      checkPage(rows.length * 8 + 18)
      doc.setFont('Assistant', 'bold')
      doc.setFontSize(10)
      setColor(COLORS.primary)
      text(section.title, rightX, y)
      y += 7
      drawTable(rows)
      addNote(section.notes)
    }
  }

  // Liabilities
  const liabRows = []
  if (formData.liabilities.mortgage.has) {
    totalLiabilities += parseAmount(formData.liabilities.mortgage.total)
    liabRows.push(['משכנתא', `חודשי: ${formData.liabilities.mortgage.monthly || '---'} | יתרה: ${formData.liabilities.mortgage.total || '---'}`])
  }
  if (formData.liabilities.loans.has) {
    totalLiabilities += parseAmount(formData.liabilities.loans.total)
    liabRows.push(['הלוואות', `חודשי: ${formData.liabilities.loans.monthly || '---'} | יתרה: ${formData.liabilities.loans.total || '---'}`])
  }
  if (formData.liabilities.monthlyExpenses) liabRows.push(['הוצאות שוטפות', formData.liabilities.monthlyExpenses])

  if (liabRows.length > 0) {
    checkPage(30)
    doc.setFont('Assistant', 'bold')
    doc.setFontSize(10)
    setColor(COLORS.primary)
    text('התחייבויות', rightX, y)
    y += 7
    drawTable(liabRows)
  }
  addNote(formData.liabilitiesNotes)

  // ===== ASSET SUMMARY TABLE =====
  const netWorth = totalAssets - totalLiabilities
  const fmtNum = (n) => n > 0 ? n.toLocaleString('he-IL') + ' ₪' : '---'

  checkPage(40)
  spacer(6)
  doc.setFont('Assistant', 'bold')
  doc.setFontSize(10)
  setColor(COLORS.primary)
  text('סיכום מאזן', rightX, y)
  y += 7

  drawSummaryTable([
    ['סך נכסים', fmtNum(totalAssets), false],
    ['סך התחייבויות', fmtNum(totalLiabilities), false],
    ['שווי נטו', fmtNum(netWorth), true],
  ])

  // Managed portion
  if (formData.managedPortion) {
    spacer(4)
    const portionLabels = { up_to_35: 'עד 35%', '35_to_70': '35%-70%', over_70: 'מעל 70%' }
    labelValue('שיעור נכסים מנוהל', portionLabels[formData.managedPortion])
  }

  // ==================== GOALS & HORIZON ====================
  sectionTitle('מטרות השקעה ואופק')

  const goalLabels = {
    preserve: 'שמירת ערך', income: 'הכנסה שוטפת', growth: 'צמיחה לטווח ארוך',
    pension: 'חיסכון לפנסיה', education: 'חינוך ילדים', intergenerational: 'העברה בין-דורית', other: 'אחר',
  }
  const goals = (formData.investmentGoals || []).map((g) => goalLabels[g] || g).join(', ')
  labelValue('מטרות ההשקעה', goals || '---')
  if (formData.investmentGoalOther) labelValue('פירוט', formData.investmentGoalOther)

  const horizonLabels = { up_to_2: 'עד שנתיים', '2_to_5': '2-5 שנים', '5_to_10': '5-10 שנים', over_10: 'מעל 10 שנים' }
  labelValue('אופק השקעה', horizonLabels[formData.investmentHorizon] || '---')

  // ==================== LIQUIDITY ====================
  sectionTitle('צרכי נזילות')

  const timelineLabels = { up_to_2: 'עד שנתיים', '2_to_5': '2-5 שנים', over_5: 'מעל 5 שנים', unknown: 'לא ידוע' }
  const next3Labels = { '0': '0%', up_to_30: 'עד 30%', up_to_50: 'עד 50%', over_50: 'מעל 50%', unknown: 'לא ידוע' }

  labelValue('מתי תצטרך את כל הכסף', timelineLabels[formData.liquidityTimeline] || '---')
  labelValue('כמה תצטרך ב-3 שנים', next3Labels[formData.liquidityNext3Years] || '---')

  // ==================== RISK ASSESSMENT ====================
  sectionTitle('הערכת סיכון')

  const q1Labels = { a: 'סיכוי עד 6%, סיכון עד 5%', b: 'סיכוי עד 14%, סיכון עד 10%', c: 'סיכוי עד 20%, סיכון עד 15%', d: 'סיכוי מעל 20%, סיכון מעל 15%' }
  const q2Labels = { a: 'מעדיף לישון בשקט', b: 'מוכן לתנודות לטובת תשואה', c: 'משקיע לטווח ארוך, תנודות לא מדאיגות' }
  const q3Labels = { a: 'רוצה לצאת', b: 'שוקל לצמצם סיכון', c: 'מחזיק ומחכה', d: 'רואה הזדמנות להוסיף' }
  const q4Labels = { a: 'לא להפסיד', b: 'לשמור מעל אינפלציה', c: 'צמיחה לטווח ארוך' }

  labelValue('שאלה 1 — אסימטריה', q1Labels[formData.riskQ1] || '---')
  labelValue('שאלה 2 — תחושה', q2Labels[formData.riskQ2] || '---')
  labelValue('שאלה 3 — תרחיש', q3Labels[formData.riskQ3] || '---')
  labelValue('שאלה 4 — עדיפות', q4Labels[formData.riskQ4] || '---')

  spacer(4)

  if (formData.priorExperience) {
    labelValue('ניסיון קודם', formData.priorExperience === 'yes' ? 'כן' : 'לא')
    if (formData.priorExperienceDetails) labelValue('פירוט', formData.priorExperienceDetails)
  }

  // ==================== ADVISOR SUMMARY & POLICY ====================
  sectionTitle('סיכום והמלצת בעל הרישיון')

  if (formData.advisorSummary) {
    checkPage(20)
    doc.setFont('Assistant', 'bold')
    doc.setFontSize(9)
    setColor(COLORS.black)
    text('סיכום וניתוח', rightX, y)
    y += 6
    doc.setFont('Assistant', 'normal')
    doc.setFontSize(9)
    setColor(COLORS.black)
    const lines = doc.splitTextToSize(rtl(formData.advisorSummary), contentWidth)
    doc.text(lines, rightX, y, { align: 'right' })
    y += lines.length * 4.5 + 4
  }

  if (formData.clientPreferences) {
    checkPage(20)
    doc.setFont('Assistant', 'bold')
    doc.setFontSize(9)
    setColor(COLORS.black)
    text('העדפות / הגבלות לקוח', rightX, y)
    y += 6
    doc.setFont('Assistant', 'normal')
    doc.setFontSize(9)
    setColor(COLORS.black)
    const lines = doc.splitTextToSize(rtl(formData.clientPreferences), contentWidth)
    doc.text(lines, rightX, y, { align: 'right' })
    y += lines.length * 4.5 + 4
  }

  // Risk level box
  if (formData.finalRiskLevel > 0) {
    checkPage(35)
    const rl = RISK_LEVELS[formData.finalRiskLevel - 1]

    setFill(COLORS.cream)
    setDraw(COLORS.gold)
    doc.setLineWidth(0.8)
    doc.roundedRect(margin, y, contentWidth, 25, 3, 3, 'FD')

    doc.setFont('Assistant', 'bold')
    doc.setFontSize(14)
    setColor(COLORS.primary)
    text(`דרגת סיכון סופית: ${formData.finalRiskLevel}`, rightX - 5, y + 10)

    doc.setFontSize(11)
    setColor(COLORS.secondary)
    text(`${rl.name} | הפסד מקסימלי: ${rl.maxLoss} | מניות: ${rl.maxStocks} | אג״ח קונצרני: ${rl.corpBonds}`, rightX - 5, y + 19)

    y += 32
  }

  if (formData.finalRiskJustification) {
    checkPage(15)
    doc.setFont('Assistant', 'bold')
    doc.setFontSize(9)
    setColor(COLORS.black)
    text('נימוק מקצועי', rightX, y)
    y += 6
    doc.setFont('Assistant', 'normal')
    doc.setFontSize(9)
    setColor(COLORS.black)
    const lines = doc.splitTextToSize(rtl(formData.finalRiskJustification), contentWidth)
    doc.text(lines, rightX, y, { align: 'right' })
    y += lines.length * 4.5 + 4
  }

  // Policy parameters
  spacer(3)
  if (formData.equityPct) labelValue('אחוז מניות מקסימלי', formData.equityPct + '%')
  if (formData.corporateBondsPct) labelValue('אג״ח קונצרני', formData.corporateBondsPct === '50' ? 'עד 50%' : 'עד 100%')
  labelValue('מט״ח', formData.forex ? 'כן' : 'לא')
  labelValue('אג״ח בדירוג נמוך', formData.lowRatedBonds ? 'כן' : 'לא')

  // ==================== REFUSALS ====================
  if (formData.refusals && formData.refusals.length > 0) {
    checkPage(20 + formData.refusals.length * 6)
    spacer(6)
    setFill(COLORS.offWhite)
    setDraw(COLORS.negative)
    doc.setLineWidth(0.3)
    const refHeight = 15 + formData.refusals.length * 6
    doc.roundedRect(margin, y, contentWidth, refHeight, 2, 2, 'FD')

    doc.setFont('Assistant', 'bold')
    doc.setFontSize(10)
    setColor(COLORS.negative)
    text('שאלות שהלקוח סירב להשיב:', rightX - 5, y + 8)
    y += 14

    doc.setFont('Assistant', 'normal')
    doc.setFontSize(9)
    setColor(COLORS.black)
    formData.refusals.forEach((r) => {
      text(`• ${r.label}`, rightX - 8, y)
      y += 6
    })

    y += 4
    doc.setFontSize(8)
    setColor(COLORS.textMuted)
    text('הובהר ללקוח כי אי מסירת המידע עלולה לפגוע באיכות ההמלצה.', rightX, y)
    y += 10
  }

  // ==================== SUMMARY PAGE ====================
  doc.addPage()
  addPageHeader()

  sectionTitle('סיכום תשובות הלקוח')

  const summaryItems = []

  // Personal
  summaryItems.push({ section: 'פרטים אישיים', items: [
    ['שם מלא', formData.clientA.fullName],
    ['תעודת זהות', formData.clientA.idNumber],
    ['טלפון', formData.clientA.phone],
    ['דוא״ל', formData.clientA.email],
    ['עיסוק', formData.clientA.occupation],
    ['מצב משפחתי', translateMarital(formData.clientA.maritalStatus)],
  ]})

  if (formData.signerType === 'couple') {
    summaryItems.push({ section: 'לקוח ב׳', items: [
      ['שם מלא', formData.clientB.fullName],
      ['תעודת זהות', formData.clientB.idNumber],
    ]})
  }

  // Financial summary
  summaryItems.push({ section: 'תמונה כלכלית', items: [
    ['סך נכסים', fmtNum(totalAssets)],
    ['סך התחייבויות', fmtNum(totalLiabilities)],
    ['שווי נטו', fmtNum(netWorth)],
    ['שיעור נכסים מנוהל', formData.managedPortion ? { up_to_35: 'עד 35%', '35_to_70': '35%-70%', over_70: 'מעל 70%' }[formData.managedPortion] : '---'],
  ]})

  // Goals
  summaryItems.push({ section: 'מטרות ואופק', items: [
    ['מטרות השקעה', goals || '---'],
    ['אופק השקעה', horizonLabels[formData.investmentHorizon] || '---'],
  ]})

  // Liquidity
  summaryItems.push({ section: 'נזילות', items: [
    ['צורך בכל הכסף', timelineLabels[formData.liquidityTimeline] || '---'],
    ['צורך ב-3 שנים', next3Labels[formData.liquidityNext3Years] || '---'],
  ]})

  // Risk
  const rlFinal = formData.finalRiskLevel > 0 ? RISK_LEVELS[formData.finalRiskLevel - 1] : null
  summaryItems.push({ section: 'סיכון ומדיניות', items: [
    ['שאלה 1', q1Labels[formData.riskQ1] || '---'],
    ['שאלה 2', q2Labels[formData.riskQ2] || '---'],
    ['שאלה 3', q3Labels[formData.riskQ3] || '---'],
    ['שאלה 4', q4Labels[formData.riskQ4] || '---'],
    ['דרגת סיכון סופית', rlFinal ? `${formData.finalRiskLevel} — ${rlFinal.name}` : '---'],
    ['ניסיון קודם', formData.priorExperience === 'yes' ? 'כן' : formData.priorExperience === 'no' ? 'לא' : '---'],
  ]})

  // Render summary
  for (const group of summaryItems) {
    checkPage(15)
    doc.setFont('Assistant', 'bold')
    doc.setFontSize(10)
    setColor(COLORS.primary)
    text(group.section, rightX, y)
    y += 7

    for (const [label, value] of group.items) {
      checkPage(8)
      doc.setFont('Assistant', 'bold')
      doc.setFontSize(8)
      setColor(COLORS.textMuted)
      text(label, rightX, y)
      doc.setFont('Assistant', 'normal')
      doc.setFontSize(9)
      setColor(COLORS.black)
      text(String(value || '---'), rightX - 55, y)
      y += 6
    }
    spacer(4)
  }

  // ==================== SIGNATURES ====================
  checkPage(70)
  spacer(10)
  setDraw(COLORS.primary)
  doc.setLineWidth(0.5)
  doc.line(margin, y, pageWidth - margin, y)
  y += 10

  doc.setFont('Assistant', 'bold')
  doc.setFontSize(13)
  setColor(COLORS.primary)
  text('חתימות', pageWidth / 2, y, { align: 'center' })
  y += 12

  const addSignature = (name, role) => {
    checkPage(30)
    doc.setFont('Assistant', 'bold')
    doc.setFontSize(10)
    setColor(COLORS.primary)
    text(role, rightX, y)
    y += 8

    doc.setFont('Assistant', 'normal')
    doc.setFontSize(9)
    setColor(COLORS.black)
    text(name || '_______________', rightX, y)
    y += 5

    setDraw(COLORS.border)
    doc.setLineWidth(0.3)
    doc.line(rightX - 60, y, rightX, y)
    y += 5
    doc.setFontSize(8)
    setColor(COLORS.textMuted)
    text('חתימה                                   תאריך', rightX, y)
    y += 12
  }

  addSignature(formData.clientA.fullName, formData.signerType === 'couple' ? 'לקוח א׳' : 'הלקוח')
  if (formData.signerType === 'couple') {
    addSignature(formData.clientB.fullName, 'לקוח ב׳')
  }
  addSignature(user.name, 'בעל הרישיון')

  // ==================== PAGE NUMBERS (all pages) ====================
  totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)

    // Logo on left of every page (except cover which already has it)
    if (i > 1) {
      // Already added via addPageHeader
    }

    // Page number footer
    doc.setFont('Assistant', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(90, 90, 90)
    doc.text(`${i} / ${totalPages}`, pageWidth / 2, pageHeight - 8, { align: 'center' })
  }

  // ==================== RETURN BLOB ====================
  const safeName = (formData.clientA.fullName || 'client').replace(/[^a-zA-Z0-9\u0590-\u05FF]/g, '_')
  const dateStr = new Date().toISOString().split('T')[0]
  const fileName = `KYC_${dateStr}_${safeName}.pdf`
  const blob = doc.output('blob')
  const url = URL.createObjectURL(blob)
  return { url, fileName, blob }
}

function translateMarital(status) {
  const map = { single: 'רווק/ה', married: 'נשוי/אה', divorced: 'גרוש/ה', widowed: 'אלמן/ה' }
  return map[status] || status || '---'
}
