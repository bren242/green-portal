import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { assistantRegular, assistantBold } from '../../assets/fonts/assistantFonts'
import { RISK_LEVELS } from '../../data/formSchema'

// Hebrew RTL helper - reverse text for jsPDF display
function rtl(text) {
  if (!text) return ''
  // Split into segments: Hebrew vs non-Hebrew (numbers, English, symbols)
  const segments = text.match(/[\u0590-\u05FF\uFB1D-\uFB4F]+|[^\u0590-\u05FF\uFB1D-\uFB4F]+/g) || []
  // Reverse order of segments and reverse Hebrew segments internally
  return segments
    .reverse()
    .map((seg) => {
      if (/[\u0590-\u05FF]/.test(seg)) {
        return seg.split('').reverse().join('')
      }
      return seg
    })
    .join('')
}

// Colors from DESIGN.md
const COLORS = {
  primary: [27, 58, 47],       // #1B3A2F
  secondary: [62, 122, 92],    // #3E7A5C
  gold: [184, 151, 90],        // #B8975A
  goldLight: [212, 180, 131],  // #D4B483
  offWhite: [244, 243, 239],   // #F4F3EF
  cream: [248, 245, 238],      // #F8F5EE
  surfaceLight: [246, 245, 241],// #F6F5F1
  border: [221, 213, 191],     // #DDD5BF
  textPrimary: [26, 26, 26],   // #1A1A1A
  textMuted: [90, 90, 90],     // #5A5A5A
  negative: [192, 57, 43],     // #C0392B
  white: [255, 255, 255],
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

  // ==================== HELPERS ====================
  const setColor = (color) => doc.setTextColor(...color)
  const setFill = (color) => doc.setFillColor(...color)
  const setDraw = (color) => doc.setDrawColor(...color)

  const text = (str, x, yPos, options = {}) => {
    doc.text(rtl(str), x, yPos, { align: 'right', ...options })
  }

  const textLeft = (str, x, yPos) => {
    doc.text(str, x, yPos, { align: 'left' })
  }

  const checkPage = (needed = 25) => {
    if (y + needed > pageHeight - 25) {
      doc.addPage()
      y = 25
      addPageHeader()
    }
  }

  const addPageHeader = () => {
    // Thin header bar
    setFill(COLORS.primary)
    doc.rect(0, 0, pageWidth, 12, 'F')
    doc.setFont('Assistant', 'bold')
    doc.setFontSize(8)
    setColor(COLORS.goldLight)
    text('GREEN Wealth Management', rightX - 5, 8)
    setColor(COLORS.white)
    doc.setFont('Assistant', 'normal')
    doc.setFontSize(7)
    textLeft(rtl('איפיון צרכים'), margin + 5, 8)
    y = 20
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
    setColor(COLORS.textPrimary)
    doc.setFont('Assistant', 'normal')
  }

  const labelValue = (label, value) => {
    checkPage(8)
    doc.setFont('Assistant', 'bold')
    doc.setFontSize(9)
    setColor(COLORS.textMuted)
    text(label, rightX, y)
    doc.setFont('Assistant', 'normal')
    doc.setFontSize(10)
    setColor(COLORS.textPrimary)
    text(value || '---', rightX - 50, y)
    y += 6
  }

  const spacer = (s = 4) => { y += s }

  // ==================== COVER PAGE ====================
  // Green background bar
  setFill(COLORS.primary)
  doc.rect(0, 0, pageWidth, 85, 'F')

  // Gold accent line
  setFill(COLORS.gold)
  doc.rect(0, 85, pageWidth, 3, 'F')

  // Logo placeholder - text version
  doc.setFont('Assistant', 'bold')
  doc.setFontSize(32)
  setColor(COLORS.white)
  doc.text('GREEN', pageWidth / 2, 35, { align: 'center' })
  doc.setFontSize(11)
  setColor(COLORS.goldLight)
  doc.text('WEALTH MANAGEMENT', pageWidth / 2, 45, { align: 'center' })

  // Title
  doc.setFontSize(22)
  setColor(COLORS.white)
  text('איפיון צרכים והתאמת מדיניות השקעה', pageWidth / 2, 65, { align: 'center' })

  // Info box below cover
  y = 100
  setFill(COLORS.cream)
  setDraw(COLORS.border)
  doc.roundedRect(margin + 20, y, contentWidth - 40, 40, 3, 3, 'FD')

  doc.setFont('Assistant', 'normal')
  doc.setFontSize(11)
  setColor(COLORS.textPrimary)

  const date = new Date().toLocaleDateString('he-IL')
  const clientName = formData.clientA.fullName || '---'

  text(`תאריך: ${date}`, pageWidth / 2 + 30, y + 12)
  text(`לקוח: ${clientName}`, pageWidth / 2 + 30, y + 22)
  text(`בעל הרישיון: ${user.name}`, pageWidth / 2 + 30, y + 32)

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
    checkPage(50)
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

  // Income
  checkPage(30)
  doc.setFont('Assistant', 'bold')
  doc.setFontSize(10)
  setColor(COLORS.primary)
  text('הכנסות (חודשי)', rightX, y)
  y += 7

  const incomeRows = []
  if (formData.income.salary.has) incomeRows.push(['שכר נטו חודשי', formData.income.salary.amount])
  if (formData.income.pension.has) incomeRows.push(['פנסיה / קצבה', formData.income.pension.amount])
  if (formData.income.realEstate.has) incomeRows.push(['הכנסות מנדל״ן', formData.income.realEstate.amount])
  if (formData.income.other.has) incomeRows.push(['אחר', formData.income.other.amount])

  if (incomeRows.length > 0) {
    addTable(doc, incomeRows, y)
    y += incomeRows.length * 8 + 10
  }
  if (formData.incomeNotes) {
    addNote(doc, formData.incomeNotes)
  }

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
      ['ביטוח מנהלים' + (formData.assets.bituachMenahalim.guaranteedYield ? ' (תשואה מובטחת)' : ''), formData.assets.bituachMenahalim],
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
    const rows = section.items.filter(([, asset]) => asset.has).map(([label, asset]) => [label, asset.amount || '---'])
    if (rows.length > 0) {
      checkPage(rows.length * 8 + 18)
      doc.setFont('Assistant', 'bold')
      doc.setFontSize(10)
      setColor(COLORS.primary)
      text(section.title, rightX, y)
      y += 7
      addTable(doc, rows, y)
      y += rows.length * 8 + 8
      if (section.notes) addNote(doc, section.notes)
    }
  }

  // Liabilities
  checkPage(30)
  doc.setFont('Assistant', 'bold')
  doc.setFontSize(10)
  setColor(COLORS.primary)
  text('התחייבויות', rightX, y)
  y += 7

  const liabRows = []
  if (formData.liabilities.mortgage.has) liabRows.push(['משכנתא', `חודשי: ${formData.liabilities.mortgage.monthly || '---'} | יתרה: ${formData.liabilities.mortgage.total || '---'}`])
  if (formData.liabilities.loans.has) liabRows.push(['הלוואות', `חודשי: ${formData.liabilities.loans.monthly || '---'} | יתרה: ${formData.liabilities.loans.total || '---'}`])
  if (formData.liabilities.monthlyExpenses) liabRows.push(['הוצאות שוטפות', formData.liabilities.monthlyExpenses])

  if (liabRows.length > 0) {
    addTable(doc, liabRows, y)
    y += liabRows.length * 8 + 8
  }
  if (formData.liabilitiesNotes) addNote(doc, formData.liabilitiesNotes)

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

  labelValue('צורך בכל הכסף', timelineLabels[formData.liquidityTimeline] || '---')
  labelValue('צורך ב-3 שנים', next3Labels[formData.liquidityNext3Years] || '---')

  // ==================== RISK ASSESSMENT ====================
  sectionTitle('הערכת סיכון')

  // Risk questions answers
  const q1Labels = { a: 'סיכוי עד 6%, סיכון עד 5%', b: 'סיכוי עד 14%, סיכון עד 10%', c: 'סיכוי עד 20%, סיכון עד 15%', d: 'סיכוי מעל 20%, סיכון מעל 15%' }
  const q2Labels = { a: 'מעדיף לישון בשקט', b: 'מוכן לתנודות לטובת תשואה', c: 'משקיע לטווח ארוך, תנודות לא מדאיגות' }
  const q3Labels = { a: 'רוצה לצאת', b: 'שוקל לצמצם סיכון', c: 'מחזיק ומחכה', d: 'רואה הזדמנות להוסיף' }
  const q4Labels = { a: 'לא להפסיד', b: 'לשמור מעל אינפלציה', c: 'צמיחה לטווח ארוך' }

  labelValue('שאלה 1 — אסימטריה', q1Labels[formData.riskQ1] || '---')
  labelValue('שאלה 2 — תחושה', q2Labels[formData.riskQ2] || '---')
  labelValue('שאלה 3 — תרחיש', q3Labels[formData.riskQ3] || '---')
  labelValue('שאלה 4 — עדיפות', q4Labels[formData.riskQ4] || '---')

  spacer(4)

  // Prior experience
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
    setColor(COLORS.textMuted)
    text('סיכום וניתוח', rightX, y)
    y += 6
    doc.setFont('Assistant', 'normal')
    doc.setFontSize(9)
    setColor(COLORS.textPrimary)
    const lines = doc.splitTextToSize(rtl(formData.advisorSummary), contentWidth)
    doc.text(lines, rightX, y, { align: 'right' })
    y += lines.length * 4.5 + 4
  }

  if (formData.clientPreferences) {
    checkPage(20)
    doc.setFont('Assistant', 'bold')
    doc.setFontSize(9)
    setColor(COLORS.textMuted)
    text('העדפות / הגבלות לקוח', rightX, y)
    y += 6
    doc.setFont('Assistant', 'normal')
    doc.setFontSize(9)
    setColor(COLORS.textPrimary)
    const lines = doc.splitTextToSize(rtl(formData.clientPreferences), contentWidth)
    doc.text(lines, rightX, y, { align: 'right' })
    y += lines.length * 4.5 + 4
  }

  // Risk level box
  if (formData.finalRiskLevel > 0) {
    checkPage(35)
    const rl = RISK_LEVELS[formData.finalRiskLevel - 1]

    // Risk level highlight box
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
    setColor(COLORS.textMuted)
    text('נימוק מקצועי', rightX, y)
    y += 6
    doc.setFont('Assistant', 'normal')
    doc.setFontSize(9)
    setColor(COLORS.textPrimary)
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
  if (formData.refusals.length > 0) {
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

  // ==================== SIGNATURES ====================
  checkPage(60)
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

  // Signature helper
  const addSignature = (name, role) => {
    checkPage(25)
    doc.setFont('Assistant', 'bold')
    doc.setFontSize(10)
    setColor(COLORS.primary)
    text(role, rightX, y)
    y += 8

    doc.setFont('Assistant', 'normal')
    doc.setFontSize(9)
    setColor(COLORS.textPrimary)
    text(name || '_______________', rightX, y)
    y += 5

    setDraw(COLORS.border)
    doc.setLineWidth(0.3)
    doc.line(rightX - 60, y, rightX, y)
    y += 5
    doc.setFontSize(8)
    setColor(COLORS.textMuted)
    text('חתימה                                   תאריך', rightX, y)
    y += 10
  }

  addSignature(formData.clientA.fullName, formData.signerType === 'couple' ? 'לקוח א׳' : 'הלקוח')
  if (formData.signerType === 'couple') {
    addSignature(formData.clientB.fullName, 'לקוח ב׳')
  }
  addSignature(user.name, 'בעל הרישיון')

  // ==================== SAVE ====================
  const safeName = (formData.clientA.fullName || 'client').replace(/[^a-zA-Z0-9\u0590-\u05FF]/g, '_')
  const dateStr = new Date().toISOString().split('T')[0]
  doc.save(`KYC_${dateStr}_${safeName}.pdf`)

  // ==================== HELPER FUNCTIONS ====================
  function addTable(d, rows, startY) {
    autoTable(d, {
      body: rows.map(([label, value]) => [rtl(value || '---'), rtl(label)]),
      startY,
      margin: { right: margin, left: margin },
      styles: {
        font: 'Assistant',
        fontStyle: 'normal',
        fontSize: 9,
        halign: 'right',
        cellPadding: 2,
        lineColor: COLORS.border,
        lineWidth: 0.2,
      },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: contentWidth - 50, fontStyle: 'bold' },
      },
      alternateRowStyles: { fillColor: COLORS.surfaceLight },
      didDrawPage: () => { y = d.lastAutoTable.finalY + 4 },
    })
    y = d.lastAutoTable.finalY + 4
  }

  function addNote(d, noteText) {
    if (!noteText) return
    checkPage(12)
    d.setFont('Assistant', 'normal')
    d.setFontSize(8)
    setColor(COLORS.textMuted)
    text(`הערות: ${noteText}`, rightX, y)
    y += 6
  }
}

function translateMarital(status) {
  const map = { single: 'רווק/ה', married: 'נשוי/אה', divorced: 'גרוש/ה', widowed: 'אלמן/ה' }
  return map[status] || status || '---'
}
