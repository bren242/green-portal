import React from 'react'
import { Document, Page, Text, View, Image, pdf } from '@react-pdf/renderer'
import { RISK_LEVELS } from '../../data/formSchema'
import { getUserById } from '../../data/users'
import { logoPng } from '../../assets/logoBase64'
import {
  C, SPACING, basePageStyle,
  PageHeader, PageFooter, SectionTitle, LabelValue, DataTable,
  SummaryRow, SummaryCard, PillTag, RiskGauge, PolicyCube, GoldBox, ClientCard,
  fmtMoney, parseAmount, translateMarital, fmtDate,
} from './PDFTemplate'

// ==================== LABELS ====================
const goalLabels = {
  preserve: 'שמירת ערך', income: 'הכנסה שוטפת', growth: 'צמיחה לטווח ארוך',
  pension: 'חיסכון לפנסיה', education: 'חינוך ילדים', intergenerational: 'העברה בין-דורית', other: 'אחר',
}
const horizonLabels = { up_to_2: 'עד שנתיים', '2_to_5': '2-5 שנים', '5_to_10': '5-10 שנים', over_10: 'מעל 10 שנים' }
const timelineLabels = { up_to_2: 'עד שנתיים', '2_to_5': '2-5 שנים', over_5: 'מעל 5 שנים', unknown: 'לא ידוע' }
const next3Labels = { '0': '0%', up_to_30: 'עד 30%', up_to_50: 'עד 50%', over_50: 'מעל 50%', unknown: 'לא ידוע' }
const q1Labels = { a: 'סיכוי עד 6%, סיכון עד 5%', b: 'סיכוי עד 14%, סיכון עד 10%', c: 'סיכוי עד 20%, סיכון עד 15%', d: 'סיכוי מעל 20%, סיכון מעל 15%' }
const q2Labels = { a: 'מעדיף לישון בשקט', b: 'מוכן לתנודות לטובת תשואה', c: 'משקיע לטווח ארוך, תנודות לא מדאיגות' }
const q3Labels = { a: 'רוצה לצאת', b: 'שוקל לצמצם סיכון', c: 'מחזיק ומחכה', d: 'רואה הזדמנות להוסיף' }
const q4Labels = { a: 'לא להפסיד', b: 'לשמור מעל אינפלציה', c: 'צמיחה לטווח ארוך' }
const portionLabels = { up_to_35: 'עד 35%', '35_to_70': '35%-70%', over_70: 'מעל 70%' }

