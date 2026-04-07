// ═══════════════════════════════════════════════════
// GREEN Portal — הסכם שיווק השקעות PDF Generator
// מקור: הסכם שיווק השקעות- 2025 תקין (003).pdf
// טקסט משפטי מאושר — אסור לשנות מילה
// גרסת הדפסה = שחור-לבן, קווים נקיים
// גרסת ממשק = צבעי GREEN + תאריכים אוטומטיים
// ═══════════════════════════════════════════════════

import React from 'react'
import { Document, Page, Text, View, Image, Font, pdf } from '@react-pdf/renderer'
import { logoPng } from '../../assets/logoBase64'
import { getSignature, getCompanyStamp, isValidImageSrc } from '../../data/signatures'

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
  gold: '#B8975A',
  goldLight: '#D4B483',
  black: '#1A1A1A',
  muted: '#5A5A5A',
  white: '#FFFFFF',
  border: '#DDD5BF',
  surface: '#F6F5F1',
  cream: '#F8F5EE',
  offWhite: '#F4F3EF',
}

// ── Helpers ───────────────────────────────────────────────────
const fmtDateAuto = () => {
  const d = new Date()
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

// ── Page Styles ───────────────────────────────────────────────
const pageStyle = {
  fontFamily: 'Assistant',
  paddingTop: 28,
  paddingBottom: 50,
  paddingHorizontal: 40,
  fontSize: 10,
  color: C.black,
}

// ═══════════════════════════════════════════════════════════════
//  REUSABLE COMPONENTS
// ═══════════════════════════════════════════════════════════════

// ── Page Header ───────────────────────────────────────────────
const PageHeader = ({ styled }) => (
  <View fixed style={{ marginBottom: 8 }}>
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingBottom: 8,
      borderBottomWidth: styled ? 2 : 1.5,
      borderBottomColor: C.gold,
    }}>
      <Image src={logoPng} style={{ height: 36, width: 'auto' }} />
      {styled && (
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 9, color: C.primary, fontWeight: 'bold' }}>הסכם שיווק השקעות</Text>
        </View>
      )}
      {!styled && <View style={{ flex: 1 }} />}
    </View>
  </View>
)

// ── Page Footer ───────────────────────────────────────────────
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

// ── Section Title ─────────────────────────────────────────────
const SectionTitle = ({ children, styled }) => {
  if (styled) {
    return (
      <View style={{ backgroundColor: C.primary, borderRadius: 3, paddingVertical: 6, paddingHorizontal: 12, marginBottom: 14, marginTop: 6 }}>
        <Text style={{ fontSize: 12, fontWeight: 'bold', color: C.goldLight, textAlign: 'center' }}>
          {children}
        </Text>
      </View>
    )
  }
  return (
    <Text style={{ fontSize: 12, fontWeight: 'bold', color: C.primary, textAlign: 'center', marginBottom: 14, marginTop: 6, textDecoration: 'underline' }}>
      {children}
    </Text>
  )
}

// ── Paragraph ─────────────────────────────────────────────────
const Para = ({ children, bold, style }) => (
  <Text style={[{
    fontSize: 10,
    textAlign: 'right',
    lineHeight: 1.6,
    marginBottom: 6,
    color: C.black,
     }, bold && { fontWeight: 'bold' }, style]}>
    {children}
  </Text>
)

// ── Numbered Paragraph (RTL-safe) ─────────────────────────────
// Splits number from text into separate columns to prevent bidi reorder
const NumPara = ({ num, children, indent, style }) => (
  <View style={[{ flexDirection: 'row-reverse', marginBottom: 6 }, indent && { paddingRight: indent }, style]}>
    <Text style={{ fontSize: 10, textAlign: 'right', lineHeight: 1.6, width: 30, color: C.black }}>{num}</Text>
    <Text style={{ fontSize: 10, textAlign: 'right', lineHeight: 1.6, flex: 1, color: C.black }}>{children}</Text>
  </View>
)

// ── LTR Text (emails, URLs, phones) ───────────────────────────
const LTR = ({ children, style }) => (
  <Text style={[{ textAlign: 'left' }, style]}>{children}</Text>
)

// ── Dynamic Field ─────────────────────────────────────────────
const DynField = ({ value }) => (
  <Text style={{ fontWeight: 'bold', color: C.primary }}>{value || '____________'}</Text>
)

// ── Signature Block ───────────────────────────────────────────
const SignBlock = ({ label, dateValue }) => (
  <View style={{ alignItems: 'center', width: 160 }}>
    <Text style={{ fontSize: 14, fontWeight: 'bold' }}>X</Text>
    <View style={{ width: 160, borderBottomWidth: 1, borderBottomColor: C.black, marginBottom: 3 }} />
    <Text style={{ fontSize: 8, color: C.muted, textAlign: 'center' }}>{label}</Text>
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

// ── Signature Row (multiple signers) ──────────────────────────
const SignRow = ({ signers, dateValue }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 20, marginBottom: 8 }}>
    {(signers || []).map((s, i) => (
      <SignBlock key={i} label={s} dateValue={dateValue} />
    ))}
  </View>
)

// ── Table Row for גילוי נאות ──────────────────────────────────
const TwoColRow = ({ left, right, even }) => (
  <View style={{
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: C.border,
    backgroundColor: even ? C.surface : C.white,
  }}>
    <View style={{ flex: 1, borderRightWidth: 0.5, borderRightColor: C.border, paddingVertical: 3, paddingHorizontal: 6 }}>
      <Text style={{ fontSize: 8, textAlign: 'right', color: C.black }}>{left}</Text>
    </View>
    <View style={{ flex: 1, paddingVertical: 3, paddingHorizontal: 6 }}>
      <Text style={{ fontSize: 8, textAlign: 'right', color: C.black }}>{right}</Text>
    </View>
  </View>
)

// ── Client Info Table ─────────────────────────────────────────
const ClientTable = ({ name, id, address, phone, email, idLabel, styled }) => (
  <View style={{ borderWidth: 1, borderColor: styled ? C.gold : C.primary, marginBottom: 4 }}>
    {/* Row 1: name, id, address */}
    <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: styled ? C.gold : C.primary }}>
      <View style={{ flex: 1, borderLeftWidth: 1, borderLeftColor: styled ? C.gold : C.primary, paddingVertical: 4, paddingHorizontal: 6 }}>
        <Text style={{ fontSize: 8, color: C.muted, textAlign: 'right' }}>כתובת</Text>
        <Text style={{ fontSize: 9, textAlign: 'right' }}>{address || ''}</Text>
      </View>
      <View style={{ flex: 1, borderLeftWidth: 1, borderLeftColor: styled ? C.gold : C.primary, paddingVertical: 4, paddingHorizontal: 6 }}>
        <Text style={{ fontSize: 8, color: C.muted, textAlign: 'right' }}>{idLabel || 'ת.ז /ח.פ'}</Text>
        <Text style={{ fontSize: 9, textAlign: 'right' }}>{id || ''}</Text>
      </View>
      <View style={{ flex: 1.5, paddingVertical: 4, paddingHorizontal: 6 }}>
        <Text style={{ fontSize: 8, color: C.muted, textAlign: 'right' }}>שם הלקוח</Text>
        <Text style={{ fontSize: 9, textAlign: 'right', fontWeight: 'bold' }}>{name || ''}</Text>
      </View>
    </View>
    {/* Row 2: phone, email */}
    <View style={{ flexDirection: 'row' }}>
      <View style={{ flex: 1, borderLeftWidth: 1, borderLeftColor: styled ? C.gold : C.primary, paddingVertical: 4, paddingHorizontal: 6 }}>
        <Text style={{ fontSize: 8, color: C.muted, textAlign: 'right' }}>דואר אלקטרוני</Text>
        <Text style={{ fontSize: 9, textAlign: 'left' }}>{email || ''}</Text>
      </View>
      <View style={{ flex: 1, paddingVertical: 4, paddingHorizontal: 6 }}>
        <Text style={{ fontSize: 8, color: C.muted, textAlign: 'right' }}>טלפון</Text>
        <Text style={{ fontSize: 9, textAlign: 'left' }}>{phone || ''}</Text>
      </View>
    </View>
  </View>
)

