import React from 'react'
import { Document, Page, Text, View, Image, pdf } from '@react-pdf/renderer'
import { logoPng } from '../../assets/logoBase64'
import {
  C, coverPageStyle, contentPageStyle,
  PageHeader, PageFooter, SectionTitle, SectionGap,
  GoldBox, SignatureLine, DateLine, RiskGauge,
  fmtDate,
} from './PDFTemplate'

// ── Local Components ──────────────────────────────────────────

const BlankLine = ({ width = 160 }) => (
  <View style={{ borderBottomWidth: 1, borderBottomColor: C.primary, width, marginVertical: 3 }} />
)

const FieldRow = ({ label, wide = false }) => (
  <View style={{ flexDirection: 'row-reverse', alignItems: 'flex-end', marginBottom: 8 }}>
    <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.muted, textAlign: 'right', width: wide ? 120 : 80 }}>
      {label}
    </Text>
    <BlankLine width={wide ? 200 : 160} />
  </View>
)

const CheckOption = ({ label, score }) => (
  <View style={{ flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 5 }}>
    <View style={{ width: 12, height: 12, borderWidth: 1, borderColor: C.primary, marginLeft: 6 }} />
    <Text style={{ fontSize: 9, color: C.black, textAlign: 'right', flex: 1 }}>{label}</Text>
    {score !== undefined && (
      <Text style={{ fontSize: 8, color: C.muted, marginRight: 8 }}>({score} נק׳)</Text>
    )}
  </View>
)

const QuestionBlock = ({ num, question, options }) => (
  <View style={{ marginBottom: 14 }} wrap={false}>
    <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 6 }}>
      {num}. {question}
    </Text>
    {options.map(({ label, score }, i) => (
      <CheckOption key={i} label={label} score={score} />
    ))}
  </View>
)

const BlankSector = ({ title, rows }) => (
  <View style={{
    width: '48%', borderWidth: 1, borderColor: C.gold,
    borderRadius: 4, marginBottom: 8, overflow: 'hidden',
  }} wrap={false}>
    <View style={{ backgroundColor: C.primary, paddingVertical: 5, paddingHorizontal: 10 }}>
      <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.goldLight, textAlign: 'right' }}>{title}</Text>
    </View>
    <View style={{ backgroundColor: C.white, padding: 10 }}>
      <Text style={{ fontSize: 8, color: C.muted, textAlign: 'right', marginBottom: 4 }}>סה״כ:</Text>
      <BlankLine width={100} />
      <View style={{ marginTop: 6 }}>
        {rows.map((label, i) => (
          <View key={i} style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', borderTopWidth: 0.5, borderTopColor: C.border, paddingVertical: 3 }}>
            <Text style={{ fontSize: 8, color: C.muted }}>{label}</Text>
            <BlankLine width={70} />
          </View>
        ))}
      </View>
    </View>
  </View>
)

// ── Questionnaire Data ────────────────────────────────────────

const QUESTIONS = [
  {
    num: 1,
    question: 'אסימטריה — סיכוי מול סיכון: מהי התשואה המקסימלית שאתה מצפה לה, ומהו ההפסד המקסימלי שאתה מוכן לספוג?',
    options: [
      { label: 'א. סיכוי עד 6%, סיכון עד 5%', score: 1 },
      { label: 'ב. סיכוי עד 14%, סיכון עד 10%', score: 2 },
      { label: 'ג. סיכוי עד 20%, סיכון עד 15%', score: 3 },
      { label: 'ד. סיכוי מעל 20%, סיכון מעל 15%', score: 5 },
    ],
  },
  {
    num: 2,
    question: 'תחושה — גישה לתנודות: כיצד אתה מרגיש לגבי תנודות בשוק ההון?',
    options: [
      { label: 'א. מעדיף לישון בשקט — תנודות מטרידות אותי', score: 1 },
      { label: 'ב. מוכן לתנודות לטובת תשואה גבוהה יותר', score: 3 },
      { label: 'ג. משקיע לטווח ארוך — תנודות לא מדאיגות אותי', score: 5 },
    ],
  },
  {
    num: 3,
    question: 'תרחיש — ירידה חדה: אם ירד תיק ההשקעות שלך ב-15% תוך חודש, מה תעשה?',
    options: [
      { label: 'א. רוצה לצאת ולהגן על מה שנשאר', score: 1 },
      { label: 'ב. שוקל לצמצם סיכון', score: 2 },
      { label: 'ג. מחזיק ומחכה להתאוששות', score: 3 },
      { label: 'ד. רואה הזדמנות להוסיף להשקעה', score: 5 },
    ],
  },
  {
    num: 4,
    question: 'עדיפות — מטרה מרכזית: מהי המטרה העיקרית שלך מתיק ההשקעות?',
    options: [
      { label: 'א. לא להפסיד כסף בשום מקרה', score: 1 },
      { label: 'ב. לשמור על ערך הכסף מעל אינפלציה', score: 3 },
      { label: 'ג. צמיחה לטווח ארוך גם במחיר תנודתיות', score: 5 },
    ],
  },
]

