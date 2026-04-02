import React from 'react'
import { Text, View, Image, Font, StyleSheet } from '@react-pdf/renderer'
import { logoPng } from '../../assets/logoBase64'

// ── Font Registration ──────────────────────────────────────────
Font.register({
  family: 'Assistant',
  fonts: [
    { src: '/fonts/Assistant-Regular.ttf', fontWeight: 'normal' },
    { src: '/fonts/Assistant-Bold.ttf', fontWeight: 'bold' },
  ],
})
Font.registerHyphenationCallback((word) => [word])

// ── Design Tokens (from DESIGN.md) ────────────────────────────
export const C = {
  primary:      '#1B3A2F',
  secondary:    '#3E7A5C',
  gold:         '#B8975A',
  goldLight:    '#D4B483',
  offWhite:     '#F4F3EF',
  cream:        '#F8F5EE',
  surface:      '#F6F5F1',
  border:       '#DDD5BF',
  black:        '#1A1A1A',
  muted:        '#5A5A5A',
  negative:     '#C0392B',
  white:        '#FFFFFF',
}

// ── Page Styles ────────────────────────────────────────────────
export const coverPageStyle = {
  fontFamily: 'Assistant',
  direction: 'rtl',
  backgroundColor: C.white,
}

export const contentPageStyle = {
  fontFamily: 'Assistant',
  direction: 'rtl',
  paddingTop: 56,
  paddingBottom: 36,
  paddingHorizontal: 36,
  fontSize: 10,
  color: C.black,
}

// ── Page Header (pages 2+) ────────────────────────────────────
export const PageHeader = () => (
  <View fixed style={hdr.wrap}>
    <View style={hdr.bar}>
      <Image src={logoPng} style={hdr.logo} />
      <View style={hdr.titleWrap}>
        <Text style={hdr.title}>אפיון צרכים והתאמת מדיניות השקעה</Text>
      </View>
    </View>
    <View style={hdr.line} />
  </View>
)

const hdr = StyleSheet.create({
  wrap: {},
  bar: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: 40,
    backgroundColor: C.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  line: {
    position: 'absolute', top: 40, left: 0, right: 0,
    height: 1,
    backgroundColor: C.gold,
  },
  logo: { height: 26 },
  titleWrap: { flex: 1, alignItems: 'flex-end' },
  title: { fontSize: 9, fontWeight: 'bold', color: C.gold, textAlign: 'right' },
})

// ── Page Footer ────────────────────────────────────────────────
export const PageFooter = () => (
  <Text
    style={{ position: 'absolute', bottom: 14, left: 0, right: 0, textAlign: 'center', fontSize: 7, color: C.muted }}
    render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
    fixed
  />
)

// ── Section Title ──────────────────────────────────────────────
export const SectionTitle = ({ children }) => (
  <View
    style={{ backgroundColor: C.primary, borderRadius: 3, paddingVertical: 5, paddingHorizontal: 10, marginBottom: 10 }}
    wrap={false}
    minPresenceAhead={60}
  >
    <Text style={{ fontSize: 11, fontWeight: 'bold', color: C.goldLight, textAlign: 'right' }}>
      {children}
    </Text>
  </View>
)

// ── Section Gap ────────────────────────────────────────────────
export const SectionGap = () => <View style={{ height: 20 }} />

// ── Label → Value Row ──────────────────────────────────────────
export const LabelValue = ({ label, value, even }) => (
  <View style={[
    { flexDirection: 'row-reverse', paddingVertical: 4, paddingHorizontal: 6 },
    even && { backgroundColor: C.surface },
  ]}>
    <Text style={{ width: '38%', fontSize: 9, fontWeight: 'bold', color: C.muted, textAlign: 'right' }}>
      {label}
    </Text>
    <Text style={{ width: '62%', fontSize: 10, color: C.black, textAlign: 'right' }}>
      {value || '---'}
    </Text>
  </View>
)

// ── Data Table ─────────────────────────────────────────────────
export const DataTable = ({ headers, rows }) => (
  <View>
    {headers && (
      <View style={{ flexDirection: 'row-reverse', backgroundColor: C.primary, borderRadius: 2, paddingVertical: 5, paddingHorizontal: 8 }}>
        {headers.map((h, i) => (
          <Text key={i} style={{ flex: 1, fontSize: 9, fontWeight: 'bold', color: C.goldLight, textAlign: 'right' }}>{h}</Text>
        ))}
      </View>
    )}
    {rows.map((row, i) => (
      <View key={i} style={[
        { flexDirection: 'row-reverse', paddingVertical: 4, paddingHorizontal: 8, borderBottomWidth: 0.5, borderBottomColor: C.border },
        i % 2 === 0 && { backgroundColor: C.surface },
      ]}>
        {row.map((cell, j) => (
          <Text key={j} style={{ flex: 1, fontSize: 9, textAlign: 'right', color: C.black, fontWeight: j === 0 ? 'bold' : 'normal' }}>{cell}</Text>
        ))}
      </View>
    ))}
  </View>
)