// ════════════════════════════════════════════════════════════════
//  DISCLOSURE TABLE DATA — גילוי נאות
// ════════════════════════════════════════════════════════════════
const DISCLOSURE_ENTITIES = [
  ['אי.בי. אי אמבן ניהול השקעות בע"מ', 'הכשרה חברה לביטוח בע"מ'],
  ['אי.בי.אי וולקנו החזקות בע"מ', 'ילין לפידות בית השקעות בע"מ'],
  ['אי.בי.אי. פרטנרס בע"מ (SBL)', 'ילין לפידות ניהול קופות גמל בע"מ'],
  ['אי.בי.אי-קומריט השקעות בע"מ', 'מור בית השקעות ניהול תיקים בע"מ'],
  ['אורות השקעות בע"מ (CCF)', 'מור קופות גמל בע"מ'],
  ['אלטשולר שחם בית השקעות בע"מ', 'מור -קרנות השקעה'],
  ['אלטשולר שחם נדלן', 'מיטב בית השקעות בע"מ'],
  ['אלפא אל טי אי בע"מ', 'מיטב גמל ופנסיה בע"מ'],
  ['אלפא לונג ביאס ג\'י.פי. בע"מ', 'מיטב ניהול תיקים בע"מ'],
  ['אלפא חוב סחיר בע"מ', 'מיטב רייגו החזקות בע"מ'],
  ['אלפא לונג בע"מ', 'נוקד אקוויטי השקעות בע"מ'],
  ['בי.אס.פי קרנות ישראל בע"מ', 'נוקד אג"ח השקעות בע"מ'],
  ['הפניקס חברה לביטוח בע"מ', 'נוקד קפיטל בע"מ'],
  ['הפניקס פנסיה וגמל בע"מ', 'ספרה ניהול קרנות'],
  ['הפניקס ניהול תיקי השקעות', 'פוינט פארו השקעות בע"מ'],
  ['הפניקס קרנות טכנולוגיה פיננסית בע"מ', 'פורטה ניהול תיקי השקעות בע"מ'],
  ['הפניקס LEAP', 'פוקוס בית השעות בע"מ'],
  ['הראל חברה לביטוח בע"מ', 'פסטרנק שוהם בית השקעות'],
  ['הראל אלטרנטיב נדל"ן בע"מ', 'רידינג קפיטל'],
  ['הראל פיננסים ניהול השקעות בע"מ', 'Electra multifamily investments'],
  ['Granite Alphen Capital Fund IL LP', 'Pagaya Opportunity Manager Ltd'],
  ['Hazavim Long, LP', 'Pagaya RE Management GP LLC'],
  ['Hazavim (Cayman), LP', '(העוגן) The Phoenix Anchor Fund L.P'],
  ['Hazavim Bond L.P', 'KYC Investment בע"מ'],
  ['Pagaya Auto Loans Manager L.P', ''],
]

