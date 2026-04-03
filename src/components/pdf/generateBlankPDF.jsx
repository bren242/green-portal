import React from 'react'
import { Document, Page, Text, View, Image, pdf } from '@react-pdf/renderer'
import { logoPng } from '../../assets/logoBase64'
import {
  C, coverPageStyle, contentPageStyle,
  PageHeader, PageFooter, SectionTitle, SectionGap,
  LabelValue, DataTable, PillTag, GoldBox,
  BalanceBox, SignatureLine, DateLine, PolicyCube,
  fmtDate,
} from './PDFTemplate'

// ── Regulatory Paragraphs (same as filled PDF) ────────────────
const REG_TEXTS = [
  'משווק השקעות נדרש, על פי חוק הסדרת העיסוק בייעוץ השקעות, בשיווק השקעות ובניהול תיקי השקעות תשנ״ה-1995 (להלן: "החוק"), להתאים, ככל האפשר, את השירותים שמשווק ההשקעות נותן ללקוח לצרכיו ולהנחיותיו של הלקוח וזאת לאחר שמשווק ההשקעות בירר עם הלקוח את מטרות ההשקעה, את מצבו הכספי לרבות ניירות הערך והנכסים הפיננסיים של הלקוח, ואת שאר הנסיבות הרלוונטיות לעניין זה.',
  'ידוע ללקוח כי מענה אמיתי, כן ומלא לשאלון שלהלן יסייע למשווק ההשקעות להתאים בצורה המיטבית האפשרית את אופי השקעותיו לצרכיו המיוחדים של הלקוח. אי מסירת פרטים או מסירת פרטים חלקית עלולה לפגוע ביכולתו של משווק ההשקעות להתאים את השירות שיינתן לצרכי הלקוח.',
  'ידוע ללקוח כי קיימת חשיבות לעדכן את משווק ההשקעות בכל שינוי שיחול ביחס לפרטים שמסר במסגרת מסמך זה. משווק ההשקעות הבהיר ללקוח כי כל פרט שהלקוח מוסר למשווק ההשקעות ישמר בסודיות על ידי משווק ההשקעות אך סודיות זו כפופה לחובת משווק ההשקעות למסור ידיעות על פי כל דין.',
  'הלקוח מצהיר כי הוא מודע לכך שהשקעות בשוק ההון כרוכות בסיכון, וכי אין בתשואות עבר כדי להבטיח תשואות עתידיות.',
]

// ── Label Maps ────────────────────────────────────────────────
const goalLabels = {
  preserve: 'שמירת ערך', income: 'הכנסה שוטפת', growth: 'צמיחה לטווח ארוך',
  pension: 'חיסכון לפנסיה', education: 'חינוך ילדים', intergenerational: 'העברה בין-דורית', other: 'אחר',
}
const horizonLabels   = { up_to_2: 'עד שנתיים', '2_to_5': 'שנתיים עד 5', '5_to_10': '5–10 שנים', over_10: 'מעל 10 שנים' }
const timelineLabels  = { up_to_2: 'עד שנתיים', '2_to_5': '2-5 שנים', over_5: 'מעל 5 שנים', unknown: 'לא ידוע' }
const next3Labels     = { '0': '0%', up_to_30: 'עד 30%', up_to_50: 'עד 50%', over_50: 'מעל 50%', unknown: 'לא ידוע' }
const q1Labels = { a: 'סיכוי עד 6%, סיכון עד 5%', b: 'סיכוי עד 14%, סיכון עד 10%', c: 'סיכוי עד 20%, סיכון עד 15%', d: 'סיכוי מעל 20%, סיכון מעל 15%' }
const q2Labels = { a: 'מעדיף לישון בשקט', b: 'מוכן לתנודות לטובת תשואה', c: 'משקיע לטווח ארוך, תנודות לא מדאיגות' }
const q3Labels = { a: 'רוצה לצאת', b: 'שוקל לצמצם סיכון', c: 'מחזיק ומחכה', d: 'רואה הזדמנות להוסיף' }
const q4Labels = { a: 'לא להפסיד', b: 'לשמור מעל אינפלציה', c: 'צמיחה לטווח ארוך' }
const portionLabels   = { up_to_35: 'עד 35%', '35_to_70': '35%-70%', over_70: 'מעל 70%' }

