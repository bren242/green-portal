import React from 'react'
import { Text, View, Image, Font, StyleSheet } from '@react-pdf/renderer'
import { logoPng } from '../../assets/logoBase64'

// ==================== FONT REGISTRATION ====================
Font.register({
  family: 'Assistant',
  fonts: [
    { src: '/fonts/Assistant-Regular.ttf', fontWeight: 'normal' },
    { src: '/fonts/Assistant-Bold.ttf', fontWeight: 'bold' },
  ],
})
Font.registerHyphenationCallback((word) => [word])

// ==================== DESIGN SYSTEM ====================
export const C = {
  primary: '#1B3A2F',
  secondary: '#3E7A5C',
  gold: '#B8975A',
  goldLight: '#D4B483',
  offWhite: '#F4F3EF',
  cream: '#F8F5EE',
  surfaceLight: '#F6F5F1',
  border: '#DDD5BF',
  black: '#1A1A1A',
  textMuted: '#5A5A5A',
  negative: '#C0392B',
  white: '#FFFFFF',
}

export const SPACING = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 14,
  xl: 20,
  xxl: 30,
}

// ==================== BASE STYLES ====================
export const basePageStyle = {
  fontFamily: 'Assistant',
  direction: 'rtl',
  paddingTop: 54,
  paddingBottom: 40,
  paddingHorizontal: 36,
  fontSize: 10,
  color: C.black,
}

// ==================== PAGE HEADER (pages 2+) ====================
export const PageHeader = () => (
  <View fixed>
    <View style={headerStyles.bar}>
      <Image src={logoPng} style={headerStyles.logo} />
      <View style={headerStyles.right}>
        <Text style={headerStyles.title}>אפיון צרכים והתאמת מדיניות השקעה</Text>
      </View>
    </View>
    <View style={headerStyles.goldLine} />
  </View>
)

const headerStyles = StyleSheet.create({
  bar: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: 40, backgroundColor: C.primary,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16,
  },
  goldLine: {
    position: 'absolute', top: 40, left: 0, right: 0,
    height: 1, backgroundColor: C.gold,
  },
  right: {
    flex: 1, alignItems: 'flex-end',
  },
  title: {
    fontSize: 9, fontWeight: 'bold', color: C.gold, textAlign: 'right',
  },
  logo: {
    height: 26,
  },
})

// ==================== PAGE FOOTER ====================
export const PageFooter = () => (
  <Text
    style={{ position: 'absolute', bottom: 14, left: 0, right: 0, textAlign: 'center', fontSize: 7, color: C.textMuted }}
    render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
    fixed
  />
)

// ==================== SECTION TITLE ====================
export const SectionTitle = ({ children }) => (
  <View style={{ backgroundColor: C.primary, borderRadius: 3, paddingVertical: 4, paddingHorizontal: 10, marginTop: SPACING.md, marginBottom: SPACING.sm }} wrap={false} minPresenceAhead={60}>
    <Text style={{ fontSize: 11, fontWeight: 'bold', color: C.goldLight, textAlign: 'right' }}>{children}</Text>
  </View>
)

// ==================== LABEL-VALUE ROW ====================
export const LabelValue = ({ label, value, even }) => (
  <View style={[{ flexDirection: 'row-reverse', justifyContent: 'flex-start', paddingVertical: 3, paddingHorizontal: 4 }, even ? { backgroundColor: C.surfaceLight } : null]}>
    <Text style={{ width: '40%', fontSize: 9, fontWeight: 'bold', color: C.textMuted, textAlign: 'right' }}>{label}</Text>
    <Text style={{ width: '60%', fontSize: 10, color: C.black, textAlign: 'right' }}>{value || '---'}</Text>
  </View>
)

// ==================== DATA TABLE ====================
export const DataTable = ({ headers, rows }) => (
  <View>
    {headers && (
      <View style={{ flexDirection: 'row-reverse', backgroundColor: C.primary, borderRadius: 2, paddingVertical: 4, paddingHorizontal: 6 }}>
        {headers.map((h, i) => <Text key={i} style={{ flex: 1, fontSize: 9, fontWeight: 'bold', color: C.white, textAlign: 'right' }}>{h}</Text>)}
      </View>
    )}
    {rows.map((row, i) => (
      <View key={i} style={[{ flexDirection: 'row-reverse', paddingVertical: 4, paddingHorizontal: 6, borderBottomWidth: 0.5, borderBottomColor: C.border }, i % 2 === 0 ? { backgroundColor: C.surfaceLight } : null]}>
        {row.map((cell, j) => (
          <Text key={j} style={{ flex: 1, fontSize: 9, textAlign: 'right', color: C.black, fontWeight: j === 0 ? 'bold' : 'normal' }}>{cell}</Text>
        ))}
      </View>
    ))}
  </View>
)

// ==================== SUMMARY ROW ====================
export const SummaryRow = ({ label, value, highlight }) => {
  if (highlight) {
    return (
      <View style={{ flexDirection: 'row-reverse', backgroundColor: C.primary, paddingVertical: 5, paddingHorizontal: 6, borderRadius: 2, marginTop: 2 }}>
        <Text style={{ flex: 1, fontSize: 10, fontWeight: 'bold', color: C.white, textAlign: 'right' }}>{label}</Text>
        <Text style={{ flex: 1, fontSize: 10, fontWeight: 'bold', color: C.white, textAlign: 'right' }}>{value}</Text>
      </View>
    )
  }
  return (
    <View style={{ flexDirection: 'row-reverse', paddingVertical: 4, paddingHorizontal: 6, borderBottomWidth: 0.5, borderBottomColor: C.border }}>
      <Text style={{ flex: 1, fontSize: 9, fontWeight: 'bold', textAlign: 'right', color: C.black }}>{label}</Text>
      <Text style={{ flex: 1, fontSize: 9, textAlign: 'right', color: C.black }}>{value}</Text>
    </View>
  )
}

