// GREEN Portal — סיכום פגישה PDF Generator
// גרסת ממשק = צבעי GREEN + תאריכים אוטומטיים
// גרסת הדפסה = שחור-לבן, קווים נקיים

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

// ══════════════════════════════════════════════════
//  REUSABLE COMPONENTS
// ══════════════════════════════════════════════════

const PageHeader = ({ styled }) => (
  <View fixed style={{ marginBottom: styled ? 8 : 4 }}>
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingBottom: styled ? 8 : 4,
      borderBottomWidth: styled ? 2 : 1.5,
      borderBottomColor: styled ? C.gold : C.black,
    }}>
      <Image src={logoPng} style={{ height: styled ? 36 : 30, width: 'auto' }} />
      {styled && (
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 9, color: C.primary, fontWeight: 'bold', direction: 'rtl' }}>{'\u05E1\u05D9\u05DB\u05D5\u05DD \u05E4\u05D2\u05D9\u05E9\u05D4'}</Text>
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
    <Text style={{ fontSize: 7, color: C.muted, direction: 'rtl' }}>{'\u05D6\u05F3\u05D1\u05D5\u05D8\u05D9\u05E0\u05E1\u05E7\u05D9 7, \u05DE\u05D2\u05D3\u05DC \u05DE\u05E9\u05D4 \u05D0\u05D1\u05D9\u05D1, \u05E8\u05DE\u05EA \u05D2\u05DF'}</Text>
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
    <View style={{ borderBottomWidth: 1, borderBottomColor: C.black, paddingBottom: 1, marginTop: 4, marginBottom: 2 }}>
      <Text style={{ fontSize: 8.5, fontWeight: 'bold', color: C.black, textAlign: 'right' }}>{children}</Text>
    </View>
  )
}

// ── Checkbox (fix #4 — proper flex alignment with gap) ───────
const CB = ({ checked, label, compact }) => (
  <View style={{ flexDirection: 'row-reverse', alignItems: 'center', marginBottom: compact ? 2 : 3, gap: compact ? 6 : 8 }}>
    <View style={{
      width: compact ? 10 : 12, height: compact ? 10 : 12,
      borderWidth: 1,
      borderColor: C.black,
      justifyContent: 'center',
      alignItems: 'center',
      flexShrink: 0,
    }}>
      {checked && <Text style={{ fontSize: compact ? 7 : 8, color: C.black, lineHeight: 1 }}>{'\u2713'}</Text>}
    </View>
    <Text style={{ fontSize: compact ? 7.5 : 9, color: C.black, textAlign: 'right', flex: 1 }}>{label}</Text>
  </View>
)

