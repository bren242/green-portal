// ═══════════════════════════════════════��═══════════
// GREEN Portal — סיכום פגישה PDF Generator
// גרסת ממשק = צבעי GREEN + תאריכים אוטומטיים
// גרסת הדפסה = שחור-לבן, קווים נקיים
// ═══════════════════════════════════════════════════

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
  gold: '#B8975A',
  goldLight: '#D4B483',
  black: '#1A1A1A',
  muted: '#5A5A5A',
  white: '#FFFFFF',
  border: '#DDD5BF',
  surface: '#F6F5F1',
}

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

const PageHeader = ({ styled }) => (
  <View fixed style={{ marginBottom: 8 }}>
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingBottom: 8,
      borderBottomWidth: styled ? 2 : 1.5,
      borderBottomColor: styled ? C.gold : C.black,
    }}>
      <Image src={logoPng} style={{ height: 36, width: 'auto' }} />
      {styled && (
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 9, color: C.primary, fontWeight: 'bold', direction: 'rtl' }}>סיכום פגישה</Text>
        </View>
      )}
      {!styled && <View style={{ flex: 1 }} />}
    </View>
  </View>
)

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
    <Text style={{ fontSize: 7, color: C.muted, direction: 'ltr', textAlign: 'left' }}>INFO@GREENWM.CO.IL</Text>
    <Text style={{ fontSize: 7, color: C.muted, direction: 'ltr', textAlign: 'left' }}>03-6456005/6</Text>
    <Text style={{ fontSize: 7, color: C.muted, direction: 'rtl' }}>ז׳בוטינסקי 7, מגדל משה אביב, רמת גן</Text>
    <Text style={{ fontSize: 7, color: C.muted, direction: 'ltr', textAlign: 'left' }}>WWW.GREENWM.CO.IL</Text>
  </View>
)

const SectionTitle = ({ children, styled }) => {
  if (styled) {
    return (
      <View style={{ backgroundColor: C.primary, paddingVertical: 5, paddingHorizontal: 10, marginTop: 12, marginBottom: 6 }}>
        <Text style={{ fontSize: 11, fontWeight: 'bold', color: C.goldLight, textAlign: 'right' }}>{children}</Text>
      </View>
    )
  }
  return (
    <View style={{ borderBottomWidth: 1, borderBottomColor: C.black, paddingBottom: 3, marginTop: 12, marginBottom: 6 }}>
      <Text style={{ fontSize: 11, fontWeight: 'bold', color: C.black, textAlign: 'right' }}>{children}</Text>
    </View>
  )
}

