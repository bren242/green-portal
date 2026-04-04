// GREEN Portal — לקוח כשיר לפי חוק הייעוץ PDF Generator
// גרסת ממשק = צבעי GREEN + תאריכים אוטומטיים
// גרסת הדפסה = שחור-לבן, קווים נקיים
// טקסט משפטי = AS IS, אסור לשנות מילה

import React from 'react'
import { Document, Page, Text, View, Image, Font, pdf, Svg, Path } from '@react-pdf/renderer'
import { logoPng } from '../../assets/logoBase64'
import { getQualifiedAmounts } from '../../data/qualifiedAmounts'

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
  black: '#1A1A1A',
  muted: '#5A5A5A',
  white: '#FFFFFF',
  border: '#DDD5BF',
  surface: '#F6F5F1',
}

// ── Helpers ───────────────────────────────────────────────────
const today = () => {
  const d = new Date()
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

// ── SVG Checkmark ─────────────────────────────────────────────
const CheckMark = ({ size = 9 }) => (
  <Svg viewBox="0 0 24 24" width={size} height={size}>
    <Path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill={C.black} />
  </Svg>
)

// ── Radio circle ──────────────────────────────────────────────
const Radio = ({ checked, size = 11 }) => (
  <View style={{
    width: size, height: size,
    borderRadius: size / 2,
    borderWidth: 1,
    borderColor: C.black,
    flexShrink: 0,
    justifyContent: 'center',
    alignItems: 'center',
  }}>
    {checked && (
      <View style={{
        width: size - 5, height: size - 5,
        borderRadius: (size - 5) / 2,
        backgroundColor: C.black,
      }} />
    )}
  </View>
)

// ── Checkbox component ────────────────────────────────────────
const CB = ({ checked, size = 11 }) => (
  <View style={{
    width: size, height: size,
    borderWidth: 1,
    borderColor: C.black,
    flexShrink: 0,
    justifyContent: 'center',
    alignItems: 'center',
  }}>
    {checked && <CheckMark size={size - 3} />}
  </View>
)

// ── Numbered paragraph — number in separate column for proper RTL ──
const NumPara = ({ num, children, bold, size = 9, mb = 4, indent = 20 }) => (
  <View style={{ flexDirection: 'row-reverse', marginBottom: mb }}>
    <Text style={{ fontSize: size, fontWeight: bold ? 'bold' : 'normal', color: C.black, textAlign: 'right', width: indent, flexShrink: 0 }}>
      {num}
    </Text>
    <View style={{ flex: 1 }}>
      {children}
    </View>
  </View>
)

// ── Signature line ────────────────────────────────────────────
const SignLine = ({ label, value, width = '45%' }) => (
  <View style={{ width, alignItems: 'center' }}>
    {value ? (
      <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.black, textAlign: 'center', marginBottom: 4 }}>{value}</Text>
    ) : (
      <View style={{ borderBottomWidth: 1, borderBottomColor: C.black, width: '100%', height: 25, marginBottom: 4 }} />
    )}
    <Text style={{ fontSize: 8, color: C.muted, textAlign: 'center' }}>{label}</Text>
  </View>
)

// ── Footer ────────────────────────────────────────────────────
const Footer = ({ styled: s }) => (
  <View style={{
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: s ? C.primary : C.white,
    paddingVertical: 6,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  }}>
    <Text style={{ fontSize: 7, color: s ? C.gold : C.muted, letterSpacing: 0.5 }}>WWW.GREENWM.CO.IL</Text>
    <Text style={{ fontSize: 7, color: s ? C.gold : C.muted }}>|</Text>
    <Text style={{ fontSize: 7, color: s ? C.gold : C.muted, letterSpacing: 0.5 }}>INFO@GREENWM.CO.IL</Text>
    <Text style={{ fontSize: 7, color: s ? C.gold : C.muted }}>|</Text>
    <Text style={{ fontSize: 7, color: s ? C.gold : C.muted, letterSpacing: 0.5 }}>03-6456005/6</Text>
  </View>
)

// ── Inline field (name/id with underline or value) ────────────
const InlineField = ({ value, width = 120 }) => {
  if (value) {
    return <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.black, marginHorizontal: 4 }}>{value}</Text>
  }
  return <View style={{ borderBottomWidth: 1, borderBottomColor: C.black, width, height: 14, marginHorizontal: 4 }} />
}

// ── Text line shortcut ────────────────────────────────────────
const T = ({ children, bold, size = 9, mb = 0, mt = 0, lh = 1.6 }) => (
  <Text style={{
    fontSize: size,
    fontWeight: bold ? 'bold' : 'normal',
    color: C.black,
    textAlign: 'right',
    lineHeight: lh,
    marginBottom: mb,
    marginTop: mt,
  }}>{children}</Text>
)

// ── Radio option row — radio on right, text left ──────────────
const RadioOption = ({ num, label, checked, extra }) => (
  <View style={{ flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 5, paddingRight: 15 }}>
    <Radio checked={checked} />
    <Text style={{ fontSize: 9, color: C.black, textAlign: 'right', marginRight: 6 }}>
      {num + '  ' + label}
    </Text>
    {extra || null}
  </View>
)

