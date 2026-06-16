// GREEN Portal — נספח השקעות בסיכון מיוחד
// טקסט משפטי מאושר — אסור לשנות מילה
// גרסת ממשק = צבעי GREEN + תאריך אוטומטי
// גרסת הדפסה = שחור-לבן, קווים נקיים

import React from 'react'
import { Document, Page, Text, View, Image, Font, pdf } from '@react-pdf/renderer'
import { logoPng } from '../../assets/logoBase64'
import { resetPdfFontCache } from '../../utils/pdfFontReset'

Font.register({
  family: 'Assistant',
  fonts: [
    { src: '/fonts/Assistant-Regular.ttf', fontWeight: 'normal' },
    { src: '/fonts/Assistant-Bold.ttf', fontWeight: 'bold' },
  ],
})
Font.registerHyphenationCallback((word) => [word])

const C = {
  primary: '#1B3A2F',
  gold: '#B8975A',
  goldLight: '#D4B483',
  black: '#1A1A1A',
  muted: '#5A5A5A',
  border: '#DDD5BF',
}

const fmtDateAuto = () => {
  const d = new Date()
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

const pageStyle = {
  fontFamily: 'Assistant',
  paddingTop: 28,
  paddingBottom: 130,
  paddingHorizontal: 40,
  fontSize: 10,
  color: C.black,
}

// ── Header ────────────────────────────────────────────────────
const PageHeader = ({ styled }) => (
  <View fixed style={{ marginBottom: 14 }}>
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingBottom: 8,
      borderBottomWidth: styled ? 2 : 1.5,
      borderBottomColor: C.gold,
    }}>
      <Image src={logoPng} style={{ height: 36, width: 'auto' }} />
      <View style={{ flex: 1 }} />
    </View>
  </View>
)

// ── Footer ────────────────────────────────────────────────────
const PageFooter = () => (
  <View fixed style={{
    position: 'absolute',
    bottom: 12,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: C.border,
    paddingTop: 6,
  }}>
    <Text style={{ fontSize: 7, color: C.muted, textAlign: 'left' }}>INFO@GREENWM.CO.IL</Text>
    <Text style={{ fontSize: 7, color: C.muted, textAlign: 'left' }}>03-6456005/6</Text>
    <Text style={{ fontSize: 7, color: C.muted }}>ז׳בוטינסקי 7, מגדל משה אביב, רמת גן</Text>
    <Text style={{ fontSize: 7, color: C.muted, textAlign: 'left' }}>WWW.GREENWM.CO.IL</Text>
  </View>
)

// ── Document Title ────────────────────────────────────────────
const DocTitle = ({ styled }) => {
  if (styled) {
    return (
      <View style={{
        backgroundColor: C.primary,
        borderRadius: 3,
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginBottom: 18,
      }}>
        <Text style={{ fontSize: 12, fontWeight: 'bold', color: C.goldLight, textAlign: 'center' }}>
          השקעות בסיכון מיוחד
        </Text>
      </View>
    )
  }
  return (
    <Text style={{ fontSize: 13, fontWeight: 'bold', color: C.primary, textAlign: 'center', marginBottom: 18, textDecoration: 'underline' }}>
      השקעות בסיכון מיוחד
    </Text>
  )
}

// ── Bullet paragraph — children = View or Text elements ───────
const BulletPara = ({ children }) => (
  <View style={{ flexDirection: 'row-reverse', marginBottom: 12 }}>
    <Text style={{ fontSize: 11, width: 14, textAlign: 'right', lineHeight: 1.65, color: C.black }}>{'•'}</Text>
    <View style={{ flex: 1 }}>
      {children}
    </View>
  </View>
)

// ── Paragraph text ────────────────────────────────────────────
const PT = ({ children }) => (
  <Text style={{ fontSize: 10, textAlign: 'right', lineHeight: 1.65, color: C.black }}>
    {children}
  </Text>
)

// ── Client signature block ─────────────────────────────────────
const ClientSignBlock = ({ dateValue }) => (
  <View style={{ alignItems: 'center', width: 160 }}>
    <Text style={{ fontSize: 14, fontWeight: 'bold' }}>X</Text>
    <View style={{ width: 160, borderBottomWidth: 1, borderBottomColor: C.black, marginBottom: 3 }} />
    <Text style={{ fontSize: 8, color: C.muted, textAlign: 'center' }}>חתימת הלקוח</Text>
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginTop: 6, width: 160 }}>
      {dateValue ? (
        <Text style={{ fontSize: 8, color: C.black, flex: 1, textAlign: 'center' }}>{dateValue}</Text>
      ) : (
        <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: C.black, height: 12 }} />
      )}
      <Text style={{ fontSize: 8, marginLeft: 4 }}>:תאריך</Text>
    </View>
  </View>
)