// ── Summary Row (used inside summary boxes) ────────────────────
export const SummaryRow = ({ label, value, highlight }) => {
  if (highlight) {
    return (
      <View style={{ flexDirection: 'row-reverse', backgroundColor: C.primary, paddingVertical: 5, paddingHorizontal: 8, borderRadius: 2, marginTop: 3 }}>
        <Text style={{ flex: 1, fontSize: 10, fontWeight: 'bold', color: C.white, textAlign: 'right' }}>{label}</Text>
        <Text style={{ flex: 1, fontSize: 10, fontWeight: 'bold', color: C.white, textAlign: 'right' }}>{value}</Text>
      </View>
    )
  }
  return (
    <View style={{ flexDirection: 'row-reverse', paddingVertical: 4, paddingHorizontal: 8, borderBottomWidth: 0.5, borderBottomColor: C.border }}>
      <Text style={{ flex: 1, fontSize: 9, fontWeight: 'bold', textAlign: 'right', color: C.black }}>{label}</Text>
      <Text style={{ flex: 1, fontSize: 9, textAlign: 'right', color: C.black }}>{value}</Text>
    </View>
  )
}

// ── Summary Card (for recap section) ───────────────────────────
export const SummaryCard = ({ title, items }) => (
  <View style={{ borderWidth: 0.5, borderColor: C.border, borderRadius: 4, marginBottom: 10, overflow: 'hidden' }} wrap={false}>
    <View style={{ backgroundColor: C.primary, paddingVertical: 5, paddingHorizontal: 10 }}>
      <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.goldLight, textAlign: 'right' }}>{title}</Text>
    </View>
    <View style={{ padding: 8 }}>
      {items.map(([label, value], i) => (
        <LabelValue key={i} label={label} value={value} even={i % 2 === 0} />
      ))}
    </View>
  </View>
)

// ── Pill Tag ───────────────────────────────────────────────────
export const PillTag = ({ text }) => (
  <View style={{
    backgroundColor: C.cream, borderWidth: 1, borderColor: C.secondary,
    borderRadius: 12, paddingVertical: 3, paddingHorizontal: 10,
    marginLeft: 6, marginBottom: 4,
  }}>
    <Text style={{ fontSize: 8, color: C.primary, fontWeight: 'bold', textAlign: 'center' }}>{text}</Text>
  </View>
)