// ══════════════════════════════════════════════════════════════
// PAGE 1 — הסכמת לקוח כשיר
// ══════════════════════════════════════════════════════════════
const Page1 = ({ data: d, styled: s }) => {
  const amounts = getQualifiedAmounts()
  const amountAdvisor = amounts.amount_advisor || '12'

  return (
    <Page size="A4" style={{ fontFamily: 'Assistant', padding: 35, paddingBottom: 45, backgroundColor: C.white }}>
      {/* Header Logo */}
      <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: s ? 15 : 10 }}>
        <Image src={logoPng} style={{ height: s ? 40 : 30, objectFit: 'contain' }} />
        <View />
      </View>

      {/* Title */}
      <View style={{
        backgroundColor: s ? C.primary : C.white,
        paddingVertical: s ? 10 : 6,
        paddingHorizontal: 10,
        marginBottom: s ? 15 : 10,
        ...(s ? {} : { borderWidth: 1.5, borderColor: C.black }),
      }}>
        <Text style={{
          fontSize: s ? 14 : 12,
          fontWeight: 'bold',
          color: s ? C.white : C.black,
          textAlign: 'center',
        }}>
          {'\u05D4\u05E0\u05D3\u05D5\u05DF: \u05D4\u05E1\u05DB\u05DE\u05EA \u05D4\u05DC\u05E7\u05D5\u05D7 \u05DB\u05D9 \u05D9\u05D7\u05E9\u05D1 \u05DB\u05DC\u05E7\u05D5\u05D7 \u05DB\u05E9\u05D9\u05E8'}
        </Text>
      </View>

      {/* Opening line */}
      <View style={{ flexDirection: 'row-reverse', flexWrap: 'wrap', marginBottom: 6, alignItems: 'flex-end' }}>
        <Text style={{ fontSize: 10, color: C.black, textAlign: 'right' }}>{'\u05D0\u05E0\u05D9 \u05D4\u05D7"\u05DE,'}</Text>
        <InlineField value={d.clientName} width={150} />
        <Text style={{ fontSize: 10, color: C.black }}>{'\u05EA.\u05D6.'}</Text>
        <InlineField value={d.clientId} width={100} />
        <Text style={{ fontSize: 10, color: C.black }}>{' ("\u05D4\u05DC\u05E7\u05D5\u05D7") \u05DE\u05E6\u05D4\u05D9\u05E8, \u05DE\u05D0\u05E9\u05E8 \u05D5\u05DE\u05E1\u05DB\u05D9\u05DD'}</Text>
      </View>

      {/* Intro paragraph — AS IS */}
      <T size={9} mb={3}>
        {'\u05D1\u05D6\u05D0\u05EA, \u05DC\u05D0\u05D7\u05E8 \u05E9\u05D4\u05D5\u05D1\u05D0\u05D5 \u05DC\u05D9\u05D3\u05D9\u05E2\u05EA\u05D9 \u05D4\u05D5\u05E8\u05D0\u05D5\u05EA \u05D7\u05D5\u05E7 \u05D4\u05E1\u05D3\u05E8\u05EA \u05D4\u05E2\u05D9\u05E1\u05D5\u05E7 \u05D1\u05D9\u05D9\u05E2\u05D5\u05E5 \u05D4\u05E9\u05E7\u05E2\u05D5\u05EA, \u05E9\u05D9\u05D5\u05D5\u05E7 \u05D4\u05E9\u05E7\u05E2\u05D5\u05EA \u05D5\u05E0\u05D9\u05D4\u05D5\u05DC \u05EA\u05D9\u05E7\u05D9 \u05D4\u05E9\u05E7\u05E2\u05D5\u05EA,'}
      </T>
      <T size={9} mb={3}>
        {'\u05D4\u05EA\u05E9\u05E0"\u05D4-1995 ("\u05D7\u05D5\u05E7 \u05D4\u05D9\u05E2\u05D5\u05E5"), \u05DC\u05E8\u05D1\u05D5\u05EA \u05D4\u05EA\u05D5\u05E1\u05E4\u05EA \u05D4\u05E8\u05D0\u05E9\u05D5\u05E0\u05D4 \u05DC\u05D7\u05D5\u05E7 \u05D4\u05D9\u05D9\u05E2\u05D5\u05E5, \u05DB\u05D9 \u05DE\u05EA\u05E7\u05D9\u05D9\u05DE\u05D9\u05DD \u05D1\u05D9\u05D7\u05E1 \u05D0\u05DC\u05D9\u05D9 2 \u05DE\u05D1\u05D9\u05DF 3'}
      </T>
      <T size={9} mb={3}>
        {'\u05D4\u05EA\u05E0\u05D0\u05D9\u05DD \u05D4\u05DE\u05E4\u05D5\u05E8\u05D8\u05D9\u05DD \u05D1\u05EA\u05D5\u05E1\u05E4\u05EA \u05D4\u05E8\u05D0\u05E9\u05D5\u05E0\u05D4 \u05DC\u05E2\u05E0\u05D9\u05D9\u05DF \u05D4\u05D9\u05D5\u05EA\u05D9 \u05DC\u05E7\u05D5\u05D7 \u05DB\u05E9\u05D9\u05E8, \u05D5\u05DC\u05E4\u05D9\u05DB\u05DA \u05D4\u05E0\u05E0\u05D9 \u05DE\u05D0\u05E9\u05E8, \u05DE\u05E6\u05D4\u05D9\u05E8 \u05D5\u05DE\u05E1\u05DB\u05D9\u05DD "\u05DC\u05E7\u05D5\u05D7 \u05DB\u05E9\u05D9\u05E8"'}
      </T>
      <T size={9} mb={8}>
        {'\u05DB\u05D4\u05D2\u05D3\u05E8\u05EA\u05D5 \u05D1\u05EA\u05D5\u05E1\u05E4\u05EA \u05D4\u05E8\u05D0\u05E9\u05D5\u05E0\u05D4 \u05DC\u05D7\u05D5\u05E7 \u05D4\u05D9\u05D9\u05E2\u05D5\u05E5.'}
      </T>

      {/* Instructions line — bold */}
      <T size={9} bold mb={10}>
        {'\u05DC\u05D4\u05DC\u05DF \u05D4\u05EA\u05E0\u05D0\u05D9\u05DD \u05DB\u05E4\u05D9 \u05E9\u05DE\u05E4\u05D5\u05E8\u05D8\u05D9\u05DD \u05D1\u05EA\u05D5\u05E1\u05E4\u05EA \u05E8\u05D0\u05E9\u05D5\u05E0\u05D4 \u05DC\u05D7\u05D5\u05E7 \u05D4\u05D9\u05D9\u05E2\u05D5\u05E5 (\u05D9\u05E9 \u05DC\u05D7\u05EA\u05D5\u05DD \u05D1\u05E6\u05D3 \u05D4\u05EA\u05E0\u05D0\u05D9\u05DD \u05D4\u05DE\u05EA\u05E7\u05D9\u05D9\u05DE\u05D9\u05DD):'}
      </T>

      {/* ── Condition (1) — number in separate column ── */}
      <NumPara num="(1)" mb={2}>
        <Text style={{ fontSize: 9, color: C.black, textAlign: 'right', lineHeight: 1.6 }}>
          {'\u05D4\u05E9\u05D5\u05D5\u05D9 \u05D4\u05DB\u05D5\u05DC\u05DC \u05E9\u05DC \u05D4\u05DE\u05D6\u05D5\u05DE\u05E0\u05D9\u05DD, \u05E4\u05D9\u05E7\u05D3\u05D5\u05E0\u05D5\u05EA, \u05E0\u05DB\u05E1\u05D9\u05DD \u05E4\u05D9\u05E0\u05E0\u05E1\u05D9\u05D9\u05DD \u05D5\u05E0\u05D9\u05D9\u05E8\u05D5\u05EA \u05E2\u05E8\u05DA \u05DB\u05D4\u05D2\u05D3\u05E8\u05EA\u05DD \u05D1\u05E1\u05E2\u05D9\u05E3 52 \u05DC\u05D7\u05D5\u05E7 \u05E0\u05D9\u05D9\u05E8\u05D5\u05EA \u05E2\u05E8\u05DA, \u05D4\u05EA\u05E9\u05DB"\u05D7-1968'}
        </Text>
        <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.black, textAlign: 'right', lineHeight: 1.6 }}>
          {'\u05E9\u05D1\u05D1\u05E2\u05DC\u05D5\u05EA \u05D4\u05DC\u05E7\u05D5\u05D7 \u05E2\u05D5\u05DC\u05D4 \u05E2\u05DC ' + amountAdvisor + ' \u05DE\u05D9\u05DC\u05D9\u05D5\u05DF \u05E9\u05E7\u05DC\u05D9\u05DD \u05D7\u05D3\u05E9\u05D9\u05DD;'}
        </Text>
      </NumPara>

      {/* Signature for condition 1 */}
      <View style={{ flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 6, gap: 8 }}>
        <Text style={{ fontSize: 9, color: C.black }}>{'\u05D7\u05EA\u05D9\u05DE\u05D4:'}</Text>
        <View style={{ borderBottomWidth: 1, borderBottomColor: C.black, width: 150, height: 20 }} />
      </View>

      {/* Bold note — AS IS */}
      <T size={8} bold mb={10}>
        {'[\u05D9\u05E9 \u05DC\u05E6\u05E8\u05E3 \u05D0\u05D9\u05E9\u05D5\u05E8 \u05D7\u05EA\u05D5\u05DD \u05E2"\u05D9 \u05E8\u05D5"\u05D7 \u05D0\u05D5 \u05E2\u05D5"\u05D3 \u05D0\u05D5 \u05D0\u05E1\u05DE\u05DB\u05EA\u05D0\u05D5\u05EA \u05D0\u05D7\u05E8\u05D5\u05EA \u05E8\u05DC\u05D5\u05D5\u05E0\u05D8\u05D9\u05D5\u05EA \u05D4\u05DE\u05E2\u05D9\u05D3\u05D5\u05EA \u05E2\u05DC \u05D4\u05EA\u05E7\u05D9\u05D9\u05DE\u05D5\u05EA \u05D4\u05EA\u05E0\u05D0\u05D9]'}
      </T>

      {/* ── Condition (2) — number in separate column ── */}
      <NumPara num="(2)" mb={6}>
        <Text style={{ fontSize: 9, color: C.black, textAlign: 'right', lineHeight: 1.6 }}>
          {'\u05D4\u05DC\u05E7\u05D5\u05D7 \u05D1\u05E2\u05DC \u05DE\u05D5\u05DE\u05D7\u05D9\u05D5\u05EA \u05D5\u05DB\u05E9\u05D9\u05E8\u05D5\u05EA \u05D1\u05EA\u05D7\u05D5\u05DD \u05E9\u05D5\u05E7 \u05D4\u05D4\u05D5\u05DF \u05D0\u05D5 \u05D4\u05D5\u05E2\u05E1\u05E7 \u05DC\u05E4\u05D7\u05D5\u05EA \u05E9\u05E0\u05D4 \u05D1\u05EA\u05E4\u05E7\u05D9\u05D3 \u05DE\u05E7\u05E6\u05D5\u05E2\u05D9 \u05E9\u05D3\u05D5\u05E8\u05E9 \u05DE\u05D5\u05DE\u05D7\u05D9\u05D5\u05EA \u05D1\u05E9\u05D5\u05E7 \u05D4\u05D4\u05D5\u05DF -'}
        </Text>
      </NumPara>

      {/* 5 radio options with proper numbering */}
      <RadioOption num="(1" label={'\u05DE\u05E0\u05DB"\u05DC/\u05D1\u05E2\u05DC\u05D9\u05DD \u05E9\u05DC \u05D7\u05D1\u05E8\u05D4 \u05D1\u05E9\u05D5\u05E7 \u05D4\u05D4\u05D5\u05DF / \u05D1\u05D9\u05D8\u05D5\u05D7'} checked={d.condition2Role === 'ceo'} />
      <RadioOption num="(2" label={'\u05DE\u05E0\u05D4\u05DC \u05DB\u05E1\u05E4\u05D9\u05DD'} checked={d.condition2Role === 'cfo'} />
      <RadioOption num="(3" label={'\u05DE\u05E0\u05D4\u05DC \u05D4\u05E9\u05E7\u05E2\u05D5\u05EA'} checked={d.condition2Role === 'investment'} />
      <RadioOption num="(4" label={'\u05E1\u05D5\u05D7\u05E8'} checked={d.condition2Role === 'trader'} />
      <RadioOption num="(5" label={'\u05D0\u05D7\u05E8'} checked={d.condition2Role === 'other'}
        extra={
          d.condition2Other ? (
            <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.black, marginRight: 6 }}>{d.condition2Other}</Text>
          ) : (
            <View style={{ borderBottomWidth: 1, borderBottomColor: C.black, width: 180, height: 14, marginRight: 6 }} />
          )
        }
      />

      {/* Note about extended questionnaire */}
      <T size={8} mb={8} mt={2}>{' (\u05D1\u05DE\u05D9\u05D3\u05D4 \u05D5\u05E1\u05D5\u05DE\u05DF \u05D0\u05D7\u05E8 \u05D9\u05E9 \u05DC\u05DE\u05DC\u05D0 \u05E9\u05D0\u05DC\u05D5\u05DF \u05DE\u05D5\u05E8\u05D7\u05D1)'}</T>

      {/* Experience details */}
      <T size={9} bold mb={4}>{'\u05E4\u05D9\u05E8\u05D5\u05D8 \u05D0\u05D5\u05D3\u05D5\u05EA \u05E0\u05D9\u05E1\u05D9\u05D5\u05DF \u05E8\u05DC\u05D5\u05D5\u05E0\u05D8\u05D9'}</T>
      {d.experienceDetails ? (
        <T size={9} mb={6}>{d.experienceDetails}</T>
      ) : (
        <View style={{ borderBottomWidth: 1, borderBottomColor: C.black, width: '100%', height: 20, marginBottom: 6 }} />
      )}

      {/* Signature for condition 2 */}
      <View style={{ flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 6, gap: 8 }}>
        <Text style={{ fontSize: 9, color: C.black }}>{'\u05D7\u05EA\u05D9\u05DE\u05D4:'}</Text>
        <View style={{ borderBottomWidth: 1, borderBottomColor: C.black, width: 150, height: 20 }} />
      </View>

      <View style={{ flex: 1 }} />
      <Footer styled={s} />
    </Page>
  )
}