// ==================== SUMMARY CARD ====================
export const SummaryCard = ({ title, items }) => (
  <View style={{ borderWidth: 0.5, borderColor: C.border, borderRadius: 4, marginBottom: 10, overflow: 'hidden' }} wrap={false}>
    <View style={{ backgroundColor: C.primary, paddingVertical: 5, paddingHorizontal: 10 }}>
      <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.white, textAlign: 'right' }}>{title}</Text>
    </View>
    <View style={{ padding: 8 }}>
      {items.map(([label, value], i) => (
        <LabelValue key={i} label={label} value={value} even={i % 2 === 0} />
      ))}
    </View>
  </View>
)

// ==================== PILL TAG ====================
export const PillTag = ({ text }) => (
  <View style={{ backgroundColor: C.cream, borderWidth: 1, borderColor: C.gold, borderRadius: 12, paddingVertical: 3, paddingHorizontal: 10, marginLeft: 6, marginBottom: 4 }}>
    <Text style={{ fontSize: 8, color: C.primary, fontWeight: 'bold', textAlign: 'center' }}>{text}</Text>
  </View>
)

// ==================== RISK GAUGE ====================
export const RiskGauge = ({ level, size = 'normal' }) => {
  const labels = ['שמרן', 'שמרן-מתון', 'מאוזן', 'צמיחה', 'אגרסיבי']
  const colors = ['#2E7D32', '#66BB6A', C.gold, '#EF6C00', C.negative]
  const isSmall = size === 'small'
  const dotSize = isSmall ? 16 : 22
  const fontSize = isSmall ? 6 : 7

  return (
    <View style={{ alignItems: 'center', marginVertical: isSmall ? 4 : 8 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        {[1, 2, 3, 4, 5].map((n) => {
          const isActive = n === level
          return (
            <View key={n} style={{ alignItems: 'center', marginHorizontal: isSmall ? 4 : 8 }}>
              <View style={{
                width: isActive ? dotSize + 4 : dotSize,
                height: isActive ? dotSize + 4 : dotSize,
                borderRadius: (isActive ? dotSize + 4 : dotSize) / 2,
                backgroundColor: isActive ? colors[n - 1] : C.surfaceLight,
                borderWidth: isActive ? 2 : 1,
                borderColor: isActive ? colors[n - 1] : C.border,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Text style={{ fontSize: isSmall ? 7 : 9, fontWeight: 'bold', color: isActive ? C.white : C.textMuted }}>{n}</Text>
              </View>
              <Text style={{ fontSize, color: isActive ? colors[n - 1] : C.textMuted, marginTop: 2, textAlign: 'center', fontWeight: isActive ? 'bold' : 'normal' }}>{labels[n - 1]}</Text>
            </View>
          )
        })}
      </View>
    </View>
  )
}

// ==================== POLICY CUBE ====================
export const PolicyCube = ({ label, value }) => (
  <View style={{
    width: '23%', backgroundColor: C.cream, borderWidth: 1, borderColor: C.gold,
    borderRadius: 4, padding: 6, alignItems: 'center', marginHorizontal: '1%',
  }}>
    <Text style={{ fontSize: 7, color: C.textMuted, textAlign: 'center', marginBottom: 2 }}>{label}</Text>
    <Text style={{ fontSize: 11, fontWeight: 'bold', color: C.primary, textAlign: 'center' }}>{value || '---'}</Text>
  </View>
)

// ==================== GOLD BORDERED BOX ====================
export const GoldBox = ({ children }) => (
  <View style={{ borderWidth: 1, borderColor: C.gold, borderRadius: 4, padding: 10, backgroundColor: C.cream, marginTop: SPACING.md }}>
    {children}
  </View>
)

// ==================== CLIENT CARD (cover page) ====================
export const ClientCard = ({ client, title }) => (
  <View style={{ flex: 1, borderWidth: 0.5, borderColor: C.border, borderRadius: 4, overflow: 'hidden', marginHorizontal: 3 }} wrap={false}>
    <View style={{ backgroundColor: C.secondary, paddingVertical: 4, paddingHorizontal: 8 }}>
      <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.white, textAlign: 'right' }}>{title}</Text>
    </View>
    <View style={{ padding: 6 }}>
      <LabelValue label="שם מלא" value={client.fullName} even />
      <LabelValue label="ת.ז." value={client.idNumber} />
      <LabelValue label="טלפון" value={client.phone} even />
      <LabelValue label="דוא״ל" value={client.email} />
    </View>
  </View>
)

// ==================== HELPERS ====================
export function fmtMoney(val) {
  if (!val) return '---'
  const str = String(val)
  const num = parseFloat(str.replace(/[^\d.-]/g, ''))
  if (isNaN(num)) return str.includes('₪') ? str : `₪ ${str}`
  return `₪ ${num.toLocaleString('he-IL')}`
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
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}.${mm}.${yyyy}`
}