// ==================== MAIN DOCUMENT ====================
const KYCDocument = ({ formData, user }) => {
  const date = fmtDate()
  const clientName = formData.clientA.fullName || '---'
  const isCouple = formData.signerType === 'couple'

  // ---- Financial calculations ----
  let totalAssets = 0
  let totalLiabilities = 0
  let totalMonthlyIncome = 0
  let totalMonthlyExpenses = 0

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

  const goals = (formData.investmentGoals || []).map((g) => goalLabels[g] || g)
  const goalsText = goals.join(', ')

  const rlFinal = formData.finalRiskLevel > 0 ? RISK_LEVELS[formData.finalRiskLevel - 1] : null

  const advisorName = user.name || '____________'
  const advisorLicense = user.license || '____________'

  // ---- Client detail printer (for page 2+ personal section) ----
  const printClientFull = (client, title) => (
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
      {/* ==================== PAGE 1: COVER ==================== */}
      <Page size="A4" style={{ fontFamily: 'Assistant', direction: 'rtl', backgroundColor: C.white }}>
        {/* רצועה 1 — Header בז׳ */}
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 50, backgroundColor: C.offWhite, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 }}>
          <Image src={logoPng} style={{ height: 34, width: 120 }} />
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 11, color: C.primary }}>{clientName}</Text>
            <Text style={{ fontSize: 10, color: C.textMuted, marginTop: 1 }}>{date}</Text>
          </View>
        </View>

        {/* רצועה 2 — פס ירוק */}
        <View style={{ position: 'absolute', top: 50, left: 0, right: 0, height: 60, backgroundColor: C.primary, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: C.gold, textAlign: 'center' }}>
            אפיון צרכים והתאמת מדיניות השקעה
          </Text>
        </View>

        {/* גוף העמוד */}
        <View style={{ marginTop: 140, paddingHorizontal: 30 }}>

          {/* Advisor table */}
          <View style={{ flexDirection: 'row-reverse', backgroundColor: C.primary, borderTopLeftRadius: 3, borderTopRightRadius: 3, paddingVertical: 6, paddingHorizontal: 10 }}>
            <Text style={{ flex: 1, fontSize: 9, fontWeight: 'bold', color: C.white, textAlign: 'right' }}>שם המשווק</Text>
            <Text style={{ flex: 1, fontSize: 9, fontWeight: 'bold', color: C.white, textAlign: 'right' }}>תעודת זהות</Text>
            <Text style={{ flex: 1, fontSize: 9, fontWeight: 'bold', color: C.white, textAlign: 'right' }}>מספר רישיון</Text>
          </View>
          <View style={{ flexDirection: 'row-reverse', paddingVertical: 6, paddingHorizontal: 10, backgroundColor: C.surfaceLight, borderBottomLeftRadius: 3, borderBottomRightRadius: 3, borderWidth: 0.5, borderColor: C.border, borderTopWidth: 0 }}>
            <Text style={{ flex: 1, fontSize: 10, color: C.black, textAlign: 'right' }}>{user.name || '---'}</Text>
            <Text style={{ flex: 1, fontSize: 10, color: C.black, textAlign: 'right' }}>{user.idNumber || '---'}</Text>
            <Text style={{ flex: 1, fontSize: 10, color: C.black, textAlign: 'right' }}>{user.license || '---'}</Text>
          </View>

          {/* Client details cards */}
          <View style={{ flexDirection: isCouple ? 'row-reverse' : 'column', marginTop: 20 }}>
            <ClientCard client={formData.clientA} title={isCouple ? 'לקוח א׳' : 'פרטי הלקוח'} />
            {isCouple && <ClientCard client={formData.clientB} title="לקוח ב׳" />}
          </View>

          {/* Regulatory text — gold bordered box */}
          <GoldBox>
            <Text style={{ fontSize: 8.5, textAlign: 'right', lineHeight: 1.6, color: C.black }}>
              {'משווק השקעות נדרש, על פי חוק הסדרת העיסוק בייעוץ השקעות, בשיווק השקעות ובניהול תיקי השקעות תשנ״ה-1995 (להלן: "החוק"), להתאים, ככל האפשר, את השירותים שמשווק ההשקעות נותן ללקוח לצרכיו ולהנחיותיו של הלקוח וזאת לאחר שמשווק ההשקעות בירר עם הלקוח את מטרות ההשקעה, את מצבו הכספי לרבות ניירות הערך והנכסים הפיננסיים של הלקוח, ואת שאר הנסיבות הרלוונטיות לעניין זה.'}
            </Text>
            <Text style={{ fontSize: 8.5, textAlign: 'right', lineHeight: 1.6, color: C.black, marginTop: 4 }}>
              {'ידוע ללקוח כי מענה אמיתי, כן ומלא לשאלון שלהלן יסייע למשווק ההשקעות להתאים בצורה המיטבית האפשרית את אופי השקעותיו לצרכיו המיוחדים של הלקוח. אי מסירת פרטים או מסירת פרטים חלקית עלולה לפגוע ביכולתו של משווק ההשקעות להתאים את השירות שיינתן לצרכי הלקוח.'}
            </Text>
            <Text style={{ fontSize: 8.5, textAlign: 'right', lineHeight: 1.6, color: C.black, marginTop: 4 }}>
              {'ידוע ללקוח כי קיימת חשיבות לעדכן את משווק ההשקעות בכל שינוי שיחול ביחס לפרטים שמסר במסגרת מסמך זה. משווק ההשקעות הבהיר ללקוח כי כל פרט שהלקוח מוסר למשווק ההשקעות ישמר בסודיות על ידי משווק ההשקעות אך סודיות זו כפופה לחובת משווק ההשקעות למסור ידיעות על פי כל דין.'}
            </Text>
          </GoldBox>
        </View>

        {/* תחתית */}
        <View style={{ position: 'absolute', bottom: 30, left: 0, right: 0, alignItems: 'center' }}>
          <Text style={{ fontSize: 9, color: C.textMuted, textAlign: 'center' }}>
            כל הנתונים נמסרו על ידי הלקוח ובאחריותו
          </Text>
        </View>
        <PageFooter />
      </Page>

      {/* ==================== PAGE 2: PERSONAL + FINANCIAL ==================== */}
      <Page size="A4" style={basePageStyle}>
        <PageHeader clientName={clientName} date={date} />
        <PageFooter />

        <SectionTitle>פרטים מזהים</SectionTitle>
        {printClientFull(formData.clientA, isCouple ? 'לקוח א׳' : 'פרטי הלקוח')}
        {isCouple && printClientFull(formData.clientB, 'לקוח ב׳')}

        <SectionTitle>תמונה כלכלית — התא המשפחתי</SectionTitle>

        {/* Income */}
        {incomeRows.length > 0 && (
          <View wrap={false}>
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 4 }}>הכנסות (חודשי)</Text>
            <DataTable rows={incomeRows} />
            {formData.incomeNotes ? <Text style={{ fontSize: 8, color: C.textMuted, textAlign: 'right', marginTop: 2 }}>הערות: {formData.incomeNotes}</Text> : null}
          </View>
        )}

        {/* Asset categories */}
        {processedAssetSections.map((section, idx) => (
          <View key={idx} wrap={false} style={{ marginTop: 8 }}>
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 4 }}>{section.title}</Text>
            <DataTable rows={section.rows} />
            {section.notes ? <Text style={{ fontSize: 8, color: C.textMuted, textAlign: 'right', marginTop: 2 }}>הערות: {section.notes}</Text> : null}
          </View>
        ))}

        {/* Liabilities */}
        {liabRows.length > 0 && (
          <View wrap={false} style={{ marginTop: 8 }}>
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 4 }}>התחייבויות</Text>
            <DataTable rows={liabRows} />
            {formData.liabilitiesNotes ? <Text style={{ fontSize: 8, color: C.textMuted, textAlign: 'right', marginTop: 2 }}>הערות: {formData.liabilitiesNotes}</Text> : null}
          </View>
        )}

        {/* Two side-by-side summary boxes */}
        <View style={{ flexDirection: 'row-reverse', marginTop: 12, gap: 8 }} wrap={false}>
          {/* Balance sheet summary */}
          <View style={{ flex: 1, borderWidth: 1, borderColor: C.gold, borderRadius: 4, overflow: 'hidden' }}>
            <View style={{ backgroundColor: C.primary, paddingVertical: 4, paddingHorizontal: 8 }}>
              <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.gold, textAlign: 'right' }}>סיכום מאזן</Text>
            </View>
            <View style={{ padding: 6 }}>
              <SummaryRow label="סך נכסים" value={totalAssets > 0 ? fmtMoney(totalAssets) : '---'} />
              <SummaryRow label="סך התחייבויות" value={totalLiabilities > 0 ? fmtMoney(totalLiabilities) : '---'} />
              <SummaryRow label="שווי נטו" value={netWorth !== 0 ? fmtMoney(netWorth) : '---'} highlight />
            </View>
          </View>

          {/* Monthly balance */}
          <View style={{ flex: 1, borderWidth: 1, borderColor: C.gold, borderRadius: 4, overflow: 'hidden' }}>
            <View style={{ backgroundColor: C.primary, paddingVertical: 4, paddingHorizontal: 8 }}>
              <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.gold, textAlign: 'right' }}>מאזן חודשי</Text>
            </View>
            <View style={{ padding: 6 }}>
              <SummaryRow label="סך הכנסות" value={totalMonthlyIncome > 0 ? fmtMoney(totalMonthlyIncome) : '---'} />
              <SummaryRow label="סך הוצאות" value={totalMonthlyExpenses > 0 ? fmtMoney(totalMonthlyExpenses) : '---'} />
              <SummaryRow label="מאזן חודשי" value={monthlyBalance !== 0 ? fmtMoney(monthlyBalance) : '---'} highlight />
            </View>
          </View>
        </View>

        {formData.managedPortion && (
          <View style={{ marginTop: 8 }}>
            <LabelValue label="שיעור נכסים מנוהל" value={portionLabels[formData.managedPortion]} even />
          </View>
        )}
      </Page>

      {/* ==================== PAGE 3: GOALS + LIQUIDITY + RISK ==================== */}
      <Page size="A4" style={basePageStyle}>
        <PageHeader clientName={clientName} date={date} />
        <PageFooter />

        {/* Goals as pill tags */}
        <SectionTitle>מטרות השקעה ואופק</SectionTitle>
        {goals.length > 0 && (
          <View style={{ flexDirection: 'row-reverse', flexWrap: 'wrap', marginBottom: 6 }}>
            {goals.map((g, i) => <PillTag key={i} text={g} />)}
          </View>
        )}
        {formData.investmentGoalOther && <LabelValue label="פירוט" value={formData.investmentGoalOther} />}
        <LabelValue label="אופק השקעה" value={horizonLabels[formData.investmentHorizon] || '---'} even />

        {/* Liquidity */}
        <SectionTitle>צרכי נזילות</SectionTitle>
        <LabelValue label="מתי תצטרך את כל הכסף" value={timelineLabels[formData.liquidityTimeline] || '---'} even />
        <LabelValue label="כמה תצטרך ב-3 שנים" value={next3Labels[formData.liquidityNext3Years] || '---'} />

        {/* Risk Assessment */}
        <SectionTitle>הערכת סיכון</SectionTitle>

        {/* Risk gauge */}
        {formData.finalRiskLevel > 0 && (
          <View style={{ marginBottom: 8 }}>
            <RiskGauge level={formData.finalRiskLevel} />
          </View>
        )}

        {/* Risk questions table */}
        <DataTable
          headers={['שאלה', 'תשובת הלקוח']}
          rows={[
            ['אסימטריה — סיכוי מול סיכון', q1Labels[formData.riskQ1] || '---'],
            ['תחושה — גישה לתנודות', q2Labels[formData.riskQ2] || '---'],
            ['תרחיש — ירידה חדה', q3Labels[formData.riskQ3] || '---'],
            ['עדיפות — מטרה מרכזית', q4Labels[formData.riskQ4] || '---'],
          ]}
        />

        {formData.priorExperience && (
          <View style={{ marginTop: 6 }}>
            <LabelValue label="ניסיון קודם בשוק ההון" value={formData.priorExperience === 'yes' ? 'כן' : 'לא'} even />
            {formData.priorExperienceDetails && <LabelValue label="פירוט" value={formData.priorExperienceDetails} />}
          </View>
        )}
      </Page>

      {/* ==================== PAGE 4: ADVISOR SUMMARY ==================== */}
      <Page size="A4" style={basePageStyle}>
        <PageHeader clientName={clientName} date={date} />
        <PageFooter />

        <SectionTitle>סיכום והמלצת בעל הרישיון</SectionTitle>

        {/* Advisor free text — summary */}
        {formData.advisorSummary && (
          <View wrap={false} style={{ borderWidth: 0.5, borderColor: C.border, borderRadius: 4, padding: 10, marginBottom: 10, backgroundColor: C.surfaceLight }}>
            <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 4 }}>סיכום וניתוח</Text>
            <Text style={{ fontSize: 9, textAlign: 'right', lineHeight: 1.6, color: C.black }}>{formData.advisorSummary}</Text>
          </View>
        )}

        {/* Client preferences */}
        {formData.clientPreferences && (
          <View wrap={false} style={{ borderWidth: 0.5, borderColor: C.border, borderRadius: 4, padding: 10, marginBottom: 10, backgroundColor: C.surfaceLight }}>
            <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 4 }}>העדפות / הגבלות לקוח</Text>
            <Text style={{ fontSize: 9, textAlign: 'right', lineHeight: 1.6, color: C.black }}>{formData.clientPreferences}</Text>
          </View>
        )}

        {/* 4 Policy cubes */}
        <View style={{ flexDirection: 'row-reverse', justifyContent: 'center', marginTop: 10 }} wrap={false}>
          <PolicyCube label="אחוז מניות מקס׳" value={formData.equityPct ? `${formData.equityPct}%` : '---'} />
          <PolicyCube label="אג״ח קונצרני" value={formData.corporateBondsPct ? (formData.corporateBondsPct === '50' ? 'עד 50%' : 'עד 100%') : '---'} />
          <PolicyCube label="מט״ח" value={formData.forex ? 'כן' : 'לא'} />
          <PolicyCube label="אג״ח דירוג נמוך" value={formData.lowRatedBonds ? 'כן' : 'לא'} />
        </View>

        {/* Risk level box */}
        {rlFinal && (
          <View style={{ backgroundColor: C.cream, borderWidth: 1, borderColor: C.gold, borderRadius: 4, padding: 12, marginTop: 14 }} wrap={false}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: C.primary, textAlign: 'right' }}>
              דרגת סיכון סופית: {formData.finalRiskLevel} — {rlFinal.name}
            </Text>
            <Text style={{ fontSize: 9, color: C.secondary, textAlign: 'right', marginTop: 4 }}>
              {rlFinal.description}
            </Text>
            <Text style={{ fontSize: 9, color: C.black, textAlign: 'right', marginTop: 4 }}>
              הפסד מקסימלי: {rlFinal.maxLoss} | מניות: {rlFinal.maxStocks} | אג״ח קונצרני: {rlFinal.corpBonds}
            </Text>
            <RiskGauge level={formData.finalRiskLevel} size="small" />
          </View>
        )}

        {formData.finalRiskJustification && (
          <View wrap={false} style={{ marginTop: 8, borderWidth: 0.5, borderColor: C.border, borderRadius: 4, padding: 10, backgroundColor: C.surfaceLight }}>
            <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 4 }}>נימוק מקצועי</Text>
            <Text style={{ fontSize: 9, textAlign: 'right', lineHeight: 1.6, color: C.black }}>{formData.finalRiskJustification}</Text>
          </View>
        )}
      </Page>

      {/* ==================== PAGE 5: SUMMARY ==================== */}
      <Page size="A4" style={basePageStyle}>
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

        {isCouple && (
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
          ['מטרות השקעה', goalsText || '---'],
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

      {/* ==================== LAST PAGE: SIGNATURES ==================== */}
      <Page size="A4" style={basePageStyle}>
        <PageHeader clientName={clientName} date={date} />
        <PageFooter />

        <SectionTitle>הצהרות וחתימות</SectionTitle>

        {/* Client declaration */}
        <View wrap={false}>
          <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 6 }}>הצהרת הלקוח</Text>
          <Text style={{ fontSize: 9, textAlign: 'right', lineHeight: 1.6, marginBottom: 8, color: C.black }}>
            {`אני הח"מ ${clientName} מצהיר בזאת כי המידע המופיע לעיל הינו המידע אותו מסרתי לידיעתו של משווק ההשקעות. כמו כן, הוסבר לי כי מענה אמיתי, כן ומלא לשאלון יסייע למשווק ההשקעות להתאים בצורה המיטבית את אופי תיק ההשקעות לצרכיי הספציפיים. כל מידע אחר אשר נתבקשתי למסור לידיעת משווק ההשקעות אולם נמנעתי מלמסרו, הינו מידע אשר אין ברצוני שישמש את משווק ההשקעות במסגרת פעילותו. בחתימתי זו מאשר הח"מ כי מדיניות ההשקעה ואופן ניהול תיק ההשקעות הוסברו לח"מ ונקבעו בשיתוף פעולה עם הח"מ. אני מאשר בזאת כי קיבלתי עותק של מסמך זה.`}
          </Text>
          <Text style={{ fontSize: 10, textAlign: 'right', marginTop: 8, color: C.black }}>חתימת הלקוח: X ______________</Text>
          <Text style={{ fontSize: 10, textAlign: 'right', marginTop: 8, color: C.black }}>תאריך: {date}</Text>
        </View>

        {isCouple && (
          <View style={{ marginTop: 12 }}>
            <Text style={{ fontSize: 10, textAlign: 'right', marginTop: 8, color: C.black }}>חתימת לקוח ב׳ ({formData.clientB.fullName || '---'}): X ______________</Text>
            <Text style={{ fontSize: 10, textAlign: 'right', marginTop: 8, color: C.black }}>תאריך: {date}</Text>
          </View>
        )}

        {/* Refusals block (red border) */}
        {formData.refusals && formData.refusals.length > 0 && (
          <View style={{ backgroundColor: C.offWhite, borderWidth: 1.5, borderColor: C.negative, borderRadius: 4, padding: 10, marginTop: 16 }} wrap={false}>
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.negative, textAlign: 'right', marginBottom: 6 }}>שאלות שהלקוח סירב להשיב:</Text>
            {formData.refusals.map((r, i) => (
              <Text key={i} style={{ fontSize: 9, color: C.black, textAlign: 'right', marginBottom: 2 }}>• {r.label}</Text>
            ))}
            <Text style={{ fontSize: 8, color: C.textMuted, textAlign: 'right', marginTop: 6 }}>הובהר ללקוח כי אי מסירת המידע עלולה לפגוע באיכות ההמלצה.</Text>
          </View>
        )}

        {/* Advisor confirmation */}
        <View wrap={false} style={{ marginTop: 20, borderTopWidth: 0.5, borderTopColor: C.primary, paddingTop: 12 }}>
          <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 6 }}>אישור בעל הרישיון</Text>
          <Text style={{ fontSize: 9, textAlign: 'right', lineHeight: 1.6, marginBottom: 8, color: C.black }}>
            {`אני הח"מ ${advisorName} בעל רישיון שיווק השקעות שמספרו ${advisorLicense} מטעם גרין סוכנות לביטוח פנסיוני ושיווק השקעות (2024) בע"מ, מאשר כי ביררתי עם הלקוח את הפרטים הנדרשים, הלקוח חתם בפני בכל המקומות הנדרשים, והוסברו לו השלכות אי מסירת מלוא המידע הרלוונטי לצורך התאמת השירות לצרכיו הייחודיים של הלקוח. במידה והלקוח בחר שלא למסור פרטים כמפורט לעיל, הבהרתי ללקוח את משמעות אי מסירת הפרטים. כמו כן, בהתאם לפרטים שמסר לי הלקוח עולה כי קיימת תשתית מספקת להתאמת מדיניות ההשקעה ללקוח בהתאם להוראות החוק.`}
          </Text>
          <Text style={{ fontSize: 10, textAlign: 'right', marginTop: 8, color: C.black }}>חתימת בעל הרישיון: ______________</Text>
          <Text style={{ fontSize: 10, textAlign: 'right', marginTop: 8, color: C.black }}>תאריך: {date}</Text>
        </View>
      </Page>
    </Document>
  )
}

// ==================== EXPORT ====================
export async function generatePDF(formData, user) {
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