// ══════════════════════════════════════════════════════════════
// PAGE 2 — Condition 3 + Waiver + Advisor declaration
// ══════════════════════════════════════════════════════════════
const Page2 = ({ data: d, styled: s }) => (
  <Page size="A4" style={{ fontFamily: 'Assistant', padding: 35, paddingBottom: 45, backgroundColor: C.white }}>
    {/* Header Logo */}
    <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: s ? 15 : 10 }}>
      <Image src={logoPng} style={{ height: s ? 40 : 30, objectFit: 'contain' }} />
      <View />
    </View>

    {/* ── Condition (3) — number in separate column ── */}
    <NumPara num="(3)" mb={2}>
      <Text style={{ fontSize: 9, color: C.black, textAlign: 'right', lineHeight: 1.6 }}>
        {'\u05D4\u05DC\u05E7\u05D5\u05D7 \u05D1\u05D9\u05E6\u05E2 \u05DC\u05E4\u05D7\u05D5\u05EA 30 \u05E2\u05E1\u05E7\u05D0\u05D5\u05EA, \u05D1\u05DE\u05DE\u05D5\u05E6\u05E2, \u05D1\u05DB\u05DC \u05E8\u05D1\u05E2\u05D5\u05DF \u05D1\u05DE\u05E9\u05DA \u05D0\u05E8\u05D1\u05E2\u05EA \u05D4\u05E8\u05D1\u05E2\u05D5\u05E0\u05D9\u05DD \u05E9\u05E7\u05D3\u05DE\u05D5 \u05DC\u05D4\u05E1\u05DB\u05DE\u05EA\u05D5; \u05DC\u05E2\u05E0\u05D9\u05D9\u05DF \u05D6\u05D4'}
      </Text>
      <Text style={{ fontSize: 9, color: C.black, textAlign: 'right', lineHeight: 1.6 }}>
        {'"\u05E2\u05E1\u05E7\u05D4" \u2013 \u05DC\u05DE\u05E2\u05D8 \u05E2\u05E1\u05E7\u05D4 \u05E9\u05D1\u05D9\u05E6\u05E2 \u05DE\u05E0\u05D4\u05DC \u05EA\u05D9\u05E7\u05D9\u05DD \u05D1\u05E2\u05D1\u05D5\u05E8 \u05D9\u05D7\u05D9\u05D3 \u05D4\u05E7\u05E9\u05D5\u05E8 \u05E2\u05D9\u05DE\u05D5 \u05D1\u05D4\u05E1\u05DB\u05DD \u05DC\u05E0\u05D9\u05D4\u05D5\u05DC \u05EA\u05D9\u05E7\u05D9 \u05D4\u05E9\u05E7\u05E2\u05D5\u05EA.'}
      </Text>
    </NumPara>

    {/* Signature for condition 3 */}
    <View style={{ flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 12, gap: 8 }}>
      <Text style={{ fontSize: 9, color: C.black }}>{'\u05D7\u05EA\u05D9\u05DE\u05D4:'}</Text>
      <View style={{ borderBottomWidth: 1, borderBottomColor: C.black, width: 150, height: 20 }} />
    </View>

    {/* ── "ולראיה באתי על החתום:" + Date + Signature ── */}
    <T size={10} bold mb={10}>{'\u05D5\u05DC\u05E8\u05D0\u05D9\u05D4 \u05D1\u05D0\u05EA\u05D9 \u05E2\u05DC \u05D4\u05D7\u05EA\u05D5\u05DD:'}</T>
    <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 15 }}>
      <SignLine label={'\u05EA\u05D0\u05E8\u05D9\u05DA'} value={s ? today() : null} />
      <SignLine label={'\u05D7\u05EA\u05D9\u05DE\u05D4'} value={null} />
    </View>

    {/* ── Waiver section ── */}
    <T size={9} mb={2}>
      {'\u05D4\u05D7"\u05DE \u05DE\u05E6\u05D4\u05D9\u05E8 \u05DB\u05D9 \u05D1\u05E2\u05DC \u05D4\u05E8\u05D9\u05E9\u05D9\u05D5\u05DF \u05D4\u05E1\u05D1\u05D9\u05E8 \u05DC\u05D5 \u05DE\u05E4\u05D5\u05E8\u05E9\u05D5\u05EA \u05D0\u05D5\u05D3\u05D5\u05EA \u05DE\u05E9\u05DE\u05E2\u05D5\u05EA \u05D4\u05D4\u05E1\u05DB\u05DE\u05D4 \u05DC\u05D4\u05D9\u05D7\u05E9\u05D1 \u05DC\u05E7\u05D5\u05D7 \u05DB\u05E9\u05D9\u05E8, \u05D0\u05E9\u05E8 \u05DB\u05D5\u05DC\u05DC\u05EA'}
    </T>
    <T size={9} bold mb={8}>{'\u05D5\u05D9\u05EA\u05D5\u05E8 \u05E2\u05DC \u05D4\u05D4\u05D2\u05E0\u05D5\u05EA \u05DE\u05DB\u05D5\u05D7 \u05D7\u05D5\u05E7 \u05D4\u05D9\u05D9\u05E2\u05D5\u05E5 \u05DB\u05DE\u05E4\u05D5\u05E8\u05D8 \u05DC\u05D4\u05DC\u05DF:'}</T>

    {/* 7 waiver clauses — each with number in separate column */}
    <NumPara num="(1)"><T size={9}>{'\u05D4\u05EA\u05D0\u05DE\u05EA \u05E9\u05D9\u05E8\u05D5\u05EA \u05D1\u05D4\u05EA\u05D0\u05DD \u05DC\u05E1\u05E2\u05D9\u05E3 12 \u05DC\u05D7\u05D5\u05E7 \u05D4\u05D9\u05D9\u05E2\u05D5\u05E5;'}</T></NumPara>
    <NumPara num="(2)"><T size={9}>{'\u05E2\u05E8\u05D9\u05DB\u05EA \u05D4\u05E1\u05DB\u05DD \u05D1\u05DB\u05EA\u05D1 \u05D5\u05DE\u05E1\u05D9\u05E8\u05EA\u05D5 \u05D8\u05E8\u05DD \u05EA\u05D7\u05D9\u05DC\u05EA \u05D4\u05E9\u05D9\u05E8\u05D5\u05EA \u05D1\u05DE\u05EA\u05DB\u05D5\u05E0\u05EA \u05D4\u05E7\u05D1\u05D5\u05E2\u05D4 \u05D1\u05E1\u05E2\u05D9\u05E3 13 \u05DC\u05D7\u05D5\u05E7 \u05D4\u05D9\u05D9\u05E2\u05D5\u05E5;'}</T></NumPara>
    <NumPara num="(3)">
      <T size={9}>{'\u05E7\u05D1\u05DC\u05EA \u05D2\u05D9\u05DC\u05D5\u05D9 \u05E0\u05D0\u05D5\u05EA \u05E2\u05DC \u05DB\u05DC \u05D4\u05E2\u05E0\u05D9\u05D9\u05E0\u05D9\u05DD \u05D4\u05DE\u05D4\u05D5\u05EA\u05D9\u05D9\u05DD \u05DC\u05E9\u05D9\u05D5\u05D5\u05E7 \u05D4\u05E0\u05D9\u05EA\u05DF \u05E2\u05DC \u05D9\u05D3\u05D9 \u05D4\u05D7\u05D1\u05E8\u05D4, \u05DC\u05E8\u05D1\u05D5\u05EA \u05D6\u05D9\u05E7\u05D4 \u05DC\u05DE\u05D5\u05E6\u05E8\u05D9\u05DD \u05D0\u05D7\u05E8\u05D9\u05DD \u05D1\u05D4\u05EA\u05D0\u05DD \u05DC\u05E1\u05E2\u05D9\u05E3 14 \u05DC\u05D7\u05D5\u05E7 \u05D4\u05D9\u05D9\u05E2\u05D5\u05E5;'}</T>
    </NumPara>
    <NumPara num="(4)">
      <T size={9}>{'\u05D0\u05D9\u05E1\u05D5\u05E8 \u05D4\u05E2\u05D3\u05E4\u05EA \u05D1\u05E2\u05DC \u05D4\u05E8\u05D9\u05E9\u05D9\u05D5\u05DF \u05E0\u05D9\u05D9\u05E8\u05D5\u05EA \u05E2\u05E8\u05DA \u05D0\u05D5 \u05E0\u05DB\u05E1\u05D9\u05DD \u05E4\u05D9\u05E0\u05E0\u05E1\u05D9\u05DD \u05E9\u05DC\u05D5 \u05D0\u05D5 \u05E9\u05DC \u05EA\u05D0\u05D2\u05D9\u05D3 \u05E7\u05E9\u05D5\u05E8 \u05DC\u05EA\u05D0\u05D2\u05D9\u05D3 \u05E9\u05D1\u05D5 \u05D4\u05D5\u05D0 \u05E2\u05D5\u05D1\u05D3 \u05D0\u05D5 \u05E9\u05D5\u05EA\u05E3 \u05D1\u05E9\u05DC \u05D4\u05E7\u05E9\u05E8 \u05D4\u05D0\u05DE\u05D5\u05E8 \u05D1\u05D4\u05EA\u05D0\u05DD \u05DC\u05E1\u05E2\u05D9\u05E3 16 \u05DC\u05D7\u05D5\u05E7 \u05D4\u05D9\u05D9\u05E2\u05D5\u05E5;'}</T>
    </NumPara>
    <NumPara num="(5)"><T size={9}>{'\u05E7\u05D1\u05DC\u05EA \u05D4\u05E1\u05DB\u05DE\u05D4 \u05DC\u05D1\u05D9\u05E6\u05D5\u05E2 \u05E2\u05E1\u05E7\u05D4 \u05D1\u05E1\u05D9\u05DB\u05D5\u05DF \u05DE\u05D9\u05D5\u05D7\u05D3;'}</T></NumPara>
    <NumPara num="(6)"><T size={9}>{'\u05E8\u05D9\u05E9\u05D5\u05DD \u05D5\u05E9\u05DE\u05D9\u05E8\u05D4 \u05E9\u05DC \u05DB\u05DC \u05E2\u05E1\u05E7\u05D4 \u05D5\u05E4\u05E2\u05D5\u05DC\u05EA \u05E9\u05D9\u05D5\u05D5\u05E7 \u05E9\u05D1\u05D5\u05E6\u05E2\u05D4 \u05D1\u05D4\u05EA\u05D0\u05DD \u05DC\u05D0\u05DE\u05D5\u05E8 \u05D1\u05E1\u05E2\u05D9\u05E3 25 \u05DC\u05D7\u05D5\u05E7 \u05D4\u05D9\u05D9\u05E2\u05D5\u05E5;'}</T></NumPara>
    <NumPara num="(7)" mb={8}>
      <T size={9}>{'\u05D1\u05E0\u05D5\u05E1\u05E3, \u05D4\u05D7\u05D1\u05E8\u05D4 \u05EA\u05D4\u05D0 \u05E8\u05E9\u05D0\u05D9\u05EA \u05DC\u05D4\u05EA\u05E0\u05D5\u05EA \u05D0\u05EA \u05E9\u05DB\u05E8\u05D4 \u05D1\u05E8\u05D5\u05D5\u05D7 \u05E9\u05EA\u05E4\u05D9\u05E7 \u05DE\u05E2\u05E1\u05E7\u05D0\u05D5\u05EA \u05E9\u05D9\u05D1\u05D5\u05E6\u05E2\u05D5 \u05D1\u05D4\u05EA\u05D0\u05DD \u05DC\u05E1\u05E2\u05D9\u05E3 24 \u05DC\u05D7\u05D5\u05E7 \u05D4\u05D9\u05D9\u05E2\u05D5\u05E5.'}</T>
    </NumPara>

    {/* Client signature on waiver */}
    <T size={10} bold mb={6}>{'\u05D5\u05DC\u05E8\u05D0\u05D9\u05D4 \u05D1\u05D0\u05EA\u05D9 \u05E2\u05DC \u05D4\u05D7\u05EA\u05D5\u05DD:'}</T>
    <View style={{ flexDirection: 'row-reverse', justifyContent: 'center', marginBottom: 15 }}>
      <SignLine label={'\u05D7\u05EA\u05D9\u05DE\u05D4'} value={null} width="50%" />
    </View>

    {/* ── Advisor declaration ── */}
    <View style={{ flexDirection: 'row-reverse', flexWrap: 'wrap', marginBottom: 4, alignItems: 'flex-end' }}>
      <Text style={{ fontSize: 9, color: C.black, textAlign: 'right' }}>{'\u05D4\u05D7"\u05DE,'}</Text>
      <InlineField value={d.advisorName} width={120} />
      <Text style={{ fontSize: 9, color: C.black }}>{', \u05D1\u05E2\u05DC \u05E8\u05D9\u05E9\u05D9\u05D5\u05DF, \u05DB\u05DE\u05E9\u05DE\u05E2\u05D5\u05EA \u05D4\u05DE\u05D5\u05E0\u05D7 \u05D1\u05D7\u05D5\u05E7 \u05D4\u05D9\u05D9\u05E2\u05D5\u05E5, \u05DE\u05E6\u05D4\u05D9\u05E8 \u05D5\u05DE\u05D0\u05E9\u05E8 \u05DB\u05D9 \u05D4\u05E1\u05D1\u05E8\u05EA\u05D9 \u05DC\u05DC\u05E7\u05D5\u05D7'}</Text>
    </View>
    <T size={9} mb={8}>{'\u05D0\u05EA \u05D4\u05D0\u05DE\u05D5\u05E8 \u05DC\u05E2\u05D9\u05DC.'}</T>

    <T size={10} bold mb={6}>{'\u05D5\u05DC\u05E8\u05D0\u05D9\u05D4 \u05D1\u05D0\u05EA\u05D9 \u05E2\u05DC \u05D4\u05D7\u05EA\u05D5\u05DD:'}</T>
    <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 6 }}>
      <SignLine label={'\u05D7\u05EA\u05D9\u05DE\u05D4'} value={null} />
      <SignLine label={'\u05EA\u05D0\u05E8\u05D9\u05DA \u05D7\u05EA\u05D9\u05DE\u05D4'} value={s ? today() : null} />
    </View>

    <View style={{ flex: 1 }} />
    <Footer styled={s} />
  </Page>
)