// ════════════════════════════════════════════════════════════════
//  MAIN DOCUMENT — supports both print and styled modes
// ════════════════════════════════════════════════════════════════
const MarketingAgreementDoc = ({ data, styled }) => {
  const d = data || {}
  const dateVal = styled ? fmtDateAuto() : null
  const advisorSig = styled && d.advisorUserId ? getSignature(d.advisorUserId) : null
  const stamp = styled ? getCompanyStamp() : null

  return (
    <Document>

      {/* ═══════════════════ PAGE 1: COVER + PARTIES ═══════════════════ */}
      <Page size="A4" style={pageStyle}>
        <PageHeader styled={styled} />

        {/* Company header info */}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 6, marginTop: 4 }}>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right' }}>
              גרין סוכנות לביטוח פנסיוני
            </Text>
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right' }}>
              ושיווק השקעות (2024) בע"מ,
            </Text>
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right' }}>
              מקבוצת אגם לידרים והפניקס
            </Text>
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right' }}>
              חברה לביטוח
            </Text>
          </View>
        </View>

        {/* Advisor row */}
        <View style={{
          flexDirection: 'row',
          borderWidth: 1,
          borderColor: styled ? C.gold : C.primary,
          marginBottom: 14,
          ...(styled ? { backgroundColor: C.offWhite } : {}),
        }}>
          <View style={{ flex: 1, borderLeftWidth: 1, borderLeftColor: styled ? C.gold : C.primary, paddingVertical: 4, paddingHorizontal: 6 }}>
            <Text style={{ fontSize: 8, textAlign: 'right', color: C.muted }}>מס רישיון</Text>
            <Text style={{ fontSize: 10, textAlign: 'right', fontWeight: 'bold' }}>{d.advisorLicense || ''}</Text>
          </View>
          <View style={{ flex: 1, borderLeftWidth: 1, borderLeftColor: styled ? C.gold : C.primary, paddingVertical: 4, paddingHorizontal: 6 }}>
            <Text style={{ fontSize: 8, textAlign: 'right', color: C.muted }}>ת.ז</Text>
            <Text style={{ fontSize: 10, textAlign: 'left', fontWeight: 'bold' }}>{d.advisorId || ''}</Text>
          </View>
          <View style={{ flex: 2, paddingVertical: 4, paddingHorizontal: 6 }}>
            <Text style={{ fontSize: 8, textAlign: 'right', color: C.muted }}>שם המשווק</Text>
            <Text style={{ fontSize: 10, textAlign: 'right', fontWeight: 'bold' }}>{d.advisorName || ''}</Text>
          </View>
        </View>

        {/* Title */}
        <SectionTitle styled={styled}>הסכם שיווק השקעות</SectionTitle>
        <Text style={{ fontSize: 10, textAlign: 'center', marginBottom: 16, color: C.black }}>
          {`שנערך ונחתם ב${d.city || '____________'} ביום ${d.date || '__ בחודש___ 2025'}`}
        </Text>

        {/* בין */}
        <Text style={{ fontSize: 11, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 }}>בין</Text>

        {/* GREEN details */}
        <Text style={{ fontSize: 10, fontWeight: 'bold', textAlign: 'center', marginBottom: 2 }}>
          גרין סוכנות לביטוח פנסיוני ושיווק השקעות (2024) בע"מ
        </Text>
        <Text style={{ fontSize: 10, textAlign: 'center', marginBottom: 2 }}>
          ח.פ 516415361 מס' רישיון 852
        </Text>
        <Text style={{ fontSize: 10, textAlign: 'center', marginBottom: 2 }}>
          ממגדל משה אביב, רחוב ז'בוטניסקי 7 רמת גן
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 2 }}>
          <Text style={{ fontSize: 10, textAlign: 'left' }}>INFO@GREENWM.CO.IL</Text>
          <Text style={{ fontSize: 10, marginLeft: 4 }}> דוא"ל</Text>
        </View>
        <Text style={{ fontSize: 10, textAlign: 'center', marginBottom: 2 }}>
          (להלן – "גרין")
        </Text>
        <Text style={{ fontSize: 10, fontWeight: 'bold', textAlign: 'right', marginBottom: 10 }}>
          מצד אחד;
        </Text>

        {/* לבין */}
        <Text style={{ fontSize: 11, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 }}>לבין</Text>

        {/* Client A */}
        <ClientTable
          name={d.clientAName} id={d.clientAId} address={d.clientAAddress}
          phone={d.clientAPhone} email={d.clientAEmail} idLabel="ת.ז /ח.פ" styled={styled}
        />
        <Text style={{ fontSize: 10, textAlign: 'center', marginBottom: 10 }}>
          (להלן – "לקוח א'")
        </Text>

        {/* Client B */}
        <ClientTable
          name={d.clientBName} id={d.clientBId} address={d.clientBAddress}
          phone={d.clientBPhone} email={d.clientBEmail} idLabel="ת.ז" styled={styled}
        />
        <Text style={{ fontSize: 10, textAlign: 'center', marginBottom: 4 }}>
          (להלן – "לקוח ב')
        </Text>
        <Text style={{ fontSize: 10, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 }}>
          (להלן לקוח א' ולקוח ב', אלא אם נקבע במפורש אחרת – "הלקוח")
        </Text>

        <Text style={{ fontSize: 10, fontWeight: 'bold', textAlign: 'right', marginBottom: 10 }}>
          מצד שני;
        </Text>

        {/* הואיל opening */}
        <Para>
          {'הואיל וגרין היא סוכנות ביטוח בעלת רישיון סוכן ביטוח בענף הביטוח הפנסיוני בהתאם להוראות חוק הפיקוח על שירותים פיננסיים (ביטוח), תשמ"א-1981 (להלן -"חוק הביטוח") ורישיון משווק השקעות'}
        </Para>

        <PageFooter />
      </Page>

      {/* ═══════════════════ PAGE 2: CLAUSES 1-4 ═══════════════════ */}
      <Page size="A4" style={pageStyle}>
        <PageHeader styled={styled} />

        <Para>
          {'בהתאם להוראות חוק הסדרת העיסוק בייעוץ השקעות, בשיווק השקעות ובניהול תיק השקעות, תשנ"ה-1995 (להלן- "חוק ההשקעות");'}
        </Para>

        <Para style={{ marginTop: 6 }}>
          {'והואיל והלקוח מעוניין לקבל מגרין שירותי שיווק השקעות כהגדרתם בחוק ההשקעות (להלן- "השירותים"), לאחר שהובהר לו, כי השירותים הם שירותים נפרדים משירותי השיווק הפנסיוני, ואינם מתייחסים למוצרי ביטוח ו/או מוצרים פנסיוניים המנוהלים על ידי הגופים המוסדיים, ואינם מפוקחים על ידי רשות שוק ההון, ביטוח וחיסכון;'}
        </Para>

        <Para>
          {'והואיל והצדדים מתקשרים ביניהם בהסכם בעניין השירותים, בהתאם לתנאים ולהוראות שלהלן;'}
        </Para>

        <Para bold style={{ marginTop: 8, marginBottom: 12 }}>
          {'לפיכך, הוצהר, הותנה והוסכם בין הצדדים כדלקמן:'}
        </Para>

        <NumPara num=".1">
          {'המבוא להסכם זה ונספחיו מהווים חלק בלתי נפרד הימנו.'}
        </NumPara>

        <NumPara num=".2">
          {'גרין מתחייבת:'}
        </NumPara>

        <NumPara num="2.1" indent={16}>
          {'להעניק ללקוח את השירותים בהתאם להוראות כל דין, ובפרט להוראת חוק ההשקעות, באמצעות בעל רישיון משווק השקעות מטעמה.'}
        </NumPara>

        <NumPara num="2.2" indent={16}>
          {'לפעול לטובת הלקוח, באמונה ובשקידה, ולא להעדיף את ענייניה האישיים או ענייניו של אחר על פני טובת הלקוח, ולא להעדיף את ענינו של לקוח על פני לקוח אחר, בכפוף לאמור בגילוי הנאות לעניין זיקה.'}
        </NumPara>

        <NumPara num="2.3" indent={16}>
          {'מצורף כנספח "א" להסכם זה גילוי נאות מצד גרין.'}
        </NumPara>

        <NumPara num=".3">
          {'גרין תפעל, ככל הניתן, על מנת להתאים את שיווק ההשקעות, במסגרת השירותים, לצרכים ולהנחיות של הלקוח, כפי שיימסרו לגרין, בקשר עם הנתונים כמפורט בנספח "ב" להסכם זה. יודגש, כי אי מסירת פרטים מלאים בעניין נתוני הלקוח וצרכיו, עלולה לפגוע בשירות הניתן ללקוח, וללקוח לא תהא כל טענה כלפי גרין במקרה של אי התאמת השירות הנובעת מהעברת פרטים מלאים כאמור'}
        </NumPara>

        <NumPara num=".4">
          {'אלא אם ייקבע במפורש אחרת, השירותים לא יכללו בכל מקרה ביצוע פעולות על ידי גרין עבור הלקוח, וכל פעולה בהמשך לשירותים תבוצע על ידי הלקוח עצמו מול היצרנים הרלוונטיים, ובאחריות הלקוח לוודא ביצוע הפעולה לשביעות רצונו. בכל מקרה גרין אינה אחראית לפעילותו של יצרן כלשהו. למען הסר ספק, בכל מקרה כל החלטת השקעה תהא על פי שיקול דעת הלקוח בלבד, וגרין לא תבצע כל פעולת השקעה על פי שיקול דעתה.'}
        </NumPara>

        <PageFooter />
      </Page>

      {/* ═══════════════════ PAGE 3: CLAUSES 5-12 ═══════════════════ */}
      <Page size="A4" style={pageStyle}>
        <PageHeader styled={styled} />

        <NumPara num=".5">
          {'יודגש, כי הסכם זה חל על שירותי שיווק השקעות המפוקחים על ידי רשות ניירות ערך, וחובותיה של גרין לפי חוק ההשקעות אינן חלות על שירותים של הפניית לקוחות לקבלת שירות מצדדים שלישיים, או מתן מידע על ידי גרין, שאינו כולל חיווי דעה או המלצה מקצועית בעניין כדאיות ההשקעה בניירות ערך ו/או בנכסים פיננסיים, שאינו עולה כדי שיווק השקעות.'}
        </NumPara>

        <NumPara num=".6">
          {'לשם מתן השירותים מעניק הלקוח לגרין ו/או למי מטעמה, ייפוי כוח לשם פניה ליצרנים כמפורט בנספח "ג" להסכם זה. הלקוח מסכים לחתום על ייפוי כוח מתאים לצורך קבלת מידע מכל רלוונטי, וכפי שיידרש מעת לעת.'}
        </NumPara>

        <NumPara num=".7">
          {'שירותי השיווק יינתנו במשרדי גרין, בימי העבודה המקובלים במשק ובין השעות 9:00 עד 16:00 או במועדים אחרים כפי שיקבעו בין הצדדים, על אף האמור לעיל, מוסכם בין הצדדים כי ניתן להעניק את השירותים גם באמצעות הטלפון ו/או אמצעי היוועדות חזותית, והכל לפי שיקול דעתה של גרין.'}
        </NumPara>

        <NumPara num=".8">
          {'התגמול לגרין יהיה, כמפורט בנספח "ד" להסכם זה.'}
        </NumPara>

        <NumPara num=".9">
          {'הסכם זה ייכנס לתוקף במועד חתימתו ויעמוד בתוקף למשך תקופה בלתי קצובה. הלקוח רשאי לבטל, בכל עת, את ההתקשרות עם גרין לעניין שירותי שיווק ההשקעות לפי הסכם זה. גרין תהא רשאית לבטל את ההתקשרות עם הלקוח לעניין שירותי שיווק ההשקעות לפי הסכם זה, בהודעה של 14 ימים מראש מוסכם על הצדדים, כי משיכת מלוא הכספים בגינם ניתנים השירותים לפי הסכם זה, תיחשב, לכל דבר ועניין כהודעת סיום ההסכם על ידי הלקוח, אלא אם יוסכם בין הצדדים אחרת.'}
        </NumPara>

        <NumPara num=".10">
          {'יובהר ויודגש, כי גרין תעניק את השירותים על פי הסכם זה, ברמה נאותה, אך אין במתן השירותים כדי להוות הבטחה או אחריות מכל סוג שהוא לתוצאות ההשקעה או כדאיותה, וגרין אינה אחראית בכל צורה ואופן לפעילותם של צדדים שלישיים.'}
        </NumPara>

        <NumPara num=".11">
          {'ידוע ללקוח, כי מידע שיימסר על ידו במסגרת השירותים ו/או שיתקבל לגביו אגב השירותים יישמר במאגרי המידע של גרין וכן של חברות נוספות מקבוצת אגם, וזאת לצורך שירות לקוחות לרבות מתן הצעות שיווקיות המיועדות ללקוחות קבוצת אגם, ובכלל זה ישמש לדיוור ישיר ו/או שירותי דיוור ישיר. מובהר, כי אין חלה על הלקוח חובה על פי דין למסור מידע לגרין, וכל מידע יימסר בהסכמתו ומרצונו החופשי של הלקוח.'}
        </NumPara>

        <NumPara num=".12">
          {'הלקוח מאשר בזאת לגרין ו/או לחברות אחרות בקבוצת אגם, לפנות אליו בפניות שיווקיות בתחומי הביטוח והפיננסיים ו/או הטבות המיועדות ללקוחות הקבוצה גם באמצעים דיגיטליים (דוא"ל, מסרונים, מערכות שיחה אוטומטיות, פקס וכו\').'}
        </NumPara>

        <SignRow signers={['חתימת הלקוח']} dateValue={dateVal} />

        <PageFooter />
      </Page>

      {/* ═══════════════════ PAGE 4: CLAUSES 13-15 + SIGNATURES ═══════════════════ */}
      <Page size="A4" style={pageStyle}>
        <PageHeader styled={styled} />

        <NumPara num=".13">
          {'יובהר, כי הלקוח יהיה רשאי להסיר עצמו, בכל עת, מרשימות דיוור שיווקיות באמצעות הודעה למייל info@greenwm.co.il. גם אם הלקוח לא חתם על סעיף 12 לעיל ו/או יסיר עצמו מהודעות שיווקיות כאמור, הרי שכל עוד הוא לקוח של גרין, גרין תמשיך לשלוח ללקוח הודעות באמצעים דיגיטליים בעניינים הנוגעים ישירות לשירותים (לרבות עדכונים מקצועיים) ו/או כמתחייב על פי דין, ובחתימתו בשולי הסכם זה הלקוח נותן הסכמתו לכך.'}
        </NumPara>

        <NumPara num=".14">
          {'גרין מתחייבת לשמור באופן סודי כל מידע שהביא הלקוח לידיעתה, לרבות מסמכים שהועברו לרשותה ותוכנם, וכל פרט אחר המתייחס לפעולות לגביהן עסקה בשיווק כלפי הלקוח, למעט אם יוסכם אחרת בכתב ו/או במקרה בו תידרש גרין למסור ידיעות על פי כל דין.'}
        </NumPara>

        <Para bold style={{ textDecoration: 'underline' }}>
          {'15. שונות'}
        </Para>

        <NumPara num="15.1" indent={16}>
          {'הסכם זה ממצה את המוסכם בין הצדדים לעניינים המוסדרים בו, והכל בכפוף להוראות חוק ההשקעות. לא יחול כל שינוי בהסכם זה, אלא אם ייערך בכתב וייחתם על ידי שני הצדדים.'}
        </NumPara>

        <NumPara num="15.2" indent={16}>
          {'רישומי גרין ייחשבו, בכל הנוגע להסכם זה והשירותים לפיו כראיה מכרעת לעניין המופיע בהם.'}
        </NumPara>

        <NumPara num="15.3" indent={16}>
          {'כל הודעה שנשלחה בין הצדדים לפי הכתובות בכותרת הסכם זה, תיחשב כאילו הגיעה ליעדה, בתוך 3 ימי עסקים ממועד המשלוח באמצעת דואר רשום ו/או בתוך יום עסקים אחד לאחר שנשלחה בדוא"ל או נמסרה במסירה ידנית. לעניין הלקוח, אלא אם נקבע אחרת, מסירה לכל אחד מיחידי הלקוח תיחשב כמסירה למשנהו.'}
        </NumPara>

        <Para bold style={{ marginTop: 12, marginBottom: 8 }}>
          ולראיה באו הצדדים על החתום:
        </Para>

        {/* Advisor sig + stamp above GREEN signature block */}
        {styled && (advisorSig || stamp) ? (
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', gap: 8, marginTop: 16, marginBottom: 2 }}>
            {advisorSig && isValidImageSrc(advisorSig) ? <Image src={advisorSig} style={{ width: 160, height: 60, objectFit: 'contain' }} /> : null}
            {stamp && isValidImageSrc(stamp) ? <Image src={stamp} style={{ width: 160, height: 60, objectFit: 'contain' }} /> : null}
          </View>
        ) : null}

        {/* 3 signatures side by side */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: styled && (advisorSig || stamp) ? 4 : 16 }}>
          <SignBlock label="לקוח ב'" dateValue={dateVal} />
          <SignBlock label="לקוח א'" dateValue={dateVal} />
          <SignBlock label={'גרין סוכנות לביטוח פנסיוני\nושיווק השקעות בע"מ'} dateValue={dateVal} />
        </View>

        <PageFooter />
      </Page>

      {/* ═══════════════════ PAGE 5: נספח א׳ — גילוי נאות ═══════════════════ */}
      <Page size="A4" style={pageStyle}>
        <PageHeader styled={styled} />

        <SectionTitle styled={styled}>נספח "א"- גילוי נאות</SectionTitle>

        <Para>
          {'בהתאם לסעיף 16א לחוק הסדרת העיסוק בייעוץ השקעות, בשיווק השקעות, ובניהול תיקי השקעות, תשנ"ה-1995 (להלן – "החוק") גרין סוכנות לביטוח פנסיוני ושיווק השקעות (2024) בע"מ (להלן – "החברה") חברה בעלת רישיון משווק השקעות ולא יועץ השקעות, מקבוצת אגם לידרים (ישראל) סוכנות לביטוח (2003) בע"מ, והפניקס אחזקות בע"מ (להלן – "קבוצת הפניקס").'}
        </Para>

        <Para>
          {'החברה היא חברה קשורה לגופים מוסדיים, משווקי השקעות ומנהלי תיקים, והיא בעלת זיקה לגופים ולנכסים פיננסיים כמפורט בטבלה שלהלן (להלן – "גופים בעלי זיקה")'}
        </Para>

        {/* Entity table */}
        <View style={{ borderWidth: 1, borderColor: styled ? C.gold : C.primary, borderRadius: 2, marginTop: 6 }}>
          {DISCLOSURE_ENTITIES.map(([right, left], i) => (
            <TwoColRow key={i} right={right} left={left} even={i % 2 === 0} />
          ))}
        </View>

        <PageFooter />
      </Page>

      {/* ═══════════════════ PAGE 6: המשך נספח א׳ + חתימה ═══════════════════ */}
      <Page size="A4" style={pageStyle}>
        <PageHeader styled={styled} />

        <Para>
          {'במסגרת עיסוקה בשיווק השקעות , רשאית החברה להעדיף נכס פיננסי שיש לה זיקה אליו על פני נכס אחר, הדומה מבחינת התאמתו ללקוח שאין לה זיקה אליו, ובלבד שעמדה בדרישות הגילוי לפי דין. זיקה כאמור לא תיחשב כניגוד עניינים בין החברה לבין הלקוח.'}
        </Para>

        <Para>
          {'בהתאם מודיעה החברה, כי יש לה זיקה לנכסים הפיננסיים המנוהלים ו/או משווקים ו/או מוצעים על ידי גופים בעלי זיקה, כפי שיתעדכן מעת לעת באתר האינטרנט של החברה www.greenwm.co.il וכי היא עשויה לקבלת טובת הנאה בקשר עם ביצוע עסקה בנכסים פיננסיים אליהם יש לה זיקה, לרבות שיווקם ו/או המשך החזקה בהם.'}
        </Para>

        {/* Signature */}
        <View style={{ marginTop: 60, flexDirection: 'row', justifyContent: 'space-evenly' }}>
          <SignBlock label="חתימת הלקוח" dateValue={dateVal} />
        </View>

        <PageFooter />
      </Page>

      {/* ═══════════════════ PAGE 7: נספח ד׳ — תגמול ═══════════════════ */}
      <Page size="A4" style={pageStyle}>
        <PageHeader styled={styled} />

        <SectionTitle styled={styled}>נספח "ד"- נספח תגמול</SectionTitle>

        <Para bold style={{ marginBottom: 10, textAlign: 'center' }}>
          תגמול בעל הרישיון יהיה לפי אחת האפשרויות להלן:
        </Para>

        {/* Option i */}
        <NumPara num=".i">
          {'כנגד קבלת השירותים, יהא זכאי בעל הרישיון לגבות עמלה מגופים פיננסיים שונים להם יש לו זיקה, בגין הפניית הלקוח לגופים הפיננסיים בשיעורים שייקבעו בין בעל הרישיון לבין הגופים הפיננסיים השונים מעת לעת.'}
        </NumPara>

        {/* Signature after option i */}
        {d.compensationModel === 'i' && (
          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 6, marginBottom: 12 }}>
            <SignBlock label="חתימת הלקוח" dateValue={dateVal} />
          </View>
        )}

        <Text style={{ fontSize: 11, textAlign: 'center', marginVertical: 10 }}>או</Text>

        {/* Option ii */}
        <NumPara num=".ii">
          {`כנגד קבלת השירותים, ישלם הלקוח לבעל הרישיון דמי טיפול בשיעור שנתי כולל של %${d.compensationPercent || '____________'} (בתוספת מע"מ) מסך שווי הנכסים המשוערך של הלקוח אשר ביחס אליהם מוענקים שירותים ("נכסי הלקוח") או לחילופין שכר טירחה בגובה ${d.compensationAmount || '____________'} ₪ כפי שהוסכם בין הצדדים.`}
        </NumPara>

        <NumPara num=".א" indent={24}>
          {'התמורה תשולם באופן רבעוני (או חלקו היחסי - לפי העניין), כנגד חשבונית, בתחילת כל רבעון קלנדארי, עבור הרבעון שקדם לו, בהתבסס על שווי נכסי הלקוח המשוערך לתום הרבעון הקלנדארי הקודם.'}
        </NumPara>

        <NumPara num=".ב" indent={24}>
          {'ככל שחלופה זו נבחרה - במידה ויתקבלו בידי בעל הרישיון תקבולים שוטפים מגופים פיננסיים שונים בגין הפניית הלקוח לקבלת שירותים מהם, אזי שכל התקבולים כאמור יוחזרו במלואם ללקוח על ידי הקטנת תשלום הרבעוני.'}
        </NumPara>

        {/* Signature after option ii */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 16 }}>
          <SignBlock label="חתימת הלקוח" dateValue={dateVal} />
        </View>

        <PageFooter />
      </Page>

      {/* ═══════════════════ PAGE 8: השקעות בסיכון מיוחד (conditional) ═══════════════════ */}
      {d.isEligible && (
        <Page size="A4" style={pageStyle}>
          <PageHeader styled={styled} />

          <SectionTitle styled={styled}>השקעות בסיכון מיוחד</SectionTitle>

          <Para>
            {'הלקוח מבקש מבעל הרישיון לקבל שרותים ביחס לעסקאות שכרוכה בהן סיכון מיוחד כמשמעות מונח זה בחוק הסדרת העיסוק בייעוץ השקעות, בשיווק השקעות ובניהול תיקי השקעות, תשנ"ה – 1995, כפי שיעודכן מעת לעת ("עסקה בסיכון מיוחד").'}
          </Para>

          <Para>
            {'הלקוח, מבקש מבעל רישיון שעניין אותו בהשקעה במוצרים מובנים (ניירות ערך ו/או פיקדונות ו/או השקעות אחרות, שהתשואה עליהם או הסיכון הכרוך בהם נקבעים על פי נוסחה המבוססת על שינוי במדד כלשהו, במחיר נייר ערך כלשהו, במחיר סחורה כלשהי, במחיר אופציה או חוזה עתידי כלשהו, בריבית או בהפרשים בין ריביות שונות, בשער חליפין או בהפרשים בין שערי חליפין כלשהם).'}
          </Para>

          <Para>
            {'הלקוח מצהיר כי ידוע לו, כי: (א) מוצרים מובנים הם מוצרים בעלי סיכון גבוה, אשר עשויים לא להניב תשואה כלשהי למשקיע בהם; (ב) אם יתרחש אירוע, המפורט בתנאי מוצר מובנה כלשהו, הוא עשוי שלא להניב ריבית או תשואה כלשהי; (ג) במידה והמוצר המובנה אינו סחיר, ניתן יהיה לפדות ו/או למכור אותו לפני שחלפה התקופה, הקבועה בתנאיו, רק בכפוף לתשלום קנס, באופן שהסכום שיתקבל עשוי להיות נמוך משמעותית מסכום הקרן, או אף, ללא אפשרות לפדות את המוצר בכלל.'}
          </Para>

          <Para>
            {'הלקוח מבקש מבעל רישיון לקבל מידע ביחס לקרנות גידור וקרנות השקעה בישראל ומחוצה לה בכפוף למגבלות הקבועות בכל דין. הלקוח מצהיר כי ידוע לו כי: (א) קרנות גידור וקרנות השקעה הינם מכשירים פיננסיים שעל פי רוב אינם סחירים; (ב) לעתים, ישנה תקופת נעילה בקרנות גידור במהלכה לא ניתן לפדות את כספי הלקוח או לחלופין ניתן לפדות כנגד תשלום קנסות גבוהים; (ג) קרנות הגידור על פי רוב אינן מפוקחות על ידי רשות פיקוח מוסמכת וכפועל יוצא, הן מתנהלות בשקיפות דלה יחסית; (ד) מבנה התגמול בקרנות גידור מבוסס על פי רוב על דמי ניהול קבועים מהיקף הנכסים ודמי הצלחה הנגבים משיעור עליית ערך נכסי התיק המנוהל; (ה) קרנות גידור נוטות למנף את ההשקעה הכלולה בהן תוך הגברת הסיכון לשחיקת הקרן – עד כדי אובדן ההשקעה כליל; (ו) הצטרפות לקרן גידור כוללת בתוכה על פי רוב תניית שיפוט ייחודית למדינה זרה; (ז) היבטי המס הקשורים להשקעה בקרנות גידור אינם ברורים. בעל הרישיון אינו מומחה מס ואינו רשאי ליתן מצג ביחס להיבטי המס הכרוכים בהשקעה בקרן גידור ועל הלקוח לקבל ייעוץ עצמאי בעניין זה; (ח) תנאי הערבות הניתנים על קרן ההשקעה במועד פדיון ההשקעה כפי שקבוע בתשקיף קרן הגידור, כפופים ותלויים בנסיבות פרטניות הכלולות באותם תשקיפים ומותנים בקיומם של נסיבות כמפורט באותם התשקיפים'}
          </Para>

          {/* Signature */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 16 }}>
            <SignBlock label="חתימת הלקוח" dateValue={dateVal} />
          </View>

          {/* Footnote — numbers separated to avoid bidi crash */}
          <View style={{ position: 'absolute', bottom: 50, left: 40, right: 40 }}>
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

          <PageFooter />
        </Page>
      )}

    </Document>
  )
}

