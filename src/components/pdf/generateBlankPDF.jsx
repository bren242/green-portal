import React from 'react'
import { Document, Page, Text, View, Image, Font, pdf } from '@react-pdf/renderer'
import { logoPng } from '../../assets/logoBase64'

// ── Font ──────────────────────────────────────────────────────
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
  gold: '#B8975A',
}

// ── Regulatory Texts ──────────────────────────────────────────
const REG_TEXTS = [
  'משווק השקעות נדרש, על פי חוק הסדרת העיסוק בייעוץ השקעות, בשיווק השקעות ובניהול תיקי השקעות תשנ״ה-1995 (להלן: "החוק"), להתאים, ככל האפשר, את השירותים שמשווק ההשקעות נותן ללקוח לצרכיו ולהנחיותיו של הלקוח וזאת לאחר שמשווק ההשקעות בירר עם הלקוח את מטרות ההשקעה, את מצבו הכספי לרבות ניירות הערך והנכסים הפיננסיים של הלקוח, ואת שאר הנסיבות הרלוונטיות לעניין זה.',
  'ידוע ללקוח כי מענה אמיתי, כן ומלא לשאלון שלהלן יסייע למשווק ההשקעות להתאים בצורה המיטבית האפשרית את אופי השקעותיו לצרכיו המיוחדים של הלקוח. אי מסירת פרטים או מסירת פרטים חלקית עלולה לפגוע ביכולתו של משווק ההשקעות להתאים את השירות שיינתן לצרכי הלקוח.',
  'ידוע ללקוח כי קיימת חשיבות לעדכן את משווק ההשקעות בכל שינוי שיחול ביחס לפרטים שמסר במסגרת מסמך זה. משווק ההשקעות הבהיר ללקוח כי כל פרט שהלקוח מוסר למשווק ההשקעות ישמר בסודיות על ידי משווק ההשקעות אך סודיות זו כפופה לחובת משווק ההשקעות למסור ידיעות על פי כל דין.',
  'הלקוח מצהיר כי הוא מודע לכך שהשקעות בשוק ההון כרוכות בסיכון, וכי אין בתשואות עבר כדי להבטיח תשואות עתידיות.',
]

// ── Page Style (NO direction: 'rtl') ──────────────────────────
const pageStyle = {
  fontFamily: 'Assistant',
  paddingTop: 24,
  paddingBottom: 30,
  paddingHorizontal: 34,
  fontSize: 10,
  color: C.black,
}

// ══════════════════════════════════════════════════════════════
//  COMPONENTS
// ══════════════════════════════════════════════════════════════

// Header: logo left, text right
const Header = () => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingBottom: 8, borderBottomWidth: 1.5, borderBottomColor: C.gold }}>
    <Image src={logoPng} style={{ height: 28 }} />
    <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary }}>GREEN Wealth Management</Text>
  </View>
)

// Section title
const SecTitle = ({ children }) => (
  <Text style={{ fontSize: 12, fontWeight: 'bold', color: C.primary, textAlign: 'right', borderBottomWidth: 1.5, borderBottomColor: C.primary, paddingBottom: 2, marginBottom: 8, marginTop: 10 }}>
    {children}
  </Text>
)

// Field: label right → gap → writing line left (same row)
const Field = ({ label, lineWidth = 160 }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end', marginBottom: 8 }}>
    <View style={{ width: lineWidth, borderBottomWidth: 1, borderBottomColor: C.black, height: 16 }} />
    <View style={{ width: 8 }} />
    <Text style={{ fontSize: 10, color: C.muted }}>{label}</Text>
  </View>
)

// Double row: fixed-width label + fixed-width line = aligned columns
const Row2 = ({ labelR, labelL }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 8 }}>
    {/* Left field (appears left in RTL) */}
    <View style={{ width: 245, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
      <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: C.black, height: 16 }} />
      <View style={{ width: 8 }} />
      <View style={{ width: 95 }}>
        <Text style={{ fontSize: 10, color: C.muted, textAlign: 'right' }}>{labelL}</Text>
      </View>
    </View>
    <View style={{ width: 24 }} />
    {/* Right field (appears right in RTL) */}
    <View style={{ width: 245, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
      <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: C.black, height: 16 }} />
      <View style={{ width: 8 }} />
      <View style={{ width: 95 }}>
        <Text style={{ fontSize: 10, color: C.muted, textAlign: 'right' }}>{labelR}</Text>
      </View>
    </View>
  </View>
)