// ── Radio group (inline) ─────────────────────────────────────
const RadioRow = ({ label, options, value, compact }) => (
  <View style={{ flexDirection: 'row-reverse', alignItems: 'center', marginBottom: compact ? 3 : 4, flexWrap: 'wrap', gap: compact ? 6 : undefined }}>
    <Text style={{ fontSize: compact ? 7.5 : 9, fontWeight: 'bold', color: C.black, textAlign: 'right', ...(compact ? {} : { marginLeft: 6 }) }}>{label}:</Text>
    {options.map((opt, i) => (
      <View key={i} style={{ flexDirection: 'row-reverse', alignItems: 'center', ...(compact ? {} : { marginLeft: 10 }) }}>
        <View style={{
          width: compact ? 9 : 12, height: compact ? 9 : 12,
          borderWidth: 1,
          borderColor: C.black,
          borderRadius: compact ? 4.5 : 6,
          marginLeft: compact ? 2 : 3,
          flexShrink: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          {value === opt.value && (
            <View style={{ width: compact ? 4.5 : 6, height: compact ? 4.5 : 6, borderRadius: 3, backgroundColor: C.black }} />
          )}
        </View>
        <Text style={{ fontSize: compact ? 7.5 : 9, color: C.black, textAlign: 'right', lineHeight: compact ? 1 : undefined }}>{opt.label}</Text>
      </View>
    ))}
  </View>
)

// ── Writing lines ────────────────────────────────────────────
const WritingLines = ({ count, compact }) => (
  <View>
    {Array.from({ length: count }).map((_, i) => (
      <View key={i} style={{ borderBottomWidth: 1, borderBottomColor: C.black, height: compact ? 16 : 22, width: '100%' }} />
    ))}
  </View>
)

// ── Identity table cell (fix #1 — fixed 25% width) ──────────
const IdCell = ({ label, value, styled: s, borderLeft }) => (
  <View style={{
    width: '25%',
    paddingVertical: s ? 6 : 4,
    paddingHorizontal: s ? 6 : 4,
    ...(borderLeft ? { borderLeftWidth: 0.5, borderLeftColor: s ? C.gold : C.black } : {}),
  }}>
    <Text style={{ fontSize: s ? 7 : 6.5, color: s ? C.gold : C.muted, textAlign: 'right', marginBottom: 1 }}>{label}</Text>
    {value ? (
      <Text style={{ fontSize: s ? 10 : 8, color: s ? C.white : C.black, textAlign: 'right', fontWeight: 'bold' }}>{value}</Text>
    ) : (
      <View style={{ borderBottomWidth: 1, borderBottomColor: s ? C.gold : C.black, height: s ? 16 : 12, width: '90%', marginRight: 0 }} />
    )}
  </View>
)

// ── Contact field ────────────────────────────────────────────
const ContactField = ({ label, value, styled: s, borderLeft }) => (
  <View style={{
    width: '25%',
    paddingVertical: s ? 5 : 3,
    paddingHorizontal: s ? 6 : 4,
    ...(borderLeft ? { borderLeftWidth: 0.5, borderLeftColor: s ? C.border : C.black } : {}),
  }}>
    <Text style={{ fontSize: s ? 7 : 6.5, color: C.muted, textAlign: 'right', marginBottom: 1 }}>{label}</Text>
    {value ? (
      <Text style={{ fontSize: s ? 9 : 7.5, color: C.black, textAlign: 'right' }}>{value}</Text>
    ) : (
      <View style={{ borderBottomWidth: 1, borderBottomColor: C.black, height: s ? 14 : 10, width: '90%' }} />
    )}
  </View>
)

// ── Topics table (fix #3 — clean Hebrew) ─────────────────────
const TOPICS = [
  { topic: '\u05E9\u05D9\u05E0\u05D5\u05D9\u05D9\u05DD \u05D1\u05E4\u05E8\u05D8\u05D9\u05DD \u05D0\u05D9\u05E9\u05D9\u05D9\u05DD', examples: '\u05E9\u05D9\u05E0\u05D5\u05D9\u05D9\u05DD \u05D1\u05DE\u05E6\u05D1 \u05DE\u05E9\u05E4\u05D7\u05EA\u05D9, \u05DE\u05E6\u05D1 \u05D1\u05E8\u05D9\u05D0\u05D5\u05EA\u05D9, \u05EA\u05E2\u05E1\u05D5\u05E7\u05EA\u05D9' },
  { topic: '\u05E9\u05D9\u05E0\u05D5\u05D9\u05D9\u05DD \u05D1\u05D4\u05DB\u05E0\u05E1\u05D5\u05EA/\u05D4\u05D5\u05E6\u05D0\u05D5\u05EA', examples: '\u05E9\u05D9\u05E0\u05D5\u05D9\u05D9\u05DD \u05D1\u05D4\u05DB\u05E0\u05E1\u05D5\u05EA, \u05D4\u05D5\u05E6\u05D0\u05D5\u05EA \u05D7\u05E8\u05D9\u05D2\u05D5\u05EA, \u05E9\u05D9\u05E0\u05D5\u05D9\u05D9 \u05DE\u05E1' },
  { topic: '\u05E9\u05D9\u05E0\u05D5\u05D9\u05D9\u05DD \u05D1\u05E0\u05DB\u05E1\u05D9\u05DD/\u05D4\u05EA\u05D7\u05D9\u05D9\u05D1\u05D5\u05D9\u05D5\u05EA', examples: '\u05E0\u05DB\u05E1\u05D9\u05DD \u05D7\u05D3\u05E9\u05D9\u05DD, \u05DE\u05D9\u05DE\u05D5\u05E9 \u05E0\u05DB\u05E1\u05D9\u05DD, \u05D4\u05DC\u05D5\u05D5\u05D0\u05D5\u05EA \u05D7\u05D3\u05E9\u05D5\u05EA' },
  { topic: '\u05E9\u05D9\u05E0\u05D5\u05D9 \u05D1\u05DE\u05D8\u05E8\u05D5\u05EA \u05D4\u05D4\u05E9\u05E7\u05E2\u05D4', examples: '\u05E9\u05D9\u05E0\u05D5\u05D9 \u05D9\u05E2\u05D3\u05D9\u05DD, \u05D0\u05D5\u05E4\u05E7 \u05D4\u05E9\u05E7\u05E2\u05D4, \u05E6\u05E8\u05DB\u05D9 \u05E0\u05D6\u05D9\u05DC\u05D5\u05EA' },
  { topic: '\u05E9\u05D9\u05E0\u05D5\u05D9 \u05D1\u05D9\u05D7\u05E1 \u05DC\u05E1\u05D9\u05DB\u05D5\u05DF', examples: '\u05E9\u05D9\u05E0\u05D5\u05D9 \u05E1\u05D9\u05D1\u05D5\u05DC\u05EA, \u05E9\u05D9\u05E0\u05D5\u05D9 \u05D4\u05E2\u05D3\u05E4\u05D5\u05EA, \u05D0\u05D9\u05E8\u05D5\u05E2\u05D9 \u05E9\u05D5\u05E7' },
  { topic: '\u05D0\u05D7\u05E8', examples: '\u05E0\u05D5\u05E9\u05D0\u05D9\u05DD \u05E0\u05D5\u05E1\u05E4\u05D9\u05DD \u05E9\u05D4\u05D5\u05E2\u05DC\u05D5 \u05D1\u05E4\u05D2\u05D9\u05E9\u05D4' },
]

const TopicsTable = ({ data, styled: s }) => {
  const headerBg = s ? C.primary : C.black
  const headerColor = s ? C.goldLight : C.white
  const fs = s ? 8 : 7
  const rowPy = s ? 5 : 3
  const cbSize = s ? 12 : 10
  return (
    <View style={{ marginTop: s ? 6 : 2 }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row-reverse',
        backgroundColor: headerBg,
        paddingVertical: s ? 5 : 3,
        paddingHorizontal: 4,
      }}>
        <Text style={{ width: '20%', fontSize: fs, fontWeight: 'bold', color: headerColor, textAlign: 'right', paddingHorizontal: 4 }}>{'\u05E0\u05D5\u05E9\u05D0'}</Text>
        <Text style={{ width: '55%', fontSize: fs, fontWeight: 'bold', color: headerColor, textAlign: 'right', paddingHorizontal: 4 }}>{'\u05D3\u05D5\u05D2\u05DE\u05D0\u05D5\u05EA / \u05E4\u05D9\u05E8\u05D5\u05D8'}</Text>
        <Text style={{ width: '12.5%', fontSize: fs, fontWeight: 'bold', color: headerColor, textAlign: 'center' }}>{'\u05DB\u05DF'}</Text>
        <Text style={{ width: '12.5%', fontSize: fs, fontWeight: 'bold', color: headerColor, textAlign: 'center' }}>{'\u05DC\u05D0'}</Text>
      </View>
      {/* Rows */}
      {TOPICS.map((t, i) => {
        const val = data?.[i]
        return (
          <View key={i} style={{
            flexDirection: 'row-reverse',
            borderBottomWidth: 0.5,
            borderBottomColor: C.border,
            paddingVertical: rowPy,
            paddingHorizontal: 4,
            backgroundColor: i % 2 === 0 ? (s ? C.surface : C.white) : C.white,
          }}>
            <Text style={{ width: '20%', fontSize: s ? 8 : 7, fontWeight: 'bold', color: C.black, textAlign: 'right', paddingHorizontal: 4 }}>{t.topic}</Text>
            <Text style={{ width: '55%', fontSize: s ? 7 : 6, color: C.muted, textAlign: 'right', paddingHorizontal: 4 }}>{t.examples}</Text>
            <View style={{ width: '12.5%', alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ width: cbSize, height: cbSize, borderWidth: 1, borderColor: C.black, justifyContent: 'center', alignItems: 'center' }}>
                {val === 'yes' && <Text style={{ fontSize: s ? 8 : 7, lineHeight: 1 }}>{'\u2713'}</Text>}
              </View>
            </View>
            <View style={{ width: '12.5%', alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ width: cbSize, height: cbSize, borderWidth: 1, borderColor: C.black, justifyContent: 'center', alignItems: 'center' }}>
                {val === 'no' && <Text style={{ fontSize: s ? 8 : 7, lineHeight: 1 }}>{'\u2713'}</Text>}
              </View>
            </View>
          </View>
        )
      })}
    </View>
  )
}

// ── Signature block (fix #5 — 50% width, symmetric, label below) ─
const SignBlock = ({ label, styled: s }) => (
  <View style={{ width: '50%', alignItems: 'center', paddingHorizontal: 12 }}>
    <View style={{ borderBottomWidth: 1, borderBottomColor: s ? C.primary : C.black, width: '100%', height: s ? 40 : 24, marginBottom: 2 }} />
    <Text style={{ fontSize: s ? 9 : 7.5, color: C.black, textAlign: 'center', fontWeight: 'bold' }}>{label}</Text>
  </View>
)

// MEETING DECLARATION TEXT (AS IS — legally fixed, fix #3 — clean Unicode)
const DECLARATION_TEXT = '\u05D0\u05E0\u05D9 \u05DE\u05D0\u05E9\u05E8/\u05EA \u05DB\u05D9 \u05D4\u05E4\u05D2\u05D9\u05E9\u05D4 \u05D4\u05EA\u05E7\u05D9\u05D9\u05DE\u05D4 \u05DB\u05DE\u05EA\u05D5\u05D0\u05E8 \u05DC\u05E2\u05D9\u05DC, \u05D5\u05DB\u05D9 \u05DB\u05DC \u05D4\u05DE\u05D9\u05D3\u05E2 \u05E9\u05E0\u05DE\u05E1\u05E8 \u05E2\u05DC \u05D9\u05D3\u05D9 \u05D4\u05D9\u05E0\u05D5 \u05E0\u05DB\u05D5\u05DF \u05D5\u05DE\u05DC\u05D0. \u05D9\u05D3\u05D5\u05E2 \u05DC\u05D9 \u05DB\u05D9 \u05D4\u05DE\u05DC\u05E6\u05D5\u05EA \u05D4\u05DE\u05E9\u05D5\u05D5\u05E7 \u05DE\u05D1\u05D5\u05E1\u05E1\u05D5\u05EA \u05E2\u05DC \u05D4\u05DE\u05D9\u05D3\u05E2 \u05E9\u05DE\u05E1\u05E8\u05EA\u05D9 \u05D5\u05E2\u05DC \u05D4\u05D1\u05E0\u05EA \u05E6\u05E8\u05DB\u05D9\u05D9 \u05DB\u05E4\u05D9 \u05E9\u05D4\u05D5\u05E6\u05D2\u05D5 \u05D1\u05E4\u05D2\u05D9\u05E9\u05D4. \u05D9\u05D3\u05D5\u05E2 \u05DC\u05D9 \u05DB\u05D9 \u05D1\u05D9\u05E6\u05D5\u05E2 \u05E2\u05E1\u05E7\u05D0\u05D5\u05EA \u05D1\u05E9\u05D5\u05E7 \u05D4\u05D4\u05D5\u05DF \u05DB\u05E8\u05D5\u05DA \u05D1\u05E1\u05D9\u05DB\u05D5\u05DF, \u05D5\u05DB\u05D9 \u05D0\u05D9\u05DF \u05D1\u05EA\u05E9\u05D5\u05D0\u05D5\u05EA \u05E2\u05D1\u05E8 \u05DB\u05D3\u05D9 \u05DC\u05D4\u05D1\u05D8\u05D9\u05D7 \u05EA\u05E9\u05D5\u05D0\u05D5\u05EA \u05E2\u05EA\u05D9\u05D3\u05D9\u05D5\u05EA.'

// CONFLICT OF INTEREST LABEL (fix #3 — clean Unicode)
const CONFLICT_LABEL = '\u05D4\u05D5\u05D1\u05D4\u05E8 \u05DC\u05DC\u05E7\u05D5\u05D7 \u05DB\u05D9 \u05DC\u05DE\u05E9\u05D5\u05D5\u05E7 \u05E2\u05E9\u05D5\u05D9 \u05DC\u05D4\u05D9\u05D5\u05EA \u05E0\u05D9\u05D2\u05D5\u05D3 \u05E2\u05E0\u05D9\u05D9\u05E0\u05D9\u05DD \u05D1\u05D9\u05D7\u05E1 \u05DC\u05D4\u05DE\u05DC\u05E6\u05D5\u05EA\u05D9\u05D5, \u05D1\u05D4\u05EA\u05D0\u05DD \u05DC\u05D2\u05D9\u05DC\u05D5\u05D9 \u05D4\u05E0\u05D0\u05D5\u05EA \u05E9\u05E0\u05DE\u05E1\u05E8 \u05DC\u05DC\u05E7\u05D5\u05D7.'

// ══════════════════════════════════════════════════
//  DOCUMENT
// ══════════════════════════════════════════════════
const MeetingSummaryDoc = ({ data, styled }) => {
  const d = data || {}
  const s = !!styled

  // fix #1 — identity table border style (shared for both rows)
  const idTableRowStyle = {
    flexDirection: 'row-reverse',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftColor: s ? C.border : C.black,
    borderRightColor: s ? C.border : C.black,
    borderBottomColor: s ? C.border : C.black,
    backgroundColor: s ? C.surface : C.white,
  }

  return (
    <Document>
      <Page size="A4" style={pageStyle}>
        <PageHeader styled={s} />

        {/* Title: full width, centered, dark bg */}
        <View style={{
          backgroundColor: s ? C.primary : C.black,
          paddingVertical: s ? 8 : 5,
          paddingHorizontal: 10,
          marginBottom: 0,
        }}>
          <Text style={{
            fontSize: s ? 14 : 11,
            fontWeight: 'bold',
            color: C.white,
            textAlign: 'center',
          }}>
            {'\u05E1\u05D9\u05DB\u05D5\u05DD \u05E4\u05D2\u05D9\u05E9\u05D4'}
          </Text>
        </View>

        {/* Identity table row 1 */}
        <View style={idTableRowStyle}>
          <IdCell label={'\u05E9\u05DD \u05DC\u05E7\u05D5\u05D7'} value={d.clientName} styled={s} />
          <IdCell label={'\u05EA.\u05D6 \u05DC\u05E7\u05D5\u05D7'} value={d.clientId} styled={s} borderLeft />
          <IdCell label={'\u05E9\u05DD \u05DE\u05E9\u05D5\u05D5\u05E7'} value={d.advisorName} styled={s} borderLeft />
          <IdCell label={'\u05EA\u05D0\u05E8\u05D9\u05DA'} value={s ? fmtDateAuto() : null} styled={s} borderLeft />
        </View>
        {/* Identity row 2 — styled only (advisor ID + license) */}
        {s && (
          <View style={idTableRowStyle}>
            <IdCell label={'\u05EA.\u05D6 \u05DE\u05E9\u05D5\u05D5\u05E7'} value={d.advisorId} styled={s} />
            <IdCell label={'\u05DE\u05E1\u05F3 \u05E8\u05D9\u05E9\u05D9\u05D5\u05DF'} value={d.advisorLicense} styled={s} borderLeft />
            <IdCell label="" value="" styled={s} borderLeft />
            <IdCell label="" value="" styled={s} borderLeft />
          </View>
        )}

        {/* 2. Contact details update */}
        <SectionTitle styled={s}>{'\u05E2\u05D3\u05DB\u05D5\u05DF \u05E4\u05E8\u05D8\u05D9 \u05D4\u05EA\u05E7\u05E9\u05E8\u05D5\u05EA'}</SectionTitle>
        <View style={{
          flexDirection: 'row-reverse',
          borderWidth: 0.5,
          borderColor: s ? C.border : C.black,
        }}>
          <ContactField label={'\u05DB\u05EA\u05D5\u05D1\u05EA'} value={d.address} styled={s} />
          <ContactField label={'\u05D8\u05DC\u05E4\u05D5\u05DF'} value={d.phone} styled={s} borderLeft />
          <ContactField label={'\u05D0\u05D9\u05DE\u05D9\u05D9\u05DC'} value={d.email} styled={s} borderLeft />
          <ContactField label={'\u05E1\u05DC\u05D5\u05DC\u05E8\u05D9'} value={d.mobile} styled={s} borderLeft />
        </View>

        {/* 3. Meeting meta */}
        <SectionTitle styled={s}>{'\u05E4\u05E8\u05D8\u05D9 \u05D4\u05E4\u05D2\u05D9\u05E9\u05D4'}</SectionTitle>
        <View style={{ paddingHorizontal: 4 }}>
          <RadioRow
            label={'\u05E1\u05D9\u05D1\u05EA \u05D4\u05E4\u05D2\u05D9\u05E9\u05D4'}
            options={[
              { value: 'periodic', label: '\u05EA\u05E7\u05D5\u05E4\u05EA\u05D9\u05EA' },
              { value: 'client_request', label: '\u05D1\u05E7\u05E9\u05EA \u05DC\u05E7\u05D5\u05D7' },
              { value: 'advisor_request', label: '\u05D9\u05D5\u05D6\u05DE\u05EA \u05DE\u05E9\u05D5\u05D5\u05E7' },
              { value: 'other', label: '\u05D0\u05D7\u05E8' },
            ]}
            value={d.meetingReason}
            compact={!s}
          />
          <RadioRow
            label={'\u05D0\u05D5\u05E4\u05DF \u05D4\u05E4\u05D2\u05D9\u05E9\u05D4'}
            options={[
              { value: 'in_person', label: '\u05E4\u05E8\u05D5\u05E0\u05D8\u05DC\u05D9\u05EA' },
              { value: 'phone', label: '\u05D8\u05DC\u05E4\u05D5\u05E0\u05D9\u05EA' },
              { value: 'video', label: '\u05D5\u05D9\u05D3\u05D0\u05D5' },
            ]}
            value={d.meetingType}
            compact={!s}
          />
          <RadioRow
            label={'\u05D9\u05D5\u05D6\u05DD \u05D4\u05E4\u05D2\u05D9\u05E9\u05D4'}
            options={[
              { value: 'client', label: '\u05DC\u05E7\u05D5\u05D7' },
              { value: 'advisor', label: '\u05DE\u05E9\u05D5\u05D5\u05E7' },
              { value: 'other', label: '\u05D0\u05D7\u05E8' },
            ]}
            value={d.meetingInitiator}
            compact={!s}
          />
          {d.meetingInitiator === 'other' && d.initiatorOther && (
            <View style={{ flexDirection: 'row-reverse', marginBottom: 2, paddingRight: 4 }}>
              <Text style={{ fontSize: 8, color: C.muted }}>{'\u05E4\u05D9\u05E8\u05D5\u05D8: '}</Text>
              <Text style={{ fontSize: 8, color: C.black }}>{d.initiatorOther}</Text>
            </View>
          )}
          <View style={{ flexDirection: 'row-reverse', alignItems: 'center', marginBottom: s ? 4 : 2 }}>
            <Text style={{ fontSize: s ? 9 : 7.5, fontWeight: 'bold', color: C.black, textAlign: 'right', marginLeft: 6 }}>{'\u05DE\u05E9\u05DA \u05D4\u05E4\u05D2\u05D9\u05E9\u05D4:'}</Text>
            {d.meetingDuration ? (
              <Text style={{ fontSize: s ? 9 : 7.5, color: C.black }}>{d.meetingDuration} {'\u05D3\u05E7\u05D5\u05EA'}</Text>
            ) : (
              <View style={{ borderBottomWidth: 1, borderBottomColor: C.black, width: s ? 80 : 60, height: s ? 14 : 10 }} />
            )}
          </View>
        </View>

        {/* 4. Topics table */}
        <SectionTitle styled={s}>{s ? '\u05E0\u05D5\u05E9\u05D0\u05D9\u05DD \u05E9\u05E0\u05D3\u05D5\u05E0\u05D5 \u05D1\u05E4\u05D2\u05D9\u05E9\u05D4' : '\u05E2\u05D3\u05DB\u05D5\u05DF \u05E4\u05E8\u05D8\u05D9\u05DD/\u05E6\u05E8\u05DB\u05D9\u05DD'}</SectionTitle>
        <TopicsTable data={d.topics} styled={s} />

        {/* 5. Meeting summary */}
        <SectionTitle styled={s}>{'\u05E1\u05D9\u05DB\u05D5\u05DD \u05D4\u05E4\u05D2\u05D9\u05E9\u05D4'}</SectionTitle>
        {d.summary ? (
          <View style={{ paddingHorizontal: 4, minHeight: s ? 80 : 30 }}>
            <Text style={{ fontSize: s ? 9 : 7.5, color: C.black, textAlign: 'right', lineHeight: 1.6 }}>{d.summary}</Text>
          </View>
        ) : (
          <WritingLines count={s ? 6 : 3} compact={!s} />
        )}

        {/* 6. Advisor recommendation */}
        <SectionTitle styled={s}>{'\u05D4\u05DE\u05DC\u05E6\u05EA \u05D4\u05DE\u05E9\u05D5\u05D5\u05E7'}</SectionTitle>
        {d.recommendation ? (
          <View style={{ paddingHorizontal: 4, minHeight: s ? 55 : 20 }}>
            <Text style={{ fontSize: s ? 9 : 7.5, color: C.black, textAlign: 'right', lineHeight: 1.6 }}>{d.recommendation}</Text>
          </View>
        ) : (
          <WritingLines count={s ? 4 : 4} compact={!s} />
        )}

        {/* Conflict of interest checkbox */}
        <View style={{ marginTop: s ? 10 : 2, paddingHorizontal: 4 }}>
          <CB checked={d.conflictOfInterest} label={CONFLICT_LABEL} compact={!s} />
        </View>

        {/* 8. Decision */}
        <SectionTitle styled={s}>{'\u05D4\u05D7\u05DC\u05D8\u05D4'}</SectionTitle>
        {d.decision ? (
          <View style={{ paddingHorizontal: 4, minHeight: s ? 30 : 14 }}>
            <Text style={{ fontSize: s ? 9 : 7.5, color: C.black, textAlign: 'right', lineHeight: 1.6 }}>{d.decision}</Text>
          </View>
        ) : (
          <WritingLines count={s ? 2 : 2} compact={!s} />
        )}

        {/* 9. Tasks */}
        <SectionTitle styled={s}>{'\u05DE\u05E9\u05D9\u05DE\u05D5\u05EA \u05DC\u05D4\u05DE\u05E9\u05DA'}</SectionTitle>
        {d.tasks ? (
          <View style={{ paddingHorizontal: 4, minHeight: s ? 30 : 14 }}>
            <Text style={{ fontSize: s ? 9 : 7.5, color: C.black, textAlign: 'right', lineHeight: 1.6 }}>{d.tasks}</Text>
          </View>
        ) : (
          <WritingLines count={s ? 2 : 2} compact={!s} />
        )}

        {/* 10. Client declaration */}
        <View style={{ marginTop: s ? 14 : 4, paddingHorizontal: 4 }}>
          <Text style={{ fontSize: s ? 8 : 7, fontWeight: 'bold', color: C.black, textAlign: 'right', marginBottom: 2 }}>{'\u05D4\u05E6\u05D4\u05E8\u05EA \u05D4\u05DC\u05E7\u05D5\u05D7:'}</Text>
          <Text style={{ fontSize: s ? 7.5 : 7, color: C.black, textAlign: 'right', lineHeight: 1.4 }}>{DECLARATION_TEXT}</Text>
        </View>

        {/* Spacer to push signatures to bottom */}
        {!s && <View style={{ flex: 1 }} />}

        {/* Signatures: 50% each, symmetric, label below line */}
        <View style={{ flexDirection: 'row-reverse', justifyContent: 'center', marginTop: s ? 24 : 4 }}>
          <SignBlock label={'\u05D7\u05EA\u05D9\u05DE\u05EA \u05D4\u05DC\u05E7\u05D5\u05D7'} styled={s} />
          <SignBlock label={'\u05D7\u05EA\u05D9\u05DE\u05EA \u05D4\u05DE\u05E9\u05D5\u05D5\u05E7'} styled={s} />
        </View>

        <PageFooter />
      </Page>
    </Document>
  )
}

// ══════════════════════════════════════════════════
//  EXPORTS
// ══════════════════════════════════════════════════

/** גרסת ממשק — צבעי GREEN, תאריכים אוטומטיים, פרטים מסשן */
export async function generateMeetingSummaryStyled(meetingData) {
  const blob = await pdf(<MeetingSummaryDoc data={meetingData} styled={true} />).toBlob()
  const pdfBytes = await blob.arrayBuffer()

  const clientName = meetingData.clientName || 'client'
  const safeName = clientName.replace(/[^a-zA-Z0-9\u0590-\u05FF]/g, '_')
  const dateStr = new Date().toISOString().split('T')[0]
  const fileName = `\u05E1\u05D9\u05DB\u05D5\u05DD_\u05E4\u05D2\u05D9\u05E9\u05D4_${dateStr}_${safeName}.pdf`

  const previewBlob = new Blob([pdfBytes], { type: 'application/pdf' })
  const previewUrl = URL.createObjectURL(previewBlob)

  return { url: previewUrl, fileName, pdfBytes }
}

/** גרסת הדפסה — שחור-לבן, שדות ריקים */
export async function generateMeetingSummaryBlank() {
  const blob = await pdf(<MeetingSummaryDoc data={{}} styled={false} />).toBlob()
  const pdfBytes = await blob.arrayBuffer()

  const fileName = '\u05E1\u05D9\u05DB\u05D5\u05DD_\u05E4\u05D2\u05D9\u05E9\u05D4_\u05D9\u05D3\u05E0\u05D9.pdf'

  const previewBlob = new Blob([pdfBytes], { type: 'application/pdf' })
  const previewUrl = URL.createObjectURL(previewBlob)

  return { url: previewUrl, fileName, pdfBytes }
}