// ══════════════════════════════════════════════════════════════
//  BLANK VERSION — טופס ידני להדפסה ומילוי ביד
// ══════════════════════════════════════════════════════════════

const BL = '____________' // short blank
const BLL = '________________________' // long blank
const BLLL = '____________________________________' // extra long

// ── Blank Signature Block — unified template ──────────────────
const BlankSign = ({ label, width = 200 }) => (
  <View style={{ flexDirection: 'column', alignItems: 'center', width }}>
    <View style={{ width, borderBottomWidth: 1, borderBottomColor: '#000', height: 1 }} />
    <Text style={{ fontSize: 9, textAlign: 'center', marginTop: 4 }}>{label}</Text>
    <View style={{ width: 140, borderBottomWidth: 1, borderBottomColor: '#000', height: 1, marginTop: 12 }} />
    <Text style={{ fontSize: 9, textAlign: 'right', marginTop: 4 }}>:תאריך</Text>
  </View>
)

// ── Blank Client Table — all fields empty ─────────────────────
const BlankClientTable = ({ idLabel }) => (
  <View style={{ borderWidth: 1, borderColor: C.primary, marginBottom: 4 }}>
    <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: C.primary }}>
      <View style={{ flex: 1, borderLeftWidth: 1, borderLeftColor: C.primary, paddingVertical: 4, paddingHorizontal: 6 }}>
        <Text style={{ fontSize: 8, color: C.muted, textAlign: 'right' }}>כתובת</Text>
        <View style={{ borderBottomWidth: 0.5, borderBottomColor: C.black, height: 14, marginTop: 2 }} />
      </View>
      <View style={{ flex: 1, borderLeftWidth: 1, borderLeftColor: C.primary, paddingVertical: 4, paddingHorizontal: 6 }}>
        <Text style={{ fontSize: 8, color: C.muted, textAlign: 'right' }}>{idLabel || 'ת.ז /ח.פ'}</Text>
        <View style={{ borderBottomWidth: 0.5, borderBottomColor: C.black, height: 14, marginTop: 2 }} />
      </View>
      <View style={{ flex: 1.5, paddingVertical: 4, paddingHorizontal: 6 }}>
        <Text style={{ fontSize: 8, color: C.muted, textAlign: 'right' }}>שם הלקוח</Text>
        <View style={{ borderBottomWidth: 0.5, borderBottomColor: C.black, height: 14, marginTop: 2 }} />
      </View>
    </View>
    <View style={{ flexDirection: 'row' }}>
      <View style={{ flex: 1, borderLeftWidth: 1, borderLeftColor: C.primary, paddingVertical: 4, paddingHorizontal: 6 }}>
        <Text style={{ fontSize: 8, color: C.muted, textAlign: 'right' }}>דואר אלקטרוני</Text>
        <View style={{ borderBottomWidth: 0.5, borderBottomColor: C.black, height: 14, marginTop: 2 }} />
      </View>
      <View style={{ flex: 1, paddingVertical: 4, paddingHorizontal: 6 }}>
        <Text style={{ fontSize: 8, color: C.muted, textAlign: 'right' }}>טלפון</Text>
        <View style={{ borderBottomWidth: 0.5, borderBottomColor: C.black, height: 14, marginTop: 2 }} />
      </View>
    </View>
  </View>
)

