import React from 'react'
import { Document, Page, Text, View, Image, Font, pdf } from '@react-pdf/renderer'
import { logoPng } from '../../assets/logoBase64'

// ── Font (same registration as PDFTemplate) ───────────────────
Font.register({
  family: 'Assistant',
  fonts: [
    { src: '/fonts/Assistant-Regular.ttf', fontWeight: 'normal' },
    { src: '/fonts/Assistant-Bold.ttf', fontWeight: 'bold' },
  ],
})
Font.registerHyphenationCallback((word) => [word])

// ── Colors ────────────────────────────────────────────────────
const C = {
  primary: '#1B3A2F',
  black: '#1A1A1A',
  muted: '#5A5A5A',
  line: '#CCCCCC',
  bg: '#F8F8F8',
  gold: '#B8975A',
  white: '#FFFFFF',
}

// ── Regulatory Texts ──────────────────────────────────────────
const REG_TEXTS = [
  'משווק השקעות נדרש, על פי חוק הסדרת העיסוק בייעוץ השקעות, בשיווק השקעות ובניהול תיקי השקעות תשנ״ה-1995 (להלן: "החוק"), להתאים, ככל האפשר, את השירותים שמשווק ההשקעות נותן ללקוח לצרכיו ולהנחיותיו של הלקוח וזאת לאחר שמשווק ההשקעות בירר עם הלקוח את מטרות ההשקעה, את מצבו הכספי לרבות ניירות הערך והנכסים הפיננסיים של הלקוח, ואת שאר הנסיבות הרלוונטיות לעניין זה.',
  'ידוע ללקוח כי מענה אמיתי, כן ומלא לשאלון שלהלן יסייע למשווק ההשקעות להתאים בצורה המיטבית האפשרית את אופי השקעותיו לצרכיו המיוחדים של הלקוח. אי מסירת פרטים או מסירת פרטים חלקית עלולה לפגוע ביכולתו של משווק ההשקעות להתאים את השירות שיינתן לצרכי הלקוח.',
  'ידוע ללקוח כי קיימת חשיבות לעדכן את משווק ההשקעות בכל שינוי שיחול ביחס לפרטים שמסר במסגרת מסמך זה. משווק ההשקעות הבהיר ללקוח כי כל פרט שהלקוח מוסר למשווק ההשקעות ישמר בסודיות על ידי משווק ההשקעות אך סודיות זו כפופה לחובת משווק ההשקעות למסור ידיעות על פי כל דין.',
  'הלקוח מצהיר כי הוא מודע לכך שהשקעות בשוק ההון כרוכות בסיכון, וכי אין בתשואות עבר כדי להבטיח תשואות עתידיות.',
]

// ── Page style ────────────────────────────────────────────────
const pageStyle = {
  fontFamily: 'Assistant',
  direction: 'rtl',
  paddingTop: 30,
  paddingBottom: 36,
  paddingHorizontal: 36,
  fontSize: 11,
  color: C.black,
}

// ══════════════════════════════════════════════════════════════
//  LOCAL COMPONENTS
// ══════════════════════════════════════════════════════════════

const SecTitle = ({ children }) => (
  <Text style={{
    fontSize: 12, fontWeight: 'bold', color: C.primary,
    textAlign: 'right', borderBottomWidth: 1.5,
    borderBottomColor: C.primary, paddingBottom: 4,
    marginBottom: 14, marginTop: 18,
  }}>{children}</Text>
)

const Field = ({ label, width = 160 }) => (
  <View style={{ flexDirection: 'row-reverse', alignItems: 'flex-end', marginBottom: 12 }}>
    <Text style={{ fontSize: 10, color: C.muted, marginLeft: 8, minWidth: 90, textAlign: 'right' }}>{label}</Text>
    <View style={{ width, borderBottomWidth: 1, borderBottomColor: C.black, height: 18 }} />
  </View>
)

