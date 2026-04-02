import React from 'react'
import { Document, Page, Text, View, Image, Font, StyleSheet, pdf } from '@react-pdf/renderer'
import { RISK_LEVELS } from '../../data/formSchema'
import { getUserById } from '../../data/users'

// ==================== FONT REGISTRATION ====================
Font.register({
  family: 'Assistant',
  fonts: [
    { src: '/fonts/Assistant-Regular.ttf', fontWeight: 'normal' },
    { src: '/fonts/Assistant-Bold.ttf', fontWeight: 'bold' },
  ],
})

// Disable hyphenation for Hebrew
Font.registerHyphenationCallback((word) => [word])

// ==================== COLORS ====================
const C = {
  primary: '#1B3A2F',
  secondary: '#3E7A5C',
  gold: '#B8975A',
  goldLight: '#D4B483',
  offWhite: '#F4F3EF',
  cream: '#F8F5EE',
  surfaceLight: '#F6F5F1',
  border: '#DDD5BF',
  black: '#1A1A1A',
  textMuted: '#5A5A5A',
  negative: '#C0392B',
  white: '#FFFFFF',
}

// ==================== HELPERS ====================
function fmtMoney(val) {
  if (!val) return '---'
  const str = String(val)
  const num = parseFloat(str.replace(/[^\d.-]/g, ''))
  if (isNaN(num)) return str.includes('₪') ? str : `₪ ${str}`
  return `₪ ${num.toLocaleString('he-IL')}`
}

function parseAmount(str) {
  if (!str) return 0
  const num = parseFloat(String(str).replace(/[^\d.-]/g, ''))
  return isNaN(num) ? 0 : num
}

function translateMarital(status) {
  const map = { single: 'רווק/ה', married: 'נשוי/אה', divorced: 'גרוש/ה', widowed: 'אלמן/ה' }
  return map[status] || status || '---'
}