// ── Blank Paragraph (no bold on body) ─────────────────────────
const BPara = ({ children, style }) => (
  <Text style={[{
    fontSize: 10,
    textAlign: 'right',
    lineHeight: 1.6,
    marginBottom: 6,
    color: C.black,
     }, style]}>
    {children}
  </Text>
)

// ── Blank Numbered Paragraph (RTL-safe) ──────────────────────
const BNumPara = ({ num, children, indent, style }) => (
  <View style={[{ flexDirection: 'row-reverse', marginBottom: 6 }, indent && { paddingRight: indent }, style]}>
    <Text style={{ fontSize: 10, textAlign: 'right', lineHeight: 1.6, width: 30, color: C.black }}>{num}</Text>
    <Text style={{ fontSize: 10, textAlign: 'right', lineHeight: 1.6, flex: 1, color: C.black }}>{children}</Text>
  </View>
)

// ── Blank Section Title ───────────────────────────────────────
const BlankTitle = ({ children }) => (
  <Text style={{ fontSize: 12, fontWeight: 'bold', color: C.primary, textAlign: 'center', marginBottom: 14, marginTop: 6, textDecoration: 'underline' }}>
    {children}
  </Text>
)

// ── Blank Header (no styled variant) ──────────────────────────
const BlankHeader = () => (
  <View fixed style={{ marginBottom: 8 }}>
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingBottom: 8,
      borderBottomWidth: 1.5,
      borderBottomColor: C.gold,
    }}>
      <Image src={logoPng} style={{ height: 36, width: 'auto' }} />
      <View style={{ flex: 1 }} />
    </View>
  </View>
)