// ══════════════════════════════════════════════════════════════
// PAGE 3 — Extended questionnaire (part 1)
// ══════════════════════════════════════════════════════════════
const Page3 = ({ data: d, styled: s }) => (
  <Page size="A4" style={{ fontFamily: 'Assistant', padding: 35, paddingBottom: 45, backgroundColor: C.white }}>
    {/* Header Logo */}
    <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: s ? 15 : 10 }}>
      <Image src={logoPng} style={{ height: s ? 40 : 30, objectFit: 'contain' }} />
      <View />
    </View>

    {/* Title */}
    <View style={{
      backgroundColor: s ? C.primary : C.white,
      paddingVertical: s ? 8 : 5,
      paddingHorizontal: 10,
      marginBottom: s ? 15 : 12,
      ...(s ? {} : { borderBottomWidth: 1.5, borderBottomColor: C.black }),
    }}>
      <Text style={{
        fontSize: s ? 14 : 12,
        fontWeight: 'bold',
        color: s ? C.white : C.black,
        textAlign: 'center',
      }}>
        {'\u05E9\u05D0\u05DC\u05D5\u05DF \u05DE\u05D5\u05E8\u05D7\u05D1'}
      </Text>
    </View>

    {/* Q1 */}
    <NumPara num=".1" mb={10}>
      <View style={{ flexDirection: 'row-reverse', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <Text style={{ fontSize: 9, color: C.black, textAlign: 'right' }}>
          {'\u05D9\u05EA\u05E8\u05EA \u05E0\u05DB\u05E1\u05D9\u05DD \u05E4\u05D9\u05E0\u05E0\u05E1\u05D9\u05D9\u05DD \u05D1\u05E0\u05D9\u05DB\u05D5\u05D9\u05D9 \u05D4\u05EA\u05D7\u05D9\u05D9\u05D1\u05D5\u05D9\u05D5\u05EA \u05D5\u05E0\u05D9"\u05E2 \u05E9\u05D0\u05D9\u05E0\u05DD \u05E1\u05D7\u05D9\u05E8\u05D9\u05DD (\u05D1\u05DE\u05D9\u05D3\u05D4 \u05D5\u05D9\u05E9):'}
        </Text>
        {d.q1_assets ? (
          <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.black, marginRight: 4 }}>{d.q1_assets}</Text>
        ) : (
          <View style={{ borderBottomWidth: 1, borderBottomColor: C.black, width: 100, height: 14, marginRight: 4 }} />
        )}
      </View>
    </NumPara>

    {/* Q2 */}
    <NumPara num=".2" mb={6}>
      <Text style={{ fontSize: 9, color: C.black, textAlign: 'right' }}>
        {'\u05D4\u05D0\u05DD \u05E2\u05E1\u05E7\u05EA/\u05D4\u05D9\u05E0\u05DA \u05E2\u05D5\u05E1\u05E7 \u05D1\u05EA\u05E4\u05E7\u05D9\u05D3 \u05DE\u05E7\u05E6\u05D5\u05E2\u05D9 \u05D4\u05D3\u05D5\u05E8\u05E9 \u05DE\u05D5\u05DE\u05D7\u05D9\u05D5\u05EA \u05D1\u05E9\u05D5\u05E7 \u05D4\u05D4\u05D5\u05DF:'}
      </Text>
    </NumPara>

    {[
      { value: 'ceo', label: '\u05DE\u05E0\u05DB"\u05DC/\u05D1\u05E2\u05DC\u05D9\u05DD \u05E9\u05DC \u05D7\u05D1\u05E8\u05D4 \u05D1\u05E9\u05D5\u05E7 \u05D4\u05D4\u05D5\u05DF / \u05D1\u05D9\u05D8\u05D5\u05D7' },
      { value: 'cfo', label: '\u05DE\u05E0\u05D4\u05DC \u05DB\u05E1\u05E4\u05D9\u05DD' },
      { value: 'investment', label: '\u05DE\u05E0\u05D4\u05DC \u05D4\u05E9\u05E7\u05E2\u05D5\u05EA' },
      { value: 'trader', label: '\u05E1\u05D5\u05D7\u05E8' },
      { value: 'other', label: '\u05D0\u05D7\u05E8' },
    ].map((opt, i) => (
      <View key={i} style={{ flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 3, gap: 6, paddingRight: 25 }}>
        <Radio checked={d.q2_role === opt.value} />
        <Text style={{ fontSize: 9, color: C.black, textAlign: 'right' }}>{opt.label}</Text>
        {opt.value === 'other' && (
          d.q2_otherText ? (
            <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.black, marginRight: 4 }}>{d.q2_otherText}</Text>
          ) : (
            <View style={{ borderBottomWidth: 1, borderBottomColor: C.black, width: 200, height: 14, marginRight: 4 }} />
          )
        )}
      </View>
    ))}

    {/* Q3 */}
    <NumPara num=".3" mb={4} mt={10}>
      <Text style={{ fontSize: 9, color: C.black, textAlign: 'right' }}>
        {'\u05D1\u05D4\u05EA\u05D9\u05D9\u05D7\u05E1\u05D5\u05EA \u05DC (2) \u05E0\u05D0 \u05E6\u05D9\u05D9\u05DF \u05E1\u05D4"\u05DB \u05E0\u05D9\u05E1\u05D9\u05D5\u05DF \u05E2\u05D9\u05E1\u05D5\u05E7 \u05D1\u05E9\u05E0\u05D9\u05DD'}
      </Text>
    </NumPara>
    <View style={{ flexDirection: 'row-reverse', flexWrap: 'wrap', marginBottom: 10, alignItems: 'flex-end', paddingRight: 20 }}>
      <Text style={{ fontSize: 9, color: C.black }}>{'\u05E4\u05E8\u05D8:'}</Text>
      {d.q3_years ? (
        <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.black, marginRight: 4 }}>{d.q3_years}</Text>
      ) : (
        <View style={{ borderBottomWidth: 1, borderBottomColor: C.black, width: '85%', height: 14, marginRight: 4 }} />
      )}
    </View>

    {/* Q4 — Education */}
    <NumPara num=".4" mb={6}>
      <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.black, textAlign: 'right' }}>
        {'\u05D0\u05E0\u05D0 \u05E4\u05E8\u05D8 \u05D4\u05E9\u05DB\u05DC\u05D4 \u05E8\u05DC\u05D5\u05D5\u05E0\u05D8\u05D9\u05EA \u05DC\u05DE\u05D5\u05DE\u05D7\u05D9\u05D5\u05EA \u05D1\u05E9\u05D5\u05E7 \u05D4\u05D4\u05D5\u05DF'}
      </Text>
    </NumPara>
    {[
      { key: 'economics', label: '\u05DB\u05DC\u05DB\u05DC\u05D4' },
      { key: 'accounting', label: '\u05D7\u05E9\u05D1\u05D5\u05E0\u05D0\u05D5\u05EA' },
      { key: 'finance', label: '\u05DE\u05D9\u05DE\u05D5\u05DF' },
      { key: 'math', label: '\u05DE\u05EA\u05DE\u05D8\u05D9\u05E7\u05D4/\u05E4\u05D9\u05D6\u05D9\u05E7\u05D4' },
      { key: 'other', label: '\u05D0\u05D7\u05E8' },
    ].map((field) => (
      <View key={field.key} style={{ flexDirection: 'row-reverse', alignItems: 'flex-end', marginBottom: 5, paddingRight: 20 }}>
        <Text style={{ fontSize: 9, color: C.black, textAlign: 'right', width: 85, flexShrink: 0 }}>{field.label}</Text>
        {d[`q4_${field.key}`] ? (
          <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.black }}>{d[`q4_${field.key}`]}</Text>
        ) : (
          <View style={{ borderBottomWidth: 1, borderBottomColor: C.black, flex: 1, height: 14 }} />
        )}
      </View>
    ))}

    {/* Q5 — Financial instruments */}
    <NumPara num=".5" mb={4} mt={10}>
      <Text style={{ fontSize: 9, color: C.black, textAlign: 'right', lineHeight: 1.6 }}>
        {'\u05E4\u05E8\u05D8 (\u05DC\u05E4\u05D7\u05D5\u05EA) 3 \u05DE\u05DB\u05E9\u05D9\u05E8\u05D9\u05DD \u05E4\u05D9\u05E0\u05E0\u05E1\u05D9\u05D9\u05DD \u05DE\u05D5\u05E8\u05DB\u05D1\u05D9\u05DD (\u05E1\u05D7\u05D9\u05E8\u05D9\u05DD /\u05DC\u05D0 \u05E1\u05D7\u05D9\u05E8\u05D9\u05DD) \u05D1\u05D4\u05DD \u05D4\u05E9\u05E7\u05E2\u05EA \u05D1\u05E2\u05D1\u05E8, \u05DE\u05E1\u05D5\u05D2:'}
      </Text>
      <Text style={{ fontSize: 8, color: C.muted, textAlign: 'right' }}>
        {'\u05D0\u05D5\u05E4\u05E6\u05D9\u05D5\u05EA, \u05E7\u05E8\u05E0\u05D5\u05EA \u05D2\u05D9\u05D3\u05D5\u05E8, \u05DE\u05D5\u05E6\u05E8\u05D9\u05DD \u05DE\u05D5\u05D1\u05E0\u05D9\u05DD \u05D5\u05DB\u05D3\u05D5\u05DE\u05D4.'}
      </Text>
    </NumPara>
    {[0, 1].map((i) => (
      <View key={i} style={{ marginBottom: 5, paddingRight: 20 }}>
        {d[`q5_instrument${i + 1}`] ? (
          <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.black, textAlign: 'right' }}>{d[`q5_instrument${i + 1}`]}</Text>
        ) : (
          <View style={{ borderBottomWidth: 1, borderBottomColor: C.black, width: '100%', height: 16 }} />
        )}
      </View>
    ))}

    {/* Q6 — Frequency table */}
    <NumPara num=".6" mb={6} mt={10}>
      <Text style={{ fontSize: 9, color: C.black, textAlign: 'right' }}>
        {'\u05DE\u05D4 \u05D4\u05EA\u05D3\u05D9\u05E8\u05D5\u05EA \u05D5\u05D0\u05D5\u05E4\u05DF \u05D4\u05EA\u05E2\u05D3\u05DB\u05E0\u05D5\u05EA \u05E9\u05DC\u05DA \u05D1\u05E9\u05D5\u05D5\u05E7\u05D9\u05DD \u05D4\u05E4\u05D9\u05E0\u05E0\u05E1\u05D9\u05D9\u05DD:'}
      </Text>
    </NumPara>

    {/* Table header */}
    <View style={{ flexDirection: 'row-reverse', borderBottomWidth: 1, borderBottomColor: C.black, paddingBottom: 4, marginBottom: 6, paddingRight: 20 }}>
      <View style={{ width: '34%' }} />
      <View style={{ width: '33%', alignItems: 'center' }}>
        <Text style={{ fontSize: 8, color: C.black, textAlign: 'center' }}>{'\u05D0\u05DC\u05E7\u05D8\u05E8\u05D5\u05E0\u05D9/\u05DE\u05E2\u05E8\u05DB\u05D5\u05EA \u05DE\u05D7\u05E7\u05E8'}</Text>
      </View>
      <View style={{ width: '33%', alignItems: 'center' }}>
        <Text style={{ fontSize: 8, color: C.black, textAlign: 'center' }}>{'\u05E2\u05EA\u05D5\u05E0\u05D5\u05EA'}</Text>
        <Text style={{ fontSize: 8, color: C.black, textAlign: 'center' }}>{'\u05DB\u05EA\u05D5\u05D1\u05D4/\u05DE\u05D0\u05DE\u05E8\u05D9\u05DD'}</Text>
      </View>
    </View>

    {/* Table rows */}
    {[
      { label: '\u05DC\u05E4\u05D7\u05D5\u05EA \u05D9\u05D5\u05DE\u05D9\u05EA', key: 'daily' },
      { label: '\u05DC\u05E4\u05D7\u05D5\u05EA \u05E9\u05D1\u05D5\u05E2\u05D9\u05EA', key: 'weekly' },
      { label: '\u05E9\u05E0\u05D4 \u05D5\u05DE\u05E2\u05DC\u05D4', key: 'yearly' },
    ].map((row) => (
      <View key={row.key} style={{ flexDirection: 'row-reverse', marginBottom: 6, alignItems: 'center', paddingRight: 20 }}>
        <View style={{ width: '34%' }}>
          <Text style={{ fontSize: 9, color: C.black, textAlign: 'right' }}>{row.label}</Text>
        </View>
        <View style={{ width: '33%', alignItems: 'center' }}>
          <CB checked={d[`q6_electronic_${row.key}`]} />
        </View>
        <View style={{ width: '33%', alignItems: 'center' }}>
          <CB checked={d[`q6_press_${row.key}`]} />
        </View>
      </View>
    ))}

    {/* Q7 */}
    <NumPara num=".7" mb={10} mt={10}>
      <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 8 }}>
        <Text style={{ fontSize: 9, color: C.black, textAlign: 'right' }}>
          {'\u05D4\u05D0\u05DD \u05D4\u05E0\u05DA \u05D9\u05D5\u05D6\u05DD \u05E4\u05E2\u05D9\u05DC\u05D5\u05EA \u05E2\u05E6\u05DE\u05D0\u05D9\u05EA \u05D1\u05EA\u05D9\u05E7 \u05E0\u05D9"\u05E2 \u05E9\u05DC\u05DA:'}
        </Text>
        <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 4 }}>
          <Radio checked={d.q7_initiative === 'yes'} />
          <Text style={{ fontSize: 9, color: C.black }}>{'\u05DB\u05DF'}</Text>
        </View>
        <Text style={{ fontSize: 9, color: C.black }}>/</Text>
        <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 4 }}>
          <Radio checked={d.q7_initiative === 'no'} />
          <Text style={{ fontSize: 9, color: C.black }}>{'\u05DC\u05D0'}</Text>
        </View>
      </View>
    </NumPara>

    {/* Q8 */}
    <NumPara num=".8" mb={8}>
      <Text style={{ fontSize: 9, color: C.black, textAlign: 'right', lineHeight: 1.6 }}>
        {'\u05D1\u05D0\u05D9\u05D6\u05D5 \u05DE\u05D9\u05D3\u05D4 \u05DC\u05D4\u05E2\u05E8\u05DB\u05EA\u05DA \u05D4\u05D9\u05E0\u05DA \u05D1\u05E2\u05DC \u05D4\u05D1\u05E0\u05D4 \u05D5\u05D1\u05E7\u05D9\u05D0\u05D5\u05EA \u05D2\u05D1\u05D5\u05D4\u05D9\u05DD \u05D1\u05E9\u05D5\u05E7 \u05D4\u05D4\u05D5\u05DF \u05D5\u05D1\u05E0\u05D9\u05D9\u05E8\u05D5\u05EA \u05E2\u05E8\u05DA \u05D5\u05D1\u05E1\u05D9\u05DB\u05D5\u05E0\u05D9\u05DD \u05D4\u05DB\u05E8\u05D5\u05DB\u05D9\u05DD \u05D1\u05D4\u05DD, \u05D5\u05D9\u05DB\u05D5\u05DC \u05DC\u05E7\u05D1\u05DC \u05D4\u05D7\u05DC\u05D8\u05D5\u05EA \u05E2\u05E6\u05DE\u05D0\u05D9\u05D5\u05EA \u05D1\u05E0\u05D5\u05D2\u05E2 \u05DC\u05E0\u05D9\u05D4\u05D5\u05DC \u05EA\u05D9\u05E7 \u05D4\u05E9\u05E7\u05E2\u05D5\u05EA\u05D9\u05DA \u05E2\u05DC \u05E1\u05DE\u05DA \u05D4\u05EA\u05E2\u05D3\u05DB\u05E0\u05D5\u05EA\u05DA \u05D1\u05DC\u05D1\u05D3 \u05D1\u05D0\u05D9\u05E8\u05D5\u05E2\u05D9\u05DD \u05D4\u05E9\u05D5\u05E0\u05D9\u05DD \u05D4\u05DE\u05EA\u05E8\u05D7\u05E9\u05D9\u05DD \u05D1\u05E9\u05D5\u05E7 \u05D4\u05D4\u05D5\u05DF \u05DC\u05DC\u05D0 \u05E2\u05D6\u05E8\u05EA\u05D5 \u05E9\u05DC \u05D1\u05E2\u05DC \u05E8\u05D9\u05E9\u05D9\u05D5\u05DF?'}
      </Text>
    </NumPara>

    {/* Q8 radio options */}
    <View style={{ flexDirection: 'row-reverse', justifyContent: 'center', gap: 30, marginBottom: 10, paddingRight: 20 }}>
      {[
        { value: 'high', label: '\u05D2\u05D1\u05D5\u05D4\u05D4' },
        { value: 'medium', label: '\u05D1\u05D9\u05E0\u05D5\u05E0\u05D9\u05EA' },
        { value: 'low', label: '\u05E0\u05DE\u05D5\u05DB\u05D4' },
      ].map((opt) => (
        <View key={opt.value} style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 6 }}>
          <CB checked={d.q8_understanding === opt.value} />
          <Text style={{ fontSize: 9, color: C.black }}>{opt.label}</Text>
        </View>
      ))}
    </View>

    <View style={{ flex: 1 }} />
    <Footer styled={s} />
  </Page>
)

