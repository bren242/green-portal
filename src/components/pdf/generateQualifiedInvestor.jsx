// GREEN Portal — הצהרת משקיע כשיר PDF Generator
// גרסת ממשק = צבעי GREEN + תאריכים אוטומטיים
// גרסת הדפסה = שחור-לבן, קווים נקיים
// טקסט משפטי = AS IS, אסור לשנות מילה

import React from 'react'
import { Document, Page, Text, View, Image, Font, pdf, Svg, Path } from '@react-pdf/renderer'
import { logoPng } from '../../assets/logoBase64'
import { getQualifiedAmounts } from '../../data/qualifiedAmounts'
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

// ── Checkbox component ────────────────────────────────────────
const CB = ({ checked, children, styled: s }) => (
  <View style={{ flexDirection: 'row-reverse', alignItems: 'flex-start', marginBottom: 8, gap: 6 }}>
    <View style={{
      width: 12, height: 12,
      borderWidth: 1,
      borderColor: C.black,
      marginTop: 2,
      flexShrink: 0,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      {checked ? <CheckMark size={9} /> : null}
    </View>
    <View style={{ flex: 1 }}>
      {children}
    </View>
  </View>
)

// ── Signature line ────────────────────────────────────────────
const SignLine = ({ label, value, styled: s }) => (
  <View style={{ width: '50%', alignItems: 'center', paddingHorizontal: 10 }}>
    {value ? (
      <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.black, textAlign: 'center', marginBottom: 4 }}>{value}</Text>
    ) : (
      <View style={{ borderBottomWidth: 1, borderBottomColor: C.black, width: '100%', height: 30, marginBottom: 4 }} />
    )}
    <Text style={{ fontSize: 8, color: C.muted, textAlign: 'center' }}>{label}</Text>
  </View>
)