const BlankMarketingAgreementDoc = () => (
  <Document>

    {/* ═══════════════════ PAGE 1: COVER + PARTIES ═══════════════════ */}
    <Page size="A4" style={pageStyle}>
      <BlankHeader />

      {/* Advisor table — 4 columns matching Word: company name (merged) | שם המשווק | ת.ז | מס רישיון */}
      <View style={{ borderWidth: 0.5, borderColor: C.border, marginBottom: 14, marginTop: 4 }}>
        {/* Header row */}
        <View style={{ flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: C.border }}>
          <View style={{ width: '22%', borderLeftWidth: 0.5, borderLeftColor: C.border, paddingVertical: 4, paddingHorizontal: 6 }}>
            <Text style={{ fontSize: 9, fontWeight: 'bold', textAlign: 'right' }}>מס רישיון</Text>
          </View>
          <View style={{ width: '20%', borderLeftWidth: 0.5, borderLeftColor: C.border, paddingVertical: 4, paddingHorizontal: 6 }}>
            <Text style={{ fontSize: 9, fontWeight: 'bold', textAlign: 'right' }}>ת.ז</Text>
          </View>
          <View style={{ width: '26%', borderLeftWidth: 0.5, borderLeftColor: C.border, paddingVertical: 4, paddingHorizontal: 6 }}>
            <Text style={{ fontSize: 9, fontWeight: 'bold', textAlign: 'right' }}>שם המשווק</Text>
          </View>
          <View style={{ width: '32%', paddingVertical: 4, paddingHorizontal: 6 }}>
            <Text style={{ fontSize: 9, fontWeight: 'bold', textAlign: 'right' }}>גרין סוכנות לביטוח פנסיוני ושיווק השקעות (2024) בע"מ,</Text>
            <Text style={{ fontSize: 9, fontWeight: 'bold', textAlign: 'right' }}>מקבוצת אגם לידרים והפניקס חברה לביטוח</Text>
          </View>
        </View>
        {/* Data row — blank */}
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: '22%', borderLeftWidth: 0.5, borderLeftColor: C.border, paddingVertical: 4, paddingHorizontal: 6 }}>
            <View style={{ borderBottomWidth: 0.5, borderBottomColor: C.black, height: 14, marginTop: 2 }} />
          </View>
          <View style={{ width: '20%', borderLeftWidth: 0.5, borderLeftColor: C.border, paddingVertical: 4, paddingHorizontal: 6 }}>
            <View style={{ borderBottomWidth: 0.5, borderBottomColor: C.black, height: 14, marginTop: 2 }} />
          </View>
          <View style={{ width: '26%', borderLeftWidth: 0.5, borderLeftColor: C.border, paddingVertical: 4, paddingHorizontal: 6 }}>
            <View style={{ borderBottomWidth: 0.5, borderBottomColor: C.black, height: 14, marginTop: 2 }} />
          </View>
          <View style={{ width: '32%', paddingVertical: 4, paddingHorizontal: 6 }} />
        </View>
      </View>

      {/* Title */}
      <BlankTitle>הסכם שיווק השקעות</BlankTitle>
      <Text style={{ fontSize: 10, fontWeight: 'bold', textAlign: 'center', marginBottom: 16, color: C.black }}>
        {'שנערך ונחתם ב____________ ביום __ בחודש___ 2026'}
      </Text>

      {/* בין */}
      <Text style={{ fontSize: 11, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 }}>בין</Text>

      {/* GREEN details — all bold, center, matching Word */}
      <Text style={{ fontSize: 10, fontWeight: 'bold', textAlign: 'center', marginBottom: 2 }}>
        גרין סוכנות לביטוח פנסיוני ושיווק השקעות (2024) בע"מ
      </Text>
      <Text style={{ fontSize: 10, fontWeight: 'bold', textAlign: 'center', marginBottom: 2 }}>
        {'ח.פ 516415361 מס\' רישיון  852'}
      </Text>
      <Text style={{ fontSize: 10, fontWeight: 'bold', textAlign: 'center', marginBottom: 2 }}>
        ממגדל משה אביב, רחוב ז'בוטניסקי 7 רמת גן
      </Text>
      <Text style={{ fontSize: 10, fontWeight: 'bold', textAlign: 'center', marginBottom: 2 }}>
        {'דוא"ל_'}
        <Text style={{ textAlign: 'left' }}>INFO@GREENWM.CO.IL</Text>
      </Text>
      <Text style={{ fontSize: 10, textAlign: 'center', marginBottom: 2 }}>
        {'(להלן – "גרין")'}
      </Text>
      <Text style={{ fontSize: 10, fontWeight: 'bold', textAlign: 'right', marginBottom: 10 }}>
        מצד אחד;
      </Text>

      {/* לבין */}
      <Text style={{ fontSize: 11, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 }}>לבין</Text>

      {/* Client A */}
      <BlankClientTable idLabel="ת.ז /ח.פ" />
      <Text style={{ fontSize: 10, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 }}>
        {'(להלן – "לקוח א\')'}
      </Text>

      {/* Client B */}
      <BlankClientTable idLabel="ת.ז" />
      <Text style={{ fontSize: 10, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 }}>
        {'(להלן – "לקוח ב\')'}
      </Text>
      <Text style={{ fontSize: 10, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 }}>
        {'(להלן לקוח א\' ולקוח ב\', אלא אם נקבע במפורש אחרת – "הלקוח")'}
      </Text>

      <Text style={{ fontSize: 10, fontWeight: 'bold', textAlign: 'right', marginBottom: 10, textDecoration: 'underline' }}>
        מצד שני;
      </Text>

      {/* הואיל opening */}
      <BPara>
        {'הואיל וגרין היא סוכנות ביטוח בעלת רישיון סוכן ביטוח בענף הביטוח הפנסיוני בהתאם להוראות חוק הפיקוח על שירותים פיננסיים (ביטוח), תשמ"א-1981 (להלן -"חוק הביטוח") ורישיון משווק השקעות'}
      </BPara>

      <PageFooter />
    </Page>

    {/* ═══════════════════ PAGE 2: CLAUSES 1-4 ═══════════════════ */}
    <Page size="A4" style={pageStyle}>
      <BlankHeader />

      <BPara>
        {'בהתאם להוראות חוק הסדרת העיסוק בייעוץ השקעות, בשיווק השקעות ובניהול תיק השקעות, תשנ"ה-1995 (להלן- "חוק ההשקעות");'}
      </BPara>

      <BPara style={{ marginTop: 6 }}>
        {'והואיל והלקוח מעוניין לקבל מגרין שירותי שיווק השקעות כהגדרתם בחוק ההשקעות (להלן- "השירותים"), לאחר שהובהר לו, כי השירותים הם שירותים נפרדים משירותי השיווק הפנסיוני, ואינם מתייחסים למוצרי ביטוח ו/או מוצרים פנסיוניים המנוהלים על ידי הגופים המוסדיים, ואינם מפוקחים על ידי רשות שוק ההון, ביטוח וחיסכון;'}
      </BPara>

      <BPara>
        {'והואיל והצדדים מתקשרים ביניהם בהסכם בעניין השירותים, בהתאם לתנאים ולהוראות שלהלן;'}
      </BPara>

      <BPara style={{ marginTop: 8, marginBottom: 12, fontWeight: 'bold' }}>
        {'לפיכך, הוצהר, הותנה והוסכם בין הצדדים כדלקמן:'}
      </BPara>

      <BNumPara num=".1">
        {'המבוא להסכם זה ונספחיו מהווים חלק בלתי נפרד הימנו.'}
      </BNumPara>

      <BNumPara num=".2">
        {'גרין מתחייבת:'}
      </BNumPara>

      <BNumPara num="2.1" indent={16}>
        {'להעניק ללקוח את השירותים בהתאם להוראות כל דין, ובפרט להוראת חוק ההשקעות, באמצעות בעל רישיון משווק השקעות מטעמה.'}
      </BNumPara>

      <BNumPara num="2.2" indent={16}>
        {'לפעול לטובת הלקוח, באמונה ובשקידה, ולא להעדיף את ענייניה האישיים או ענייניו של אחר על פני טובת הלקוח, ולא להעדיף את ענינו של לקוח על פני לקוח אחר, בכפוף לאמור בגילוי הנאות לעניין זיקה.'}
      </BNumPara>

      <BNumPara num="2.3" indent={16}>
        {'מצורף כנספח "א" להסכם זה גילוי נאות מצד גרין.'}
      </BNumPara>

      <BNumPara num=".3">
        {'גרין תפעל, ככל הניתן, על מנת להתאים את שיווק ההשקעות, במסגרת השירותים, לצרכים ולהנחיות של הלקוח, כפי שיימסרו לגרין, בקשר עם הנתונים כמפורט בנספח "ב" להסכם זה. יודגש, כי אי מסירת פרטים מלאים בעניין נתוני הלקוח וצרכיו, עלולה לפגוע בשירות הניתן ללקוח, וללקוח לא תהא כל טענה כלפי גרין במקרה של אי התאמת השירות הנובעת מהעברת פרטים מלאים כאמור'}
      </BNumPara>

      <BNumPara num=".4">
        {'אלא אם ייקבע במפורש אחרת, השירותים לא יכללו בכל מקרה ביצוע פעולות על ידי גרין עבור הלקוח, וכל פעולה בהמשך לשירותים תבוצע על ידי הלקוח עצמו מול היצרנים הרלוונטיים, ובאחריות הלקוח לוודא ביצוע הפעולה לשביעות רצונו. בכל מקרה גרין אינה אחראית לפעילותו של יצרן כלשהו. למען הסר ספק, בכל מקרה כל החלטת השקעה תהא על פי שיקול דעת הלקוח בלבד, וגרין לא תבצע כל פעולת השקעה על פי שיקול דעתה.'}
      </BNumPara>

      <PageFooter />
    </Page>

    {/* ═══════════════════ PAGE 3: CLAUSES 5-12 ═══════════════════ */}
    <Page size="A4" style={pageStyle}>
      <BlankHeader />

      <BNumPara num=".5">
        {'יודגש, כי הסכם זה חל על שירותי שיווק השקעות המפוקחים על ידי רשות ניירות ערך, וחובותיה של גרין לפי חוק ההשקעות אינן חלות על שירותים של הפניית לקוחות לקבלת שירות מצדדים שלישיים, או מתן מידע על ידי גרין, שאינו כולל חיווי דעה או המלצה מקצועית בעניין כדאיות ההשקעה בניירות ערך ו/או בנכסים פיננסיים, שאינו עולה כדי שיווק השקעות.'}
      </BNumPara>

      <BNumPara num=".6">
        {'לשם מתן השירותים מעניק הלקוח לגרין ו/או למי מטעמה, ייפוי כוח לשם פניה ליצרנים כמפורט בנספח "ג" להסכם זה. הלקוח מסכים לחתום על ייפוי כוח מתאים לצורך קבלת מידע מכל רלוונטי, וכפי שיידרש מעת לעת.'}
      </BNumPara>

      <BNumPara num=".7">
        {'שירותי השיווק יינתנו במשרדי גרין, בימי העבודה המקובלים במשק ובין השעות 9:00 עד 16:00 או במועדים אחרים כפי שיקבעו בין הצדדים, על אף האמור לעיל, מוסכם בין הצדדים כי ניתן להעניק את השירותים גם באמצעות הטלפון ו/או אמצעי היוועדות חזותית, והכל לפי שיקול דעתה של גרין.'}
      </BNumPara>

      <BNumPara num=".8">
        {'התגמול לגרין יהיה, כמפורט בנספח "ד" להסכם זה.'}
      </BNumPara>

      <BNumPara num=".9">
        {'הסכם זה ייכנס לתוקף במועד חתימתו ויעמוד בתוקף למשך תקופה בלתי קצובה. הלקוח רשאי לבטל, בכל עת, את ההתקשרות עם גרין לעניין שירותי שיווק ההשקעות לפי הסכם זה. גרין תהא רשאית לבטל את ההתקשרות עם הלקוח לעניין שירותי שיווק ההשקעות לפי הסכם זה, בהודעה של 14 ימים מראש מוסכם על הצדדים, כי משיכת מלוא הכספים בגינם ניתנים השירותים לפי הסכם זה, תיחשב, לכל דבר ועניין כהודעת סיום ההסכם על ידי הלקוח, אלא אם יוסכם בין הצדדים אחרת.'}
      </BNumPara>

      <BNumPara num=".10">
        {'יובהר ויודגש, כי גרין תעניק את השירותים על פי הסכם זה, ברמה נאותה, אך אין במתן השירותים כדי להוות הבטחה או אחריות מכל סוג שהוא לתוצאות ההשקעה או כדאיותה, וגרין אינה אחראית בכל צורה ואופן לפעילותם של צדדים שלישיים.'}
      </BNumPara>

      <BNumPara num=".11">
        {'ידוע ללקוח, כי מידע שיימסר על ידו במסגרת השירותים ו/או שיתקבל לגביו אגב השירותים יישמר במאגרי המידע של גרין וכן של חברות נוספות מקבוצת אגם, וזאת לצורך שירות לקוחות לרבות מתן הצעות שיווקיות המיועדות ללקוחות קבוצת אגם, ובכלל זה ישמש לדיוור ישיר ו/או שירותי דיוור ישיר. מובהר, כי אין חלה על הלקוח חובה על פי דין למסור מידע לגרין, וכל מידע יימסר בהסכמתו ומרצונו החופשי של הלקוח.'}
      </BNumPara>

      <BNumPara num=".12">
        {'הלקוח מאשר בזאת לגרין ו/או לחברות אחרות בקבוצת אגם, לפנות אליו בפניות שיווקיות בתחומי הביטוח והפיננסיים ו/או הטבות המיועדות ללקוחות הקבוצה גם באמצעים דיגיטליים (דוא"ל, מסרונים, מערכות שיחה אוטומטיות, פקס וכו\').'}
      </BNumPara>

      {/* Signature for clause 12 */}
      <View wrap={false} style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 20, marginBottom: 8 }}>
        <BlankSign label="חתימת הלקוח" />
      </View>

      <PageFooter />
    </Page>

    {/* ═══════════════════ PAGE 4: CLAUSES 13-15 + SIGNATURES ═══════════════════ */}
    <Page size="A4" style={pageStyle}>
      <BlankHeader />

      <BNumPara num=".13">
        {'יובהר, כי הלקוח יהיה רשאי להסיר עצמו, בכל עת, מרשימות דיוור שיווקיות באמצעות הודעה למייל info@greenwm.co.il. גם אם הלקוח לא חתם על סעיף 12 לעיל ו/או יסיר עצמו מהודעות שיווקיות כאמור, הרי שכל עוד הוא לקוח של גרין, גרין תמשיך לשלוח ללקוח הודעות באמצעים דיגיטליים בעניינים הנוגעים ישירות לשירותים (לרבות עדכונים מקצועיים) ו/או כמתחייב על פי דין, ובחתימתו בשולי הסכם זה הלקוח נותן הסכמתו לכך.'}
      </BNumPara>

      <BNumPara num=".14">
        {'גרין מתחייבת לשמור באופן סודי כל מידע שהביא הלקוח לידיעתה, לרבות מסמכים שהועברו לרשותה ותוכנם, וכל פרט אחר המתייחס לפעולות לגביהן עסקה בשיווק כלפי הלקוח, למעט אם יוסכם אחרת בכתב ו/או במקרה בו תידרש גרין למסור ידיעות על פי כל דין.'}
      </BNumPara>

      <Text style={{ fontSize: 10, fontWeight: 'bold', textDecoration: 'underline', textAlign: 'right', marginBottom: 6, color: C.black }}>
        {'15. שונות'}
      </Text>

      <BNumPara num="15.1" indent={16}>
        {'הסכם זה ממצה את המוסכם בין הצדדים לעניינים המוסדרים בו, והכל בכפוף להוראות חוק ההשקעות. לא יחול כל שינוי בהסכם זה, אלא אם ייערך בכתב וייחתם על ידי שני הצדדים.'}
      </BNumPara>

      <BNumPara num="15.2" indent={16}>
        {'רישומי גרין ייחשבו, בכל הנוגע להסכם זה והשירותים לפיו כראיה מכרעת לעניין המופיע בהם.'}
      </BNumPara>

      <BNumPara num="15.3" indent={16}>
        {'כל הודעה שנשלחה בין הצדדים לפי הכתובות בכותרת הסכם זה, תיחשב כאילו הגיעה ליעדה, בתוך 3 ימי עסקים ממועד המשלוח באמצעת דואר רשום ו/או בתוך יום עסקים אחד לאחר שנשלחה בדוא"ל או נמסרה במסירה ידנית. לעניין הלקוח, אלא אם נקבע אחרת, מסירה לכל אחד מיחידי הלקוח תיחשב כמסירה למשנהו.'}
      </BNumPara>

      <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 12, marginBottom: 8, color: C.black }}>
        ולראיה באו הצדדים על החתום:
      </Text>

      {/* 3 signatures — space-between, 160pt each */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 16 }}>
        <BlankSign label="לקוח ב'" width={160} />
        <BlankSign label="לקוח א'" width={160} />
        <BlankSign label={'גרין סוכנות לביטוח פנסיוני ושיווק השקעות בע"מ'} width={160} />
      </View>

      <PageFooter />
    </Page>

    {/* ═══════════════════ PAGE 5: נספח א׳ — גילוי נאות ═══════════════════ */}
    <Page size="A4" style={pageStyle}>
      <BlankHeader />

      <BlankTitle>נספח "א"- גילוי נאות</BlankTitle>

      <BPara>
        {'בהתאם לסעיף 16א לחוק הסדרת העיסוק בייעוץ השקעות, בשיווק השקעות, ובניהול תיקי השקעות, תשנ"ה-1995 (להלן – "החוק") גרין סוכנות לביטוח פנסיוני ושיווק השקעות (2024) בע"מ (להלן – "החברה") חברה בעלת רישיון משווק השקעות ולא יועץ השקעות, מקבוצת אגם לידרים (ישראל) סוכנות לביטוח (2003) בע"מ, והפניקס אחזקות בע"מ (להלן – "קבוצת הפניקס").'}
      </BPara>

      <BPara>
        {'החברה היא חברה קשורה לגופים מוסדיים, משווקי השקעות ומנהלי תיקים, והיא בעלת זיקה לגופים ולנכסים פיננסיים כמפורט בטבלה שלהלן (להלן – "גופים בעלי זיקה")'}
      </BPara>

      {/* Entity table */}
      <View style={{ borderWidth: 1, borderColor: C.primary, borderRadius: 2, marginTop: 6 }}>
        {DISCLOSURE_ENTITIES.map(([right, left], i) => (
          <TwoColRow key={i} right={right} left={left} even={i % 2 === 0} />
        ))}
      </View>

      <PageFooter />
    </Page>

    {/* ═══════════════════ PAGE 6: המשך נספח א׳ + חתימה ═══════════════════ */}
    <Page size="A4" style={pageStyle}>
      <BlankHeader />

      <BPara>
        {'במסגרת עיסוקה בשיווק השקעות , רשאית החברה להעדיף נכס פיננסי שיש לה זיקה אליו על פני נכס אחר, הדומה מבחינת התאמתו ללקוח שאין לה זיקה אליו, ובלבד שעמדה בדרישות הגילוי לפי דין. זיקה כאמור לא תיחשב כניגוד עניינים בין החברה לבין הלקוח.'}
      </BPara>

      <BPara>
        {'בהתאם מודיעה החברה, כי יש לה זיקה לנכסים הפיננסיים המנוהלים ו/או משווקים ו/או מוצעים על ידי גופים בעלי זיקה, כפי שיתעדכן מעת לעת באתר האינטרנט של החברה '}
        <LTR>www.greenwm.co.il</LTR>
        {' וכי היא עשויה לקבלת טובת הנאה בקשר עם ביצוע עסקה בנכסים פיננסיים אליהם יש לה זיקה, לרבות שיווקם ו/או המשך החזקה בהם.'}
      </BPara>

      {/* Signature */}
      <View style={{ marginTop: 60, flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
        <BlankSign label="חתימת הלקוח" />
      </View>

      <PageFooter />
    </Page>

    {/* ═══════════════════ PAGE 7: נספח ד׳ — תגמול ═══════════════════ */}
    <Page size="A4" style={pageStyle}>
      <BlankHeader />

      <BlankTitle>נספח "ד"- נספח תגמול</BlankTitle>

      <BPara style={{ marginBottom: 10, textAlign: 'center', fontWeight: 'bold' }}>
        תגמול בעל הרישיון יהיה לפי אחת האפשרויות להלן:
      </BPara>

      {/* Option i — blank */}
      <BNumPara num=".i">
        {'כנגד קבלת השירותים, יהא זכאי בעל הרישיון לגבות עמלה מגופים פיננסיים שונים להם יש לו זיקה, בגין הפניית הלקוח לגופים הפיננסיים בשיעורים שייקבעו בין בעל הרישיון לבין הגופים הפיננסיים השונים מעת לעת.'}
      </BNumPara>

      {/* Signature block for option i */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 10, marginBottom: 16 }}>
        <BlankSign label="חתימת הלקוח" />
      </View>

      <Text style={{ fontSize: 11, textAlign: 'center', marginVertical: 10 }}>או</Text>

      {/* Option ii — blank fields */}
      <BNumPara num=".ii">
        {'כנגד קבלת השירותים, ישלם הלקוח לבעל הרישיון דמי טיפול בשיעור שנתי כולל של %____________ (בתוספת מע"מ) מסך שווי הנכסים המשוערך של הלקוח אשר ביחס אליהם מוענקים שירותים ("נכסי הלקוח") או לחילופין שכר טירחה בגובה ____________ ₪ כפי שהוסכם בין הצדדים .'}
      </BNumPara>

      <BNumPara num=".א" indent={24}>
        {'התמורה תשולם באופן רבעוני (או חלקו היחסי - לפי העניין), כנגד חשבונית, בתחילת כל רבעון קלנדארי, עבור הרבעון שקדם לו, בהתבסס על שווי נכסי הלקוח המשוערך לתום הרבעון הקלנדארי הקודם.'}
      </BNumPara>

      <BNumPara num=".ב" indent={24}>
        {'ככל שחלופה זו נבחרה - במידה ויתקבלו בידי בעל הרישיון תקבולים שוטפים מגופים פיננסיים שונים בגין הפניית הלקוח לקבלת שירותים מהם, אזי שכל התקבולים כאמור יוחזרו במלואם ללקוח על ידי הקטנת תשלום הרבעוני.'}
      </BNumPara>

      {/* Signature block for option ii */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 16 }}>
        <BlankSign label="חתימת הלקוח" />
      </View>

      <PageFooter />
    </Page>

    {/* ═══════════════════ PAGE 8: השקעות בסיכון מיוחד ═══════════════════ */}
    <Page size="A4" style={pageStyle}>
      <BlankHeader />

      <BlankTitle>השקעות בסיכון מיוחד</BlankTitle>

      <BPara>
        {'הלקוח מבקש מבעל הרישיון לקבל שרותים ביחס לעסקאות שכרוכה בהן סיכון מיוחד כמשמעות מונח זה בחוק הסדרת העיסוק בייעוץ השקעות, בשיווק השקעות ובניהול תיקי השקעות, תשנ"ה – 1995, כפי שיעודכן מעת לעת ("עסקה בסיכון מיוחד").'}
      </BPara>

      <BPara>
        {'הלקוח, מבקש מבעל רישיון שעניין אותו בהשקעה במוצרים מובנים (ניירות ערך ו/או פיקדונות ו/או השקעות אחרות, שהתשואה עליהם או הסיכון הכרוך בהם נקבעים על פי נוסחה המבוססת על שינוי במדד כלשהו, במחיר נייר ערך כלשהו, במחיר סחורה כלשהי, במחיר אופציה או חוזה עתידי כלשהו, בריבית או בהפרשים בין ריביות שונות, בשער חליפין או בהפרשים בין שערי חליפין כלשהם).'}
      </BPara>

      <BPara>
        {'הלקוח מצהיר כי ידוע לו, כי: (א) מוצרים מובנים הם מוצרים בעלי סיכון גבוה, אשר עשויים לא להניב תשואה כלשהי למשקיע בהם; (ב) אם יתרחש אירוע, המפורט בתנאי מוצר מובנה כלשהו, הוא עשוי שלא להניב ריבית או תשואה כלשהי; (ג) במידה והמוצר המובנה אינו סחיר, ניתן יהיה לפדות ו/או למכור אותו לפני שחלפה התקופה, הקבועה בתנאיו, רק בכפוף לתשלום קנס, באופן שהסכום שיתקבל עשוי להיות נמוך משמעותית מסכום הקרן, או אף, ללא אפשרות לפדות את המוצר בכלל.'}
      </BPara>

      <BPara>
        {'הלקוח מבקש מבעל רישיון לקבל מידע ביחס לקרנות גידור וקרנות השקעה בישראל ומחוצה לה בכפוף למגבלות הקבועות בכל דין. הלקוח מצהיר כי ידוע לו כי: (א) קרנות גידור וקרנות השקעה הינם מכשירים פיננסיים שעל פי רוב אינם סחירים; (ב) לעתים, ישנה תקופת נעילה בקרנות גידור במהלכה לא ניתן לפדות את כספי הלקוח או לחלופין ניתן לפדות כנגד תשלום קנסות גבוהים; (ג) קרנות הגידור על פי רוב אינן מפוקחות על ידי רשות פיקוח מוסמכת וכפועל יוצא, הן מתנהלות בשקיפות דלה יחסית; (ד) מבנה התגמול בקרנות גידור מבוסס על פי רוב על דמי ניהול קבועים מהיקף הנכסים ודמי הצלחה הנגבים משיעור עליית ערך נכסי התיק המנוהל; (ה) קרנות גידור נוטות למנף את ההשקעה הכלולה בהן תוך הגברת הסיכון לשחיקת הקרן – עד כדי אובדן ההשקעה כליל; (ו) הצטרפות לקרן גידור כוללת בתוכה על פי רוב תניית שיפוט ייחודית למדינה זרה; (ז) היבטי המס הקשורים להשקעה בקרנות גידור אינם ברורים. בעל הרישיון אינו מומחה מס ואינו רשאי ליתן מצג ביחס להיבטי המס הכרוכים בהשקעה בקרן גידור ועל הלקוח לקבל ייעוץ עצמאי בעניין זה; (ח) תנאי הערבות הניתנים על קרן ההשקעה במועד פדיון ההשקעה כפי שקבוע בתשקיף קרן הגידור, כפופים ותלויים בנסיבות פרטניות הכלולות באותם תשקיפים ומותנים בקיומם של נסיבות כמפורט באותם התשקיפים'}
      </BPara>

      {/* Signature */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 16 }}>
        <BlankSign label="חתימת הלקוח" />
      </View>

      {/* Footnote — numbers separated to avoid bidi crash */}
      <View style={{ position: 'absolute', bottom: 50, left: 40, right: 40 }}>
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

      <PageFooter />
    </Page>

  </Document>
)