// Checkbox: square 12×12 right → gap → text left
const Chk = ({ label, score, width }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 5, ...(width ? { width } : {}) }}>
    {score !== undefined && (
      <Text style={{ fontSize: 9, color: C.muted, marginRight: 6 }}>({score} נק׳)</Text>
    )}
    <Text style={{ fontSize: 10, color: C.black, textAlign: 'right' }}>{label}</Text>
    <View style={{ width: 6 }} />
    <View style={{ width: 12, height: 12, borderWidth: 1.5, borderColor: C.black, flexShrink: 0 }} />
  </View>
)

// Writing lines
const Lines = ({ n = 3 }) => (
  <View>
    {Array.from({ length: n }).map((_, i) => (
      <View key={i} style={{ borderBottomWidth: 1, borderBottomColor: C.line, height: 18, marginBottom: 4 }} />
    ))}
  </View>
)

// Separator
const Sep = () => <View style={{ borderTopWidth: 1, borderTopColor: C.line, marginVertical: 10 }} />

// Page number
const PageNum = () => (
  <Text style={{ position: 'absolute', bottom: 12, left: 0, right: 0, textAlign: 'center', fontSize: 7, color: C.muted }}
    render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
)

// Financial table row: 3 fixed-width columns (sector | total | details)
const FinRow = ({ label, isHeader }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'flex-end', borderBottomWidth: 0.5, borderBottomColor: C.line, paddingVertical: 6, paddingHorizontal: 2 }}>
    <View style={{ width: 200 }}>
      {isHeader
        ? <Text style={{ fontSize: 9, fontWeight: 'bold', textAlign: 'right' }}>פירוט עיקרי</Text>
        : <View style={{ borderBottomWidth: 1, borderBottomColor: C.black, height: 13, marginTop: 3 }} />}
    </View>
    <View style={{ width: 80, alignItems: 'center' }}>
      {isHeader
        ? <Text style={{ fontSize: 9, fontWeight: 'bold', textAlign: 'center' }}>סה״כ (₪)</Text>
        : <View style={{ borderBottomWidth: 1, borderBottomColor: C.black, height: 13, marginTop: 3, width: 60 }} />}
    </View>
    <View style={{ width: 180 }}>
      <Text style={{ fontSize: isHeader ? 9 : 10, fontWeight: isHeader ? 'bold' : 'normal', textAlign: 'right' }}>{label}</Text>
    </View>
  </View>
)