// ── Checkbox ──────────────────────────────────────────────────
const CB = ({ checked, label }) => (
  <View style={{ flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 3 }}>
    <View style={{
      width: 12, height: 12,
      borderWidth: 1,
      borderColor: C.black,
      marginLeft: 6,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      {checked && <Text style={{ fontSize: 8, color: C.black, lineHeight: 1 }}>✓</Text>}
    </View>
    <Text style={{ fontSize: 9, color: C.black, textAlign: 'right' }}>{label}</Text>
  </View>
)

// ── Radio group (inline) ─────────────────────────────────────
const RadioRow = ({ label, options, value }) => (
  <View style={{ flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
    <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.black, textAlign: 'right', marginLeft: 8 }}>{label}:</Text>
    {options.map((opt, i) => (
      <View key={i} style={{ flexDirection: 'row-reverse', alignItems: 'center', marginLeft: 10 }}>
        <View style={{
          width: 12, height: 12,
          borderWidth: 1,
          borderColor: C.black,
          borderRadius: 6,
          marginLeft: 4,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          {value === opt.value && (
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: C.black }} />
          )}
        </View>
        <Text style={{ fontSize: 9, color: C.black, textAlign: 'right' }}>{opt.label}</Text>
      </View>
    ))}
  </View>
)

// ── Writing lines ────────────────────────────────────────────
const WritingLines = ({ count }) => (
  <View>
    {Array.from({ length: count }).map((_, i) => (
      <View key={i} style={{ borderBottomWidth: 1, borderBottomColor: C.black, height: 22, width: '100%' }} />
    ))}
  </View>
)

// ── Identity table cell ──────────────────────────────────────
const IdCell = ({ label, value, styled: s, borderLeft }) => (
  <View style={{
    width: '25%',
    paddingVertical: 6,
    paddingHorizontal: 6,
    ...(borderLeft ? { borderLeftWidth: 0.5, borderLeftColor: s ? C.gold : C.black } : {}),
  }}>
    <Text style={{ fontSize: 7, color: s ? C.gold : C.muted, textAlign: 'right', marginBottom: 2 }}>{label}</Text>
    {value ? (
      <Text style={{ fontSize: 10, color: s ? C.white : C.black, textAlign: 'right', fontWeight: 'bold' }}>{value}</Text>
    ) : (
      <View style={{ borderBottomWidth: 1, borderBottomColor: s ? C.gold : C.black, height: 16, width: '90%', marginRight: 0 }} />
    )}
  </View>
)

// ── Contact field ────────────────────────────────────────────
const ContactField = ({ label, value, styled: s, borderLeft }) => (
  <View style={{
    width: '25%',
    paddingVertical: 5,
    paddingHorizontal: 6,
    ...(borderLeft ? { borderLeftWidth: 0.5, borderLeftColor: s ? C.border : C.black } : {}),
  }}>
    <Text style={{ fontSize: 7, color: C.muted, textAlign: 'right', marginBottom: 2 }}>{label}</Text>
    {value ? (
      <Text style={{ fontSize: 9, color: C.black, textAlign: 'right' }}>{value}</Text>
    ) : (
      <View style={{ borderBottomWidth: 1, borderBottomColor: C.black, height: 14, width: '90%' }} />
    )}
  </View>
)

// ── Topics table ─────────────────────────────────────────────
const TOPICS = [
  { topic: 'שינויים בפרטים אישיים', examples: 'שינויים במצב משפחתי, מצב בריאותי, תעסוקתי' },
  { topic: 'ש��נויים בהכנסות/הוצאות', examples: 'שינויים בהכנסות, הוצאות חריגות, שינויי מס' },
  { topic: 'שינויים בנכסים/התחייבויות', examples: 'נכסים חדשים, מימוש נכסים, הלוואות חדשות' },
  { topic: 'שינוי במטרות ההשקעה', examples: 'שינוי יעדים, אופק השקעה, צרכי נזילות' },
  { topic: 'שינוי ביחס לסיכון', examples: 'שינוי סיבולת, שינוי העדפות, אירועי שוק' },
  { topic: 'אחר', examples: 'נושאים נוספים שהועלו בפגישה' },
]

const TopicsTable = ({ data, styled: s }) => {
  const headerBg = s ? C.primary : C.black
  const headerColor = s ? C.goldLight : C.white
  return (
    <View style={{ marginTop: 6 }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row-reverse',
        backgroundColor: headerBg,
        paddingVertical: 5,
        paddingHorizontal: 4,
      }}>
        <Text style={{ width: '20%', fontSize: 8, fontWeight: 'bold', color: headerColor, textAlign: 'right', paddingHorizontal: 4 }}>נושא</Text>
        <Text style={{ width: '55%', fontSize: 8, fontWeight: 'bold', color: headerColor, textAlign: 'right', paddingHorizontal: 4 }}>דוגמאות / פירוט</Text>
        <Text style={{ width: '12.5%', fontSize: 8, fontWeight: 'bold', color: headerColor, textAlign: 'center' }}>כן</Text>
        <Text style={{ width: '12.5%', fontSize: 8, fontWeight: 'bold', color: headerColor, textAlign: 'center' }}>לא</Text>
      </View>
      {/* Rows */}
      {TOPICS.map((t, i) => {
        const val = data?.[i]
        return (
          <View key={i} style={{
            flexDirection: 'row-reverse',
            borderBottomWidth: 0.5,
            borderBottomColor: C.border,
            paddingVertical: 5,
            paddingHorizontal: 4,
            backgroundColor: i % 2 === 0 ? (s ? C.surface : C.white) : C.white,
          }}>
            <Text style={{ width: '20%', fontSize: 8, fontWeight: 'bold', color: C.black, textAlign: 'right', paddingHorizontal: 4 }}>{t.topic}</Text>
            <Text style={{ width: '55%', fontSize: 7, color: C.muted, textAlign: 'right', paddingHorizontal: 4 }}>{t.examples}</Text>
            <View style={{ width: '12.5%', alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ width: 12, height: 12, borderWidth: 1, borderColor: C.black, justifyContent: 'center', alignItems: 'center' }}>
                {val === 'yes' && <Text style={{ fontSize: 8, lineHeight: 1 }}>✓</Text>}
              </View>
            </View>
            <View style={{ width: '12.5%', alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ width: 12, height: 12, borderWidth: 1, borderColor: C.black, justifyContent: 'center', alignItems: 'center' }}>
                {val === 'no' && <Text style={{ fontSize: 8, lineHeight: 1 }}>✓</Text>}
              </View>
            </View>
          </View>
        )
      })}
    </View>
  )
}

// ── Signature block ──────────────────────────────────────────
const SignBlock = ({ label, styled: s }) => (
  <View style={{ width: '45%', alignItems: 'center' }}>
    <View style={{ borderBottomWidth: 1, borderBottomColor: s ? C.primary : C.black, width: '100%', height: 40, marginBottom: 4 }} />
    <Text style={{ fontSize: 9, color: C.black, textAlign: 'center', fontWeight: 'bold' }}>{label}</Text>
  </View>
)

// ═══════════════════════════════════════════════════════════════
//  MEETING DECLARATION TEXT (AS IS — legally fixed)
// ══════════════════════════════════════════════════���════════════
const DECLARATION_TEXT = 'אני מאשר/�� כי הפגישה התקיימה כמתואר לעיל, וכי כל המידע שנמסר על ידי הינו נכון ומלא. ידוע לי כי המלצות המשווק מבוססות על המידע שמסרתי ועל הבנת צרכיי כפי שהוצגו בפגישה. ידוע לי כי ביצוע עסקאות בשוק ההון כרוך בסיכון, וכי אין בתשואות עבר כדי להבטיח תשואות עתידיות.'

// ═════════════════════════════════════════════════���═════════════
//  DOCUMENT
// ═══════════════════════════════════════════════════════════════
const MeetingSummaryDoc = ({ data, styled }) => {
  const d = data || {}
  const s = !!styled

  return (
    <Document>
      <Page size="A4" style={pageStyle}>
        <PageHeader styled={s} />

        {/* 1. Title + Identity table */}
        <View style={{
          backgroundColor: s ? C.primary : C.white,
          paddingVertical: 8,
          paddingHorizontal: 10,
          marginBottom: 0,
          ...(s ? {} : { borderWidth: 1, borderColor: C.black }),
        }}>
          <Text style={{
            fontSize: 14,
            fontWeight: 'bold',
            color: s ? C.white : C.black,
            textAlign: 'center',
          }}>
            סיכום פגישה
          </Text>
        </View>

        {/* Identity row 1 */}
        <View style={{
          flexDirection: 'row-reverse',
          borderLeftWidth: s ? 0.5 : 1,
          borderRightWidth: s ? 0.5 : 1,
          borderBottomWidth: s ? 0.5 : 1,
          borderLeftColor: s ? C.border : C.black,
          borderRightColor: s ? C.border : C.black,
          borderBottomColor: s ? C.border : C.black,
          backgroundColor: s ? C.surface : C.white,
        }}>
          <IdCell label="שם לקוח" value={d.clientName} styled={s} />
          <IdCell label="ת.ז לקוח" value={d.clientId} styled={s} borderLeft />
          <IdCell label="שם משווק" value={d.advisorName} styled={s} borderLeft />
          <IdCell label="תאריך" value={s ? fmtDateAuto() : null} styled={s} borderLeft />
        </View>
        {/* Identity row 2 — advisor details */}
        <View style={{
          flexDirection: 'row-reverse',
          borderLeftWidth: s ? 0.5 : 1,
          borderRightWidth: s ? 0.5 : 1,
          borderBottomWidth: s ? 0.5 : 1,
          borderLeftColor: s ? C.border : C.black,
          borderRightColor: s ? C.border : C.black,
          borderBottomColor: s ? C.border : C.black,
          backgroundColor: s ? C.surface : C.white,
        }}>
          <IdCell label="ת.ז משווק" value={d.advisorId} styled={s} />
          <IdCell label="מס׳ רישיון" value={d.advisorLicense} styled={s} borderLeft />
          <View style={{ width: '50%' }} />
        </View>

        {/* 2. Contact details update */}
        <SectionTitle styled={s}>עדכון פרטי התקשרות</SectionTitle>
        <View style={{
          flexDirection: 'row-reverse',
          borderWidth: 0.5,
          borderColor: s ? C.border : C.black,
        }}>
          <ContactField label="כתובת" value={d.address} styled={s} />
          <ContactField label="טלפון" value={d.phone} styled={s} borderLeft />
          <ContactField label="אימייל" value={d.email} styled={s} borderLeft />
          <ContactField label="סלולרי" value={d.mobile} styled={s} borderLeft />
        </View>

        {/* 3. Meeting meta */}
        <SectionTitle styled={s}>פרטי הפגישה</SectionTitle>
        <View style={{ paddingHorizontal: 4 }}>
          <RadioRow
            label="סיבת הפגישה"
            options={[
              { value: 'periodic', label: 'תקופתית' },
              { value: 'client_request', label: 'בקשת לקוח' },
              { value: 'advisor_request', label: 'יוזמת משווק' },
              { value: 'other', label: 'אחר' },
            ]}
            value={d.meetingReason}
          />
          <RadioRow
            label="אופן הפגישה"
            options={[
              { value: 'in_person', label: 'פרונטלית' },
              { value: 'phone', label: 'טלפונית' },
              { value: 'video', label: 'וידאו' },
            ]}
            value={d.meetingType}
          />
          <RadioRow
            label="יוזם הפגישה"
            options={[
              { value: 'client', label: 'לקוח' },
              { value: 'advisor', label: 'משווק' },
              { value: 'other', label: 'אחר' },
            ]}
            value={d.meetingInitiator}
          />
          {d.meetingInitiator === 'other' && d.initiatorOther && (
            <View style={{ flexDirection: 'row-reverse', marginBottom: 4, paddingRight: 4 }}>
              <Text style={{ fontSize: 9, color: C.muted }}>פירוט: </Text>
              <Text style={{ fontSize: 9, color: C.black }}>{d.initiatorOther}</Text>
            </View>
          )}
          <View style={{ flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 4 }}>
            <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.black, textAlign: 'right', marginLeft: 8 }}>משך הפגישה:</Text>
            {d.meetingDuration ? (
              <Text style={{ fontSize: 9, color: C.black }}>{d.meetingDuration} דקות</Text>
            ) : (
              <View style={{ borderBottomWidth: 1, borderBottomColor: C.black, width: 80, height: 14 }} />
            )}
          </View>
        </View>

        {/* 4. Topics table */}
        <SectionTitle styled={s}>נושאים שנדונו בפגישה</SectionTitle>
        <TopicsTable data={d.topics} styled={s} />

        {/* 5. Meeting summary */}
        <SectionTitle styled={s}>סיכום הפגישה</SectionTitle>
        {d.summary ? (
          <View style={{ paddingHorizontal: 4, minHeight: 80 }}>
            <Text style={{ fontSize: 9, color: C.black, textAlign: 'right', lineHeight: 1.6 }}>{d.summary}</Text>
          </View>
        ) : (
          <WritingLines count={6} />
        )}

        {/* 6. Advisor recommendation */}
        <SectionTitle styled={s}>המלצת המשווק</SectionTitle>
        {d.recommendation ? (
          <View style={{ paddingHorizontal: 4, minHeight: 55 }}>
            <Text style={{ fontSize: 9, color: C.black, textAlign: 'right', lineHeight: 1.6 }}>{d.recommendation}</Text>
          </View>
        ) : (
          <WritingLines count={4} />
        )}

        {/* 7. Conflict of interest checkbox */}
        <View style={{ marginTop: 10, paddingHorizontal: 4 }}>
          <CB
            checked={d.conflictOfInterest}
            label="��ובהר ללקוח כי למשווק עשוי להיות ניגוד עניינים ביחס להמלצותיו, בהתאם לגילוי הנאות שנמסר ללקוח."
          />
        </View>

        {/* 8. Decision */}
        <SectionTitle styled={s}>החלטה</SectionTitle>
        {d.decision ? (
          <View style={{ paddingHorizontal: 4, minHeight: 30 }}>
            <Text style={{ fontSize: 9, color: C.black, textAlign: 'right', lineHeight: 1.6 }}>{d.decision}</Text>
          </View>
        ) : (
          <WritingLines count={2} />
        )}

        {/* 9. Tasks */}
        <SectionTitle styled={s}>משימות להמשך</SectionTitle>
        {d.tasks ? (
          <View style={{ paddingHorizontal: 4, minHeight: 30 }}>
            <Text style={{ fontSize: 9, color: C.black, textAlign: 'right', lineHeight: 1.6 }}>{d.tasks}</Text>
          </View>
        ) : (
          <WritingLines count={2} />
        )}

        {/* 10. Client declaration */}
        <View style={{ marginTop: 14, paddingHorizontal: 4 }}>
          <Text style={{ fontSize: 8, fontWeight: 'bold', color: C.black, textAlign: 'right', marginBottom: 4 }}>הצהרת הלקוח:</Text>
          <Text style={{ fontSize: 8, color: C.black, textAlign: 'right', lineHeight: 1.5 }}>{DECLARATION_TEXT}</Text>
        </View>

        {/* 11. Signatures */}
        <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-around', marginTop: 24 }}>
          <SignBlock label="חתימת הלקוח" styled={s} />
          <SignBlock label="חתימת המשווק" styled={s} />
        </View>

        <PageFooter />
      </Page>
    </Document>
  )
}