// ══════════════════════════════════════════════════════════════
//  EXPORTS
// ══════════════════════════════════════════════════════════════

/** גרסת הדפסה — שחור-לבן, קווים נקיים, ללא רקעים */
export async function generateMarketingAgreement(clientData) {
  const blob = await pdf(<MarketingAgreementDoc data={clientData} styled={false} />).toBlob()
  const pdfBytes = await blob.arrayBuffer()

  const clientName = clientData.clientAName || 'client'
  const safeName = clientName.replace(/[^a-zA-Z0-9\u0590-\u05FF]/g, '_')
  const dateStr = new Date().toISOString().split('T')[0]
  const fileName = `הסכם_שיווק_${dateStr}_${safeName}.pdf`

  const previewBlob = new Blob([pdfBytes], { type: 'application/pdf' })
  const previewUrl = URL.createObjectURL(previewBlob)

  return { url: previewUrl, fileName, pdfBytes }
}

/** גרסת ממשק — צבעי GREEN, כותרות מעוצבות, תאריכים אוטומטיים */
export async function generateMarketingAgreementStyled(clientData) {
  const blob = await pdf(<MarketingAgreementDoc data={clientData} styled={true} />).toBlob()
  const pdfBytes = await blob.arrayBuffer()

  const clientName = clientData.clientAName || 'client'
  const safeName = clientName.replace(/[^a-zA-Z0-9\u0590-\u05FF]/g, '_')
  const dateStr = new Date().toISOString().split('T')[0]
  const fileName = `הסכם_שיווק_styled_${dateStr}_${safeName}.pdf`

  const previewBlob = new Blob([pdfBytes], { type: 'application/pdf' })
  const previewUrl = URL.createObjectURL(previewBlob)

  return { url: previewUrl, fileName, pdfBytes }
}

/** גרסה ידנית — טופס ריק להדפסה ומילוי ביד */
export async function generateMarketingAgreementBlank() {
  const blob = await pdf(<BlankMarketingAgreementDoc />).toBlob()
  const pdfBytes = await blob.arrayBuffer()

  const fileName = 'הסכם_שיווק_ידני.pdf'

  const previewBlob = new Blob([pdfBytes], { type: 'application/pdf' })
  const previewUrl = URL.createObjectURL(previewBlob)

  return { url: previewUrl, fileName, pdfBytes }
}
