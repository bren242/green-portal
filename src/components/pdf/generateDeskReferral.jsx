// GREEN Portal — הפניה לדסק תפעול PDF Generator
// RTL Hebrew — אסור direction:'rtl', אסור לקנן Text בתוך Text

import React from 'react'
import { Document, Page, Text, View, Image, Font, pdf } from '@react-pdf/renderer'
import { logoPng } from '../../assets/logoBase64'

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
  black: '#1A1A1A',
  muted: '#5A5A5A',
  white: '#FFFFFF',
  border: '#DDD5BF',
  surface: '#F6F5F1',
}

const today = () => {
  const d = new Date()
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

const pageStyle = {
  fontFamily: 'Assistant',
  paddingTop: 30,
  paddingBottom: 50,
  paddingHorizontal: 40,
  fontSize: 10,
  color: C.black,
}

// ── Header ────────────────────────────────────────────────────
const PageHeader = () => (
  <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottomWidth: 2, borderBottomColor: C.primary, paddingBottom: 10 }}>
    <Image src={logoPng} style={{ height: 36, objectFit: 'contain' }} />
    <View style={{ alignItems: 'flex-end' }}>
      <Text style={{ fontSize: 14, fontWeight: 'bold', color: C.primary, textAlign: 'right' }}>
        {'הפניה לדסק תפעול'}
      </Text>
      <Text style={{ fontSize: 8, color: C.muted, textAlign: 'right', marginTop: 2 }}>
        {'GREEN Wealth Management'}
      </Text>
    </View>
  </View>
)

// ── Info row ──────────────────────────────────────────────────
const InfoRow = ({ label, value }) => (
  <View style={{ flexDirection: 'row-reverse', marginBottom: 3 }}>
    <Text style={{ fontSize: 9, fontWeight: 'bold', color: C.muted, textAlign: 'right', width: 70 }}>
      {label}
    </Text>
    <Text style={{ fontSize: 9, color: C.black, textAlign: 'right', flex: 1 }}>
      {value || '—'}
    </Text>
  </View>
)

// ── Section title ─────────────────────────────────────────────
const SectionTitle = ({ children }) => (
  <View style={{ backgroundColor: C.primary, paddingVertical: 5, paddingHorizontal: 10, marginBottom: 10, marginTop: 14 }}>
    <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.white, textAlign: 'right' }}>
      {children}
    </Text>
  </View>
)

// ── Instruction label ─────────────────────────────────────────
const FieldRow = ({ label, value }) => {
  if (!value) return null
  return (
    <View style={{ flexDirection: 'row-reverse', marginBottom: 4 }}>
      <Text style={{ fontSize: 9, color: C.muted, textAlign: 'right', width: 80 }}>
        {label}
      </Text>
      <Text style={{ fontSize: 9, color: C.black, textAlign: 'right', flex: 1 }}>
        {value}
      </Text>
    </View>
  )
}

// ── Instruction type label map ─────────────────────────────────
const TYPE_LABELS = {
  new_investment: 'השקעה חדשה',
  existing_investment: 'טיפול בהשקעה קיימת',
  transfer: 'העברת כספים',
  other: 'אחר',
}

const INVESTMENT_TYPE_LABELS = {
  portfolio: 'תיק השקעות',
  fund: 'קרן השקעה',
  savings_policy: 'פוליסת חיסכון',
}

const ACTION_LABELS = {
  increase: 'הגדלה',
  decrease: 'הקטנה',
  redemption: 'פדיון',
  change_track: 'שינוי מסלול',
}