function fmtDate() {
  const d = new Date()
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}.${mm}.${yyyy}`
}

// ==================== STYLES ====================
const s = StyleSheet.create({
  page: {
    fontFamily: 'Assistant',
    direction: 'rtl',
    paddingTop: 70,
    paddingBottom: 40,
    paddingHorizontal: 36,
    fontSize: 10,
    color: C.black,
  },
  // Page header
  headerBar: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: 52, backgroundColor: C.primary,
    flexDirection: 'row-reverse', alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerGoldLine: {
    position: 'absolute', top: 52, left: 0, right: 0,
    height: 2, backgroundColor: C.gold,
  },
  headerRight: {
    flex: 1, alignItems: 'flex-start',
  },
  headerRightLine1: {
    fontSize: 11, fontWeight: 'bold', color: C.white, textAlign: 'right',
  },
  headerRightLine2: {
    fontSize: 10, color: C.gold, textAlign: 'right', marginTop: 2,
  },
  headerCenter: {
    borderWidth: 1, borderColor: C.gold, borderRadius: 4,
    paddingVertical: 4, paddingHorizontal: 12, alignItems: 'center',
  },
  headerCenterLabel: {
    fontSize: 7, color: C.gold,
  },
  headerCenterDate: {
    fontSize: 10, fontWeight: 'bold', color: C.white, marginTop: 1,
  },
  headerLogo: {
    height: 36, marginLeft: 0,
  },
  // Footer
  footer: {
    position: 'absolute', bottom: 14, left: 0, right: 0,
    textAlign: 'center', fontSize: 7, color: C.textMuted,
  },
  // Section title bar
  sectionTitle: {
    backgroundColor: C.primary, borderRadius: 3,
    paddingVertical: 5, paddingHorizontal: 10,
    marginTop: 14, marginBottom: 8,
  },
  sectionTitleText: {
    fontSize: 11, fontWeight: 'bold', color: C.goldLight, textAlign: 'right',
  },
  // Label-value row
  row: {
    flexDirection: 'row-reverse', justifyContent: 'flex-start',
    paddingVertical: 3, paddingHorizontal: 4,
  },
  rowEven: {
    backgroundColor: C.surfaceLight,
  },
  rowLabel: {
    width: '40%', fontSize: 9, fontWeight: 'bold', color: C.textMuted, textAlign: 'right',
  },
  rowValue: {
    width: '60%', fontSize: 10, color: C.black, textAlign: 'right',
  },
  // Table
  tableHeaderRow: {
    flexDirection: 'row-reverse', backgroundColor: C.primary,
    borderRadius: 2, paddingVertical: 4, paddingHorizontal: 6,
  },
  tableHeaderCell: {
    flex: 1, fontSize: 9, fontWeight: 'bold', color: C.white, textAlign: 'right',
  },
  tableRow: {
    flexDirection: 'row-reverse', paddingVertical: 4, paddingHorizontal: 6,
    borderBottomWidth: 0.5, borderBottomColor: C.border,
  },
  tableCell: {
    flex: 1, fontSize: 9, textAlign: 'right', color: C.black,
  },
  tableCellBold: {
    flex: 1, fontSize: 9, fontWeight: 'bold', textAlign: 'right', color: C.black,
  },
  // Summary highlight row
  summaryHighlight: {
    flexDirection: 'row-reverse', backgroundColor: C.primary,
    paddingVertical: 5, paddingHorizontal: 6, borderRadius: 2, marginTop: 2,
  },
  summaryHighlightText: {
    flex: 1, fontSize: 10, fontWeight: 'bold', color: C.white, textAlign: 'right',
  },
  // Risk box
  riskBox: {
    backgroundColor: C.cream, borderWidth: 1, borderColor: C.gold,
    borderRadius: 4, padding: 12, marginTop: 8,
  },
  // Card
  card: {
    borderWidth: 0.5, borderColor: C.border, borderRadius: 4,
    marginBottom: 10, overflow: 'hidden',
  },
  cardTitle: {
    backgroundColor: C.primary, paddingVertical: 5, paddingHorizontal: 10,
  },
  cardTitleText: {
    fontSize: 9, fontWeight: 'bold', color: C.white, textAlign: 'right',
  },
  cardBody: {
    padding: 8,
  },
  // Refusals
  refusalBox: {
    backgroundColor: C.offWhite, borderWidth: 0.5, borderColor: C.negative,
    borderRadius: 3, padding: 10, marginTop: 10,
  },
  // Paragraph
  paragraph: {
    fontSize: 9, textAlign: 'right', lineHeight: 1.6, marginBottom: 8, color: C.black,
  },
  // Signature
  signatureLine: {
    fontSize: 10, textAlign: 'right', marginTop: 8, color: C.black,
  },
  // Cover page
  coverBg: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: 280, backgroundColor: C.primary,
  },
  coverGold: {
    position: 'absolute', top: 280, left: 0, right: 0,
    height: 3, backgroundColor: C.gold,
  },
  subtitle: {
    fontSize: 10, color: C.textMuted, textAlign: 'right', marginBottom: 3,
  },
})

// ==================== REUSABLE COMPONENTS ====================

const PageHeader = ({ clientName, date }) => (
  <View fixed>
    <View style={s.headerBar}>
      {/* Right side — title + client name */}
      <View style={s.headerRight}>
        <Text style={s.headerRightLine1}>אפיון צרכים והתאמת מדיניות השקעה</Text>
        <Text style={s.headerRightLine2}>{clientName}</Text>
      </View>
      {/* Center — date box */}
      <View style={s.headerCenter}>
        <Text style={s.headerCenterLabel}>תאריך דוח</Text>
        <Text style={s.headerCenterDate}>{date}</Text>
      </View>
      {/* Left side — logo */}
      <Image src="/logo.png" style={s.headerLogo} />
    </View>
    <View style={s.headerGoldLine} />
  </View>
)

const PageFooter = () => (
  <Text style={s.footer} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
)

const SectionTitle = ({ children }) => (
  <View style={s.sectionTitle} wrap={false} minPresenceAhead={60}>
    <Text style={s.sectionTitleText}>{children}</Text>
  </View>
)

const LabelValue = ({ label, value, even }) => (
  <View style={[s.row, even ? s.rowEven : null]}>
    <Text style={s.rowLabel}>{label}</Text>
    <Text style={s.rowValue}>{value || '---'}</Text>
  </View>
)

const DataTable = ({ headers, rows }) => (
  <View>
    {headers && (
      <View style={s.tableHeaderRow}>
        {headers.map((h, i) => <Text key={i} style={s.tableHeaderCell}>{h}</Text>)}
      </View>
    )}
    {rows.map((row, i) => (
      <View key={i} style={[s.tableRow, i % 2 === 0 ? { backgroundColor: C.surfaceLight } : null]}>
        {row.map((cell, j) => (
          <Text key={j} style={j === 0 ? s.tableCellBold : s.tableCell}>{cell}</Text>
        ))}
      </View>
    ))}
  </View>
)

const SummaryRow = ({ label, value, highlight }) => {
  if (highlight) {
    return (
      <View style={s.summaryHighlight}>
        <Text style={s.summaryHighlightText}>{label}</Text>
        <Text style={s.summaryHighlightText}>{value}</Text>
      </View>
    )
  }
  return (
    <View style={s.tableRow}>
      <Text style={s.tableCellBold}>{label}</Text>
      <Text style={s.tableCell}>{value}</Text>
    </View>
  )
}

const SummaryCard = ({ title, items }) => (
  <View style={s.card} wrap={false}>
    <View style={s.cardTitle}>
      <Text style={s.cardTitleText}>{title}</Text>
    </View>
    <View style={s.cardBody}>
      {items.map(([label, value], i) => (
        <LabelValue key={i} label={label} value={value} even={i % 2 === 0} />
      ))}
    </View>
  </View>
)

// ==================== MAIN DOCUMENT ====================

const KYCDocument = ({ formData, user }) => {
  const date = fmtDate()
  const clientName = formData.clientA.fullName || '---'

  // Financial calculations
  let totalAssets = 0
  let totalLiabilities = 0
  let totalMonthlyIncome = 0
  let totalMonthlyExpenses = 0

  // Income
  const incomeRows = []
  const incomeItems = [
    ['שכר נטו חודשי', formData.income.salary],
    ['פנסיה / קצבה', formData.income.pension],
    ['הכנסות מנדל״ן', formData.income.realEstate],
    ['אחר', formData.income.other],
  ]
  for (const [label, item] of incomeItems) {
    if (item.has) {
      totalMonthlyIncome += parseAmount(item.amount)
      incomeRows.push([label, fmtMoney(item.amount)])
    }
  }

  // Assets
  const assetSections = [
    { title: 'עו״ש, מזומן ופקדונות', items: [
      ['עו״ש / מזומן', formData.assets.cash], ['פקדונות בנקאיים', formData.assets.deposits],
      ['קרנות כספיות', formData.assets.moneyMarket],
    ], notes: formData.cashNotes },
    { title: 'ני״ע בארץ ובחו״ל', items: [
      ['תיק מנוהל', formData.assets.managedPortfolio], ['מניות / אג״ח', formData.assets.stocks],
      ['ETF', formData.assets.etf], ['ברוקר זר / חו״ל', formData.assets.foreignBroker],
    ], notes: formData.securitiesNotes },
    { title: 'חיסכון, גמל והשתלמות', items: [
      ['קרן השתלמות', formData.assets.hishtalmut], ['קופת גמל', formData.assets.gemel],
      ['גמל להשקעה', formData.assets.gemelInvestment], ['פוליסת חיסכון', formData.assets.savingsPolicy],
    ], notes: formData.savingsNotes },
    { title: 'פנסיה', items: [
      ['קרן פנסיה', formData.assets.pensionFund],
      ['ביטוח מנהלים', formData.assets.bituachMenahalim],
    ], notes: formData.pensionNotes },
    { title: 'נדל״ן', items: [
      ['נדל״ן להשקעה', formData.assets.investmentRealEstate], ['נדל״ן מגורים', formData.assets.residenceRealEstate],
    ], notes: formData.realEstateNotes },
    { title: 'אחר', items: [
      ['עסק / שותפות', formData.assets.business], ['אחר', formData.assets.other],
    ], notes: formData.otherAssetsNotes },
  ]

  const processedAssetSections = assetSections.map((section) => {
    const rows = section.items
      .filter(([, a]) => a && a.has)
      .map(([label, a]) => { totalAssets += parseAmount(a.amount); return [label, fmtMoney(a.amount)] })
    return { ...section, rows }
  }).filter(sec => sec.rows.length > 0)

  // Liabilities
  const liabRows = []
  if (formData.liabilities.mortgage.has) {
    totalLiabilities += parseAmount(formData.liabilities.mortgage.total)
    totalMonthlyExpenses += parseAmount(formData.liabilities.mortgage.monthly)
    liabRows.push(['משכנתא', `חודשי: ${fmtMoney(formData.liabilities.mortgage.monthly)} | יתרה: ${fmtMoney(formData.liabilities.mortgage.total)}`])
  }
  if (formData.liabilities.loans.has) {
    totalLiabilities += parseAmount(formData.liabilities.loans.total)
    totalMonthlyExpenses += parseAmount(formData.liabilities.loans.monthly)
    liabRows.push(['הלוואות', `חודשי: ${fmtMoney(formData.liabilities.loans.monthly)} | יתרה: ${fmtMoney(formData.liabilities.loans.total)}`])
  }
  if (formData.liabilities.monthlyExpenses) {
    totalMonthlyExpenses += parseAmount(formData.liabilities.monthlyExpenses)
    liabRows.push(['הוצאות שוטפות', fmtMoney(formData.liabilities.monthlyExpenses)])
  }

  const netWorth = totalAssets - totalLiabilities
  const monthlyBalance = totalMonthlyIncome - totalMonthlyExpenses

  // Goals & labels
  const goalLabels = {
    preserve: 'שמירת ערך', income: 'הכנסה שוטפת', growth: 'צמיחה לטווח ארוך',
    pension: 'חיסכון לפנסיה', education: 'חינוך ילדים', intergenerational: 'העברה בין-דורית', other: 'אחר',
  }
  const goals = (formData.investmentGoals || []).map((g) => goalLabels[g] || g).join(', ')
  const horizonLabels = { up_to_2: 'עד שנתיים', '2_to_5': '2-5 שנים', '5_to_10': '5-10 שנים', over_10: 'מעל 10 שנים' }
  const timelineLabels = { up_to_2: 'עד שנתיים', '2_to_5': '2-5 שנים', over_5: 'מעל 5 שנים', unknown: 'לא ידוע' }
  const next3Labels = { '0': '0%', up_to_30: 'עד 30%', up_to_50: 'עד 50%', over_50: 'מעל 50%', unknown: 'לא ידוע' }
  const q1Labels = { a: 'סיכוי עד 6%, סיכון עד 5%', b: 'סיכוי עד 14%, סיכון עד 10%', c: 'סיכוי עד 20%, סיכון עד 15%', d: 'סיכוי מעל 20%, סיכון מעל 15%' }
  const q2Labels = { a: 'מעדיף לישון בשקט', b: 'מוכן לתנודות לטובת תשואה', c: 'משקיע לטווח ארוך, תנודות לא מדאיגות' }
  const q3Labels = { a: 'רוצה לצאת', b: 'שוקל לצמצם סיכון', c: 'מחזיק ומחכה', d: 'רואה הזדמנות להוסיף' }
  const q4Labels = { a: 'לא להפסיד', b: 'לשמור מעל אינפלציה', c: 'צמיחה לטווח ארוך' }

  const rlFinal = formData.finalRiskLevel > 0 ? RISK_LEVELS[formData.finalRiskLevel - 1] : null
  const portionLabels = { up_to_35: 'עד 35%', '35_to_70': '35%-70%', over_70: 'מעל 70%' }

  const advisorName = user.name || '____________'
  const advisorLicense = user.license || '____________'

  const printClient = (client, title) => (
    <View wrap={false}>
      <Text style={{ fontSize: 11, fontWeight: 'bold', color: C.secondary, textAlign: 'right', marginBottom: 6, marginTop: 8 }}>{title}</Text>
      <LabelValue label="שם מלא" value={client.fullName} even />
      <LabelValue label="תעודת זהות" value={client.idNumber} />
      <LabelValue label="תאריך לידה" value={client.birthDate} even />
      <LabelValue label="מצב משפחתי" value={translateMarital(client.maritalStatus)} />
      <LabelValue label="נפשות תלויות" value={client.dependents} even />
      <LabelValue label="טלפון" value={client.phone} />
      <LabelValue label="דוא״ל" value={client.email} even />
      <LabelValue label="עיסוק" value={client.occupation} />
    </View>
  )

  return (
    <Document>
      {/* ==================== COVER PAGE ==================== */}
      <Page size="A4" style={{ fontFamily: 'Assistant', direction: 'rtl' }}>
        <View style={s.coverBg} />
        <View style={s.coverGold} />

        {/* Logo */}
        <View style={{ alignItems: 'center', marginTop: 60 }}>
          <Image src="/logo.png" style={{ height: 60 }} />
          <Text style={{ fontSize: 11, color: C.goldLight, marginTop: 8 }}>WEALTH MANAGEMENT</Text>
        </View>

        {/* Title */}
        <View style={{ alignItems: 'center', marginTop: 40 }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: C.white }}>אפיון צרכים והתאמת מדיניות השקעה</Text>
        </View>

        {/* Client + Date box */}
        <View style={{ marginHorizontal: 50, marginTop: 60, backgroundColor: C.offWhite, borderRadius: 4, borderWidth: 0.5, borderColor: C.border, padding: 14 }}>
          <LabelValue label="תאריך" value={date} even />
          <LabelValue label="לקוח" value={clientName} />
        </View>

        {/* Advisor table */}
        <View style={{ marginHorizontal: 50, marginTop: 12 }}>
          <View style={s.tableHeaderRow}>
            <Text style={s.tableHeaderCell}>שם המשווק</Text>
            <Text style={s.tableHeaderCell}>תעודת זהות</Text>
            <Text style={s.tableHeaderCell}>מספר רישיון</Text>
          </View>
          <View style={[s.tableRow, { backgroundColor: C.cream }]}>
            <Text style={s.tableCell}>{user.name || '---'}</Text>
            <Text style={s.tableCell}>{user.idNumber || '---'}</Text>
            <Text style={s.tableCell}>{user.license || '---'}</Text>
          </View>
        </View>

        {/* Footer text */}
        <View style={{ position: 'absolute', bottom: 40, left: 0, right: 0, alignItems: 'center' }}>
          <Text style={{ fontSize: 8, color: C.textMuted }}>מסמך זה הופק באמצעות מערכת איפיון צרכים דיגיטלית של GREEN Wealth Management</Text>
          <Text style={{ fontSize: 8, color: C.textMuted, marginTop: 2 }}>כל הנתונים נמסרו על ידי הלקוח ובאחריותו</Text>
        </View>

        <PageFooter />
      </Page>

      {/* ==================== REGULATORY PAGE ==================== */}
      <Page size="A4" style={s.page}>
        <PageHeader clientName={clientName} date={date} />
        <PageFooter />

        <SectionTitle>הוראות הדין</SectionTitle>

        <Text style={s.paragraph}>
          משווק השקעות נדרש, על פי חוק הסדרת העיסוק בייעוץ השקעות, בשיווק השקעות ובניהול תיקי השקעות תשנ״ה-1995 (להלן: ״החוק״), להתאים, ככל האפשר, את השירותים שמשווק ההשקעות נותן ללקוח לצרכיו ולהנחיותיו של הלקוח וזאת לאחר שמשווק ההשקעות בירר עם הלקוח את מטרות ההשקעה, את מצבו הכספי לרבות ניירות הערך והנכסים הפיננסיים של הלקוח, ואת שאר הנסיבות הרלוונטיות לעניין זה.
        </Text>
        <Text style={s.paragraph}>
          ידוע ללקוח כי מענה אמיתי, כן ומלא לשאלון שלהלן יסייע למשווק ההשקעות להתאים בצורה המיטבית האפשרית את אופי השקעותיו לצרכיו המיוחדים של הלקוח. וכן אי מסירת פרטים או מסירת פרטים חלקית עלולה לפגוע ביכולתו של משווק ההשקעות להתאים את השירות שיינתן לצרכי הלקוח, ובמידה שלא יתקבל מהלקוח מידע שיהווה תשתית מספקת להתאמת מדיניות ההשקעה, לא יתאפשר מתן השירותים לפי חוק.
        </Text>
        <Text style={s.paragraph}>
          ידוע ללקוח כי קיימת חשיבות לעדכן את משווק ההשקעות בכל שינוי שיחול ביחס לפרטים שמסר במסגרת מסמך זה וכן כי עליו לעדכן את משווק ההשקעות בכל שינוי שיחול בפרטים כאמור.
        </Text>
        <Text style={s.paragraph}>
          משווק ההשקעות הבהיר ללקוח כי כל פרט שהלקוח מוסר למשווק ההשקעות ישמר בסודיות על ידי משווק ההשקעות אך סודיות זו כפופה לחובת משווק ההשקעות למסור ידיעות על פי כל דין.
        </Text>
      </Page>

      {/* ==================== PERSONAL + FINANCIAL + GOALS + RISK ==================== */}
      <Page size="A4" style={s.page}>
        <PageHeader clientName={clientName} date={date} />
        <PageFooter />

        {/* Personal Details */}
        <SectionTitle>פרטים מזהים</SectionTitle>
        {printClient(formData.clientA, formData.signerType === 'couple' ? 'לקוח א׳' : 'פרטי הלקוח')}
        {formData.signerType === 'couple' && printClient(formData.clientB, 'לקוח ב׳')}

        {/* Financial Balance */}
        <SectionTitle>תמונה כלכלית — התא המשפחתי</SectionTitle>

        {incomeRows.length > 0 && (
          <View wrap={false}>
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 4 }}>הכנסות (חודשי)</Text>
            <DataTable rows={incomeRows} />
            {formData.incomeNotes ? <Text style={{ fontSize: 8, color: C.textMuted, textAlign: 'right', marginTop: 2 }}>הערות: {formData.incomeNotes}</Text> : null}
          </View>
        )}

        {processedAssetSections.map((section, idx) => (
          <View key={idx} wrap={false} style={{ marginTop: 8 }}>
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 4 }}>{section.title}</Text>
            <DataTable rows={section.rows} />
            {section.notes ? <Text style={{ fontSize: 8, color: C.textMuted, textAlign: 'right', marginTop: 2 }}>הערות: {section.notes}</Text> : null}
          </View>
        ))}

        {liabRows.length > 0 && (
          <View wrap={false} style={{ marginTop: 8 }}>
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 4 }}>התחייבויות</Text>
            <DataTable rows={liabRows} />
            {formData.liabilitiesNotes ? <Text style={{ fontSize: 8, color: C.textMuted, textAlign: 'right', marginTop: 2 }}>הערות: {formData.liabilitiesNotes}</Text> : null}
          </View>
        )}

        {/* Asset summary */}
        <View wrap={false} style={{ marginTop: 10 }}>
          <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 4 }}>סיכום מאזן</Text>
          <SummaryRow label="סך נכסים" value={totalAssets > 0 ? fmtMoney(totalAssets) : '---'} />
          <SummaryRow label="סך התחייבויות" value={totalLiabilities > 0 ? fmtMoney(totalLiabilities) : '---'} />
          <SummaryRow label="שווי נטו" value={netWorth !== 0 ? fmtMoney(netWorth) : '---'} highlight />
        </View>

        {/* Monthly balance */}
        {(totalMonthlyIncome > 0 || totalMonthlyExpenses > 0) && (
          <View wrap={false} style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 4 }}>מאזן חודשי</Text>
            <SummaryRow label="סך הכנסות חודשיות" value={totalMonthlyIncome > 0 ? fmtMoney(totalMonthlyIncome) : '---'} />
            <SummaryRow label="סך הוצאות חודשיות" value={totalMonthlyExpenses > 0 ? fmtMoney(totalMonthlyExpenses) : '---'} />
            <SummaryRow label="מאזן חודשי" value={monthlyBalance !== 0 ? fmtMoney(monthlyBalance) : '---'} highlight />
          </View>
        )}

        {formData.managedPortion && (
          <LabelValue label="שיעור נכסים מנוהל" value={portionLabels[formData.managedPortion]} even />
        )}

        {/* Goals & Horizon */}
        <SectionTitle>מטרות השקעה ואופק</SectionTitle>
        <LabelValue label="מטרות ההשקעה" value={goals || '---'} even />
        {formData.investmentGoalOther && <LabelValue label="פירוט" value={formData.investmentGoalOther} />}
        <LabelValue label="אופק השקעה" value={horizonLabels[formData.investmentHorizon] || '---'} />

        {/* Liquidity */}
        <SectionTitle>צרכי נזילות</SectionTitle>
        <LabelValue label="מתי תצטרך את כל הכסף" value={timelineLabels[formData.liquidityTimeline] || '---'} even />
        <LabelValue label="כמה תצטרך ב-3 שנים" value={next3Labels[formData.liquidityNext3Years] || '---'} />

        {/* Risk Assessment */}
        <SectionTitle>הערכת סיכון</SectionTitle>
        <LabelValue label="שאלה 1 — אסימטריה" value={q1Labels[formData.riskQ1] || '---'} even />
        <LabelValue label="שאלה 2 — תחושה" value={q2Labels[formData.riskQ2] || '---'} />
        <LabelValue label="שאלה 3 — תרחיש" value={q3Labels[formData.riskQ3] || '---'} even />
        <LabelValue label="שאלה 4 — עדיפות" value={q4Labels[formData.riskQ4] || '---'} />
        {formData.priorExperience && <LabelValue label="ניסיון קודם" value={formData.priorExperience === 'yes' ? 'כן' : 'לא'} even />}
        {formData.priorExperienceDetails && <LabelValue label="פירוט" value={formData.priorExperienceDetails} />}

        {/* Advisor Summary */}
        <SectionTitle>סיכום והמלצת בעל הרישיון</SectionTitle>
        {formData.advisorSummary && (
          <View wrap={false}>
            <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.black, textAlign: 'right', marginBottom: 3 }}>סיכום וניתוח</Text>
            <Text style={s.paragraph}>{formData.advisorSummary}</Text>
          </View>
        )}
        {formData.clientPreferences && (
          <View wrap={false}>
            <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.black, textAlign: 'right', marginBottom: 3 }}>העדפות / הגבלות לקוח</Text>
            <Text style={s.paragraph}>{formData.clientPreferences}</Text>
          </View>
        )}

        {/* Risk level box */}
        {rlFinal && (
          <View style={s.riskBox} wrap={false}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: C.primary, textAlign: 'right' }}>
              דרגת סיכון סופית: {formData.finalRiskLevel} — {rlFinal.name}
            </Text>
            <Text style={{ fontSize: 9, color: C.secondary, textAlign: 'right', marginTop: 4 }}>
              {rlFinal.description}
            </Text>
            <Text style={{ fontSize: 9, color: C.black, textAlign: 'right', marginTop: 4 }}>
              הפסד מקסימלי: {rlFinal.maxLoss} | מניות: {rlFinal.maxStocks} | אג״ח קונצרני: {rlFinal.corpBonds}
            </Text>
          </View>
        )}

        {formData.finalRiskJustification && (
          <View wrap={false} style={{ marginTop: 6 }}>
            <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.black, textAlign: 'right', marginBottom: 3 }}>נימוק מקצועי</Text>
            <Text style={s.paragraph}>{formData.finalRiskJustification}</Text>
          </View>
        )}

        {formData.equityPct && <LabelValue label="אחוז מניות מקסימלי" value={`${formData.equityPct}%`} even />}
        {formData.corporateBondsPct && <LabelValue label="אג״ח קונצרני" value={formData.corporateBondsPct === '50' ? 'עד 50%' : 'עד 100%'} />}
        <LabelValue label="מט״ח" value={formData.forex ? 'כן' : 'לא'} even />
        <LabelValue label="אג״ח בדירוג נמוך" value={formData.lowRatedBonds ? 'כן' : 'לא'} />

        {/* Refusals */}
        {formData.refusals && formData.refusals.length > 0 && (
          <View style={s.refusalBox} wrap={false}>
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.negative, textAlign: 'right', marginBottom: 6 }}>שאלות שהלקוח סירב להשיב:</Text>
            {formData.refusals.map((r, i) => (
              <Text key={i} style={{ fontSize: 9, color: C.black, textAlign: 'right', marginBottom: 2 }}>• {r.label}</Text>
            ))}
            <Text style={{ fontSize: 8, color: C.textMuted, textAlign: 'right', marginTop: 6 }}>הובהר ללקוח כי אי מסירת המידע עלולה לפגוע באיכות ההמלצה.</Text>
          </View>
        )}
      </Page>

      {/* ==================== SUMMARY PAGE ==================== */}
      <Page size="A4" style={s.page}>
        <PageHeader clientName={clientName} date={date} />
        <PageFooter />

        <SectionTitle>סיכום תשובות הלקוח</SectionTitle>

        <SummaryCard title="פרטים אישיים" items={[
          ['שם מלא', formData.clientA.fullName],
          ['תעודת זהות', formData.clientA.idNumber],
          ['טלפון', formData.clientA.phone],
          ['דוא״ל', formData.clientA.email],
          ['מצב משפחתי', translateMarital(formData.clientA.maritalStatus)],
        ]} />

        {formData.signerType === 'couple' && (
          <SummaryCard title="לקוח ב׳" items={[
            ['שם מלא', formData.clientB.fullName],
            ['תעודת זהות', formData.clientB.idNumber],
          ]} />
        )}

        <SummaryCard title="תמונה כלכלית" items={[
          ['סך נכסים', totalAssets > 0 ? fmtMoney(totalAssets) : '---'],
          ['סך התחייבויות', totalLiabilities > 0 ? fmtMoney(totalLiabilities) : '---'],
          ['שווי נטו', netWorth !== 0 ? fmtMoney(netWorth) : '---'],
        ]} />

        <SummaryCard title="מטרות ואופק" items={[
          ['מטרות השקעה', goals || '---'],
          ['אופק השקעה', horizonLabels[formData.investmentHorizon] || '---'],
        ]} />

        <SummaryCard title="נזילות" items={[
          ['צורך בכל הכסף', timelineLabels[formData.liquidityTimeline] || '---'],
          ['צורך ב-3 שנים', next3Labels[formData.liquidityNext3Years] || '---'],
        ]} />

        <SummaryCard title="סיכון ומדיניות" items={[
          ['שאלה 1', q1Labels[formData.riskQ1] || '---'],
          ['שאלה 2', q2Labels[formData.riskQ2] || '---'],
          ['שאלה 3', q3Labels[formData.riskQ3] || '---'],
          ['שאלה 4', q4Labels[formData.riskQ4] || '---'],
          ['דרגת סיכון סופית', rlFinal ? `${formData.finalRiskLevel} — ${rlFinal.name}` : '---'],
        ]} />
      </Page>

      {/* ==================== SIGNATURES PAGE ==================== */}
      <Page size="A4" style={s.page}>
        <PageHeader clientName={clientName} date={date} />
        <PageFooter />

        <SectionTitle>הצהרות וחתימות</SectionTitle>

        {/* Client declaration */}
        <View wrap={false}>
          <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 6 }}>הצהרת הלקוח</Text>
          <Text style={s.paragraph}>
            {`אני הח"מ ${clientName} מצהיר בזאת כי המידע המופיע לעיל הינו המידע אותו מסרתי לידיעתו של משווק ההשקעות. כמו כן, הוסבר לי כי מענה אמיתי, כן ומלא לשאלון יסייע למשווק ההשקעות להתאים בצורה המיטבית את אופי תיק ההשקעות לצרכיי הספציפיים. כל מידע אחר אשר נתבקשתי למסור לידיעת משווק ההשקעות אולם נמנעתי מלמסרו, הינו מידע אשר אין ברצוני שישמש את משווק ההשקעות במסגרת פעילותו. בחתימתי זו מאשר הח"מ כי מדיניות ההשקעה ואופן ניהול תיק ההשקעות הוסברו לח"מ ונקבעו בשיתוף פעולה עם הח"מ. אני מאשר בזאת כי קיבלתי עותק של מסמך זה.`}
          </Text>
          <Text style={s.signatureLine}>חתימת הלקוח: X ______________</Text>
          <Text style={s.signatureLine}>תאריך: _______________</Text>
        </View>

        {formData.signerType === 'couple' && (
          <View style={{ marginTop: 12 }}>
            <Text style={s.signatureLine}>חתימת לקוח ב׳: X ______________</Text>
            <Text style={s.signatureLine}>תאריך: _______________</Text>
          </View>
        )}

        {/* Advisor confirmation */}
        <View wrap={false} style={{ marginTop: 20, borderTopWidth: 0.5, borderTopColor: C.primary, paddingTop: 12 }}>
          <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 6 }}>אישור בעל הרישיון</Text>
          <Text style={s.paragraph}>
            {`אני הח"מ ${advisorName} בעל רישיון שיווק השקעות שמספרו ${advisorLicense} מטעם גרין סוכנות לביטוח פנסיוני ושיווק השקעות (2024) בע"מ, מאשר כי ביררתי עם הלקוח את הפרטים הנדרשים, הלקוח חתם בפני בכל המקומות הנדרשים, והוסברו לו השלכות אי מסירת מלוא המידע הרלוונטי לצורך התאמת השירות לצרכיו הייחודיים של הלקוח. במידה והלקוח בחר שלא למסור פרטים כמפורט לעיל, הבהרתי ללקוח את משמעות אי מסירת הפרטים. כמו כן, בהתאם לפרטים שמסר לי הלקוח עולה כי קיימת תשתית מספקת להתאמת מדיניות ההשקעה ללקוח בהתאם להוראות החוק.`}
          </Text>
          <Text style={s.signatureLine}>חתימת בעל הרישיון: ______________</Text>
          <Text style={s.signatureLine}>תאריך: _______________</Text>
        </View>
      </Page>
    </Document>
  )
}

// ==================== EXPORT ====================
export async function generatePDF(formData, user) {
  // Fetch fresh user data from store (reflects admin edits in real-time)
  const freshUser = getUserById(user.id) || user

  const blob = await pdf(<KYCDocument formData={formData} user={freshUser} />).toBlob()
  const pdfBytes = await blob.arrayBuffer()

  const clientName = formData.clientA.fullName || 'client'
  const safeName = clientName.replace(/[^a-zA-Z0-9\u0590-\u05FF]/g, '_')
  const dateStr = new Date().toISOString().split('T')[0]
  const fileName = `KYC_${dateStr}_${safeName}.pdf`

  const previewBlob = new Blob([pdfBytes], { type: 'application/pdf' })
  const previewUrl = URL.createObjectURL(previewBlob)

  return { url: previewUrl, fileName, pdfBytes }
}