// ── Footnote (absolute positioned above footer) ───────────────
const Footnote = () => (
  <View style={{ position: 'absolute', bottom: 38, left: 40, right: 40 }}>
    <View style={{ borderTopWidth: 0.5, borderTopColor: C.muted, paddingTop: 4 }}>
      <Text style={{ fontSize: 7, color: C.muted, textAlign: 'right', lineHeight: 1.5, marginBottom: 2 }}>
        {'1 עסקאות המפורטות להלן, הינן עסקאות שביצוען כרוך בסיכון מיוחד:'}
      </Text>
      <View style={{ flexDirection: 'row-reverse', marginBottom: 1 }}>
        <Text style={{ fontSize: 7, color: C.muted, width: 12, textAlign: 'right' }}>{'1.'}</Text>
        <Text style={{ fontSize: 7, color: C.muted, flex: 1, textAlign: 'right', lineHeight: 1.5 }}>
          {'עסקה בנייר ערך אשר בתשקיף צויין כי ההשקעה בו כרוכה בסיכון מיוחד, כל עוד לא חלפו שנתיים מתאריך התשקיף, זולת אם הסיכון אשר צויין כאמור אינו קיים עוד;'}
        </Text>
      </View>
      <View style={{ flexDirection: 'row-reverse', marginBottom: 1 }}>
        <Text style={{ fontSize: 7, color: C.muted, width: 12, textAlign: 'right' }}>{'2.'}</Text>
        <Text style={{ fontSize: 7, color: C.muted, flex: 1, textAlign: 'right', lineHeight: 1.5 }}>
          {'עסקה שכרוכה בה מכירה בחסר, כמשמעותה בסעיף 63 לחוק השקעות משותפות בנאמנות, תשנ"ד-1994 והשאלת ניירות ערך לצורך ביצוע עסקה כאמור;'}
        </Text>
      </View>
      <View style={{ flexDirection: 'row-reverse', marginBottom: 1 }}>
        <Text style={{ fontSize: 7, color: C.muted, width: 12, textAlign: 'right' }}>{'3.'}</Text>
        <Text style={{ fontSize: 7, color: C.muted, flex: 1, textAlign: 'right', lineHeight: 1.5 }}>
          {'עסקה בחוזה עתידי, באופציה או במוצר מובנה;'}
        </Text>
      </View>
      <View style={{ flexDirection: 'row-reverse', marginBottom: 1 }}>
        <Text style={{ fontSize: 7, color: C.muted, width: 12, textAlign: 'right' }}>{'4.'}</Text>
        <Text style={{ fontSize: 7, color: C.muted, flex: 1, textAlign: 'right', lineHeight: 1.5 }}>
          {'עסקה אחרת שקבע לענין זה שר האוצר, בהתייעצות עם הרשות ובאישור ועדת הכספים של הכנסת.'}
        </Text>
      </View>
    </View>
  </View>
)