// ══════════════════════════════════════════════════════════════
//  DOCUMENT
// ══════════════════════════════════════════════════════════════
const BlankDoc = () => (
  <Document>

    {/* ══ PAGE 1: Cover + Personal Details ══ */}
    <Page size="A4" style={pageStyle}>
      <Header /><PageNum />
      <View style={{ alignItems: 'center', marginBottom: 12 }}>
        <Text style={{ fontSize: 15, fontWeight: 'bold', color: C.primary }}>אפיון צרכים והתאמת מדיניות השקעה</Text>
        <Text style={{ fontSize: 9, color: C.muted, marginTop: 2 }}>טופס למילוי ידני</Text>
      </View>

      <SecTitle>פרטי המשווק</SecTitle>
      <Row2 labelR="שם המשווק:" labelL="מספר רישיון:" />
      <Row2 labelR="ת.ז:" labelL="תאריך פגישה:" />

      <SecTitle>פרטי לקוח א׳</SecTitle>
      <Row2 labelR="שם מלא:" labelL="ת.ז:" />
      <Row2 labelR="תאריך לידה:" labelL="מצב משפחתי:" />
      <Row2 labelR="טלפון:" labelL="דוא״ל:" />
      <Row2 labelR="עיסוק:" labelL="נפשות תלויות:" />

      <SecTitle>פרטי לקוח ב׳ (אם רלוונטי)</SecTitle>
      <Row2 labelR="שם מלא:" labelL="ת.ז:" />
      <Row2 labelR="תאריך לידה:" labelL="מצב משפחתי:" />
      <Row2 labelR="טלפון:" labelL="דוא״ל:" />
      <Row2 labelR="עיסוק:" labelL="נפשות תלויות:" />

      <View style={{ borderWidth: 1, borderColor: C.primary, borderRadius: 4, padding: 10, marginTop: 10 }}>
        {REG_TEXTS.map((t, i) => (
          <Text key={i} style={{ fontSize: 8.5, textAlign: 'right', lineHeight: 1.6, marginTop: i > 0 ? 4 : 0 }}>{t}</Text>
        ))}
      </View>
    </Page>

    {/* ══ PAGE 2: Financial Picture ══ */}
    <Page size="A4" style={pageStyle}>
      <Header /><PageNum />
      <SecTitle>תמונה כלכלית — התא המשפחתי</SecTitle>

      <FinRow label="סקטור" isHeader />
      {['הכנסות חודשיות', 'עו״ש, מזומן ופקדונות', 'ני״ע בארץ ובחו״ל', 'חיסכון, גמל והשתלמות', 'פנסיה וביטוח מנהלים', 'נדל״ן', 'אחר (עסק, שותפות)', 'התחייבויות (יתרה כוללת)', 'הוצאות חודשיות שוטפות'].map((l, i) => (
        <FinRow key={i} label={l} />
      ))}

      <Sep />

      {/* Two summary boxes side by side */}
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 12 }}>
        <View style={{ width: 220, borderWidth: 1, borderColor: C.black, borderRadius: 4, padding: 8 }}>
          <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 6 }}>מאזן חודשי</Text>
          <Field label="סך הכנסות:" lineWidth={110} />
          <Field label="סך הוצאות:" lineWidth={110} />
          <Field label="מאזן חודשי:" lineWidth={110} />
        </View>
        <View style={{ width: 12 }} />
        <View style={{ width: 220, borderWidth: 1, borderColor: C.black, borderRadius: 4, padding: 8 }}>
          <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 6 }}>סיכום מאזן</Text>
          <Field label="סך נכסים:" lineWidth={110} />
          <Field label="סך התחייבויות:" lineWidth={110} />
          <Field label="שווי נטו:" lineWidth={110} />
        </View>
      </View>

      {/* GREEN portion */}
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 4 }}>
        <Chk label="מעל 70%" width={90} />
        <View style={{ width: 10 }} />
        <Chk label="35%–70%" width={90} />
        <View style={{ width: 10 }} />
        <Chk label="עד 35%" width={80} />
        <View style={{ width: 10 }} />
        <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary }}>:שיעור הנכסים המועבר לטיפול GREEN</Text>
      </View>
    </Page>

    {/* ══ PAGE 3: Goals + Liquidity + Experience ══ */}
    <Page size="A4" style={pageStyle}>
      <Header /><PageNum />

      <SecTitle>מטרות השקעה</SecTitle>
      <Text style={{ fontSize: 10, color: C.muted, textAlign: 'right', marginBottom: 6 }}>סמן את כל המטרות הרלוונטיות:</Text>
      <Chk label="שמירת ערך" />
      <Chk label="הכנסה שוטפת" />
      <Chk label="צמיחה לטווח ארוך" />
      <Chk label="חיסכון לפנסיה" />
      <Chk label="חינוך ילדים" />
      <Chk label="העברה בין-דורית" />
      <Field label="אחר — פרט:" lineWidth={220} />

      <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginTop: 8, marginBottom: 6 }}>אופק השקעה:</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <Chk label="מעל 10 שנים" width={120} />
        <View style={{ width: 8 }} />
        <Chk label="5–10 שנים" width={100} />
        <View style={{ width: 8 }} />
        <Chk label="שנתיים עד 5" width={100} />
        <View style={{ width: 8 }} />
        <Chk label="עד שנתיים" width={95} />
      </View>

      <SecTitle>צרכי נזילות</SecTitle>
      <View wrap={false} style={{ marginBottom: 10 }}>
        <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 6 }}>18. מתי תזדקק לכל הכסף שהשקעת? [שאלת חובה]</Text>
        <Chk label="א. בשנתיים הקרובות" />
        <Chk label="ב. בין 2-5 שנים" />
        <Chk label="ג. למעלה מ-5 שנים" />
      </View>
      <View wrap={false} style={{ marginBottom: 10 }}>
        <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 6 }}>19. לאיזה חלק מתיק ההשקעות תזדקק במהלך 3 השנים הקרובות? [שאלת חובה]</Text>
        <Chk label="א. 0% מהתיק" />
        <Chk label="ב. עד 30% מהתיק" />
        <Chk label="ג. עד 50% מהתיק" />
        <Chk label="ד. יותר מ-50% מהתיק" />
      </View>

      <SecTitle>ניסיון קודם בשוק ההון</SecTitle>
      <View wrap={false}>
        <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 6 }}>23. האם נעזרת בעבר בשירותי מנהל/יועץ השקעות?</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 6 }}>
          <Chk label="לא" width={60} />
          <View style={{ width: 20 }} />
          <Chk label="כן" width={55} />
        </View>
        <Field label="אם כן, פרט:" lineWidth={280} />
      </View>

      <View style={{ borderWidth: 1, borderColor: C.line, borderRadius: 4, padding: 10, marginTop: 8 }}>
        <Text style={{ fontSize: 9, color: C.muted, textAlign: 'right', lineHeight: 1.6, fontWeight: 'bold' }}>
          בעל הרישיון יסביר ללקוח את הקשר שבין סיכון לתשואה בתיק ההשקעות ובכלל זה יבהיר כי ככל שרמת הסיכון גבוהה יותר, כך גדל הסיכוי לתשואה גבוהה, אך במקביל גם קיים סיכון להפסד גבוה יותר לרבות אובדן חלק מהקרן.
        </Text>
      </View>
    </Page>

    {/* ══ PAGE 4: Risk Questionnaire ══ */}
    <Page size="A4" style={pageStyle}>
      <Header /><PageNum />
      <SecTitle>הערכת סיכון — שאלון</SecTitle>
      <Text style={{ fontSize: 9, color: C.muted, textAlign: 'right', marginBottom: 6 }}>סמן תשובה אחת לכל שאלה.</Text>

      <View style={{ marginBottom: 8 }}>
        <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 4 }}>20. אם שווי התיק שלך היה נופל ב-10% או יותר תוך זמן קצר, איך היית מגיב? [שאלת חובה]</Text>
        <Chk label="א. אמכור מיד את כל אחזקותי. יהיה לי קשה להתמודד עם ההפסד." score={1} />
        <Chk label="ב. אמכור חלק מהשקעה כדי לצמצם את הסיכון." score={2} />
        <Chk label="ג. זה יקטין את נכסי, אך לא הפסד בעייתי בעיני." score={3} />
        <Chk label="ד. בהשקעות לפעמים מפסידים ולפעמים מרוויחים, אין לי בעיה עם הפסד כזה." score={5} />
      </View>

      <View style={{ marginBottom: 8 }}>
        <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 4 }}>21. מהי רמת הסיכון שאתה מוכן לקחת כדי להשיג את יעדיך?</Text>
        <Chk label="א. מוכן לקחת סיכון מוגבל, קטן ככל האפשר." score={1} />
        <Chk label="ב. מוכן לקחת סיכון מסוים, אך לא גבוה." score={3} />
        <Chk label="ג. מוכן לקחת סיכון גבוה עם סיכוי לרווח ניכר." score={5} />
      </View>

      <View style={{ marginBottom: 8 }}>
        <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 4 }}>22. כאשר השווקים הפיננסיים יורדים, מה סביר לצפות מתיק ההשקעות שלי?</Text>
        <Chk label="א. שווי התיק עלול להיפגע, אך לא במידה ניכרת." score={1} />
        <Chk label="ב. כשהשווקים יורדים גם שווי התיק יגלם את הירידות." score={3} />
        <Chk label="ג. בתיק עם סיכונים צריך לצפות לירידות שווי, לעיתים אף משמעותיות." score={5} />
      </View>

      <View style={{ marginBottom: 8 }}>
        <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 4 }}>אסימטריה — מהי התשואה המקסימלית שאתה מצפה לה ומהו ההפסד המקסימלי שאתה מוכן לספוג?</Text>
        <Chk label="א. סיכוי עד 6%, סיכון עד 5%." score={1} />
        <Chk label="ב. סיכוי עד 14%, סיכון עד 10%." score={2} />
        <Chk label="ג. סיכוי עד 20%, סיכון עד 15%." score={3} />
        <Chk label="ד. סיכוי מעל 20%, סיכון מעל 15%." score={5} />
      </View>

      <SecTitle>פסקת סירוב</SecTitle>
      <View style={{ borderWidth: 1, borderColor: C.black, borderRadius: 4, padding: 8 }} wrap={false}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end', marginBottom: 6 }}>
          <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: C.black, height: 16, marginLeft: 8 }} />
          <Text style={{ fontSize: 10, flexShrink: 0 }}>הלקוח סירב להשיב על שאלה/ות מס׳:</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end', marginBottom: 6 }}>
          <Text style={{ fontSize: 10, flexShrink: 0, marginLeft: 6 }}>אינן רלוונטיות עבור הלקוח.</Text>
          <View style={{ width: 80, borderBottomWidth: 1, borderBottomColor: C.black, height: 16, marginLeft: 6 }} />
          <Text style={{ fontSize: 10, flexShrink: 0 }}>שאלה/ות מס׳</Text>
        </View>
        <Text style={{ fontSize: 9, color: C.muted, textAlign: 'right' }}>הובהר ללקוח כי אי מסירת המידע עלולה לפגוע באיכות ההמלצה.</Text>
      </View>

    </Page>

    {/* ══ PAGE 5: Scoring + Advisor Summary + Policy ══ */}
    <Page size="A4" style={pageStyle}>
      <Header /><PageNum />

      <SecTitle>טבלת ניקוד וחישוב דרגת סיכון</SecTitle>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', borderBottomWidth: 1, borderBottomColor: C.black, paddingVertical: 4 }}>
        {['מניות מקס׳', 'הפסד מקס׳', 'שם', 'דרגה', 'ממוצע ניקוד'].map((h, i) => (
          <Text key={i} style={{ width: i === 2 ? 90 : 80, fontSize: 9, fontWeight: 'bold', textAlign: 'right' }}>{h}</Text>
        ))}
      </View>
      {[
        ['0%', 'עד 5%', 'שמרן', '1', 'פחות מ-2'],
        ['עד 15%', 'עד 10%', 'שמרן-מתון', '2', '2 עד 3'],
        ['עד 25%', 'עד 15%', 'מאוזן', '3', '3 עד 3.8'],
        ['עד 35%', 'מעל 15%', 'צמיחה', '4', '3.8 עד 4.5'],
        ['עד 100%', 'משמעותי', 'אגרסיבי', '5', '4.5 ומעלה'],
      ].map((row, i) => (
        <View key={i} style={{ flexDirection: 'row', justifyContent: 'flex-end', borderBottomWidth: 0.5, borderBottomColor: C.line, paddingVertical: 4 }}>
          {row.map((cell, j) => (
            <Text key={j} style={{ width: j === 2 ? 90 : 80, fontSize: 9, textAlign: 'right' }}>{cell}</Text>
          ))}
        </View>
      ))}

      {/* Manual calculation */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 6 }} wrap={false}>
        {['שאלה 1', 'שאלה 2', 'שאלה 3', 'שאלה 4'].map((q, i) => (
          <View key={i} style={{ alignItems: 'center', marginHorizontal: 8 }}>
            <Text style={{ fontSize: 8, color: C.muted, marginBottom: 3 }}>{q}</Text>
            <View style={{ width: 28, height: 28, borderWidth: 1.5, borderColor: C.black }} />
          </View>
        ))}
        <Text style={{ fontSize: 14, marginHorizontal: 8 }}>=</Text>
        <View style={{ alignItems: 'center', marginHorizontal: 8 }}>
          <Text style={{ fontSize: 8, color: C.muted, marginBottom: 3 }}>ממוצע</Text>
          <View style={{ width: 34, height: 34, borderWidth: 2, borderColor: C.primary }} />
        </View>
        <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, marginHorizontal: 8 }}>דרגת סיכון מחושבת:</Text>
        <View style={{ width: 34, height: 34, borderWidth: 2, borderColor: C.primary }} />
      </View>

      <SecTitle>סיכום והמלצת בעל הרישיון</SecTitle>

      <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 3 }}>24. סיכום וניתוח המידע שהתקבל מהלקוח:</Text>
      <Lines n={2} />

      <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginTop: 4, marginBottom: 3 }}>25. העדפות / הגבלות השקעה לקוח:</Text>
      <Lines n={1} />

      <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginTop: 6, marginBottom: 6 }}>26. המלצת בעל הרישיון למדיניות השקעה:</Text>

      {/* 4 policy cubes — compact */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }} wrap={false}>
        <View style={{ width: '24%', borderWidth: 1, borderColor: C.black, borderRadius: 4, padding: 4, alignItems: 'center' }}>
          <Text style={{ fontSize: 8, color: C.muted, textAlign: 'center', marginBottom: 3 }}>אחוז מניות מקס׳</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 10 }}>%</Text>
            <View style={{ width: 4 }} />
            <View style={{ width: 45, borderBottomWidth: 1, borderBottomColor: C.black, height: 14 }} />
          </View>
        </View>
        <View style={{ width: '24%', borderWidth: 1, borderColor: C.black, borderRadius: 4, padding: 4, alignItems: 'center' }}>
          <Text style={{ fontSize: 8, color: C.muted, textAlign: 'center', marginBottom: 3 }}>אג״ח קונצרני</Text>
          <Chk label="עד 50%" width={70} />
          <Chk label="עד 100%" width={75} />
        </View>
        <View style={{ width: '24%', borderWidth: 1, borderColor: C.black, borderRadius: 4, padding: 4, alignItems: 'center' }}>
          <Text style={{ fontSize: 8, color: C.muted, textAlign: 'center', marginBottom: 3 }}>מט״ח</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Chk label="לא" width={45} />
            <View style={{ width: 6 }} />
            <Chk label="כן" width={40} />
          </View>
        </View>
        <View style={{ width: '24%', borderWidth: 1, borderColor: C.black, borderRadius: 4, padding: 4, alignItems: 'center' }}>
          <Text style={{ fontSize: 8, color: C.muted, textAlign: 'center', marginBottom: 3 }}>אג״ח דירוג נמוך</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Chk label="לא" width={45} />
            <View style={{ width: 6 }} />
            <Chk label="כן" width={40} />
          </View>
        </View>
      </View>

      {/* Final risk level */}
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 6 }} wrap={false}>
        <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: C.black, height: 14, marginLeft: 8 }} />
        <Text style={{ fontSize: 11, marginLeft: 8 }}>—</Text>
        <View style={{ width: 30, height: 30, borderWidth: 2, borderColor: C.primary, marginLeft: 8 }} />
        <Text style={{ fontSize: 11, fontWeight: 'bold', color: C.primary }}>דרגת סיכון סופית:</Text>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 4 }}>
        {[{ n: 1, l: 'שמרן' }, { n: 2, l: 'שמרן-מתון' }, { n: 3, l: 'מאוזן' }, { n: 4, l: 'צמיחה' }, { n: 5, l: 'אגרסיבי' }].map(({ n, l }) => (
          <View key={n} style={{ alignItems: 'center', marginHorizontal: 10 }}>
            <View style={{ width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, borderColor: C.black, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 9, fontWeight: 'bold' }}>{n}</Text>
            </View>
            <Text style={{ fontSize: 7, color: C.muted, marginTop: 1 }}>{l}</Text>
          </View>
        ))}
      </View>
      <Text style={{ fontSize: 7, color: C.muted, textAlign: 'center', marginBottom: 6 }}>* עגל את הדרגה הנבחרת</Text>

      <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 3 }}>נימוק מקצועי:</Text>
      <Lines n={2} />
    </Page>

    {/* ══ PAGE 6: Declarations + Signatures ══ */}
    <Page size="A4" style={pageStyle}>
      <Header /><PageNum />
      <SecTitle>הצהרות וחתימות</SecTitle>

      <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 5 }}>הצהרת הלקוח</Text>
      <Text style={{ fontSize: 9, textAlign: 'right', lineHeight: 1.6, marginBottom: 12 }}>
        {'אני הח"מ _______________ מצהיר בזאת כי המידע המופיע לעיל, הינו המידע אותו מסרתי לידיעתו של משווק ההשקעות. כמו כן, הוסבר לי כי מענה אמיתי, כן ומלא לשאלון יסייע למשווק ההשקעות להתאים בצורה המיטבית את אופי תיק ההשקעות לצרכיי הספציפיים וכן כי אי מסירת פרטים או מסירת פרטים חלקיים עלולה לפגוע ביכולתו של משווק ההשקעות להתאים את השירות שיינתן לח"מ. כמו כן, כל מידע אחר אשר נתבקשתי למסור לידיעת משווק ההשקעות אולם נמנעתי מלמסרו, הינו מידע אשר אין ברצוני שישמש את משווק ההשקעות במסגרת פעילותו ואני מוותר בזאת על כל טענה ו/או תביעה ו/או זכות כלשהי אודות שימוש שלא ייעשה במידע זה. בחתימתי זו מאשר הח"מ כי מדיניות ההשקעה ואופן ניהול תיק ההשקעות הוסברו לח"מ ונקבעו בשיתוף פעולה עם הח"מ. אני מאשר בזאת כי קיבלתי העתק בכתב/בדוא״ל של מסמך זה.'}
      </Text>

      {/* Client signatures — A right, B left */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 }} wrap={false}>
        <View style={{ width: '48%' }}>
          <Text style={{ fontSize: 10, textAlign: 'right' }}>חתימת לקוח ב׳: X _______________</Text>
          <Text style={{ fontSize: 10, color: C.muted, textAlign: 'right', marginTop: 5 }}>תאריך: ___/___/______</Text>
        </View>
        <View style={{ width: '48%' }}>
          <Text style={{ fontSize: 10, textAlign: 'right' }}>חתימת לקוח א׳: X _______________</Text>
          <Text style={{ fontSize: 10, color: C.muted, textAlign: 'right', marginTop: 5 }}>תאריך: ___/___/______</Text>
        </View>
      </View>

      <Sep />

      {/* Refusals box */}
      <View style={{ borderWidth: 1, borderColor: C.black, borderRadius: 4, padding: 10, marginBottom: 12 }} wrap={false}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end', marginBottom: 8 }}>
          <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: C.black, height: 16, marginLeft: 8 }} />
          <Text style={{ fontSize: 10, flexShrink: 0 }}>הלקוח סירב להשיב על שאלה/ות מס׳:</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end', marginBottom: 8 }}>
          <Text style={{ fontSize: 10, flexShrink: 0, marginLeft: 6 }}>אינן רלוונטיות עבור הלקוח.</Text>
          <View style={{ width: 80, borderBottomWidth: 1, borderBottomColor: C.black, height: 16, marginLeft: 6 }} />
          <Text style={{ fontSize: 10, flexShrink: 0 }}>שאלה/ות מס׳</Text>
        </View>
        <Text style={{ fontSize: 9, color: C.muted, textAlign: 'right', marginBottom: 8 }}>הובהר ללקוח כי אי מסירת המידע עלולה לפגוע באיכות ההמלצה.</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 10, flexShrink: 0, marginLeft: 16 }}>תאריך: ___/___/______</Text>
          <Text style={{ fontSize: 10, flexShrink: 0, marginLeft: 8 }}>חתימה על הסירובים: X _______________</Text>
        </View>
      </View>

      <Sep />

      {/* Advisor confirmation */}
      <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 5 }}>אישור בעל הרישיון</Text>
      <Text style={{ fontSize: 9, textAlign: 'right', lineHeight: 1.6, marginBottom: 12 }}>
        {'אני הח"מ _______________ בעל רישיון שיווק השקעות שמספרו _______________ מטעם גרין סוכנות לביטוח פנסיוני ושיווק השקעות (2024) בע"מ, מאשר כי ביררתי עם הלקוח את הפרטים הנדרשים, הלקוח חתם בפני בכל המקומות הנדרשים, והוסברו לו השלכות אי מסירת מלוא המידע הרלוונטי לצורך התאמת השירות לצרכיו הייחודיים של הלקוח. במידה והלקוח בחר שלא למסור פרטים כמפורט לעיל, הבהרתי ללקוח את משמעות אי מסירת הפרטים. כמו כן, בהתאם לפרטים שמסר לי הלקוח עולה כי קיימת תשתית מספקת להתאמת מדיניות ההשקעה ללקוח בהתאם להוראות החוק.'}
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
        <Text style={{ fontSize: 10, flexShrink: 0, marginLeft: 12 }}>תאריך: ___/___/______</Text>
        <View style={{ width: 180, borderBottomWidth: 1, borderBottomColor: C.black, height: 16, marginLeft: 8 }} />
        <Text style={{ fontSize: 10, flexShrink: 0 }}>חתימת בעל הרישיון:</Text>
      </View>
    </Page>

  </Document>
)

// ══════════════════════════════════════════════════════════════
//  EXPORT
// ══════════════════════════════════════════════════════════════
export async function generateBlankPDF() {
  const blob = await pdf(<BlankDoc />).toBlob()
  const pdfBytes = await blob.arrayBuffer()
  const previewBlob = new Blob([pdfBytes], { type: 'application/pdf' })
  const previewUrl = URL.createObjectURL(previewBlob)
  return { url: previewUrl, fileName: 'אפיון צרכים 2026.pdf', pdfBytes }
}