const FieldRow2 = ({ right, left }) => (
  <View style={{ flexDirection: 'row-reverse', marginBottom: 12 }}>
    <View style={{ flex: 1, marginLeft: 12 }}><Field label={right} width={140} /></View>
    <View style={{ flex: 1 }}><Field label={left} width={140} /></View>
  </View>
)

const Check = ({ label, score }) => (
  <View style={{ flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 9 }}>
    <View style={{ width: 13, height: 13, borderWidth: 1.5, borderColor: C.black, marginLeft: 8 }} />
    <Text style={{ fontSize: 10, color: C.black, flex: 1, textAlign: 'right' }}>{label}</Text>
    {score !== undefined && (
      <Text style={{ fontSize: 9, color: C.muted, marginRight: 6 }}>({score} נק׳)</Text>
    )}
  </View>
)

const WriteLines = ({ count = 3 }) => (
  <View>
    {Array.from({ length: count }).map((_, i) => (
      <View key={i} style={{ borderBottomWidth: 1, borderBottomColor: C.line, height: 24, marginBottom: 6 }} />
    ))}
  </View>
)

const TR = ({ cells, isHeader }) => (
  <View style={{
    flexDirection: 'row-reverse',
    borderBottomWidth: 0.5, borderBottomColor: C.line,
    paddingVertical: 6, paddingHorizontal: 4,
    backgroundColor: isHeader ? C.white : undefined,
  }}>
    {cells.map((cell, i) => (
      <Text key={i} style={{
        flex: i === 2 ? 2 : 1, fontSize: isHeader ? 9 : 10,
        fontWeight: isHeader ? 'bold' : 'normal',
        color: C.black, textAlign: 'right',
      }}>{cell}</Text>
    ))}
  </View>
)

const BlankField = ({ width = 80 }) => (
  <View style={{ borderBottomWidth: 1, borderBottomColor: C.black, width, height: 16, marginVertical: 2 }} />
)

const Sep = () => (
  <View style={{ borderTopWidth: 1, borderTopColor: C.line, marginVertical: 14 }} />
)

const PageNum = () => (
  <Text
    style={{ position: 'absolute', bottom: 14, left: 0, right: 0, textAlign: 'center', fontSize: 7, color: C.muted }}
    render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
    fixed
  />
)

const SimpleHeader = () => (
  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: C.gold }}>
    <Image src={logoPng} style={{ height: 30 }} />
    <View style={{ flex: 1, alignItems: 'flex-end' }}>
      <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary }}>GREEN Wealth Management</Text>
    </View>
  </View>
)

// ══════════════════════════════════════════════════════════════
//  DOCUMENT
// ══════════════════════════════════════════════════════════════

