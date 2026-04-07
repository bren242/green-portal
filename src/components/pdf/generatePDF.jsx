import React from 'react'
import { Document, Page, Text, View, Image, pdf } from '@react-pdf/renderer'
import { RISK_LEVELS } from '../../data/formSchema'

import { logoPng } from '../../assets/logoBase64'
import { getSignature, getCompanyStamp } from '../../data/signatures'
import {
  C, coverPageStyle, contentPageStyle,
  PageHeader, PageFooter, SectionTitle, SectionGap,
  LabelValue, DataTable, SummaryRow,
  PillTag, RiskGauge, PolicyCube, GoldBox,
  ClientCard, BalanceBox, KpiRow, KpiHeader, SectorCard, SignatureLine, DateLine,
  fmtMoney, parseAmount, translateMarital, fmtDate,
} from './PDFTemplate'

// ── Label Maps ─────────────────────────────────────────────────
const goalLabels = {
  preserve: 'שמירת ערך', income: 'הכנסה שוטפת', growth: 'צמיחה לטווח ארוך',
  pension: 'חיסכון לפנסיה', education: 'חינוך ילדים', intergenerational: 'העברה בין-דורית', other: 'אחר',
}
const horizonLabels   = { up_to_2: 'עד שנתיים', '2_to_5': 'בין 2 ל-5 שנים', '5_to_10': 'בין 5 ל 10 שנים', over_10: 'מעל 10 שנים' }
const timelineLabels  = { up_to_2: 'עד שנתיים', '2_to_5': '2-5 שנים', over_5: 'מעל 5 שנים', unknown: 'לא ידוע' }
const next3Labels     = { '0': '0%', up_to_30: 'עד 30%', up_to_50: 'עד 50%', over_50: 'מעל 50%', unknown: 'לא ידוע' }
const q1Labels = { a: 'סיכוי עד 6%, סיכון עד 5%', b: 'סיכוי עד 14%, סיכון עד 10%', c: 'סיכוי עד 20%, סיכון עד 15%', d: 'סיכוי מעל 20%, סיכון מעל 15%' }
const q2Labels = { a: 'מעדיף לישון בשקט', b: 'מוכן לתנודות לטובת תשואה', c: 'משקיע לטווח ארוך, תנודות לא מדאיגות' }
const q3Labels = { a: 'רוצה לצאת', b: 'שוקל לצמצם סיכון', c: 'מחזיק ומחכה', d: 'רואה הזדמנות להוסיף' }
const q4Labels = { a: 'לא להפסיד', b: 'לשמור מעל אינפלציה', c: 'צמיחה לטווח ארוך' }

// ── Full Risk Questions with Hebrew letter options ─────────────
const RISK_QUESTIONS = [
  {
    key: 'riskQ1',
    title: 'אסימטריה — סיכוי מול סיכון',
    question: 'מהי רמת הסיכוי/סיכון שתרצה לקחת בתיק ההשקעות',
    options: [
      { key: 'a', letter: 'א', text: q1Labels.a },
      { key: 'b', letter: 'ב', text: q1Labels.b },
      { key: 'c', letter: 'ג', text: q1Labels.c },
      { key: 'd', letter: 'ד', text: q1Labels.d },
    ],
  },
  {
    key: 'riskQ2',
    title: 'גישה לתנודות',
    question: 'מהי גישתך לתנודות בשוק ההון',
    options: [
      { key: 'a', letter: 'א', text: q2Labels.a },
      { key: 'b', letter: 'ב', text: q2Labels.b },
      { key: 'c', letter: 'ג', text: q2Labels.c },
    ],
  },
  {
    key: 'riskQ3',
    title: 'תרחיש ירידה חדה',
    question: 'אם תיק ההשקעות שלך ירד 20% בחודש, מה תעשה',
    options: [
      { key: 'a', letter: 'א', text: q3Labels.a },
      { key: 'b', letter: 'ב', text: q3Labels.b },
      { key: 'c', letter: 'ג', text: q3Labels.c },
      { key: 'd', letter: 'ד', text: q3Labels.d },
    ],
  },
  {
    key: 'riskQ4',
    title: 'מטרה מרכזית',
    question: 'מהי המטרה המרכזית שלך בהשקעה',
    options: [
      { key: 'a', letter: 'א', text: q4Labels.a },
      { key: 'b', letter: 'ב', text: q4Labels.b },
      { key: 'c', letter: 'ג', text: q4Labels.c },
    ],
  },
]