// ── Risk Gauge ─────────────────────────────────────────────────
export const RiskGauge = ({ level, size = 'normal' }) => {
  const labels = ['שמרן', 'שמרן-מתון', 'מאוזן', 'צמיחה', 'אגרסיבי']
  const colors = ['#2E7D32', '#66BB6A', C.gold, '#EF6C00', C.negative]
  const sm = size === 'small'
  const dot = sm ? 16 : 22

  return (
    <View style={{ alignItems: 'center', marginVertical: sm ? 4 : 8 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        {[1, 2, 3, 4, 5].map((n) => {
          const active = n === level
          const d = active ? dot + 4 : dot
          return (
            <View key={n} style={{ alignItems: 'center', marginHorizontal: sm ? 4 : 8 }}>
              <View style={{
                width: d, height: d, borderRadius: d / 2,
                backgroundColor: active ? colors[n - 1] : C.surface,
                borderWidth: active ? 2 : 1,
                borderColor: active ? colors[n - 1] : C.border,
                justifyContent: 'center', alignItems: 'center',
              }}>
                <Text style={{ fontSize: sm ? 7 : 9, fontWeight: 'bold', color: active ? C.white : C.muted }}>{n}</Text>
              </View>
              <Text style={{
                fontSize: sm ? 6 : 7,
                color: active ? colors[n - 1] : C.muted,
                marginTop: 2, textAlign: 'center',
                fontWeight: active ? 'bold' : 'normal',
              }}>{labels[n - 1]}</Text>
            </View>
          )
        })}
      </View>
    </View>
  )
}

// ── Policy Cube ────────────────────────────────────────────────
export const PolicyCube = ({ label, value }) => (
  <View style={{
    width: '23%', backgroundColor: C.cream, borderWidth: 1, borderColor: C.gold,
    borderRadius: 4, padding: 6, alignItems: 'center', marginHorizontal: '1%',
  }}>
    <Text style={{ fontSize: 7, color: C.muted, textAlign: 'center', marginBottom: 2 }}>{label}</Text>
    <Text style={{ fontSize: 11, fontWeight: 'bold', color: C.primary, textAlign: 'center' }}>{value || '---'}</Text>
  </View>
)

// ── Gold Bordered Box ──────────────────────────────────────────
export const GoldBox = ({ children, mt }) => (
  <View style={{ borderWidth: 1, borderColor: C.gold, borderRadius: 4, padding: 10, backgroundColor: C.offWhite, marginTop: mt ?? 24 }}>
    {children}
  </View>
)

// ── Client Card ────────────────────────────────────────────────
export const ClientCard = ({ client, title, full }) => (
  <View style={{ flex: 1, borderWidth: 0.5, borderColor: C.border, borderRadius: 4, overflow: 'hidden', marginHorizontal: 3 }} wrap={false}>
    <View style={{ backgroundColor: C.primary, paddingVertical: 5, paddingHorizontal: 10 }}>
      <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.gold, textAlign: 'right' }}>{title}</Text>
    </View>
    <View style={{ padding: 8 }}>
      <LabelValue label="שם מלא" value={client.fullName} even />
      <LabelValue label="ת.ז." value={client.idNumber} />
      {full && <>
        <LabelValue label="תאריך לידה" value={client.birthDate} even />
        <LabelValue label="מצב משפחתי" value={translateMarital(client.maritalStatus)} />
        <LabelValue label="נפשות תלויות" value={client.dependents} even />
      </>}
      <LabelValue label="טלפון" value={client.phone} even={!full} />
      <LabelValue label="דוא״ל" value={client.email} even={full} />
      {full && <LabelValue label="עיסוק" value={client.occupation} />}
    </View>
  </View>
)

// ── Balance Box (summary sidebar) ──────────────────────────────
export const BalanceBox = ({ title, rows, highlightLabel, highlightValue }) => (
  <View style={{ flex: 1, borderWidth: 1, borderColor: C.gold, borderRadius: 4, overflow: 'hidden' }}>
    <View style={{ backgroundColor: C.primary, paddingVertical: 4, paddingHorizontal: 8 }}>
      <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.gold, textAlign: 'right' }}>{title}</Text>
    </View>
    <View style={{ padding: 6 }}>
      {rows.map(([l, v], i) => <SummaryRow key={i} label={l} value={v} />)}
      <SummaryRow label={highlightLabel} value={highlightValue} highlight />
    </View>
  </View>
)

// ── Signature Line (RTL: label right, writing line left) ───────
export const SignatureLine = ({ label }) => (
  <View style={{ flexDirection: 'row-reverse', alignItems: 'flex-end', marginTop: 10 }}>
    <Text style={{ fontSize: 10, color: C.black, textAlign: 'right' }}>X {label}</Text>
    <View style={{ width: 200, borderBottomWidth: 1, borderBottomColor: C.primary, marginRight: 8, marginBottom: 1 }} />
  </View>
)

// ── Date Line ──────────────────────────────────────────────────
export const DateLine = ({ date }) => (
  <View style={{ flexDirection: 'row-reverse', alignItems: 'flex-end', marginTop: 6 }}>
    <Text style={{ fontSize: 10, color: C.black, textAlign: 'right' }}>תאריך:</Text>
    <Text style={{ fontSize: 10, color: C.black, marginRight: 8 }}>{date}</Text>
  </View>
)

// ── Helpers ─────────────────────────────────────────────────────
export function fmtMoney(val) {
  if (!val) return '---'
  const num = parseFloat(String(val).replace(/[^\d.-]/g, ''))
  if (isNaN(num)) return String(val).includes('₪') ? String(val) : `₪${val}`
  return `₪${num.toLocaleString('he-IL')}`
}

export function parseAmount(str) {
  if (!str) return 0
  const num = parseFloat(String(str).replace(/[^\d.-]/g, ''))
  return isNaN(num) ? 0 : num
}

export function translateMarital(status) {
  const map = { single: 'רווק/ה', married: 'נשוי/אה', divorced: 'גרוש/ה', widowed: 'אלמן/ה' }
  return map[status] || status || '---'
}

export function fmtDate() {
  const d = new Date()
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`
}