// ══════════════════════════════════════════════════════════════
// DOCUMENT
// ══════════════════════════════════════════════════════════════
const QualifiedInvestorDoc = ({ data = {}, styled: s }) => {
  const d = data
  const amounts = getQualifiedAmounts() || {}
  const advisorSig = s && d.advisorUserId ? getSignature(d.advisorUserId) : null
  const stamp = s ? getCompanyStamp() : null
  const a1 = amounts.amount1 || '---'
  const a2 = amounts.amount2 || '---'
  const a3 = amounts.amount3 || '---'
  const a4 = amounts.amount4 || '---'
  const a5 = amounts.amount5 || '---'
  const a6 = amounts.amount6 || '---'

  const pageStyle = {
    fontFamily: 'Assistant',
    padding: s ? 35 : 30,
    paddingBottom: s ? 40 : 35,
    backgroundColor: C.white,
  }

  return (
    <Document>
      <Page size="A4" style={pageStyle}>
        {/* ── Header: Logo ── */}
        <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: s ? 15 : 10 }}>
          <Image src={logoPng} style={{ height: s ? 40 : 30, objectFit: 'contain' }} />
          <View />
        </View>

        {/* ── Title ── */}
        <View style={{
          backgroundColor: s ? C.primary : C.white,
          paddingVertical: s ? 10 : 6,
          paddingHorizontal: 10,
          marginBottom: s ? 15 : 10,
          ...(s ? {} : { borderWidth: 1.5, borderColor: C.black }),
        }}>
          <Text style={{
            fontSize: s ? 16 : 14,
            fontWeight: 'bold',
            color: s ? C.white : C.black,
            textAlign: 'center',
          }}>
            {'\u05D4\u05E6\u05D4\u05E8\u05EA \u05DE\u05E9\u05E7\u05D9\u05E2 \u05DB\u05E9\u05D9\u05E8'}
          </Text>
        </View>

        {/* ── Opening line ── */}
        <View style={{ flexDirection: 'row-reverse', flexWrap: 'wrap', marginBottom: s ? 12 : 8, alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 10, color: C.black, textAlign: 'right' }}>
            {'\u05D0\u05E0\u05D9, \u05D4\u05D7"\u05DE'}
          </Text>
          {d.clientName ? (
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.black, marginHorizontal: 4 }}>{d.clientName}</Text>
          ) : (
            <View style={{ borderBottomWidth: 1, borderBottomColor: C.black, width: 120, height: 14, marginHorizontal: 4 }} />
          )}
          <Text style={{ fontSize: 10, color: C.black }}>{'\u05EA.\u05D6'}</Text>
          {d.clientId ? (
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.black, marginHorizontal: 4 }}>{d.clientId}</Text>
          ) : (
            <View style={{ borderBottomWidth: 1, borderBottomColor: C.black, width: 100, height: 14, marginHorizontal: 4 }} />
          )}
        </View>

        {/* ── Intro paragraph (AS IS) ── */}
        <View style={{ marginBottom: s ? 12 : 8 }}>
          <Text style={{ fontSize: 9, color: C.black, textAlign: 'right', lineHeight: 1.6 }}>
            {'\u05DE\u05E6\u05D4\u05D9\u05E8/\u05D4 \u05D1\u05D6\u05D0\u05EA \u05DB\u05D9 \u05D0\u05E0\u05D9 \u05E2\u05D5\u05E0\u05D4 \u05E2\u05DC \u05D4\u05EA\u05E0\u05D0\u05D9\u05DD \u05D4\u05E0\u05D3\u05E8\u05E9\u05D9\u05DD \u05DC\u05E1\u05D9\u05D5\u05D5\u05D2\u05D9 \u05DB\u05DE\u05E9\u05E7\u05D9\u05E2 \u05DB\u05E9\u05D9\u05E8'}
          </Text>
          <Text style={{ fontSize: 9, color: C.black, textAlign: 'right', lineHeight: 1.6 }}>
            {'\u05DB\u05DE\u05E9\u05DE\u05E2\u05D5\u05EA\u05DD \u05D1\u05D7\u05D5\u05E7 \u05D4\u05E1\u05D3\u05E8\u05EA \u05E0\u05D9\u05D9\u05E8\u05D5\u05EA \u05E2\u05E8\u05DA, \u05D4\u05EA\u05E9\u05E0\u05D0-2007'}
          </Text>
          <Text style={{ fontSize: 9, color: C.black, textAlign: 'right', lineHeight: 1.6 }}>
            {'\u05D5\u05D1\u05D4\u05EA\u05D0\u05DD \u05DC\u05DB\u05DA \u05DE\u05D1\u05E7\u05E9/\u05EA \u05DC\u05D4\u05D9\u05D7\u05E9\u05D1 \u05DB\u05DE\u05E9\u05E7\u05D9\u05E2 \u05DB\u05E9\u05D9\u05E8 \u05DC\u05E2\u05E0\u05D9\u05D9\u05DF \u05E7\u05D1\u05DC\u05EA \u05E9\u05D9\u05E8\u05D5\u05EA\u05D9 \u05E9\u05D9\u05D5\u05D5\u05E7 \u05D4\u05E9\u05E7\u05E2\u05D5\u05EA.'}
          </Text>
        </View>

        <Text style={{ fontSize: 9, color: C.black, textAlign: 'right', lineHeight: 1.6, marginBottom: s ? 15 : 10 }}>
          {'\u05DC\u05E6\u05D5\u05E8\u05DA \u05DB\u05DA \u05D0\u05E0\u05D9 \u05DE\u05E6\u05D4\u05D9\u05E8/\u05D4 \u05DB\u05D9 \u05DE\u05EA\u05E7\u05D9\u05D9\u05DD \u05D1\u05D9 \u05D4\u05EA\u05E0\u05D0\u05D9\u05DD \u05D4\u05D1\u05D0\u05D9\u05DD:'}
        </Text>

        {/* ── Checkbox 1: Liquid assets ── */}
        <CB checked={d.option1} styled={s}>
          <Text style={{ fontSize: 9, color: C.black, textAlign: 'right', lineHeight: 1.6 }}>
            {'\u05E9\u05D5\u05D5\u05D9 \u05D4\u05E0\u05DB\u05E1\u05D9\u05DD \u05D4\u05E0\u05D6\u05D9\u05DC\u05D9\u05DD* \u05E9\u05DC\u05D9 \u05E2\u05D5\u05DC\u05D4 \u05E2\u05DC ' + a1 + ' \u05DE\u05D9\u05DC\u05D9\u05D5\u05DF \u05E9\u05D7.'}
          </Text>
        </CB>

        {/* ── Checkbox 2: Income ── */}
        <CB checked={d.option2} styled={s}>
          <Text style={{ fontSize: 9, color: C.black, textAlign: 'right', lineHeight: 1.6 }}>
            {'\u05D4\u05DB\u05E0\u05E1\u05EA\u05D9 \u05D4\u05E9\u05E0\u05EA\u05D9\u05EA \u05D1\u05DB\u05DC \u05D0\u05D7\u05EA \u05DE\u05E9\u05E0\u05EA\u05D9\u05D9\u05DD \u05D4\u05E9\u05E0\u05EA\u05D9\u05D9\u05DD \u05D4\u05D0\u05D7\u05E8\u05D5\u05E0\u05D5\u05EA \u05DC\u05D0 \u05E4\u05D7\u05EA\u05D4 \u05DE- ' + a2 + ' \u05DE\u05D9\u05DC\u05D9\u05D5\u05DF \u05E9\u05D7,'}
          </Text>
          <Text style={{ fontSize: 9, color: C.black, textAlign: 'right', lineHeight: 1.6 }}>
            {'\u05D0\u05D5 \u05E9\u05D4\u05DB\u05E0\u05E1\u05EA \u05D4\u05EA\u05D0 \u05D4\u05DE\u05E9\u05E4\u05D7\u05EA\u05D9** \u05D1\u05DB\u05DC \u05D0\u05D7\u05EA \u05DE\u05E9\u05E0\u05EA\u05D9\u05D9\u05DD \u05D4\u05E9\u05E0\u05EA\u05D9\u05D9\u05DD \u05D4\u05D0\u05D7\u05E8\u05D5\u05E0\u05D5\u05EA \u05DC\u05D0 \u05E4\u05D7\u05EA\u05D4 \u05DE- ' + a3 + ' \u05DE\u05D9\u05DC\u05D9\u05D5\u05DF \u05E9\u05D7.'}
          </Text>
        </CB>

        {/* ── Checkbox 3: Combined ── */}
        <CB checked={d.option3} styled={s}>
          <Text style={{ fontSize: 9, color: C.black, textAlign: 'right', lineHeight: 1.6 }}>
            {'\u05E9\u05D5\u05D5\u05D9 \u05D4\u05E0\u05DB\u05E1\u05D9\u05DD \u05D4\u05E0\u05D6\u05D9\u05DC\u05D9\u05DD* \u05E9\u05DC\u05D9 \u05E2\u05D5\u05DC\u05D4 \u05E2\u05DC ' + a4 + ' \u05DE\u05D9\u05DC\u05D9\u05D5\u05DF \u05E9\u05D7'}
          </Text>
          <Text style={{ fontSize: 9, color: C.black, textAlign: 'right', lineHeight: 1.6 }}>
            {'\u05D5\u05D4\u05DB\u05E0\u05E1\u05EA\u05D9 \u05D4\u05E9\u05E0\u05EA\u05D9\u05EA \u05D1\u05DB\u05DC \u05D0\u05D7\u05EA \u05DE\u05E9\u05E0\u05EA\u05D9\u05D9\u05DD \u05D4\u05E9\u05E0\u05EA\u05D9\u05D9\u05DD \u05D4\u05D0\u05D7\u05E8\u05D5\u05E0\u05D5\u05EA \u05DC\u05D0 \u05E4\u05D7\u05EA\u05D4 \u05DE- ' + a5 + ' \u05E9\u05D7,'}
          </Text>
          <Text style={{ fontSize: 9, color: C.black, textAlign: 'right', lineHeight: 1.6 }}>
            {'\u05D0\u05D5 \u05E9\u05D4\u05DB\u05E0\u05E1\u05EA \u05D4\u05EA\u05D0 \u05D4\u05DE\u05E9\u05E4\u05D7\u05EA\u05D9** \u05D1\u05DB\u05DC \u05D0\u05D7\u05EA \u05DE\u05E9\u05E0\u05EA\u05D9\u05D9\u05DD \u05D4\u05E9\u05E0\u05EA\u05D9\u05D9\u05DD \u05D4\u05D0\u05D7\u05E8\u05D5\u05E0\u05D5\u05EA \u05DC\u05D0 \u05E4\u05D7\u05EA\u05D4 \u05DE- ' + a6 + ' \u05DE\u05D9\u05DC\u05D9\u05D5\u05DF \u05E9\u05D7.'}
          </Text>
        </CB>

        {/* ── Footnotes (AS IS) ── */}
        <View style={{ marginTop: s ? 10 : 6, marginBottom: s ? 10 : 6, paddingRight: 4 }}>
          <Text style={{ fontSize: 7.5, color: C.muted, textAlign: 'right', lineHeight: 1.5, marginBottom: 3 }}>
            {'* "\u05E0\u05DB\u05E1\u05D9\u05DD \u05E0\u05D6\u05D9\u05DC\u05D9\u05DD" \u2013 \u05DE\u05D6\u05D5\u05DE\u05E0\u05D9\u05DD, \u05E4\u05D9\u05E7\u05D3\u05D5\u05E0\u05D5\u05EA, \u05EA\u05D5\u05DB\u05E0\u05D9\u05D5\u05EA \u05D7\u05D9\u05E1\u05DB\u05D5\u05DF, \u05E7\u05E8\u05E0\u05D5\u05EA \u05E0\u05D0\u05DE\u05E0\u05D5\u05EA, \u05E7\u05D5\u05E4\u05D5\u05EA \u05D2\u05DE\u05DC, \u05E7\u05E8\u05E0\u05D5\u05EA \u05D4\u05E9\u05EA\u05DC\u05DE\u05D5\u05EA \u05D5\u05DE\u05D5\u05E6\u05E8\u05D9\u05DD \u05E4\u05D9\u05E0\u05E0\u05E1\u05D9\u05D9\u05DD \u05DB\u05D4\u05D2\u05D3\u05E8\u05EA\u05DD \u05D1\u05D7\u05D5\u05E7.'}
          </Text>
          <Text style={{ fontSize: 7.5, color: C.muted, textAlign: 'right', lineHeight: 1.5 }}>
            {'** "\u05EA\u05D0 \u05DE\u05E9\u05E4\u05D7\u05EA\u05D9" \u2013 \u05D1\u05DF/\u05D1\u05EA \u05D6\u05D5\u05D2 \u05D0\u05D5 \u05D9\u05DC\u05D3/\u05D4 \u05E9\u05DC \u05D4\u05DE\u05E6\u05D4\u05D9\u05E8/\u05D4 \u05D4\u05E0\u05DE\u05E6\u05D0\u05D9\u05DD \u05E2\u05DC \u05D0\u05D5\u05EA\u05D5 \u05DE\u05E9\u05E7 \u05D1\u05D9\u05EA.'}
          </Text>
        </View>

        {/* ── Closing paragraph (AS IS) ── */}
        <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.black, textAlign: 'right', lineHeight: 1.6, marginBottom: s ? 15 : 10, marginTop: s ? 8 : 4 }}>
          {'\u05D9\u05D3\u05D5\u05E2 \u05DC\u05D9 \u05DB\u05D9 \u05D0\u05DD \u05D0\u05E1\u05D5\u05D5\u05D2 \u05DB"\u05DE\u05E9\u05E7\u05D9\u05E2 \u05DB\u05E9\u05D9\u05E8" \u05DC\u05D0 \u05D9\u05D7\u05D5\u05DC\u05D5 \u05E2\u05DC\u05D9 \u05D7\u05DC\u05E7 \u05DE\u05D7\u05D5\u05D1\u05D5\u05EA \u05D4\u05D2\u05D9\u05DC\u05D5\u05D9 \u05D5\u05D4\u05D3\u05D9\u05D5\u05D5\u05D7 \u05D4\u05D7\u05DC\u05D5\u05EA \u05E2\u05DC \u05DE\u05E9\u05D5\u05D5\u05E7 \u05D4\u05E9\u05E7\u05E2\u05D5\u05EA \u05DC\u05E4\u05D9 \u05D4\u05D7\u05D5\u05E7 \u05D5\u05DB\u05D9 \u05D4\u05D5\u05E1\u05D1\u05E8\u05D5 \u05DC\u05D9 \u05D4\u05E9\u05DC\u05DB\u05D5\u05EA \u05E9\u05DC \u05E1\u05D9\u05D5\u05D5\u05D2 \u05D6\u05D4 \u05DC\u05E8\u05D1\u05D5\u05EA \u05D4\u05D2\u05E0\u05D5\u05EA \u05D4\u05E6\u05E8\u05DB\u05E0\u05D9 \u05D5\u05DC\u05DE\u05E0\u05D9\u05E2\u05EA \u05EA\u05D1\u05D9\u05E2\u05D5\u05EA \u05DE\u05E9\u05E4\u05D8\u05D9\u05D5\u05EA.'}
        </Text>

        {/* ── Spacer to push signatures down ── */}
        <View style={{ flex: 1 }} />

        {/* ── Signatures ── */}
        <View style={{ marginTop: s ? 14 : 10 }}>
          {/* Sig + stamp: both side-by-side in right half (above date line) */}
          {s && (advisorSig || stamp) ? (
            <View style={{ flexDirection: 'row-reverse', marginBottom: 4 }}>
              <View style={{ width: '50%', flexDirection: 'row-reverse', justifyContent: 'center', gap: 4, paddingHorizontal: 10 }}>
                {advisorSig && isValidImageSrc(advisorSig) ? <Image src={advisorSig} style={{ width: 160, height: 60, objectFit: 'contain' }} /> : null}
                {stamp && isValidImageSrc(stamp) ? <Image src={stamp} style={{ width: 160, height: 60, objectFit: 'contain' }} /> : null}
              </View>
            </View>
          ) : null}
          <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between' }}>
            <SignLine
              label={'\u05EA\u05D0\u05E8\u05D9\u05DA'}
              value={s ? today() : null}
              styled={s}
            />
            <SignLine
              label={'\u05D7\u05EA\u05D9\u05DE\u05EA \u05D4\u05DC\u05E7\u05D5\u05D7/\u05D4'}
              value={null}
              styled={s}
            />
          </View>
        </View>
      </Page>
    </Document>
  )
}