// ── Instruction block ─────────────────────────────────────────
const InstructionBlock = ({ instruction, index }) => {
  const typeLabel = TYPE_LABELS[instruction.type] || instruction.type
  return (
    <View wrap={false} style={{ backgroundColor: C.surface, borderRadius: 4, padding: 10, marginBottom: 8, borderRightWidth: 3, borderRightColor: C.gold }}>
      {/* Number + type heading */}
      <View style={{ flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 6 }}>
        <View style={{ backgroundColor: C.primary, borderRadius: 10, width: 18, height: 18, justifyContent: 'center', alignItems: 'center', marginLeft: 6 }}>
          <Text style={{ fontSize: 8, fontWeight: 'bold', color: C.white }}>{String(index + 1)}</Text>
        </View>
        <Text style={{ fontSize: 10, fontWeight: 'bold', color: C.primary, textAlign: 'right' }}>
          {typeLabel}
        </Text>
      </View>

      {/* Fields per type */}
      {instruction.type === 'new_investment' && (
        <View>
          <FieldRow label={'סוג'} value={INVESTMENT_TYPE_LABELS[instruction.investmentType] || instruction.investmentType} />
          <FieldRow label={'גוף מנהל'} value={instruction.manager} />
          <FieldRow label={'סכום'} value={instruction.amount} />
        </View>
      )}
      {instruction.type === 'existing_investment' && (
        <View>
          <FieldRow label={'גוף מנהל'} value={instruction.manager} />
          <FieldRow label={'פעולה'} value={ACTION_LABELS[instruction.action] || instruction.action} />
          <FieldRow label={'סכום / אחוז'} value={instruction.amount} />
        </View>
      )}
      {instruction.type === 'transfer' && (
        <View>
          <FieldRow label={'מאיפה'} value={instruction.from} />
          <FieldRow label={'לאיפה'} value={instruction.to} />
          <FieldRow label={'סכום'} value={instruction.amount} />
        </View>
      )}
      {instruction.type === 'other' && (
        <View>
          <Text style={{ fontSize: 9, color: C.black, textAlign: 'right', lineHeight: 1.5 }}>
            {instruction.notes || '—'}
          </Text>
        </View>
      )}
      {instruction.extraNotes ? (
        <View style={{ marginTop: 4, borderTopWidth: 1, borderTopColor: C.border, paddingTop: 4 }}>
          <FieldRow label={'הערות'} value={instruction.extraNotes} />
        </View>
      ) : null}
    </View>
  )
}

// ══════════════════════════════════════════════════════════════
// DOCUMENT
// ══════════════════════════════════════════════════════════════
const DeskReferralDoc = ({ data }) => {
  const d = data || {}
  const instructions = d.instructions || []
  const dateStr = d.date || today()

  return (
    <Document>
      <Page size="A4" style={pageStyle}>
        <PageHeader />

        {/* Meta info */}
        <View style={{ backgroundColor: C.surface, borderRadius: 4, padding: 10, marginBottom: 4 }}>
          <View style={{ flexDirection: 'row-reverse', gap: 20 }}>
            <View style={{ flex: 1 }}>
              <InfoRow label={'לקוח'} value={d.clientName} />
              <InfoRow label={'תעודת זהות'} value={d.clientId} />
            </View>
            <View style={{ flex: 1 }}>
              <InfoRow label={'משווק'} value={d.advisorName} />
              <InfoRow label={'תאריך'} value={dateStr} />
            </View>
          </View>
        </View>

        {/* Instructions */}
        <SectionTitle>{'הוראות'}</SectionTitle>
        {instructions.map((inst, i) => (
          <InstructionBlock key={i} instruction={inst} index={i} />
        ))}

        {/* Footer */}
        <View style={{ position: 'absolute', bottom: 20, left: 40, right: 40, borderTopWidth: 1, borderTopColor: C.border, paddingTop: 6, flexDirection: 'row-reverse', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 7.5, color: C.muted, textAlign: 'right' }}>
            {'GREEN Wealth Management'}
          </Text>
          <Text style={{ fontSize: 7.5, color: C.muted, textAlign: 'left' }}>
            {dateStr}
          </Text>
        </View>
      </Page>
    </Document>
  )
}

// ── Export ────────────────────────────────────────────────────
export async function generateDeskReferralPDF(data) {
  const blob = await pdf(<DeskReferralDoc data={data} />).toBlob()
  const pdfBytes = await blob.arrayBuffer()
  const safeName = (data.clientName || '').replace(/[^a-zA-Z0-9\u0590-\u05FF]/g, '_')
  const dateStr = new Date().toISOString().split('T')[0]
  const fileName = `\u05D4\u05E4\u05E0\u05D9\u05D4_\u05DC\u05D3\u05E1\u05E7_${dateStr}_${safeName}.pdf`
  const previewBlob = new Blob([pdfBytes], { type: 'application/pdf' })
  const previewUrl = URL.createObjectURL(previewBlob)
  return { url: previewUrl, fileName, pdfBytes }
}