// ══════════════════════════════════════════════════════════════
//  EXPORTS
// ══════════════════════════════════════════════════════════════

/** גרסת ממשק — צבעי GREEN, תאריכים אוטומטיים, פרטים מסשן */
export async function generateMeetingSummaryStyled(meetingData) {
  const blob = await pdf(<MeetingSummaryDoc data={meetingData} styled={true} />).toBlob()
  const pdfBytes = await blob.arrayBuffer()

  const clientName = meetingData.clientName || 'client'
  const safeName = clientName.replace(/[^a-zA-Z0-9\u0590-\u05FF]/g, '_')
  const dateStr = new Date().toISOString().split('T')[0]
  const fileName = `סיכום_פגישה_${dateStr}_${safeName}.pdf`

  const previewBlob = new Blob([pdfBytes], { type: 'application/pdf' })
  const previewUrl = URL.createObjectURL(previewBlob)

  return { url: previewUrl, fileName, pdfBytes }
}

/** גרסת הדפסה — שחור-לבן, שדות ריקים */
export async function generateMeetingSummaryBlank() {
  const blob = await pdf(<MeetingSummaryDoc data={{}} styled={false} />).toBlob()
  const pdfBytes = await blob.arrayBuffer()

  const fileName = 'סיכום_פגישה_ידני.pdf'

  const previewBlob = new Blob([pdfBytes], { type: 'application/pdf' })
  const previewUrl = URL.createObjectURL(previewBlob)

  return { url: previewUrl, fileName, pdfBytes }
}