// ══════════════════════════════════════════════════════════════
// EXPORTS
// ══════════════════════════════════════════════════════════════

export async function generateQualifiedInvestorStyled(clientData) {
  const blob = await pdf(<QualifiedInvestorDoc data={clientData} styled={true} />).toBlob()
  const pdfBytes = await blob.arrayBuffer()
  const safeName = (clientData.clientName || '').replace(/[^a-zA-Z0-9\u0590-\u05FF]/g, '_')
  const dateStr = new Date().toISOString().split('T')[0]
  const fileName = `\u05D4\u05E6\u05D4\u05E8\u05EA_\u05DB\u05E9\u05D9\u05E8_${dateStr}_${safeName}.pdf`
  const previewBlob = new Blob([pdfBytes], { type: 'application/pdf' })
  const previewUrl = URL.createObjectURL(previewBlob)
  return { url: previewUrl, fileName, pdfBytes }
}

export async function generateQualifiedInvestorBlank() {
  const blob = await pdf(<QualifiedInvestorDoc data={{}} styled={false} />).toBlob()
  const pdfBytes = await blob.arrayBuffer()
  const fileName = '\u05D4\u05E6\u05D4\u05E8\u05EA_\u05DB\u05E9\u05D9\u05E8_\u05D9\u05D3\u05E0\u05D9.pdf'
  const previewBlob = new Blob([pdfBytes], { type: 'application/pdf' })
  const previewUrl = URL.createObjectURL(previewBlob)
  return { url: previewUrl, fileName, pdfBytes }
}
