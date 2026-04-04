// ═══════════════════════════════════════════════════
// GREEN Portal — Executive Summary PDF
// תקציר מנהלים — פורטל טפסים GREEN
// ═══════════════════════════════════════════════════

import React from 'react'
import { Document, Page, Text, View, Image, Font } from '@react-pdf/renderer'
import { logoPng } from '../../assets/logoBase64'
import { pdf } from '@react-pdf/renderer'

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
  offWhite: '#F4F3EF',
  cream: '#F8F5EE',
  white: '#FFFFFF',
  black: '#1A1A1A',
  muted: '#5A5A5A',
  border: '#DDD5BF',
}

const fmtDate = () => {
  const d = new Date()
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`
}

// ── Bullet Point ──
const Bullet = ({ children, icon }) => (
  <View style={{ flexDirection: 'row-reverse', alignItems: 'flex-start', marginBottom: 8, paddingRight: 4 }}>
    <Text style={{ fontSize: 10, color: C.gold, marginLeft: 8, lineHeight: 1.4 }}>{icon || '-'}</Text>
    <Text style={{ flex: 1, fontSize: 10.5, color: C.black, textAlign: 'right', lineHeight: 1.7 }}>
      {children}
    </Text>
  </View>
)

// ── Section Header ──
const SectionHeader = ({ children }) => (
  <View style={{ backgroundColor: C.primary, borderRadius: 3, paddingVertical: 6, paddingHorizontal: 12, marginBottom: 10, marginTop: 16 }}>
    <Text style={{ fontSize: 12, fontWeight: 'bold', color: C.goldLight, textAlign: 'right' }}>
      {children}
    </Text>
  </View>
)

// ── Security Badge ──
const SecurityBadge = ({ icon, title, description }) => (
  <View style={{
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: C.cream,
    borderWidth: 1,
    borderColor: C.gold,
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  }} wrap={false}>
    <View style={{
      width: 36, height: 36, borderRadius: 18,
      backgroundColor: C.primary,
      justifyContent: 'center', alignItems: 'center',
      marginLeft: 12,
    }}>
      <Text style={{ fontSize: 14, fontWeight: 'bold', color: C.white }}>{icon}</Text>
    </View>
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 10.5, fontWeight: 'bold', color: C.primary, textAlign: 'right', marginBottom: 2 }}>
        {title}
      </Text>
      <Text style={{ fontSize: 9.5, color: C.muted, textAlign: 'right', lineHeight: 1.6 }}>
        {description}
      </Text>
    </View>
  </View>
)

// ── Module Card ──
const ModuleCard = ({ name, description }) => (
  <View style={{
    flexDirection: 'row-reverse',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: C.border,
    paddingVertical: 6,
    paddingHorizontal: 4,
  }}>
    <View style={{
      width: 6, height: 6, borderRadius: 3,
      backgroundColor: C.gold,
      marginLeft: 8,
    }} />
    <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right', width: '35%' }}>
      {name}
    </Text>
    <Text style={{ fontSize: 9, color: C.muted, textAlign: 'right', flex: 1 }}>
      {description}
    </Text>
  </View>
)

// ── Main Document ──
const ExecutiveSummaryDocument = () => (
  <Document>
    <Page size="A4" style={{ fontFamily: 'Assistant', backgroundColor: C.white, paddingBottom: 40 }}>
      {/* ═══ COVER HEADER ═══ */}
      <View style={{ paddingHorizontal: 36, paddingTop: 30 }}>
        {/* Logo + Company row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
          <Image src={logoPng} style={{ height: 44, width: 'auto' }} />
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 13, fontWeight: 'bold', color: C.primary, textAlign: 'right' }}>
              גרין סוכנות לביטוח פנסיוני ושיווק השקעות (2024) בע"מ
            </Text>
            <Text style={{ fontSize: 9, color: C.muted, marginTop: 2 }}>
              GREEN Wealth Management
            </Text>
          </View>
        </View>

        {/* Gold separator */}
        <View style={{ height: 2, backgroundColor: C.gold, marginBottom: 20 }} />

        {/* Title block */}
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: C.primary, textAlign: 'center', marginBottom: 6 }}>
            תקציר מנהלים
          </Text>
          <Text style={{ fontSize: 14, color: C.gold, textAlign: 'center', marginBottom: 4 }}>
            פורטל טפסים רגולטורי — GREEN Portal
          </Text>
          <Text style={{ fontSize: 9, color: C.muted }}>{fmtDate()}</Text>
        </View>

        {/* ═══ OVERVIEW ═══ */}
        <SectionHeader>סקירה כללית</SectionHeader>

        <Text style={{ fontSize: 10.5, color: C.black, textAlign: 'right', lineHeight: 1.8, marginBottom: 10, paddingHorizontal: 4 }}>
          פורטל GREEN הוא מערכת פנימית המשמשת את צוות המשווקים של GREEN Wealth Management להפקת טפסים רגולטוריים במהלך פגישות עם לקוחות. המערכת מאפשרת מילוי פרטי לקוח פעם אחת, בחירת מודולים רלוונטיים, והפקת מסמכי PDF מקצועיים בלחיצה אחת.
        </Text>

        <Bullet>3 משווקי השקעות מורשים משתמשים במערכת</Bullet>
        <Bullet>5 מודולים רגולטוריים — כל אחד מייצר PDF נפרד</Bullet>
        <Bullet>פרטי לקוח מוזנים פעם אחת ומועברים אוטומטית לכל הטפסים</Bullet>
        <Bullet>אפשרות להפקת קיט מסמכים מלא בהורדה אחת</Bullet>

        {/* ═══ MODULES ═══ */}
        <SectionHeader>מודולים</SectionHeader>

        <ModuleCard name="הסכם שיווק השקעות" description="הסכם משפטי מאושר בין הלקוח לחברה — טקסט קבוע ע״פ רגולציה" />
        <ModuleCard name="איפיון צרכים (KYC)" description="שאלון מלא: תמונה כלכלית, דרגת סיכון, העדפות השקעה, נימוק מקצועי" />
        <ModuleCard name="הצהרת משקיע כשיר" description="טופס הצהרה לפי חוק ניירות ערך — סכומים מתעדכנים דרך פאנל ניהול" />
        <ModuleCard name="לקוח כשיר — חוק הייעוץ" description="טופס 4 עמודים עם שאלון מורחב — תנאים לפי חוק הסדרת הייעוץ" />
        <ModuleCard name="סיכום פגישה" description="תיעוד פגישה שוטפת — נושאים, החלטות, המלצות, חתימות" />

        {/* ═══ SECURITY — THE KEY SECTION ═══ */}
        <SectionHeader>אבטחת מידע ופרטיות — עיקרון אפס שמירה</SectionHeader>

        <View style={{
          backgroundColor: C.primary,
          borderRadius: 6,
          padding: 14,
          marginBottom: 14,
        }}>
          <Text style={{ fontSize: 11, fontWeight: 'bold', color: C.goldLight, textAlign: 'center', lineHeight: 1.8 }}>
            המערכת לא שומרת, לא מעבירה ולא מאחסנת שום מידע של לקוחות.
          </Text>
          <Text style={{ fontSize: 11, fontWeight: 'bold', color: C.white, textAlign: 'center', lineHeight: 1.8 }}>
            אין שרת. אין מסד נתונים. אין עקבות.
          </Text>
        </View>

        <SecurityBadge
          icon="1"
          title="Client-Side Only — ללא שרת"
          description="כל העיבוד מתבצע בדפדפן המשתמש בלבד. אין שרת backend, אין מסד נתונים, אין API שמקבל מידע. הפלטפורמה (Vercel) מגישה קבצים סטטיים בלבד."
        />

        <SecurityBadge
          icon="2"
          title="מחיקה אוטומטית אחרי 10 דקות חוסר פעילות"
          description="אם המשתמש לא פעיל במשך 10 דקות — כל הנתונים נמחקים אוטומטית מזיכרון הדפדפן והמשתמש מנותק מהמערכת."
        />

        <SecurityBadge
          icon="3"
          title="סגירת סשן = מחיקה מלאה"
          description="בסיום פגישה או התנתקות — כל פרטי הלקוח, הטפסים והמסמכים נמחקים לחלוטין. אין שום שריד בזיכרון הדפדפן."
        />

        <SecurityBadge
          icon="4"
          title="אין שמירה מקומית (localStorage/cookies)"
          description="פרטי לקוח לעולם לא נשמרים ב-localStorage, cookies או sessionStorage. הנתונים היחידים שנשמרים הם הגדרות מערכת (משתמשים, סכומי כשיר) — ללא מידע אישי."
        />

        <SecurityBadge
          icon="5"
          title="הגנות נוספות"
          description="כותרות no-cache/no-store על כל הדפים. autocomplete=off על כל שדות הטופס. אין העברת מידע לשום צד שלישי."
        />
      </View>

      {/* ═══ FOOTER ═══ */}
      <View style={{ position: 'absolute', bottom: 16, left: 36, right: 36 }}>
        <View style={{ height: 1, backgroundColor: C.gold, marginBottom: 8 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 7, color: C.muted }}>GREEN Wealth Management — Confidential</Text>
          <Text style={{ fontSize: 7, color: C.muted }}>{fmtDate()}</Text>
        </View>
      </View>
    </Page>
  </Document>
)

// ── Export function ──
export async function generateExecutiveSummary() {
  const blob = await pdf(<ExecutiveSummaryDocument />).toBlob()
  const url = URL.createObjectURL(blob)
  return { url, fileName: `GREEN_Executive_Summary_${fmtDate().replace(/\./g, '-')}.pdf` }
}