// ── QuestionBlock Component ───────────────────────────────────
const QuestionBlock = ({ q, selectedKey }) => (
  <View wrap={false} style={{ marginBottom: 8, borderWidth: 0.5, borderColor: C.gold, borderRadius: 4, overflow: 'hidden' }}>
    {/* Question header */}
    <View style={{ backgroundColor: C.primary, paddingVertical: 5, paddingHorizontal: 10 }}>
      <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.goldLight, textAlign: 'right' }}>{q.title}</Text>
    </View>
    <View style={{ padding: 8, backgroundColor: C.white }}>
      <Text style={{ fontSize: 8.5, color: C.black, textAlign: 'right', marginBottom: 6 }}>{q.question}</Text>
      {q.options.map((opt) => {
        const isSelected = selectedKey === opt.key
        return (
          <View key={opt.key} style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            paddingVertical: 3,
            paddingHorizontal: 4,
            marginBottom: 2,
            backgroundColor: isSelected ? C.cream : C.white,
            borderRadius: 3,
          }}>
            {/* Hebrew letter */}
            <Text style={{ fontSize: 8, fontWeight: 'bold', color: C.primary, marginLeft: 4, minWidth: 10, textAlign: 'right' }}>
              {opt.letter}
            </Text>
            {/* Option text */}
            <Text style={{ fontSize: 8, color: isSelected ? C.primary : C.muted, textAlign: 'right', flex: 1 }}>
              {opt.text}
            </Text>
            {/* Radio indicator — last in code = leftmost visual */}
            <View style={{
              width: 10, height: 10, borderRadius: 5,
              borderWidth: 1.5,
              borderColor: isSelected ? C.gold : C.border,
              backgroundColor: isSelected ? C.gold : C.white,
              marginRight: 6,
            }} />
          </View>
        )
      })}
    </View>
  </View>
)
const portionLabels   = { up_to_35: 'עד 35%', '35_to_70': '35%-70%', over_70: 'מעל 70%' }

// ── Regulatory Paragraphs (ללא נקודה סופית) ───────────────────
const REG_TEXTS = [
  'משווק השקעות נדרש, על פי חוק הסדרת העיסוק בייעוץ השקעות, בשיווק השקעות ובניהול תיקי השקעות תשנ״ה-1995 (להלן: "החוק"), להתאים, ככל האפשר, את השירותים שמשווק ההשקעות נותן ללקוח לצרכיו ולהנחיותיו של הלקוח וזאת לאחר שמשווק ההשקעות בירר עם הלקוח את מטרות ההשקעה, את מצבו הכספי לרבות ניירות הערך והנכסים הפיננסיים של הלקוח, ואת שאר הנסיבות הרלוונטיות לעניין זה',
  'ידוע ללקוח כי מענה אמיתי, כן ומלא לשאלון שלהלן יסייע למשווק ההשקעות להתאים בצורה המיטבית האפשרית את אופי השקעותיו לצרכיו המיוחדים של הלקוח. אי מסירת פרטים או מסירת פרטים חלקית עלולה לפגוע ביכולתו של משווק ההשקעות להתאים את השירות שיינתן לצרכי הלקוח',
  'ידוע ללקוח כי קיימת חשיבות לעדכן את משווק ההשקעות בכל שינוי שיחול ביחס לפרטים שמסר במסגרת מסמך זה. משווק ההשקעות הבהיר ללקוח כי כל פרט שהלקוח מוסר למשווק ההשקעות ישמר בסודיות על ידי משווק ההשקעות אך סודיות זו כפופה לחובת משווק ההשקעות למסור ידיעות על פי כל דין',
  'הלקוח מצהיר כי הוא מודע לכך שהשקעות בשוק ההון כרוכות בסיכון, וכי אין בתשואות עבר כדי להבטיח תשואות עתידיות',
]

// ── Risk levels table data (approved values) ──────────────────
const RISK_TABLE = [
  { level: 1, name: 'שמרן',       maxLoss: 'עד 5%',    maxStocks: '0%'       },
  { level: 2, name: 'שמרן-מתון',  maxLoss: 'עד 10%',   maxStocks: 'עד 20%'   },
  { level: 3, name: 'מאוזן',      maxLoss: 'עד 15%',   maxStocks: 'עד 30%'   },
  { level: 4, name: 'צמיחה',      maxLoss: 'מעל 15%',  maxStocks: 'עד 50%'   },
  { level: 5, name: 'אגרסיבי',    maxLoss: 'משמעותי',  maxStocks: 'עד 100%'  },
]