// ══════════════════════════════════════════════════════════════
// PAGE 4 — Extended questionnaire closing + signatures
// ══════════════════════════════════════════════════════════════
const Page4 = ({ data: d, styled: s }) => (
  <Page size="A4" style={{ fontFamily: 'Assistant', padding: 35, paddingBottom: 45, backgroundColor: C.white }}>
    {/* Header Logo */}
    <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: s ? 15 : 10 }}>
      <Image src={logoPng} style={{ height: s ? 40 : 30, objectFit: 'contain' }} />
      <View />
    </View>

    {/* Additional notes */}
    <T size={9} mb={6}>{'\u05D0\u05E0\u05D0 \u05E6\u05D9\u05D9\u05DF \u05DB\u05DC \u05E4\u05E8\u05D8 \u05E8\u05DC\u05D5\u05D5\u05E0\u05D8\u05D9 \u05E0\u05D5\u05E1\u05E3:'}</T>
    {d.additionalNotes ? (
      <T size={9} mb={10}>{d.additionalNotes}</T>
    ) : (
      <>
        <View style={{ borderBottomWidth: 1, borderBottomColor: C.black, width: '100%', height: 16, marginBottom: 6 }} />
        <View style={{ borderBottomWidth: 1, borderBottomColor: C.black, width: '100%', height: 16, marginBottom: 10 }} />
      </>
    )}

    {/* Final signatures */}
    <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 10 }}>
      <View style={{ width: '30%', alignItems: 'center' }}>
        <Text style={{ fontSize: 8, color: C.muted, marginBottom: 4 }}>{'\u05EA.\u05D6.'}</Text>
        {d.clientId ? (
          <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.black }}>{d.clientId}</Text>
        ) : (
          <View style={{ borderBottomWidth: 1, borderBottomColor: C.black, width: '100%', height: 20 }} />
        )}
      </View>
      <View style={{ width: '30%', alignItems: 'center' }}>
        <Text style={{ fontSize: 8, color: C.muted, marginBottom: 4 }}>{'\u05D7\u05EA\u05D9\u05DE\u05EA \u05D4\u05DC\u05E7\u05D5\u05D7'}</Text>
        <View style={{ borderBottomWidth: 1, borderBottomColor: C.black, width: '100%', height: 20 }} />
      </View>
      <View style={{ width: '30%', alignItems: 'center' }}>
        <Text style={{ fontSize: 8, color: C.muted, marginBottom: 4 }}>{'\u05EA\u05D0\u05E8\u05D9\u05DA'}</Text>
        {s ? (
          <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.black }}>{today()}</Text>
        ) : (
          <View style={{ borderBottomWidth: 1, borderBottomColor: C.black, width: '100%', height: 20 }} />
        )}
      </View>
    </View>

    {/* License holder signature */}
    <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', marginTop: 20 }}>
      <View style={{ width: '45%', alignItems: 'center' }}>
        <Text style={{ fontSize: 8, color: C.muted, marginBottom: 4 }}>{'\u05E9\u05DD \u05D1\u05E2\u05DC \u05D4\u05E8\u05D9\u05E9\u05D9\u05D5\u05DF \u05DE\u05D0\u05E9\u05E8 \u05D4\u05D7\u05EA\u05D9\u05DE\u05D4'}</Text>
        {d.advisorName ? (
          <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.black }}>{d.advisorName}</Text>
        ) : (
          <View style={{ borderBottomWidth: 1, borderBottomColor: C.black, width: '100%', height: 20 }} />
        )}
      </View>
      <View style={{ width: '45%', alignItems: 'center' }}>
        <Text style={{ fontSize: 8, color: C.muted, marginBottom: 4 }}>{'\u05D7\u05EA\u05D9\u05DE\u05EA'}</Text>
        <View style={{ borderBottomWidth: 1, borderBottomColor: C.black, width: '100%', height: 20 }} />
      </View>
    </View>

    <View style={{ flex: 1 }} />
    <Footer styled={s} />
  </Page>
)