const RISK_TABLE = [
  { range: 'פחות מ-2', level: 1, name: 'שמרן', maxLoss: 'עד 5%', maxStocks: '0%' },
  { range: '2 עד 3', level: 2, name: 'שמרן-מתון', maxLoss: 'עד 10%', maxStocks: 'עד 15%' },
  { range: '3 עד 3.8', level: 3, name: 'מאוזן', maxLoss: 'עד 15%', maxStocks: 'עד 25%' },
  { range: '3.8 עד 4.5', level: 4, name: 'צמיחה', maxLoss: 'מעל 15%', maxStocks: 'עד 35%' },
  { range: '4.5 ומעלה', level: 5, name: 'אגרסיבי', maxLoss: 'משמעותי', maxStocks: 'עד 100%' },
]

const BLANK_SECTORS = [
  { title: 'הכנסות (חודשי)', rows: ['שכר נטו חודשי', 'פנסיה / קצבה', 'הכנסות מנדל״ן', 'אחר'] },
  { title: 'עו״ש, מזומן ופקדונות', rows: ['עו״ש / מזומן', 'פקדונות בנקאיים', 'קרנות כספיות'] },
  { title: 'ני״ע בארץ ובחו״ל', rows: ['תיק מנוהל', 'מניות / אג״ח', 'ETF', 'ברוקר זר'] },
  { title: 'חיסכון, גמל והשתלמות', rows: ['קרן השתלמות', 'קופת גמל', 'גמל להשקעה', 'פוליסת חיסכון'] },
  { title: 'פנסיה וביטוח מנהלים', rows: ['קרן פנסיה', 'ביטוח מנהלים'] },
  { title: 'נדל״ן', rows: ['נדל״ן להשקעה', 'נדל״ן מגורים'] },
  { title: 'התחייבויות', rows: ['משכנתא (יתרה)', 'משכנתא (חודשי)', 'הלוואות (יתרה)', 'הוצאות שוטפות'] },
]