const BlankDocument = () => (
  <Document>

    {/* ═══════════════════ PAGE 1: COVER ═══════════════════ */}
    <Page size="A4" style={pageStyle}>
      <SimpleHeader />
      <PageNum />

      <View style={{ alignItems: 'center', marginTop: 6, marginBottom: 4 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: C.primary }}>אפיון צרכים והתאמת מדיניות השקעה</Text>
        <Text style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>טופס למילוי ידני</Text>
      </View>

      <SecTitle>פרטי המשווק</SecTitle>
      <FieldRow2 right="שם המשווק:" left="מספר רישיון:" />
      <FieldRow2 right="ת.ז:" left="תאריך פגישה:" />

      <SecTitle>פרטי לקוח א׳</SecTitle>
      <FieldRow2 right="שם מלא:" left="ת.ז:" />
      <FieldRow2 right="תאריך לידה:" left="מצב משפחתי:" />
      <FieldRow2 right="טלפון:" left="דוא״ל:" />
      <FieldRow2 right="עיסוק:" left="נפשות תלויות:" />

      <SecTitle>פרטי לקוח ב׳ (אם רלוונטי)</SecTitle>
      <FieldRow2 right="שם מלא:" left="ת.ז:" />
      <FieldRow2 right="תאריך לידה:" left="מצב משפחתי:" />
      <FieldRow2 right="טלפון:" left="דוא״ל:" />
      <FieldRow2 right="עיסוק:" left="נפשות תלויות:" />

      {/* Regulatory box */}
      <View style={{ borderWidth: 1, borderColor: C.primary, borderRadius: 4, padding: 10, marginTop: 14 }}>
        {REG_TEXTS.map((txt, i) => (
          <Text key={i} style={{ fontSize: 8.5, textAlign: 'right', lineHeight: 1.6, color: C.black, marginTop: i > 0 ? 4 : 0 }}>{txt}</Text>
        ))}
      </View>
    </Page>

    {/* ═══════════════════ PAGE 2: FINANCIAL ═══════════════════ */}
    <Page size="A4" style={pageStyle}>
      <SimpleHeader />
      <PageNum />

      <SecTitle>תמונה כלכלית — התא המשפחתי</SecTitle>

      {/* Financial table */}
      <TR cells={['סקטור', 'סה״כ (₪)', 'פירוט עיקרי']} isHeader />
      {[
        'הכנסות חודשיות',
        'עו״ש, מזומן ופקדונות',
        'ני״ע בארץ ובחו״ל',
        'חיסכון, גמל והשתלמות',
        'פנסיה וביטוח מנהלים',
        'נדל״ן',
        'אחר (עסק, שותפות)',
        'התחייבויות (יתרה כוללת)',
        'הוצאות חודשיות שוטפות',
      ].map((label, i) => (
        <View key={i} style={{
          flexDirection: 'row-reverse',
          borderBottomWidth: 0.5, borderBottomColor: C.line,
          paddingVertical: 8, paddingHorizontal: 4,
          backgroundColor: i % 2 === 0 ? C.bg : C.white,
        }}>
          <Text style={{ flex: 1, fontSize: 10, color: C.black, textAlign: 'right', fontWeight: 'bold' }}>{label}</Text>
          <View style={{ flex: 1, justifyContent: 'flex-end' }}><BlankField width={80} /></View>
          <View style={{ flex: 2, justifyContent: 'flex-end' }}><BlankField width={160} /></View>
        </View>
      ))}

      <Sep />

      {/* Two summary boxes side-by-side */}
      <View style={{ flexDirection: 'row-reverse', marginBottom: 12 }}>
        <View style={{ flex: 1, borderWidth: 1, borderColor: C.black, borderRadius: 4, padding: 8, marginLeft: 6 }}>
          <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 6 }}>סיכום מאזן</Text>
          <Field label="סך נכסים:" width={120} />
          <Field label="סך התחייבויות:" width={120} />
          <Field label="שווי נטו:" width={120} />
        </View>
        <View style={{ flex: 1, borderWidth: 1, borderColor: C.black, borderRadius: 4, padding: 8, marginRight: 6 }}>
          <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 6 }}>מאזן חודשי</Text>
          <Field label="סך הכנסות:" width={120} />
          <Field label="סך הוצאות:" width={120} />
          <Field label="מאזן חודשי:" width={120} />
        </View>
      </View>

      {/* Managed portion */}
      <View style={{ flexDirection: 'row-reverse', alignItems: 'center', marginTop: 4 }}>
        <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginLeft: 12 }}>שיעור הנכסים המועבר לטיפול GREEN:</Text>
        <Check label="עד 35%" />
        <View style={{ width: 16 }} />
        <Check label="35%-70%" />
        <View style={{ width: 16 }} />
        <Check label="מעל 70%" />
      </View>
    </Page>

    {/* ═══════════════════ PAGE 3: GOALS + LIQUIDITY + EXPERIENCE ═══════════════════ */}
    <Page size="A4" style={pageStyle}>
      <SimpleHeader />
      <PageNum />

      <SecTitle>מטרות השקעה</SecTitle>
      <Text style={{ fontSize: 10, color: C.muted, textAlign: 'right', marginBottom: 8 }}>סמן את כל המטרות הרלוונטיות:</Text>
      <Check label="שמירת ערך" />
      <Check label="הכנסה שוטפת" />
      <Check label="צמיחה לטווח ארוך" />
      <Check label="חיסכון לפנסיה" />
      <Check label="חינוך ילדים" />
      <Check label="העברה בין-דורית" />
      <Field label="אחר — פרט:" width={200} />

      <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginTop: 10, marginBottom: 8 }}>אופק השקעה:</Text>
      <View style={{ flexDirection: 'row-reverse', flexWrap: 'wrap' }}>
        <View style={{ width: '25%' }}><Check label="עד שנתיים" /></View>
        <View style={{ width: '25%' }}><Check label="שנתיים עד 5" /></View>
        <View style={{ width: '25%' }}><Check label="5–10 שנים" /></View>
        <View style={{ width: '25%' }}><Check label="מעל 10 שנים" /></View>
      </View>

      <SecTitle>צרכי נזילות</SecTitle>

      <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 6 }}>18. מתי תזדקק לכל הכסף שהשקעת? [שאלת חובה]</Text>
      <Check label="א. בשנתיים הקרובות" />
      <Check label="ב. בין 2-5 שנים" />
      <Check label="ג. למעלה מ-5 שנים" />

      <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginTop: 10, marginBottom: 6 }}>19. לאיזה חלק מתיק ההשקעות תזדקק במהלך 3 השנים הקרובות? [שאלת חובה]</Text>
      <Check label="א. 0% מהתיק" />
      <Check label="ב. עד 30% מהתיק" />
      <Check label="ג. עד 50% מהתיק" />
      <Check label="ד. יותר מ-50% מהתיק" />

      <SecTitle>ניסיון קודם בשוק ההון</SecTitle>
      <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 6 }}>23. האם נעזרת בעבר בשירותי מנהל/יועץ השקעות?</Text>
      <View style={{ flexDirection: 'row-reverse' }}>
        <View style={{ marginLeft: 24 }}><Check label="כן" /></View>
        <Check label="לא" />
      </View>
      <Field label="אם כן, פרט:" width={260} />

      {/* Risk-return explanation */}
      <View style={{ borderWidth: 1, borderColor: C.line, borderRadius: 4, padding: 10, marginTop: 10 }}>
        <Text style={{ fontSize: 9, color: C.muted, textAlign: 'right', lineHeight: 1.5, fontWeight: 'bold' }}>
          בעל הרישיון יסביר ללקוח את הקשר שבין סיכון לתשואה בתיק ההשקעות ובכלל זה יבהיר כי ככל שרמת הסיכון גבוהה יותר, כך גדל הסיכוי לתשואה גבוהה, אך במקביל גם קיים סיכון להפסד גבוה יותר לרבות אובדן חלק מהקרן.
        </Text>
      </View>
    </Page>

    {/* ═══════════════════ PAGE 4: RISK QUESTIONNAIRE ═══════════════════ */}
    <Page size="A4" style={pageStyle}>
      <SimpleHeader />
      <PageNum />

      <SecTitle>הערכת סיכון — שאלון</SecTitle>
      <Text style={{ fontSize: 10, color: C.muted, textAlign: 'right', marginBottom: 10 }}>סמן תשובה אחת לכל שאלה.</Text>

      {/* Q1 */}
      <View style={{ marginBottom: 14 }} wrap={false}>
        <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 6 }}>
          20. אם שווי התיק שלך היה נופל ב-10% או יותר תוך זמן קצר, איך היית מגיב? [שאלת חובה]
        </Text>
        <Check label='א. אמכור מיד את כל אחזקותי. יהיה לי קשה להתמודד עם ההפסד.' score={1} />
        <Check label='ב. אמכור חלק מהשקעה כדי לצמצם את הסיכון.' score={2} />
        <Check label='ג. זה יקטין את נכסי, אך לא הפסד בעייתי בעיני.' score={3} />
        <Check label='ד. בהשקעות לפעמים מפסידים ולפעמים מרוויחים, אין לי בעיה עם הפסד כזה.' score={5} />
      </View>

      {/* Q2 */}
      <View style={{ marginBottom: 14 }} wrap={false}>
        <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 6 }}>
          21. מהי רמת הסיכון שאתה מוכן לקחת כדי להשיג את יעדיך?
        </Text>
        <Check label='א. מוכן לקחת סיכון מוגבל, קטן ככל האפשר.' score={1} />
        <Check label='ב. מוכן לקחת סיכון מסוים, אך לא גבוה.' score={3} />
        <Check label='ג. מוכן לקחת סיכון גבוה עם סיכוי לרווח ניכר.' score={5} />
      </View>

      {/* Q3 */}
      <View style={{ marginBottom: 14 }} wrap={false}>
        <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 6 }}>
          22. כאשר השווקים הפיננסיים יורדים, מה סביר לצפות מתיק ההשקעות שלי?
        </Text>
        <Check label='א. שווי התיק עלול להיפגע, אך לא במידה ניכרת.' score={1} />
        <Check label='ב. כשהשווקים יורדים גם שווי התיק יגלם את הירידות.' score={3} />
        <Check label='ג. בתיק עם סיכונים צריך לצפות לירידות שווי, לעיתים אף משמעותיות.' score={5} />
      </View>

      {/* Q4 */}
      <View style={{ marginBottom: 14 }} wrap={false}>
        <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 6 }}>
          אסימטריה — מהי התשואה המקסימלית שאתה מצפה לה ומהו ההפסד המקסימלי שאתה מוכן לספוג?
        </Text>
        <Check label='א. סיכוי עד 6%, סיכון עד 5%.' score={1} />
        <Check label='ב. סיכוי עד 14%, סיכון עד 10%.' score={2} />
        <Check label='ג. סיכוי עד 20%, סיכון עד 15%.' score={3} />
        <Check label='ד. סיכוי מעל 20%, סיכון מעל 15%.' score={5} />
      </View>

      <Sep />

      {/* Refusal clause */}
      <SecTitle>פסקת סירוב</SecTitle>
      <View style={{ borderWidth: 1, borderColor: C.black, borderRadius: 4, padding: 10 }}>
        <View style={{ flexDirection: 'row-reverse', alignItems: 'flex-end', marginBottom: 8 }}>
          <Text style={{ fontSize: 10, color: C.black, textAlign: 'right', marginLeft: 8 }}>הלקוח סירב להשיב על שאלה/ות מס׳:</Text>
          <BlankField width={250} />
        </View>
        <View style={{ flexDirection: 'row-reverse', alignItems: 'flex-end', marginBottom: 8 }}>
          <Text style={{ fontSize: 10, color: C.black, textAlign: 'right', marginLeft: 8 }}>שאלה/ות מס׳</Text>
          <BlankField width={100} />
          <Text style={{ fontSize: 10, color: C.black, textAlign: 'right', marginHorizontal: 8 }}>אינן רלוונטיות עבור הלקוח.</Text>
        </View>
        <Text style={{ fontSize: 9, color: C.muted, textAlign: 'right', marginTop: 4 }}>
          הובהר ללקוח כי אי מסירת המידע עלולה לפגוע באיכות ההמלצה.
        </Text>
      </View>

      <Sep />

      {/* Scoring table */}
      <SecTitle>טבלת ניקוד וחישוב דרגת סיכון</SecTitle>
      <TR cells={['ממוצע ניקוד', 'דרגה', 'שם', 'הפסד מקס׳', 'מניות מקס׳']} isHeader />
      {[
        ['פחות מ-2', '1', 'שמרן', 'עד 5%', '0%'],
        ['2 עד 3', '2', 'שמרן-מתון', 'עד 10%', 'עד 15%'],
        ['3 עד 3.8', '3', 'מאוזן', 'עד 15%', 'עד 25%'],
        ['3.8 עד 4.5', '4', 'צמיחה', 'מעל 15%', 'עד 35%'],
        ['4.5 ומעלה', '5', 'אגרסיבי', 'משמעותי', 'עד 100%'],
      ].map((row, i) => (
        <View key={i} style={{
          flexDirection: 'row-reverse', borderBottomWidth: 0.5, borderBottomColor: C.line,
          paddingVertical: 5, paddingHorizontal: 4, backgroundColor: i % 2 === 0 ? C.bg : C.white,
        }}>
          {row.map((cell, j) => (
            <Text key={j} style={{ flex: 1, fontSize: 9, color: C.black, textAlign: 'right' }}>{cell}</Text>
          ))}
        </View>
      ))}

      {/* Manual calculation */}
      <View style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', marginTop: 14 }}>
        {['שאלה 1', 'שאלה 2', 'שאלה 3', 'שאלה 4'].map((q, i) => (
          <View key={i} style={{ alignItems: 'center', marginHorizontal: 6 }}>
            <Text style={{ fontSize: 8, color: C.muted, marginBottom: 2 }}>{q}</Text>
            <View style={{ width: 28, height: 28, borderWidth: 1.5, borderColor: C.black }} />
          </View>
        ))}
        <Text style={{ fontSize: 12, color: C.black, marginHorizontal: 6 }}>=</Text>
        <View style={{ alignItems: 'center', marginHorizontal: 6 }}>
          <Text style={{ fontSize: 8, color: C.muted, marginBottom: 2 }}>ממוצע</Text>
          <View style={{ width: 36, height: 36, borderWidth: 2, borderColor: C.primary }} />
        </View>
      </View>
      <View style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', marginTop: 8 }}>
        <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, marginLeft: 8 }}>דרגת סיכון מחושבת:</Text>
        <View style={{ width: 40, height: 40, borderWidth: 2, borderColor: C.primary }} />
      </View>
    </Page>

    {/* ═══════════════════ PAGE 5: ADVISOR SUMMARY ═══════════════════ */}
    <Page size="A4" style={pageStyle}>
      <SimpleHeader />
      <PageNum />

      <SecTitle>סיכום והמלצת בעל הרישיון</SecTitle>

      <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 6 }}>24. סיכום וניתוח המידע שהתקבל מהלקוח:</Text>
      <WriteLines count={5} />

      <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginTop: 12, marginBottom: 6 }}>25. העדפות / הגבלות השקעה לקוח:</Text>
      <WriteLines count={3} />

      <Sep />

      <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 10 }}>26. המלצת בעל הרישיון למדיניות השקעה:</Text>

      {/* 4 Policy boxes */}
      <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 12 }}>
        {/* Max equity */}
        <View style={{ width: '23%', borderWidth: 1, borderColor: C.black, borderRadius: 4, padding: 6, alignItems: 'center' }}>
          <Text style={{ fontSize: 8, color: C.muted, marginBottom: 4 }}>אחוז מניות מקס׳</Text>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 10, color: C.black }}>%</Text>
            <BlankField width={40} />
          </View>
        </View>
        {/* Corp bonds */}
        <View style={{ width: '23%', borderWidth: 1, borderColor: C.black, borderRadius: 4, padding: 6, alignItems: 'center' }}>
          <Text style={{ fontSize: 8, color: C.muted, marginBottom: 4 }}>אג״ח קונצרני</Text>
          <View style={{ flexDirection: 'row-reverse' }}>
            <Check label="עד 50%" />
          </View>
          <View style={{ flexDirection: 'row-reverse' }}>
            <Check label="עד 100%" />
          </View>
        </View>
        {/* Forex */}
        <View style={{ width: '23%', borderWidth: 1, borderColor: C.black, borderRadius: 4, padding: 6, alignItems: 'center' }}>
          <Text style={{ fontSize: 8, color: C.muted, marginBottom: 4 }}>מט״ח</Text>
          <View style={{ flexDirection: 'row-reverse' }}>
            <View style={{ marginLeft: 12 }}><Check label="כן" /></View>
            <Check label="לא" />
          </View>
        </View>
        {/* Low rated bonds */}
        <View style={{ width: '23%', borderWidth: 1, borderColor: C.black, borderRadius: 4, padding: 6, alignItems: 'center' }}>
          <Text style={{ fontSize: 8, color: C.muted, marginBottom: 4 }}>אג״ח דירוג נמוך</Text>
          <View style={{ flexDirection: 'row-reverse' }}>
            <View style={{ marginLeft: 12 }}><Check label="כן" /></View>
            <Check label="לא" />
          </View>
        </View>
      </View>

      <Sep />

      {/* Final risk level */}
      <View style={{ flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 10 }}>
        <Text style={{ fontSize: 11, fontWeight: 'bold', color: C.primary, marginLeft: 8 }}>דרגת סיכון סופית:</Text>
        <View style={{ width: 36, height: 36, borderWidth: 2, borderColor: C.primary, marginLeft: 8 }} />
        <Text style={{ fontSize: 11, color: C.black, marginLeft: 8 }}>—</Text>
        <BlankField width={120} />
      </View>

      {/* 5 circles */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 8 }}>
        {[
          { n: 1, label: 'שמרן' },
          { n: 2, label: 'שמרן-מתון' },
          { n: 3, label: 'מאוזן' },
          { n: 4, label: 'צמיחה' },
          { n: 5, label: 'אגרסיבי' },
        ].map(({ n, label }) => (
          <View key={n} style={{ alignItems: 'center', marginHorizontal: 10 }}>
            <View style={{
              width: 26, height: 26, borderRadius: 13,
              borderWidth: 1.5, borderColor: C.black,
              justifyContent: 'center', alignItems: 'center',
            }}>
              <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.black }}>{n}</Text>
            </View>
            <Text style={{ fontSize: 7, color: C.muted, marginTop: 2 }}>{label}</Text>
          </View>
        ))}
      </View>
      <Text style={{ fontSize: 8, color: C.muted, textAlign: 'center', marginBottom: 10 }}>* עגל את הדרגה הנבחרת</Text>

      <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 6 }}>נימוק מקצועי:</Text>
      <WriteLines count={3} />
    </Page>

    {/* ═══════════════════ PAGE 6: SIGNATURES ═══════════════════ */}
    <Page size="A4" style={pageStyle}>
      <SimpleHeader />
      <PageNum />

      <SecTitle>הצהרות וחתימות</SecTitle>

      {/* Client declaration */}
      <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 6 }}>הצהרת הלקוח</Text>
      <Text style={{ fontSize: 9, textAlign: 'right', lineHeight: 1.5, marginBottom: 12, color: C.black }}>
        {'אני הח"מ _______________ מצהיר בזאת כי המידע המופיע לעיל, הינו המידע אותו מסרתי לידיעתו של משווק ההשקעות. כמו כן, הוסבר לי כי מענה אמיתי, כן ומלא לשאלון יסייע למשווק ההשקעות להתאים בצורה המיטבית את אופי תיק ההשקעות לצרכיי הספציפיים וכן כי אי מסירת פרטים או מסירת פרטים חלקיים עלולה לפגוע ביכולתו של משווק ההשקעות להתאים את השירות שיינתן לח"מ. כמו כן, כל מידע אחר אשר נתבקשתי למסור לידיעת משווק ההשקעות אולם נמנעתי מלמסרו, הינו מידע אשר אין ברצוני שישמש את משווק ההשקעות במסגרת פעילותו ואני מוותר בזאת על כל טענה ו/או תביעה ו/או זכות כלשהי אודות שימוש שלא ייעשה במידע זה. בחתימתי זו מאשר הח"מ כי מדיניות ההשקעה ואופן ניהול תיק ההשקעות הוסברו לח"מ ונקבעו בשיתוף פעולה עם הח"מ. אני מאשר בזאת כי קיבלתי העתק בכתב/בדוא״ל של מסמך זה.'}
      </Text>

      {/* Two signature columns */}
      <View style={{ flexDirection: 'row-reverse', marginBottom: 16 }}>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={{ fontSize: 10, color: C.black, textAlign: 'right' }}>חתימת לקוח א׳: X _______________</Text>
          <Text style={{ fontSize: 10, color: C.black, textAlign: 'right', marginTop: 6 }}>תאריך: ___/___/______</Text>
        </View>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={{ fontSize: 10, color: C.black, textAlign: 'right' }}>חתימת לקוח ב׳: X _______________</Text>
          <Text style={{ fontSize: 10, color: C.black, textAlign: 'right', marginTop: 6 }}>תאריך: ___/___/______</Text>
        </View>
      </View>

      <Sep />

      {/* Refusals block */}
      <View style={{ borderWidth: 1, borderColor: C.black, borderRadius: 4, padding: 10, marginBottom: 16 }}>
        <View style={{ flexDirection: 'row-reverse', alignItems: 'flex-end', marginBottom: 8 }}>
          <Text style={{ fontSize: 10, color: C.black, marginLeft: 8 }}>הלקוח סירב להשיב על שאלה/ות מס׳:</Text>
          <BlankField width={200} />
        </View>
        <View style={{ flexDirection: 'row-reverse', alignItems: 'flex-end', marginBottom: 8 }}>
          <Text style={{ fontSize: 10, color: C.black, marginLeft: 8 }}>שאלה/ות מס׳</Text>
          <BlankField width={100} />
          <Text style={{ fontSize: 10, color: C.black, marginHorizontal: 8 }}>אינן רלוונטיות עבור הלקוח.</Text>
        </View>
        <Text style={{ fontSize: 9, color: C.muted, textAlign: 'right', marginTop: 4 }}>
          הובהר ללקוח כי אי מסירת המידע עלולה לפגוע באיכות ההמלצה.
        </Text>
        <Text style={{ fontSize: 10, color: C.black, textAlign: 'right', marginTop: 8 }}>חתימה על הסירובים: X _______________     תאריך: ___/___/______</Text>
      </View>

      <Sep />

      {/* Advisor confirmation */}
      <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 6 }}>אישור בעל הרישיון</Text>
      <Text style={{ fontSize: 9, textAlign: 'right', lineHeight: 1.5, marginBottom: 10, color: C.black }}>
        {'אני הח"מ _______________ בעל רישיון שיווק השקעות שמספרו _______________ מטעם גרין סוכנות לביטוח פנסיוני ושיווק השקעות (2024) בע"מ, מאשר כי ביררתי עם הלקוח את הפרטים הנדרשים, הלקוח חתם בפני בכל המקומות הנדרשים, והוסברו לו השלכות אי מסירת מלוא המידע הרלוונטי לצורך התאמת השירות לצרכיו הייחודיים של הלקוח. במידה והלקוח בחר שלא למסור פרטים כמפורט לעיל, הבהרתי ללקוח את משמעות אי מסירת הפרטים. כמו כן, בהתאם לפרטים שמסר לי הלקוח עולה כי קיימת תשתית מספקת להתאמת מדיניות ההשקעה ללקוח בהתאם להוראות החוק.'}
      </Text>
      <Text style={{ fontSize: 10, color: C.black, textAlign: 'right' }}>חתימת בעל הרישיון: _______________     תאריך: ___/___/______</Text>
    </Page>

  </Document>
)

// ══════════════════════════════════════════════════════════════
//  EXPORT
// ══════════════════════════════════════════════════════════════
export async function generateBlankPDF() {
  const blob = await pdf(<BlankDocument />).toBlob()
  const pdfBytes = await blob.arrayBuffer()
  const previewBlob = new Blob([pdfBytes], { type: 'application/pdf' })
  const previewUrl = URL.createObjectURL(previewBlob)
  return { url: previewUrl, fileName: 'אפיון צרכים 2026.pdf', pdfBytes }
}