// ══════════════════════════════════════════════════════════════
// DOCUMENT
// ══════════════════════════════════════════════════════════════
const QualifiedAdvisorDoc = ({ data = {}, styled: s }) => {
  // Show extended pages if condition2Role is 'other' OR if showExtended flag is set (for blank version)
  const showExtended = data.condition2Role === 'other' || data.showExtended === true

  return (
    <Document>
      <Page1 data={data} styled={s} />
      <Page2 data={data} styled={s} />
      {showExtended && <Page3 data={data} styled={s} />}
      {showExtended && <Page4 data={data} styled={s} />}
    </Document>
  )
}

// ══════════════════════════════════════════════════════════════
// EXPORTS
// ══════════════════════════════════════════════════════════════

export async function generateQualifiedAdvisorStyled(clientData) {
  const blob = await pdf(<QualifiedAdvisorDoc data={clientData} styled={true} />).toBlob()
  const pdfBytes = await blob.arrayBuffer()
  const safeName = (clientData.clientName || '').replace(/[^a-zA-Z0-9\u0590-\u05FF]/g, '_')
  const dateStr = new Date().toISOString().split('T')[0]
  const fileName = `\u05DC\u05E7\u05D5\u05D7_\u05DB\u05E9\u05D9\u05E8_\u05D7\u05D5\u05E7_\u05D4\u05D9\u05D9\u05E2\u05D5\u05E5_${dateStr}_${safeName}.pdf`
  const previewBlob = new Blob([pdfBytes], { type: 'application/pdf' })
  const previewUrl = URL.createObjectURL(previewBlob)
  return { url: previewUrl, fileName, pdfBytes }
}

export async function generateQualifiedAdvisorBlank() {
  // Blank version: showExtended flag triggers pages 3-4 WITHOUT filling any radio
  const blankData = { showExtended: true }
  const blob = await pdf(<QualifiedAdvisorDoc data={blankData} styled={false} />).toBlob()
  const pdfBytes = await blob.arrayBuffer()
  const fileName = '\u05DC\u05E7\u05D5\u05D7_\u05DB\u05E9\u05D9\u05E8_\u05D7\u05D5\u05E7_\u05D4\u05D9\u05D9\u05E2\u05D5\u05E5_\u05D9\u05D3\u05E0\u05D9.pdf'
  const previewBlob = new Blob([pdfBytes], { type: 'application/pdf' })
  const previewUrl = URL.createObjectURL(previewBlob)
  return { url: previewUrl, fileName, pdfBytes }
}