// ════════════════════════════════════════════════════════════════
//  MAIN DOCUMENT
// ════════════════════════════════════════════════════════════════
const SpecialRiskDoc = ({ styled }) => {
  const dateVal = styled ? fmtDateAuto() : null

  return (
    <Document>
      <Page size="A4" style={pageStyle}>
        <PageHeader styled={styled} />
        <DocTitle styled={styled} />

        {/* Bullet 1 — special risk transactions */}
        <BulletPara>
          <PT>
            {'הלקוח מבקש מבעל הרישיון לקבל שרותים ביחס לעסקאות שכרוכה בהן סיכון מיוחד כמשמעות מונח זה בחוק הסדרת העיסוק בייעוץ השקעות, בשיווק השקעות ובניהול תיקי השקעות, תשנ"ה – 1995, כפי שיעודכן מעת לעת ("עסקה בסיכון מיוחד").'}
          </PT>
        </BulletPara>

        {/* Bullet 2 — structured products + declaration */}
        <BulletPara>
          <PT>
            {'הלקוח, מבקש מבעל רישיון שעניין אותו בהשקעה במוצרים מובנים (ניירות ערך ו/או פיקדונות ו/או השקעות אחרות, שהתשואה עליהם או הסיכון הכרוך בהם נקבעים על פי נוסחה המבוססת על שינוי במדד כלשהו, במחיר נייר ערך כלשהו, במחיר סחורה כלשהי, במחיר אופציה או חוזה עתידי כלשהו, בריבית או בהפרשים בין ריביות שונות, בשער חליפין או בהפרשים בין שערי חליפין כלשהם).'}
          </PT>
          <View style={{ height: 6 }} />
          <PT>
            {'הלקוח מצהיר כי ידוע לו, כי: (א) מוצרים מובנים הם מוצרים בעלי סיכון גבוה, אשר עשויים לא להניב תשואה כלשהי למשקיע בהם; (ב) אם יתרחש אירוע, המפורט בתנאי מוצר מובנה כלשהו, הוא עשוי שלא להניב ריבית או תשואה כלשהי; (ג) במידה והמוצר המובנה אינו סחיר, ניתן יהיה לפדות ו/או למכור אותו לפני שחלפה התקופה, הקבועה בתנאיו, רק בכפוף לתשלום קנס, באופן שהסכום שיתקבל עשוי להיות נמוך משמעותית מסכום הקרן, או אף, ללא אפשרות לפדות את המוצר בכלל.'}
          </PT>
        </BulletPara>

        {/* Bullet 3 — hedge funds */}
        <BulletPara>
          <PT>
            {'הלקוח מבקש מבעל רישיון לקבל מידע ביחס לקרנות גידור וקרנות השקעה בישראל ומחוצה לה בכפוף למגבלות הקבועות בכל דין. הלקוח מצהיר כי ידוע לו כי: (א) קרנות גידור וקרנות השקעה הינם מכשירים פיננסיים שעל פי רוב אינם סחירים; (ב) לעתים, ישנה תקופת נעילה בקרנות גידור במהלכה לא ניתן לפדות את כספי הלקוח או לחלופין ניתן לפדות כנגד תשלום קנסות גבוהים; (ג) קרנות הגידור על פי רוב אינן מפוקחות על ידי רשות פיקוח מוסמכת וכפועל יוצא, הן מתנהלות בשקיפות דלה יחסית; (ד) מבנה התגמול בקרנות גידור מבוסס על פי רוב על דמי ניהול קבועים מהיקף הנכסים ודמי הצלחה הנגבים משיעור עליית ערך נכסי התיק המנוהל; (ה) קרנות גידור נוטות למנף את ההשקעה הכלולה בהן תוך הגברת הסיכון לשחיקת הקרן – עד כדי אובדן ההשקעה כליל; (ו) הצטרפות לקרן גידור כוללת בתוכה על פי רוב תניית שיפוט ייחודית למדינה זרה; (ז) היבטי המס הקשורים להשקעה בקרנות גידור אינם ברורים. בעל הרישיון אינו מומחה מס ואינו רשאי ליתן מצג ביחס להיבטי המס הכרוכים בהשקעה בקרן גידור ועל הלקוח לקבל ייעוץ עצמאי בעניין זה; (ח) תנאי הערבות הניתנים על קרן ההשקעה במועד פדיון ההשקעה כפי שקבוע בתשקיף קרן הגידור, כפופים ותלויים בנסיבות פרטניות הכלולות באותם תשקיפים ומותנים בקיומם של נסיבות כמפורט באותם התשקיפים.'}
          </PT>
        </BulletPara>

        {/* Client Signature */}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 24 }}>
          <ClientSignBlock dateValue={dateVal} />
        </View>

        <Footnote />
        <PageFooter />
      </Page>
    </Document>
  )
}

// ════════════════════════════════════════════════════════════════
//  EXPORTS
// ════════════════════════════════════════════════════════════════

export async function generateSpecialRisk(clientData) {
  resetPdfFontCache()
  const blob = await pdf(<SpecialRiskDoc styled={true} />).toBlob()
  const url = URL.createObjectURL(blob)
  const clientName = clientData?.clientA?.fullName || 'לקוח'
  const d = new Date()
  const dateStr = `${String(d.getDate()).padStart(2, '0')}${String(d.getMonth() + 1).padStart(2, '0')}${d.getFullYear()}`
  return { url, fileName: `נספח-סיכון-מיוחד-${clientName}-${dateStr}.pdf` }
}

export async function generateSpecialRiskBlank() {
  resetPdfFontCache()
  const blob = await pdf(<SpecialRiskDoc styled={false} />).toBlob()
  const url = URL.createObjectURL(blob)
  return { url, fileName: 'נספח-סיכון-מיוחד-ידני.pdf' }
}