// ════════════════════════════════════════════════════════════════
//  BLANK DOCUMENT
// ════════════════════════════════════════════════════════════════
const BlankDocument = () => {
  const date = '___/___/______'

  return (
    <Document>

      {/* ═══════════════════ PAGE 1: COVER ═══════════════════ */}
      <Page size="A4" style={coverPageStyle}>
        <View>
          <View style={{ height: 60, backgroundColor: C.white, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, borderBottomWidth: 1, borderBottomColor: C.gold }}>
            <Image src={logoPng} style={{ height: 36, width: 'auto' }} />
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <BlankLine width={140} />
              <Text style={{ fontSize: 8, color: C.muted, marginTop: 2 }}>שם הלקוח</Text>
            </View>
          </View>
          <View style={{ backgroundColor: C.primary, paddingVertical: 14, alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: C.gold }}>
              אפיון צרכים והתאמת מדיניות השקעה
            </Text>
            <Text style={{ fontSize: 10, color: C.goldLight, marginTop: 4 }}>טופס למילוי ידני</Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 30, paddingTop: 16, paddingBottom: 80 }}>
          {/* Advisor table */}
          <View style={{ flexDirection: 'row-reverse', backgroundColor: C.primary, borderTopLeftRadius: 3, borderTopRightRadius: 3, paddingVertical: 6, paddingHorizontal: 10 }}>
            <Text style={{ flex: 1, fontSize: 9, fontWeight: 'bold', color: C.goldLight, textAlign: 'right' }}>שם המשווק</Text>
            <Text style={{ flex: 1, fontSize: 9, fontWeight: 'bold', color: C.goldLight, textAlign: 'right' }}>תעודת זהות</Text>
            <Text style={{ flex: 1, fontSize: 9, fontWeight: 'bold', color: C.goldLight, textAlign: 'right' }}>מספר רישיון</Text>
          </View>
          <View style={{ flexDirection: 'row-reverse', paddingVertical: 10, paddingHorizontal: 10, backgroundColor: C.surface, borderBottomLeftRadius: 3, borderBottomRightRadius: 3, borderWidth: 0.5, borderColor: C.border, borderTopWidth: 0 }}>
            <View style={{ flex: 1 }}><BlankLine /></View>
            <View style={{ flex: 1 }}><BlankLine /></View>
            <View style={{ flex: 1 }}><BlankLine /></View>
          </View>

          {/* Client blocks */}
          <View style={{ marginTop: 16, flexDirection: 'row-reverse', gap: 8 }}>
            {['לקוח א׳', 'לקוח ב׳'].map((title, i) => (
              <View key={i} style={{ flex: 1, backgroundColor: C.primary, borderRadius: 4, padding: 12 }}>
                <Text style={{ fontSize: 8, color: C.gold, textAlign: 'right', marginBottom: 6 }}>{title}</Text>
                <BlankLine width={120} />
                <Text style={{ fontSize: 8, color: C.goldLight, textAlign: 'right', marginTop: 2 }}>שם מלא</Text>
                <View style={{ marginTop: 6 }}>
                  <BlankLine width={100} />
                  <Text style={{ fontSize: 8, color: C.goldLight, textAlign: 'right', marginTop: 2 }}>ת.ז</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Regulatory text */}
          <GoldBox mt={20}>
            <Text style={{ fontSize: 8, color: C.muted, textAlign: 'right', lineHeight: 1.6 }}>
              משווק השקעות נדרש, על פי חוק הסדרת העיסוק בייעוץ השקעות תשנ״ה-1995, להתאים את השירותים לצרכי הלקוח לאחר בירור מטרות ההשקעה, מצבו הכספי ונסיבותיו הרלוונטיות.
            </Text>
            <Text style={{ fontSize: 8, color: C.muted, textAlign: 'right', lineHeight: 1.6, marginTop: 4 }}>
              ידוע ללקוח כי מענה אמיתי, כן ומלא לשאלון יסייע להתאמה מיטבית. אי מסירת פרטים עלולה לפגוע באיכות השירות.
            </Text>
          </GoldBox>
        </View>

        <View style={{ position: 'absolute', bottom: 30, left: 0, right: 0, alignItems: 'center' }}>
          <Text style={{ fontSize: 9, color: C.muted }}>כל הנתונים נמסרו על ידי הלקוח ובאחריותו</Text>
        </View>
        <PageFooter />
      </Page>

      {/* ═══════════════════ PAGE 2: PERSONAL + FINANCIAL ═══════════════════ */}
      <Page size="A4" style={contentPageStyle}>
        <PageHeader clientName="________________" date={date} docTitle="________________" />
        <PageFooter />

        <SectionTitle>פרטים מזהים</SectionTitle>
        <View style={{ flexDirection: 'row-reverse', gap: 6 }}>
          {['לקוח א׳', 'לקוח ב׳'].map((title, i) => (
            <View key={i} style={{ width: '49%', borderWidth: 0.5, borderColor: C.border, borderRadius: 4, minHeight: 160 }}>
              <View style={{ backgroundColor: C.primary, paddingVertical: 5, paddingHorizontal: 10 }}>
                <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.gold, textAlign: 'right' }}>{title}</Text>
              </View>
              <View style={{ padding: 8 }}>
                {['שם מלא', 'ת.ז.', 'תאריך לידה', 'מצב משפחתי', 'נפשות תלויות', 'טלפון', 'דוא״ל', 'עיסוק'].map((field, j) => (
                  <View key={j} style={{ flexDirection: 'row-reverse', alignItems: 'flex-end', marginBottom: 5 }}>
                    <Text style={{ fontSize: 8, fontWeight: 'bold', color: C.muted, width: 70, textAlign: 'right' }}>{field}</Text>
                    <BlankLine width={80} />
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        <SectionGap />
        <SectionTitle>תמונה כלכלית — התא המשפחתי</SectionTitle>
        <View style={{ flexDirection: 'row-reverse', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {BLANK_SECTORS.map((sec, i) => (
            <BlankSector key={i} title={sec.title} rows={sec.rows} />
          ))}
        </View>

        {/* Balance summary */}
        <View style={{ borderTopWidth: 1, borderTopColor: C.gold, marginTop: 16, marginBottom: 12 }} />
        <View style={{ flexDirection: 'row-reverse', gap: 8 }} wrap={false}>
          {[
            { title: 'סיכום מאזן', rows: ['סך נכסים', 'סך התחייבויות', 'שווי נטו'] },
            { title: 'מאזן חודשי', rows: ['סך הכנסות', 'סך הוצאות', 'מאזן חודשי'] },
          ].map((box, i) => (
            <View key={i} style={{ flex: 1, borderWidth: 1, borderColor: C.gold, borderRadius: 4, overflow: 'hidden' }}>
              <View style={{ backgroundColor: C.primary, paddingVertical: 4, paddingHorizontal: 8 }}>
                <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.gold, textAlign: 'right' }}>{box.title}</Text>
              </View>
              <View style={{ padding: 8 }}>
                {box.rows.map((label, j) => (
                  <View key={j} style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', paddingVertical: 4, borderBottomWidth: 0.5, borderBottomColor: C.border }}>
                    <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.black }}>{label}</Text>
                    <BlankLine width={80} />
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* GREEN portion */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: C.surface, paddingVertical: 5, paddingHorizontal: 10, borderTopWidth: 0.5, borderTopColor: C.gold, marginTop: 4, borderRadius: 3 }}>
          <BlankLine width={80} />
          <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.primary }}>שיעור הנכסים המועבר לטיפול GREEN</Text>
        </View>
      </Page>

      {/* ═══════════════════ PAGE 3: GOALS + LIQUIDITY + EXPERIENCE ═══════════════════ */}
      <Page size="A4" style={contentPageStyle}>
        <PageHeader clientName="________________" date={date} docTitle="________________" />
        <PageFooter />

        <SectionTitle>מטרות השקעה ואופק</SectionTitle>
        <Text style={{ fontSize: 9, color: C.muted, textAlign: 'right', marginBottom: 8 }}>סמן את כל המטרות הרלוונטיות:</Text>
        <View style={{ flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          {['שמירת ערך', 'הכנסה שוטפת', 'צמיחה לטווח ארוך', 'חיסכון לפנסיה', 'חינוך ילדים', 'העברה בין-דורית', 'אחר'].map((goal, i) => (
            <View key={i} style={{ flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 4 }}>
              <View style={{ width: 12, height: 12, borderWidth: 1, borderColor: C.primary, marginLeft: 6 }} />
              <Text style={{ fontSize: 9, color: C.black }}>{goal}</Text>
            </View>
          ))}
        </View>

        <View style={{ flexDirection: 'row-reverse', alignItems: 'flex-end', marginBottom: 16 }}>
          <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.muted, marginLeft: 8 }}>אופק השקעה:</Text>
          {['עד שנתיים', 'שנתיים עד 5', 'שנים 5–10', 'מעל 10 שנים'].map((opt, i) => (
            <View key={i} style={{ flexDirection: 'row-reverse', alignItems: 'center', marginLeft: 12 }}>
              <View style={{ width: 12, height: 12, borderWidth: 1, borderColor: C.primary, marginLeft: 4 }} />
              <Text style={{ fontSize: 8, color: C.black }}>{opt}</Text>
            </View>
          ))}
        </View>

        <SectionGap />
        <SectionTitle>צרכי נזילות</SectionTitle>

        <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 6 }}>
          מתי תצטרך את כל הכסף?
        </Text>
        <View style={{ flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          {['עד שנתיים', 'שנתיים עד 5', 'מעל 5 שנים', 'לא ידוע'].map((opt, i) => (
            <View key={i} style={{ flexDirection: 'row-reverse', alignItems: 'center', marginLeft: 12 }}>
              <View style={{ width: 12, height: 12, borderWidth: 1, borderColor: C.primary, marginLeft: 4 }} />
              <Text style={{ fontSize: 8, color: C.black }}>{opt}</Text>
            </View>
          ))}
        </View>

        <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 6 }}>
          כמה תצטרך ב-3 שנים הקרובות?
        </Text>
        <View style={{ flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {['0%', 'עד 30%', 'עד 50%', 'מעל 50%', 'לא ידוע'].map((opt, i) => (
            <View key={i} style={{ flexDirection: 'row-reverse', alignItems: 'center', marginLeft: 12 }}>
              <View style={{ width: 12, height: 12, borderWidth: 1, borderColor: C.primary, marginLeft: 4 }} />
              <Text style={{ fontSize: 8, color: C.black }}>{opt}</Text>
            </View>
          ))}
        </View>

        <SectionGap />
        <SectionTitle>ניסיון קודם בשוק ההון</SectionTitle>
        <View style={{ flexDirection: 'row-reverse', gap: 20, marginBottom: 8 }}>
          {['כן', 'לא'].map((opt, i) => (
            <View key={i} style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
              <View style={{ width: 12, height: 12, borderWidth: 1, borderColor: C.primary, marginLeft: 6 }} />
              <Text style={{ fontSize: 9, color: C.black }}>{opt}</Text>
            </View>
          ))}
        </View>
        <FieldRow label="פירוט:" wide />
      </Page>

      {/* ═══════════════════ PAGE 4: RISK QUESTIONNAIRE ═══════════════════ */}
      <Page size="A4" style={contentPageStyle}>
        <PageHeader clientName="________________" date={date} docTitle="________________" />
        <PageFooter />

        <SectionTitle>הערכת סיכון — שאלון</SectionTitle>
        <Text style={{ fontSize: 8, color: C.muted, textAlign: 'right', marginBottom: 12 }}>
          סמן תשובה אחת לכל שאלה. הניקוד מחושב אוטומטית בטבלה בעמוד הבא.
        </Text>

        {QUESTIONS.map((q, i) => (
          <QuestionBlock key={i} num={q.num} question={q.question} options={q.options} />
        ))}

        <SectionGap />
        <SectionTitle>טבלת ניקוד וחישוב דרגת סיכון</SectionTitle>

        {/* Risk score table */}
        <View style={{ borderWidth: 0.5, borderColor: C.border, borderRadius: 4, overflow: 'hidden', marginBottom: 12 }}>
          <View style={{ flexDirection: 'row-reverse', backgroundColor: C.primary, paddingVertical: 5, paddingHorizontal: 8 }}>
            <Text style={{ flex: 1, fontSize: 8, fontWeight: 'bold', color: C.goldLight, textAlign: 'right' }}>ממוצע ניקוד</Text>
            <Text style={{ flex: 1, fontSize: 8, fontWeight: 'bold', color: C.goldLight, textAlign: 'right' }}>דרגת סיכון</Text>
            <Text style={{ flex: 1, fontSize: 8, fontWeight: 'bold', color: C.goldLight, textAlign: 'right' }}>שם</Text>
            <Text style={{ flex: 1, fontSize: 8, fontWeight: 'bold', color: C.goldLight, textAlign: 'right' }}>הפסד מקס׳</Text>
            <Text style={{ flex: 1, fontSize: 8, fontWeight: 'bold', color: C.goldLight, textAlign: 'right' }}>מניות מקס׳</Text>
          </View>
          {RISK_TABLE.map((row, i) => (
            <View key={i} style={{ flexDirection: 'row-reverse', paddingVertical: 5, paddingHorizontal: 8, backgroundColor: i % 2 === 0 ? C.surface : C.white, borderTopWidth: 0.5, borderTopColor: C.border }}>
              <Text style={{ flex: 1, fontSize: 8, textAlign: 'right', color: C.black }}>{row.range}</Text>
              <Text style={{ flex: 1, fontSize: 8, textAlign: 'right', fontWeight: 'bold', color: C.primary }}>{row.level}</Text>
              <Text style={{ flex: 1, fontSize: 8, textAlign: 'right', color: C.black }}>{row.name}</Text>
              <Text style={{ flex: 1, fontSize: 8, textAlign: 'right', color: C.black }}>{row.maxLoss}</Text>
              <Text style={{ flex: 1, fontSize: 8, textAlign: 'right', color: C.black }}>{row.maxStocks}</Text>
            </View>
          ))}
        </View>

        {/* Manual calculation */}
        <View style={{ backgroundColor: C.cream, borderWidth: 1, borderColor: C.gold, borderRadius: 4, padding: 12 }} wrap={false}>
          <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 10 }}>
            חישוב ידני
          </Text>
          <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-around', marginBottom: 10 }}>
            {['שאלה 1', 'שאלה 2', 'שאלה 3', 'שאלה 4'].map((q, i) => (
              <View key={i} style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 8, color: C.muted, marginBottom: 4 }}>{q}</Text>
                <View style={{ width: 40, height: 24, borderWidth: 1, borderColor: C.primary, borderRadius: 3 }} />
              </View>
            ))}
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 8, color: C.muted, marginBottom: 4 }}>ממוצע</Text>
              <View style={{ width: 50, height: 24, borderWidth: 1.5, borderColor: C.gold, borderRadius: 3, backgroundColor: C.white }} />
            </View>
          </View>
          <View style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, marginLeft: 8 }}>דרגת סיכון מחושבת:</Text>
            <View style={{ width: 60, height: 28, borderWidth: 1.5, borderColor: C.primary, borderRadius: 3, backgroundColor: C.white }} />
          </View>
        </View>
      </Page>

      {/* ═══════════════════ PAGE 5: ADVISOR SUMMARY ═══════════════════ */}
      <Page size="A4" style={contentPageStyle}>
        <PageHeader clientName="________________" date={date} docTitle="________________" />
        <PageFooter />

        <SectionTitle>סיכום והמלצת בעל הרישיון</SectionTitle>

        <View style={{ borderWidth: 0.5, borderColor: C.gold, borderRadius: 4, padding: 10, marginBottom: 10, backgroundColor: C.cream, minHeight: 80 }}>
          <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 6 }}>סיכום וניתוח</Text>
          <View style={{ borderBottomWidth: 1, borderBottomColor: C.border, marginBottom: 8 }} />
          <View style={{ borderBottomWidth: 1, borderBottomColor: C.border, marginBottom: 8 }} />
          <View style={{ borderBottomWidth: 1, borderBottomColor: C.border }} />
        </View>

        <View style={{ borderWidth: 0.5, borderColor: C.gold, borderRadius: 4, padding: 10, marginBottom: 10, backgroundColor: C.cream, minHeight: 60 }}>
          <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 6 }}>העדפות / הגבלות לקוח</Text>
          <View style={{ borderBottomWidth: 1, borderBottomColor: C.border, marginBottom: 8 }} />
          <View style={{ borderBottomWidth: 1, borderBottomColor: C.border }} />
        </View>

        {/* Policy cubes */}
        <View style={{ flexDirection: 'row-reverse', justifyContent: 'center', marginTop: 6, marginBottom: 12 }} wrap={false}>
          {[
            { label: 'אחוז מניות מקס׳', suffix: '%' },
            { label: 'אג״ח קונצרני', options: 'עד 50% / עד 100%' },
            { label: 'מט״ח', options: 'כן / לא' },
            { label: 'אג״ח דירוג נמוך', options: 'כן / לא' },
          ].map((cube, i) => (
            <View key={i} style={{ width: '23%', backgroundColor: C.cream, borderWidth: 1, borderColor: C.gold, borderRadius: 4, padding: 6, alignItems: 'center', marginHorizontal: '1%' }}>
              <Text style={{ fontSize: 7, color: C.muted, textAlign: 'center', marginBottom: 4 }}>{cube.label}</Text>
              {cube.options
                ? <Text style={{ fontSize: 8, color: C.muted, textAlign: 'center' }}>{cube.options}</Text>
                : <BlankLine width={40} />
              }
            </View>
          ))}
        </View>

        {/* Final risk level */}
        <View style={{ backgroundColor: C.cream, borderWidth: 1, borderColor: C.gold, borderRadius: 4, padding: 10, marginBottom: 12 }} wrap={false}>
          <View style={{ flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontSize: 12, fontWeight: 'bold', color: C.primary, marginLeft: 8 }}>דרגת סיכון סופית:</Text>
            <View style={{ width: 40, height: 28, borderWidth: 1.5, borderColor: C.primary, borderRadius: 3, backgroundColor: C.white, marginLeft: 8 }} />
            <Text style={{ fontSize: 11, color: C.primary }}>—</Text>
            <View style={{ width: 80, height: 28, borderWidth: 1.5, borderColor: C.primary, borderRadius: 3, backgroundColor: C.white, marginRight: 8 }} />
          </View>
          <RiskGauge level={0} />
          <Text style={{ fontSize: 8, color: C.muted, textAlign: 'center', marginTop: 4 }}>* סמן את הדרגה הנבחרת</Text>
        </View>

        <View style={{ borderWidth: 0.5, borderColor: C.gold, borderRadius: 4, padding: 10, backgroundColor: C.cream, minHeight: 60 }}>
          <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 6 }}>נימוק מקצועי</Text>
          <View style={{ borderBottomWidth: 1, borderBottomColor: C.border, marginBottom: 8 }} />
          <View style={{ borderBottomWidth: 1, borderBottomColor: C.border }} />
        </View>
      </Page>

      {/* ═══════════════════ PAGE 6: DECLARATIONS & SIGNATURES ═══════════════════ */}
      <Page size="A4" style={contentPageStyle}>
        <PageHeader clientName="________________" date={date} docTitle="________________" />
        <PageFooter />

        <View wrap={false}>
          <SectionGap />
          <SectionTitle>הצהרות וחתימות</SectionTitle>

          <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 6 }}>הצהרת הלקוח</Text>
          <Text style={{ fontSize: 9, textAlign: 'right', lineHeight: 1.5, marginBottom: 16, color: C.black }}>
            אני הח"מ _______________ מצהיר בזאת כי המידע המופיע לעיל הינו המידע אותו מסרתי לידיעתו של משווק ההשקעות. כמו כן, הוסבר לי כי מענה אמיתי, כן ומלא לשאלון יסייע למשווק ההשקעות להתאים בצורה המיטבית את אופי תיק ההשקעות לצרכיי הספציפיים. בחתימתי זו מאשר הח"מ כי מדיניות ההשקעה ואופן ניהול תיק ההשקעות הוסברו לח"מ ונקבעו בשיתוף פעולה עם הח"מ. אני מאשר בזאת כי קיבלתי עותק של מסמך זה.
          </Text>

          <View style={{ flexDirection: 'row-reverse', marginTop: 4 }}>
            <View style={{ flex: 1, marginLeft: 6 }}>
              <SignatureLine label="חתימת לקוח א׳:" />
              <DateLine date="___/___/______" />
            </View>
            <View style={{ flex: 1, marginRight: 6 }}>
              <SignatureLine label="חתימת לקוח ב׳:" />
              <DateLine date="___/___/______" />
            </View>
          </View>
        </View>

        {/* Refusals */}
        <View style={{ borderWidth: 1, borderColor: C.gold, borderRadius: 4, padding: 12, marginTop: 20 }} wrap={false}>
          <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 6 }}>הלקוח סירב להשיב על:</Text>
          {[1, 2, 3].map(i => (
            <View key={i} style={{ flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 6 }}>
              <View style={{ width: 12, height: 12, borderWidth: 1, borderColor: C.primary, marginLeft: 6 }} />
              <BlankLine width={200} />
            </View>
          ))}
          <Text style={{ fontSize: 8, color: C.muted, textAlign: 'right', marginTop: 4 }}>
            הובהר ללקוח כי אי מסירת המידע עלולה לפגוע באיכות ההמלצה.
          </Text>
          <SignatureLine label="חתימה על הסירובים:" />
          <DateLine date="___/___/______" />
        </View>

        {/* Advisor confirmation */}
        <View style={{ marginTop: 20, borderTopWidth: 0.5, borderTopColor: C.primary, paddingTop: 12 }}>
          <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 6 }}>אישור בעל הרישיון</Text>
          <Text style={{ fontSize: 9, textAlign: 'right', lineHeight: 1.5, marginBottom: 10, color: C.black }}>
            אני הח"מ _______________ בעל רישיון שיווק השקעות שמספרו _______________ מטעם גרין סוכנות לביטוח פנסיוני ושיווק השקעות (2024) בע"מ, מאשר כי ביררתי עם הלקוח את הפרטים הנדרשים, הלקוח חתם בפני בכל המקומות הנדרשים, והוסברו לו השלכות אי מסירת מלוא המידע הרלוונטי לצורך התאמת השירות לצרכיו הייחודיים של הלקוח.
          </Text>
          <SignatureLine label="חתימת בעל הרישיון:" />
          <DateLine date="___/___/______" />
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