// ── Blank Line Component ──────────────────────────────────────
const BlankLine = ({ width = 200 }) => (
  <View style={{ borderBottomWidth: 1, borderBottomColor: C.primary, width, marginVertical: 2 }} />
)

// ── Blank Sector Card ─────────────────────────────────────────
const BlankSectorCard = ({ title, rows }) => (
  <View style={{
    width: '48%',
    borderWidth: 1,
    borderColor: C.gold,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  }} wrap={false}>
    <View style={{ backgroundColor: C.primary, paddingVertical: 5, paddingHorizontal: 10 }}>
      <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.goldLight, textAlign: 'right' }}>{title}</Text>
    </View>
    <View style={{ backgroundColor: C.white, padding: 10 }}>
      <View style={{ borderBottomWidth: 1, borderBottomColor: C.primary, marginBottom: 8, width: 100, alignSelf: 'flex-end' }} />
      {rows.map((label, i) => (
        <View key={i} style={{
          flexDirection: 'row-reverse',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTopWidth: 0.5,
          borderTopColor: C.border,
          paddingVertical: 3,
        }}>
          <Text style={{ fontSize: 8, color: C.muted }}>{label}</Text>
          <View style={{ borderBottomWidth: 1, borderBottomColor: C.primary, width: 70 }} />
        </View>
      ))}
    </View>
  </View>
)

// ── Blank Client Card ─────────────────────────────────────────
const BlankClientCard = ({ title }) => (
  <View style={{ borderWidth: 0.5, borderColor: C.border, borderRadius: 4, marginHorizontal: 3, minHeight: 140 }} wrap={false}>
    <View style={{ backgroundColor: C.primary, paddingVertical: 5, paddingHorizontal: 10 }}>
      <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.gold, textAlign: 'right' }}>{title}</Text>
    </View>
    <View style={{ padding: 8 }}>
      {['שם מלא', 'ת.ז.', 'תאריך לידה', 'מצב משפחתי', 'נפשות תלויות', 'טלפון', 'דוא״ל', 'עיסוק'].map((label, i) => (
        <View key={i} style={[
          { flexDirection: 'row-reverse', paddingVertical: 4, paddingHorizontal: 6 },
          i % 2 === 0 && { backgroundColor: C.surface },
        ]}>
          <Text style={{ width: '38%', fontSize: 9, fontWeight: 'bold', color: C.muted, textAlign: 'right' }}>{label}</Text>
          <View style={{ width: '62%', alignItems: 'flex-end' }}>
            <BlankLine width={140} />
          </View>
        </View>
      ))}
    </View>
  </View>
)

// ── Fixed Blank Sectors ───────────────────────────────────────
const BLANK_SECTORS = [
  { title: 'הכנסות (חודשי)', rows: ['שכר נטו חודשי', 'הכנסות מנדל״ן', 'אחר'] },
  { title: 'עו״ש, מזומן ופקדונות', rows: ['עו״ש / מזומן', 'פקדונות בנקאיים', 'קרנות כספיות'] },
  { title: 'ני״ע בארץ ובחו״ל', rows: ['תיק מנוהל', 'מניות / אג״ח', 'ETF'] },
  { title: 'חיסכון, גמל והשתלמות', rows: ['קרן השתלמות', 'קופת גמל', 'פוליסת חיסכון'] },
  { title: 'פנסיה', rows: ['קרן פנסיה', 'ביטוח מנהלים'] },
  { title: 'נדל״ן', rows: ['נדל״ן להשקעה', 'נדל״ן מגורים'] },
  { title: 'התחייבויות', rows: ['משכנתא (יתרה)', 'משכנתא (חודשי)', 'הלוואות (יתרה)', 'הוצאות שוטפות'] },
]