// ════════════════════════════════════════════════════════════════
//  MAIN DOCUMENT
// ════════════════════════════════════════════════════════════════
const KYCDocument = ({ formData, user }) => {
  const date = fmtDate()
  const isCouple = formData.signerType === 'couple'
  const getDisplayName = () => {
    if (!isCouple) return formData.clientA.fullName || '---'
    const [aFirst, ...aLast] = (formData.clientA.fullName || '').split(' ')
    const [bFirst, ...bLast] = (formData.clientB.fullName || '').split(' ')
    if (aLast.join(' ') === bLast.join(' ') && aLast.length > 0) {
      return `${aFirst} ו${bFirst} ${aLast.join(' ')}`
    }
    return `${formData.clientA.fullName} ו${formData.clientB.fullName}`
  }
  const clientName = getDisplayName()

  // ── Financial Calculations ───────────────────────────────────
  let totalAssets = 0, totalLiabilities = 0
  let totalMonthlyIncome = 0, totalMonthlyExpenses = 0

  // Income
  const incomeItems = [
    ['שכר נטו חודשי', formData.income.salary],
    ['פנסיה / קצבה', formData.income.pension],
    ['הכנסות מנדל״ן', formData.income.realEstate],
    ['אחר', formData.income.other],
  ]
  const incomeRows = []
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
      ['נדל״ן להשקעה', formData.assets.investmentRealEstate],
      ['נדל״ן מגורים', formData.assets.residenceRealEstate],
    ], notes: formData.realEstateNotes },
    { title: 'אחר', items: [
      ['עסק / שותפות', formData.assets.business], ['אחר', formData.assets.other],
    ], notes: formData.otherAssetsNotes },
  ]

  const processedAssets = assetSections.map((sec) => {
    const rows = sec.items
      .filter(([, a]) => a && a.has)
      .map(([label, a]) => { totalAssets += parseAmount(a.amount); return [label, fmtMoney(a.amount)] })
    return { ...sec, rows }
  }).filter(s => s.rows.length > 0)

  // Always include ני"ע card even when empty
  const hasSecurities = processedAssets.some(s => s.title === 'ני״ע בארץ ובחו״ל')
  if (!hasSecurities) {
    processedAssets.splice(1, 0, {
      title: 'ני״ע בארץ ובחו״ל',
      rows: [['סך הכל', 'אין']],
      notes: '',
    })
  }

  // Monthly expenses (for cash flow block — separate from liabilities)
  const expenseRows = []
  if (formData.liabilities.mortgage.has && formData.liabilities.mortgage.monthly) {
    totalMonthlyExpenses += parseAmount(formData.liabilities.mortgage.monthly)
    expenseRows.push(['משכנתא חודשי', fmtMoney(formData.liabilities.mortgage.monthly)])
  }
  if (formData.liabilities.loans.has && formData.liabilities.loans.monthly) {
    totalMonthlyExpenses += parseAmount(formData.liabilities.loans.monthly)
    expenseRows.push(['הלוואות חודשי', fmtMoney(formData.liabilities.loans.monthly)])
  }
  if (formData.liabilities.monthlyExpenses) {
    totalMonthlyExpenses += parseAmount(formData.liabilities.monthlyExpenses)
    expenseRows.push(['הוצאות שוטפות', fmtMoney(formData.liabilities.monthlyExpenses)])
  }

  // Liabilities (totals only — for net worth block)
  const liabRows = []
  if (formData.liabilities.mortgage.has) {
    totalLiabilities += parseAmount(formData.liabilities.mortgage.total)
    liabRows.push(['משכנתא', fmtMoney(formData.liabilities.mortgage.total)])
  }
  if (formData.liabilities.loans.has) {
    totalLiabilities += parseAmount(formData.liabilities.loans.total)
    liabRows.push(['הלוואות', fmtMoney(formData.liabilities.loans.total)])
  }

  const netWorth = totalAssets - totalLiabilities
  const monthlyBalance = totalMonthlyIncome - totalMonthlyExpenses

  // Goals & Risk
  const goals = (formData.investmentGoals || []).map(g => goalLabels[g] || g)
  const goalsText = goals.join(', ')
  const rlFinal = formData.finalRiskLevel > 0 ? RISK_LEVELS[formData.finalRiskLevel - 1] : null
  const advisorName = user.name || '____________'
  const advisorLicense = user.license || '____________'
  const advisorSig = user.id ? getSignature(user.id) : null
  const stamp = getCompanyStamp()

  return (
    <Document>

      {/* ═══════════════════ PAGE 1: COVER ═══════════════════ */}
      <Page size="A4" style={coverPageStyle}>

        {/* Header + Title — flow רגיל, ללא absolute */}
        <View>
          {/* Header לבן */}
          <View style={{
            height: 60,
            backgroundColor: C.white,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 24,
            borderBottomWidth: 1,
            borderBottomColor: C.gold,
          }}>
            <Image src={logoPng} style={{ height: 36, width: 'auto' }} />
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 11, color: C.primary, fontWeight: 'bold' }}>{clientName}</Text>
              <Text style={{ fontSize: 9, color: C.muted, marginTop: 1 }}>{date}</Text>
            </View>
          </View>

          {/* כותרת ירוקה */}
          <View style={{
            backgroundColor: C.primary,
            paddingVertical: 14,
            paddingHorizontal: 30,
            alignItems: 'center',
          }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: C.gold, textAlign: 'center' }}>
              אפיון צרכים והתאמת מדיניות השקעה
            </Text>
          </View>
        </View>

        {/* Body */}
        <View style={{ paddingHorizontal: 30, paddingTop: 16, paddingBottom: 80 }}>

          {/* Advisor table */}
          <View style={{ flexDirection: 'row-reverse', backgroundColor: C.primary, borderTopLeftRadius: 3, borderTopRightRadius: 3, paddingVertical: 6, paddingHorizontal: 10 }}>
            <Text style={{ flex: 1, fontSize: 9, fontWeight: 'bold', color: C.goldLight, textAlign: 'right' }}>שם המשווק</Text>
            <Text style={{ flex: 1, fontSize: 9, fontWeight: 'bold', color: C.goldLight, textAlign: 'right' }}>תעודת זהות</Text>
            <Text style={{ flex: 1, fontSize: 9, fontWeight: 'bold', color: C.goldLight, textAlign: 'right' }}>מספר רישיון</Text>
          </View>
          <View style={{ flexDirection: 'row-reverse', paddingVertical: 6, paddingHorizontal: 10, backgroundColor: C.surface, borderBottomLeftRadius: 3, borderBottomRightRadius: 3, borderWidth: 0.5, borderColor: C.border, borderTopWidth: 0 }}>
            <Text style={{ flex: 1, fontSize: 10, color: C.black, textAlign: 'right' }}>{user.name || '---'}</Text>
            <Text style={{ flex: 1, fontSize: 10, color: C.black, textAlign: 'right' }}>{user.idNumber || '---'}</Text>
            <Text style={{ flex: 1, fontSize: 10, color: C.black, textAlign: 'right' }}>{user.license || '---'}</Text>
          </View>

          {/* Client blocks */}
          {isCouple ? (
            <View style={{ marginTop: 16, flexDirection: 'row-reverse', gap: 8 }}>
              {[
                { client: formData.clientA, title: 'לקוח א׳' },
                { client: formData.clientB, title: 'לקוח ב׳' },
              ].map(({ client, title }, i) => (
                <View key={i} style={{
                  flex: 1,
                  backgroundColor: C.primary,
                  borderRadius: 4,
                  padding: 10,
                }}>
                  <Text style={{ fontSize: 8, fontWeight: 'bold', color: C.gold, textAlign: 'right', marginBottom: 4 }}>{title}</Text>
                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: C.white, textAlign: 'right' }}>{client.fullName || '---'}</Text>
                  <Text style={{ fontSize: 9, color: C.goldLight, textAlign: 'right', marginTop: 3 }}>תעודת זהות {client.idNumber || '---'}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={{ marginTop: 16, backgroundColor: C.primary, borderRadius: 4, padding: 12 }}>
              <Text style={{ fontSize: 8, fontWeight: 'bold', color: C.gold, textAlign: 'right', marginBottom: 4 }}>פרטי הלקוח</Text>
              <Text style={{ fontSize: 13, fontWeight: 'bold', color: C.white, textAlign: 'right' }}>{formData.clientA.fullName || '---'}</Text>
              <Text style={{ fontSize: 9, color: C.goldLight, textAlign: 'right', marginTop: 3 }}>תעודת זהות {formData.clientA.idNumber || '---'}</Text>
            </View>
          )}

          {/* Regulatory text — GoldBox */}
          <GoldBox mt={24}>
            {REG_TEXTS.map((txt, i) => (
              <Text key={i} style={{ fontSize: 8.5, textAlign: 'right', lineHeight: 1.6, color: C.black, marginTop: i > 0 ? 4 : 0 }}>{txt}</Text>
            ))}
          </GoldBox>

        </View>

        {/* Bottom disclaimer — absolute */}
        <View style={{ position: 'absolute', bottom: 30, left: 0, right: 0, alignItems: 'center' }}>
          <Text style={{ fontSize: 9, color: C.muted, textAlign: 'center' }}>כל הנתונים נמסרו על ידי הלקוח ובאחריותו</Text>
        </View>

        <PageFooter />
      </Page>

      {/* ═══════════════════ PAGE 2+: CONTENT (continuous) ═══════════════════ */}
      <Page size="A4" style={contentPageStyle}>
        <PageHeader
          clientName={clientName}
          date={date}
          docTitle={isCouple
            ? `${formData.clientA.fullName} ו${formData.clientB.fullName}`
            : clientName}
        />
        <PageFooter />

        {/* ── Personal Details ────────────────────────────── */}
        <SectionTitle>פרטים מזהים</SectionTitle>
        {isCouple ? (
          <View style={{ flexDirection: 'row-reverse', gap: 6 }}>
            <View style={{ width: '49%' }}><ClientCard client={formData.clientA} title="לקוח א׳" full /></View>
            <View style={{ width: '49%' }}><ClientCard client={formData.clientB} title="לקוח ב׳" full /></View>
          </View>
        ) : (
          <View style={{ width: '100%' }}>
            <ClientCard client={formData.clientA} title="פרטי הלקוח" full />
          </View>
        )}

        {/* ── Block 1: תזרים חודשי ─────────────────────── */}
        <SectionGap />
        <SectionTitle>תזרים חודשי</SectionTitle>

        <View style={{ flexDirection: 'row-reverse', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {incomeRows.length > 0 && (
            <SectorCard
              title="הכנסות (חודשי)"
              total={fmtMoney(totalMonthlyIncome)}
              items={incomeRows}
              notes={formData.incomeNotes}
            />
          )}
          {expenseRows.length > 0 && (
            <SectorCard
              title="הוצאות חודשיות"
              total={fmtMoney(totalMonthlyExpenses)}
              items={expenseRows}
            />
          )}
        </View>

        <View style={{ marginTop: 4, borderWidth: 1, borderColor: C.gold, borderRadius: 4, overflow: 'hidden' }}>
          <View style={{ backgroundColor: C.primary, paddingVertical: 4, paddingHorizontal: 8 }}>
            <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.gold, textAlign: 'right' }}>מאזן חודשי</Text>
          </View>
          <View style={{ padding: 6 }}>
            <SummaryRow label="סך הכנסות" value={totalMonthlyIncome > 0 ? fmtMoney(totalMonthlyIncome) : '---'} />
            <SummaryRow label="סך הוצאות" value={totalMonthlyExpenses > 0 ? fmtMoney(totalMonthlyExpenses) : '---'} />
            {/* Highlighted balance row with conditional color */}
            <View style={{
              flexDirection: 'row-reverse',
              backgroundColor: monthlyBalance >= 0 ? C.primary : '#B03A2E',
              paddingVertical: 5,
              paddingHorizontal: 8,
              borderRadius: 2,
              marginTop: 3,
            }}>
              <Text style={{ flex: 1, fontSize: 10, fontWeight: 'bold', color: C.white, textAlign: 'right' }}>מאזן חודשי</Text>
              <Text style={{ flex: 1, fontSize: 10, fontWeight: 'bold', color: C.white, textAlign: 'right' }}>{monthlyBalance !== 0 ? fmtMoney(monthlyBalance) : '---'}</Text>
            </View>
          </View>
        </View>

        {/* ── Block 2: נכסים והתחייבויות ─────────────────── */}
        <SectionGap />
        <View wrap={false}>
          <SectionTitle>נכסים והתחייבויות</SectionTitle>

          <View style={{ flexDirection: 'row-reverse', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {processedAssets.map((sec, idx) => {
              const secTotal = sec.rows.reduce((s, [, v]) => {
                const cleaned = String(v).replace(/[^\d.]/g, '')
                return s + parseAmount(cleaned)
              }, 0)
              return (
                <SectorCard
                  key={idx}
                  title={sec.title}
                  total={secTotal > 0 ? fmtMoney(secTotal) : 'אין'}
                  items={sec.rows}
                  notes={sec.notes}
                />
              )
            })}

            {liabRows.length > 0 && (
              <SectorCard
                title="התחייבויות"
                total={fmtMoney(totalLiabilities)}
                items={liabRows}
                notes={formData.liabilitiesNotes}
              />
            )}
          </View>
        </View>

        {/* Separator */}
        <View style={{ borderTopWidth: 1, borderTopColor: C.gold, marginTop: 8, marginBottom: 8 }} />

        <View wrap={false}>
          <BalanceBox
            title="סיכום מאזן"
            rows={[
              ['סך נכסים', totalAssets > 0 ? fmtMoney(totalAssets) : '---'],
              ['סך התחייבויות', totalLiabilities > 0 ? fmtMoney(totalLiabilities) : '---'],
            ]}
            highlightLabel="שווי נטו"
            highlightValue={netWorth !== 0 ? fmtMoney(netWorth) : '---'}
          />
        </View>

        {formData.managedPortion && (
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: C.surface,
            paddingVertical: 5,
            paddingHorizontal: 10,
            borderTopWidth: 0.5,
            borderTopColor: C.gold,
            marginTop: 4,
            borderRadius: 3,
          }}>
            <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.black }}>
              {portionLabels[formData.managedPortion]}
            </Text>
            <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.primary }}>
              שיעור הנכסים המועבר לטיפול GREEN
            </Text>
          </View>
        )}

        {/* ── Goals & Horizon ─────────────────────────────── */}
        <SectionGap />
        <SectionTitle>מטרות השקעה ואופק</SectionTitle>
        {goals.length > 0 && (
          <View style={{ flexDirection: 'row-reverse', flexWrap: 'wrap', marginTop: 4, marginBottom: 6 }}>
            {goals.map((g, i) => <PillTag key={i} text={g} />)}
          </View>
        )}
        {formData.investmentGoalOther && <LabelValue label="פירוט" value={formData.investmentGoalOther} />}
        <LabelValue label="אופק השקעה" value={horizonLabels[formData.investmentHorizon] || '---'} even />

        {/* ── Liquidity ───────────────────────────────────── */}
        <SectionGap />
        <SectionTitle>צרכי נזילות</SectionTitle>
        <LabelValue label="מתי תצטרך את כל הכסף" value={timelineLabels[formData.liquidityTimeline] || '---'} even />
        <LabelValue label="כמה תצטרך ב-3 שנים" value={next3Labels[formData.liquidityNext3Years] || '---'} />

        {/* ── Risk Assessment ─────────────────────────────── */}
        <SectionGap />
        <SectionTitle>הערכת סיכון</SectionTitle>

        {formData.finalRiskLevel > 0 && (
          <View style={{ marginBottom: 8 }}>
            <RiskGauge level={formData.finalRiskLevel} />
          </View>
        )}

        {/* Risk levels reference table */}
        <View wrap={false} style={{ marginBottom: 10, borderWidth: 0.5, borderColor: C.border, borderRadius: 4, overflow: 'hidden' }}>
          <View style={{ flexDirection: 'row-reverse', backgroundColor: C.primary, paddingVertical: 4, paddingHorizontal: 6 }}>
            <Text style={{ width: 36, fontSize: 8, fontWeight: 'bold', color: C.goldLight, textAlign: 'right' }}>דרגה</Text>
            <Text style={{ flex: 2, fontSize: 8, fontWeight: 'bold', color: C.goldLight, textAlign: 'right' }}>שם</Text>
            <Text style={{ flex: 2, fontSize: 8, fontWeight: 'bold', color: C.goldLight, textAlign: 'right' }}>הפסד מקס׳</Text>
            <Text style={{ flex: 2, fontSize: 8, fontWeight: 'bold', color: C.goldLight, textAlign: 'right' }}>מניות מקס׳</Text>
          </View>
          {RISK_TABLE.map((rl) => {
            const isSelected = formData.finalRiskLevel === rl.level
            return (
              <View key={rl.level} style={{
                flexDirection: 'row-reverse',
                paddingVertical: 3,
                paddingHorizontal: 6,
                backgroundColor: isSelected ? C.gold : (rl.level % 2 === 0 ? C.surface : C.white),
              }}>
                <Text style={{ width: 36, fontSize: 8, fontWeight: isSelected ? 'bold' : 'normal', color: isSelected ? C.primary : C.black, textAlign: 'right' }}>{rl.level}</Text>
                <Text style={{ flex: 2, fontSize: 8, fontWeight: isSelected ? 'bold' : 'normal', color: isSelected ? C.primary : C.black, textAlign: 'right' }}>{rl.name}</Text>
                <Text style={{ flex: 2, fontSize: 8, fontWeight: isSelected ? 'bold' : 'normal', color: isSelected ? C.primary : C.black, textAlign: 'right' }}>{rl.maxLoss}</Text>
                <Text style={{ flex: 2, fontSize: 8, fontWeight: isSelected ? 'bold' : 'normal', color: isSelected ? C.primary : C.black, textAlign: 'right' }}>{rl.maxStocks}</Text>
              </View>
            )
          })}
        </View>

        {/* Risk questions with visual radio indicators */}
        <View style={{ flexDirection: 'row-reverse', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {RISK_QUESTIONS.map((q) => (
            <View key={q.key} style={{ width: '48%' }} wrap={false}>
              <QuestionBlock q={q} selectedKey={formData[q.key]} />
            </View>
          ))}
        </View>

        {/* Prior experience — kept together */}
        <View wrap={false}>
          <LabelValue label="ניסיון קודם בשוק ההון" value={formData.priorExperience === 'yes' ? 'כן' : (formData.priorExperience === 'no' ? 'לא' : '---')} even />
          <LabelValue label="פירוט ניסיון" value={formData.priorExperienceDetails || '---'} />
        </View>

        {/* ── Advisor Summary & Policy ────────────────────── */}
        <SectionGap />
        <View wrap={false}>
          <SectionTitle>סיכום והמלצת בעל הרישיון</SectionTitle>

          {formData.advisorSummary && (
            <View style={{ borderWidth: 0.5, borderColor: C.gold, borderRadius: 4, padding: 10, marginBottom: 10, backgroundColor: C.cream }}>
              <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 3 }}>סיכום וניתוח</Text>
              <Text style={{ fontSize: 9, textAlign: 'right', lineHeight: 1.5, color: C.black }}>{String(formData.advisorSummary).replace(/\.$/, '')}</Text>
            </View>
          )}

          {formData.clientPreferences && (
            <View style={{ borderWidth: 0.5, borderColor: C.gold, borderRadius: 4, padding: 10, marginBottom: 10, backgroundColor: C.cream }}>
              <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 3 }}>העדפות / הגבלות לקוח</Text>
              <Text style={{ fontSize: 9, textAlign: 'right', lineHeight: 1.5, color: C.black }}>{String(formData.clientPreferences).replace(/\.$/, '')}</Text>
            </View>
          )}
        </View>

        {/* Policy cubes + final risk level + justifications — kept together */}
        <View wrap={false}>
          {/* 4 Policy cubes */}
          <View style={{ flexDirection: 'row-reverse', justifyContent: 'center', marginTop: 6 }}>
            <PolicyCube label="אחוז מניות מקס׳" value={formData.equityPct ? `${formData.equityPct}%` : '---'} />
            <PolicyCube label="אג״ח קונצרני" value={formData.corporateBondsPct ? (formData.corporateBondsPct === '50' ? 'עד 50%' : 'עד 100%') : '---'} />
            <PolicyCube label="מט״ח" value={formData.forex ? 'כן' : 'לא'} />
            <PolicyCube label="אג״ח דירוג נמוך" value={formData.lowRatedBonds ? 'כן' : 'לא'} />
          </View>

          {/* Final risk level box */}
          {rlFinal && (
            <View style={{ backgroundColor: C.cream, borderWidth: 1, borderColor: C.gold, borderRadius: 4, padding: 10, marginTop: 12 }}>
              <Text style={{ fontSize: 13, fontWeight: 'bold', color: C.primary, textAlign: 'right' }}>
                דרגת סיכון סופית: {formData.finalRiskLevel} — {rlFinal.name}
              </Text>
              <Text style={{ fontSize: 9, color: C.secondary, textAlign: 'right', marginTop: 3 }}>{rlFinal.description}</Text>
              <Text style={{ fontSize: 9, color: C.black, textAlign: 'right', marginTop: 3 }}>
                הפסד מקסימלי: {rlFinal.maxLoss} | מניות: {rlFinal.maxStocks} | אג״ח קונצרני: {rlFinal.corpBonds}
              </Text>
              <RiskGauge level={formData.finalRiskLevel} size="small" />
            </View>
          )}

          {formData.finalRiskJustification && (
            <View style={{ marginTop: 8, borderWidth: 0.5, borderColor: C.gold, borderRadius: 4, padding: 10, backgroundColor: C.cream }}>
              <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 3 }}>נימוק לפער בדרגה</Text>
              <Text style={{ fontSize: 9, textAlign: 'right', lineHeight: 1.5, color: C.black }}>{String(formData.finalRiskJustification).replace(/\.$/, '')}</Text>
            </View>
          )}

          {formData.riskLevelReason && (
            <View style={{ marginTop: 8, borderWidth: 0.5, borderColor: C.gold, borderRadius: 4, padding: 10, backgroundColor: C.cream }}>
              <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 3 }}>נימוק לבחירת רמת הסיכון</Text>
              <Text style={{ fontSize: 9, textAlign: 'right', lineHeight: 1.5, color: C.black }}>{String(formData.riskLevelReason).replace(/\.$/, '')}</Text>
            </View>
          )}
        </View>

      </Page>

      {/* ═══════════════════ PAGE: DECLARATIONS & SIGNATURES ═══════════════════ */}
      <Page size="A4" style={contentPageStyle}>
        <PageHeader
          clientName={clientName}
          date={date}
          docTitle={isCouple
            ? `${formData.clientA.fullName} ו${formData.clientB.fullName}`
            : clientName}
        />
        <PageFooter />

        <SectionTitle>הצהרות וחתימות</SectionTitle>

        {/* Client declaration */}
        <View>
          <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 6 }}>הצהרת הלקוח</Text>
          <Text style={{ fontSize: 9, textAlign: 'right', lineHeight: 1.5, marginBottom: 10, color: C.black }}>
            {`אני הח"מ ${clientName} מצהיר בזאת כי המידע המופיע לעיל, הינו המידע אותו מסרתי לידיעתו של משווק ההשקעות כמו כן, הוסבר לי כי מענה אמיתי, כן ומלא לשאלון יסייע למשווק ההשקעות להתאים בצורה המיטבית את אופי תיק ההשקעות לצרכיי הספציפיים וכן כי אי מסירת פרטים או מסירת פרטים חלקיים עלולה לפגוע ביכולתו של משווק ההשקעות להתאים את השירות שיינתן לח"מ. כמו כן, כל מידע אחר אשר נתבקשתי למסור לידיעת משווק ההשקעות אולם נמנעתי מלמסרו, הינו מידע אשר אין ברצוני שישמש את משווק ההשקעות במסגרת פעילותו ואני מוותר בזאת על כל טענה ו/או תביעה ו/או זכות כלשהי אודות שימוש שלא ייעשה במידע זה. בחתימתי זו מאשר הח"מ כי מדיניות ההשקעה ואופן ניהול תיק ההשקעות הוסברו לח"מ ונקבעו בשיתוף פעולה עם הח"מ. אני מאשר בזאת כי קיבלתי העתק בכתב/בדוא״ל של מסמך זה`}
          </Text>

          {/* Signature lines */}
          {isCouple ? (
            <View style={{ flexDirection: 'row-reverse', marginTop: 4 }}>
              <View style={{ flex: 1, marginLeft: 6 }}>
                <SignatureLine label={`חתימת הלקוח (${formData.clientA.fullName})`} />
                <DateLine date={date} />
              </View>
              <View style={{ flex: 1, marginRight: 6 }}>
                <SignatureLine label={`חתימת הלקוח (${formData.clientB.fullName})`} />
                <DateLine date={date} />
              </View>
            </View>
          ) : (
            <View style={{ marginTop: 4 }}>
              <SignatureLine label="חתימת הלקוח" />
              <DateLine date={date} />
            </View>
          )}
        </View>

        {/* Refusals block */}
        {Array.isArray(formData.refusals) && formData.refusals.length > 0 && (
          <View style={{ borderWidth: 1, borderColor: C.gold, borderRadius: 4, padding: 12, marginTop: 20 }} wrap={false}>
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 6 }}>הלקוח סירב להשיב על:</Text>
            {formData.refusals.map((r, i) => (
              <Text key={i} style={{ fontSize: 9, color: C.black, textAlign: 'right', marginBottom: 3 }}>• {r.label}</Text>
            ))}
            <Text style={{ fontSize: 8, color: C.muted, textAlign: 'right', marginTop: 8 }}>
              הובהר ללקוח כי אי מסירת המידע עלולה לפגוע באיכות ההמלצה
            </Text>
            <SignatureLine label="חתימה על הסירובים" />
            <DateLine date={date} />
          </View>
        )}

        {/* Advisor confirmation */}
        <View style={{ marginTop: 20, borderTopWidth: 0.5, borderTopColor: C.primary, paddingTop: 12 }}>
          <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 6 }}>אישור בעל הרישיון</Text>
          <Text style={{ fontSize: 9, textAlign: 'right', lineHeight: 1.5, marginBottom: 10, color: C.black }}>
            {`אני הח"מ ${advisorName} בעל רישיון שיווק השקעות שמספרו ${advisorLicense} מטעם גרין סוכנות לביטוח פנסיוני ושיווק השקעות (2024) בע"מ, מאשר כי ביררתי עם הלקוח את הפרטים הנדרשים, הלקוח חתם בפני בכל המקומות הנדרשים, והוסברו לו השלכות אי מסירת מלוא המידע הרלוונטי לצורך התאמת השירות לצרכיו הייחודיים של הלקוח. במידה והלקוח בחר שלא למסור פרטים כמפורט לעיל, הבהרתי ללקוח את משמעות אי מסירת הפרטים. כמו כן, בהתאם לפרטים שמסר לי הלקוח עולה כי קיימת תשתית מספקת להתאמת מדיניות ההשקעה ללקוח בהתאם להוראות החוק`}
          </Text>
          {/* Signature images */}
          {(advisorSig || stamp) ? (
            <View style={{ flexDirection: 'row-reverse', gap: 8, marginBottom: 8, alignItems: 'flex-end' }}>
              {advisorSig ? <Image src={advisorSig} style={{ width: 160, height: 60, objectFit: 'contain' }} /> : null}
              {stamp ? <Image src={stamp} style={{ width: 160, height: 60, objectFit: 'contain' }} /> : null}
            </View>
          ) : null}
          <SignatureLine label="חתימת בעל הרישיון" />
          <DateLine date={date} />
        </View>

      </Page>
    </Document>
  )
}

// ── Export ──────────────────────────────────────────────────────
export async function generatePDF(formData, user) {
  if (!user) throw new Error('משתמש לא מחובר')
  const freshUser = user

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