// ════════════════════════════════════════════════════════════════
//  BLANK DOCUMENT
// ════════════════════════════════════════════════════════════════
const BlankDocument = () => {
  const blankName = '________________'
  const blankDate = '___/___/______'

  return (
    <Document>

      {/* ═══════════════════ PAGE 1: COVER ═══════════════════ */}
      <Page size="A4" style={coverPageStyle}>

        <View>
          {/* Header */}
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
              <BlankLine width={180} />
              <Text style={{ fontSize: 9, color: C.muted, marginTop: 4 }}>{blankDate}</Text>
            </View>
          </View>

          {/* Title */}
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
          <View style={{ flexDirection: 'row-reverse', paddingVertical: 8, paddingHorizontal: 10, backgroundColor: C.surface, borderBottomLeftRadius: 3, borderBottomRightRadius: 3, borderWidth: 0.5, borderColor: C.border, borderTopWidth: 0 }}>
            <View style={{ flex: 1, alignItems: 'flex-end' }}><BlankLine width={120} /></View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}><BlankLine width={120} /></View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}><BlankLine width={120} /></View>
          </View>

          {/* Client blocks */}
          <View style={{ marginTop: 16, flexDirection: 'row-reverse', gap: 8 }}>
            {['לקוח א׳', 'לקוח ב׳'].map((title, i) => (
              <View key={i} style={{
                flex: 1,
                backgroundColor: C.primary,
                borderRadius: 4,
                padding: 10,
              }}>
                <Text style={{ fontSize: 8, fontWeight: 'bold', color: C.gold, textAlign: 'right', marginBottom: 4 }}>{title}</Text>
                <View style={{ borderBottomWidth: 1, borderBottomColor: C.goldLight, width: 160, marginBottom: 4 }} />
                <Text style={{ fontSize: 9, color: C.goldLight, textAlign: 'right', marginTop: 3 }}>ת.ז: ______________</Text>
              </View>
            ))}
          </View>

          {/* Regulatory text */}
          <GoldBox mt={24}>
            {REG_TEXTS.map((txt, i) => (
              <Text key={i} style={{ fontSize: 8.5, textAlign: 'right', lineHeight: 1.6, color: C.black, marginTop: i > 0 ? 4 : 0 }}>{txt}</Text>
            ))}
          </GoldBox>

        </View>

        <View style={{ position: 'absolute', bottom: 30, left: 0, right: 0, alignItems: 'center' }}>
          <Text style={{ fontSize: 9, color: C.muted, textAlign: 'center' }}>כל הנתונים נמסרו על ידי הלקוח ובאחריותו</Text>
        </View>

        <PageFooter />
      </Page>

      {/* ═══════════════════ PAGE 2+: CONTENT ═══════════════════ */}
      <Page size="A4" style={contentPageStyle}>
        <PageHeader clientName={blankName} date={blankDate} docTitle="טופס ריק" />
        <PageFooter />

        {/* ── Personal Details ────────────────────────────── */}
        <SectionTitle>פרטים מזהים</SectionTitle>
        <View style={{ flexDirection: 'row-reverse', gap: 6 }}>
          <View style={{ width: '49%' }}><BlankClientCard title="לקוח א׳" /></View>
          <View style={{ width: '49%' }}><BlankClientCard title="לקוח ב׳" /></View>
        </View>

        {/* ── Financial Picture ───────────────────────────── */}
        <SectionGap />
        <SectionTitle>תמונה כלכלית — התא המשפחתי</SectionTitle>

        <View style={{ flexDirection: 'row-reverse', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {BLANK_SECTORS.map((sec, i) => (
            <BlankSectorCard key={i} title={sec.title} rows={sec.rows} />
          ))}
        </View>

        {/* Separator */}
        <View style={{ borderTopWidth: 1, borderTopColor: C.gold, marginTop: 16, marginBottom: 12 }} />

        {/* Summary boxes */}
        <View style={{ flexDirection: 'row-reverse', gap: 8 }} wrap={false}>
          <BalanceBox
            title="סיכום מאזן"
            rows={[['סך נכסים', '___________'], ['סך התחייבויות', '___________']]}
            highlightLabel="שווי נטו"
            highlightValue="___________"
          />
          <BalanceBox
            title="מאזן חודשי"
            rows={[['סך הכנסות', '___________'], ['סך הוצאות', '___________']]}
            highlightLabel="מאזן חודשי"
            highlightValue="___________"
          />
        </View>

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
          <BlankLine width={80} />
          <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.primary }}>
            שיעור הנכסים המועבר לטיפול GREEN
          </Text>
        </View>

        {/* ── Goals & Horizon ─────────────────────────────── */}
        <SectionGap />
        <SectionTitle>מטרות השקעה ואופק</SectionTitle>
        <View style={{ flexDirection: 'row-reverse', flexWrap: 'wrap', marginTop: 4, marginBottom: 6 }}>
          {Object.values(goalLabels).map((g, i) => <PillTag key={i} text={g} />)}
        </View>
        <LabelValue label="אופק השקעה" value="_______________" even />

        {/* ── Liquidity ───────────────────────────────────── */}
        <SectionGap />
        <SectionTitle>צרכי נזילות</SectionTitle>
        <LabelValue label="מתי תצטרך את כל הכסף" value="_______________" even />
        <LabelValue label="כמה תצטרך ב-3 שנים" value="_______________" />

        {/* ── Risk Assessment ─────────────────────────────── */}
        <SectionGap />
        <SectionTitle>הערכת סיכון</SectionTitle>

        {/* Empty risk gauge area */}
        <View style={{ alignItems: 'center', marginVertical: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            {[1, 2, 3, 4, 5].map((n) => {
              const labels = ['שמרן', 'שמרן-מתון', 'מאוזן', 'צמיחה', 'אגרסיבי']
              return (
                <View key={n} style={{ alignItems: 'center', marginHorizontal: 8 }}>
                  <View style={{
                    width: 22, height: 22, borderRadius: 11,
                    backgroundColor: C.surface,
                    borderWidth: 1, borderColor: C.border,
                    justifyContent: 'center', alignItems: 'center',
                  }}>
                    <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.muted }}>{n}</Text>
                  </View>
                  <Text style={{ fontSize: 7, color: C.muted, marginTop: 2, textAlign: 'center' }}>{labels[n - 1]}</Text>
                </View>
              )
            })}
          </View>
        </View>

        <DataTable
          headers={['שאלה', 'תשובת הלקוח']}
          rows={[
            ['אסימטריה — סיכוי מול סיכון', '_______________'],
            ['תחושה — גישה לתנודות', '_______________'],
            ['תרחיש — ירידה חדה', '_______________'],
            ['עדיפות — מטרה מרכזית', '_______________'],
            ['ניסיון קודם בשוק ההון', '_______________'],
            ['פירוט ניסיון', '_______________'],
          ]}
        />

        {/* ── Advisor Summary & Policy ────────────────────── */}
        <SectionGap />
        <SectionTitle>סיכום והמלצת בעל הרישיון</SectionTitle>

        <View wrap={false} style={{ borderWidth: 0.5, borderColor: C.gold, borderRadius: 4, padding: 10, marginBottom: 10, backgroundColor: C.cream }}>
          <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 3 }}>סיכום וניתוח</Text>
          <BlankLine width={460} />
          <View style={{ marginTop: 6 }}><BlankLine width={460} /></View>
          <View style={{ marginTop: 6 }}><BlankLine width={460} /></View>
          <View style={{ marginTop: 6 }}><BlankLine width={300} /></View>
        </View>

        <View wrap={false} style={{ borderWidth: 0.5, borderColor: C.gold, borderRadius: 4, padding: 10, marginBottom: 10, backgroundColor: C.cream }}>
          <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 3 }}>העדפות / הגבלות לקוח</Text>
          <BlankLine width={460} />
          <View style={{ marginTop: 6 }}><BlankLine width={460} /></View>
          <View style={{ marginTop: 6 }}><BlankLine width={300} /></View>
        </View>

        {/* Policy cubes */}
        <View style={{ flexDirection: 'row-reverse', justifyContent: 'center', marginTop: 6 }} wrap={false}>
          <PolicyCube label="אחוז מניות מקס׳" value="____" />
          <PolicyCube label="אג״ח קונצרני" value="____" />
          <PolicyCube label="מט״ח" value="____" />
          <PolicyCube label="אג״ח דירוג נמוך" value="____" />
        </View>

        {/* Final risk level */}
        <View style={{ backgroundColor: C.cream, borderWidth: 1, borderColor: C.gold, borderRadius: 4, padding: 10, marginTop: 12 }} wrap={false}>
          <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
            <Text style={{ fontSize: 13, fontWeight: 'bold', color: C.primary, textAlign: 'right' }}>דרגת סיכון סופית: </Text>
            <BlankLine width={200} />
          </View>
          <View style={{ flexDirection: 'row-reverse', alignItems: 'center', marginTop: 6 }}>
            <Text style={{ fontSize: 9, color: C.primary, textAlign: 'right' }}>נימוק: </Text>
            <BlankLine width={400} />
          </View>
        </View>

        {/* ── Declarations & Signatures ───────────────────── */}
        <View wrap={false}>
          <SectionGap />
          <SectionTitle>הצהרות וחתימות</SectionTitle>

          <View>
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 6 }}>הצהרת הלקוח</Text>
            <Text style={{ fontSize: 9, textAlign: 'right', lineHeight: 1.5, marginBottom: 10, color: C.black }}>
              {`אני הח"מ ________________ מצהיר בזאת כי המידע המופיע לעיל הינו המידע אותו מסרתי לידיעתו של משווק ההשקעות. כמו כן, הוסבר לי כי מענה אמיתי, כן ומלא לשאלון יסייע למשווק ההשקעות להתאים בצורה המיטבית את אופי תיק ההשקעות לצרכיי הספציפיים. כל מידע אחר אשר נתבקשתי למסור לידיעת משווק ההשקעות אולם נמנעתי מלמסרו, הינו מידע אשר אין ברצוני שישמש את משווק ההשקעות במסגרת פעילותו. בחתימתי זו מאשר הח"מ כי מדיניות ההשקעה ואופן ניהול תיק ההשקעות הוסברו לח"מ ונקבעו בשיתוף פעולה עם הח"מ. אני מאשר בזאת כי קיבלתי עותק של מסמך זה.`}
            </Text>

            {/* Signature lines — couple */}
            <View style={{ flexDirection: 'row-reverse', marginTop: 4 }}>
              <View style={{ flex: 1, marginLeft: 6 }}>
                <SignatureLine label="חתימת לקוח א׳:" />
                <DateLine date={blankDate} />
              </View>
              <View style={{ flex: 1, marginRight: 6 }}>
                <SignatureLine label="חתימת לקוח ב׳:" />
                <DateLine date={blankDate} />
              </View>
            </View>
          </View>

          {/* Refusals block */}
          <View style={{ borderWidth: 1, borderColor: C.gold, borderRadius: 4, padding: 12, marginTop: 20 }}>
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 6 }}>הלקוח סירב להשיב על:</Text>
            <BlankLine width={400} />
            <View style={{ marginTop: 4 }}><BlankLine width={400} /></View>
            <Text style={{ fontSize: 8, color: C.muted, textAlign: 'right', marginTop: 8 }}>
              הובהר ללקוח כי אי מסירת המידע עלולה לפגוע באיכות ההמלצה.
            </Text>
            <SignatureLine label="חתימה על הסירובים:" />
            <DateLine date={blankDate} />
          </View>

          {/* Advisor confirmation */}
          <View style={{ marginTop: 20, borderTopWidth: 0.5, borderTopColor: C.primary, paddingTop: 12 }}>
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 6 }}>אישור בעל הרישיון</Text>
            <Text style={{ fontSize: 9, textAlign: 'right', lineHeight: 1.5, marginBottom: 10, color: C.black }}>
              {`אני הח"מ ________________ בעל רישיון שיווק השקעות שמספרו ____________ מטעם גרין סוכנות לביטוח פנסיוני ושיווק השקעות (2024) בע"מ, מאשר כי ביררתי עם הלקוח את הפרטים הנדרשים, הלקוח חתם בפני בכל המקומות הנדרשים, והוסברו לו השלכות אי מסירת מלוא המידע הרלוונטי לצורך התאמת השירות לצרכיו הייחודיים של הלקוח. במידה והלקוח בחר שלא למסור פרטים כמפורט לעיל, הבהרתי ללקוח את משמעות אי מסירת הפרטים. כמו כן, בהתאם לפרטים שמסר לי הלקוח עולה כי קיימת תשתית מספקת להתאמת מדיניות ההשקעה ללקוח בהתאם להוראות החוק.`}
            </Text>
            <SignatureLine label="חתימת בעל הרישיון:" />
            <DateLine date={blankDate} />
          </View>

        </View>

      </Page>
    </Document>
  )
}

// ── Export ──────────────────────────────────────────────────────
export async function generateBlankPDF() {
  const blob = await pdf(<BlankDocument />).toBlob()
  const pdfBytes = await blob.arrayBuffer()
  const previewBlob = new Blob([pdfBytes], { type: 'application/pdf' })
  const previewUrl = URL.createObjectURL(previewBlob)
  return { url: previewUrl, fileName: 'KYC_טופס_ריק.pdf', pdfBytes }
}
