import { useState } from 'react'
import WizardHeader from '../wizard/WizardHeader'
import { generateDeskReferralPDF } from '../pdf/generateDeskReferral'
import { getAdminSettings } from '../../data/adminSettings'

const TYPE_LABELS = {
  new_investment: 'השקעה חדשה',
  existing_investment: 'טיפול בהשקעה קיימת',
  transfer: 'העברת כספים',
  other: 'אחר',
}

const fmtDate = () => {
  const d = new Date()
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

function createInstruction() {
  return { id: Date.now(), type: null, investmentType: '', manager: '', amount: '', action: '', from: '', to: '', notes: '' }
}

// ── Top-level helpers (outside InstructionCard to prevent remount) ────────────
function CardRadio({ instId, name, value, current, label, onChange, inst }) {
  return (
    <label className="flex items-center gap-1.5 cursor-pointer">
      <input
        type="radio"
        name={`${name}_${instId}`}
        checked={current === value}
        onChange={() => onChange({ ...inst, [name]: value })}
        className="accent-green-primary w-3.5 h-3.5"
      />
      <span className="text-sm text-text-primary">{label}</span>
    </label>
  )
}

function CardField({ field, value, placeholder, type = 'text', onChange, inst }) {
  return (
    <input
      type={type}
      value={value || ''}
      onChange={(e) => onChange({ ...inst, [field]: e.target.value })}
      placeholder={placeholder}
      autoComplete="off"
      className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-green-secondary focus:ring-1 focus:ring-green-secondary"
    />
  )
}

// ── Instruction card ──────────────────────────────────────────
function InstructionCard({ inst, index, onChange, onRemove }) {
  return (
    <div className="border border-border rounded-card bg-white overflow-hidden" dir="rtl">
      {/* Card header */}
      <div className="flex items-center justify-between bg-surface-cream px-4 py-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-green-primary text-white text-xs font-bold flex items-center justify-center">
            {index + 1}
          </span>
          <span className="text-sm font-semibold text-text-primary">
            {inst.type ? TYPE_LABELS[inst.type] : 'בחר סוג הוראה'}
          </span>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-xs text-red-500 hover:text-red-700 font-semibold border border-red-200 px-2 py-1 rounded transition-colors"
        >
          הסר
        </button>
      </div>

      {/* Type selector — big tiles */}
      {!inst.type && (
        <div className="grid grid-cols-2 gap-3 p-4">
          {Object.entries(TYPE_LABELS).map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => onChange({ ...inst, type: val })}
              className="flex flex-col items-center justify-center gap-1.5 py-5 px-3 border-2 border-border rounded-card hover:border-green-primary hover:bg-green-primary/5 transition-all text-sm font-semibold text-text-primary"
            >
              <TypeIcon type={val} />
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Fields per type */}
      {inst.type && (
        <div className="p-4 space-y-3">
          {/* Allow re-selecting type */}
          <button
            type="button"
            onClick={() => onChange({ ...inst, type: null })}
            className="text-xs text-gold hover:text-gold/70 underline underline-offset-2"
          >
            שנה סוג
          </button>

          {inst.type === 'new_investment' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-2">סוג</label>
                <div className="flex flex-wrap gap-4">
                  <CardRadio instId={inst.id} name="investmentType" value="portfolio" current={inst.investmentType} label="תיק השקעות" onChange={onChange} inst={inst} />
                  <CardRadio instId={inst.id} name="investmentType" value="fund" current={inst.investmentType} label="קרן השקעה" onChange={onChange} inst={inst} />
                  <CardRadio instId={inst.id} name="investmentType" value="savings_policy" current={inst.investmentType} label="פוליסת חיסכון" onChange={onChange} inst={inst} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">גוף מנהל</label>
                <CardField field="manager" value={inst.manager} placeholder="שם הגוף המנהל..." onChange={onChange} inst={inst} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">סכום</label>
                <CardField field="amount" value={inst.amount} placeholder="₪" onChange={onChange} inst={inst} />
              </div>
            </>
          )}

          {inst.type === 'existing_investment' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">גוף מנהל</label>
                <CardField field="manager" value={inst.manager} placeholder="שם הגוף המנהל..." onChange={onChange} inst={inst} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-2">פעולה</label>
                <div className="flex flex-wrap gap-4">
                  <CardRadio instId={inst.id} name="action" value="increase" current={inst.action} label="הגדלה" onChange={onChange} inst={inst} />
                  <CardRadio instId={inst.id} name="action" value="decrease" current={inst.action} label="הקטנה" onChange={onChange} inst={inst} />
                  <CardRadio instId={inst.id} name="action" value="redemption" current={inst.action} label="פדיון" onChange={onChange} inst={inst} />
                  <CardRadio instId={inst.id} name="action" value="change_track" current={inst.action} label="שינוי מסלול" onChange={onChange} inst={inst} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">סכום או אחוז</label>
                <CardField field="amount" value={inst.amount} placeholder="₪ / %" onChange={onChange} inst={inst} />
              </div>
            </>
          )}

          {inst.type === 'transfer' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">מאיפה</label>
                <CardField field="from" value={inst.from} placeholder="מקור הכספים..." onChange={onChange} inst={inst} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">לאיפה</label>
                <CardField field="to" value={inst.to} placeholder="יעד הכספים..." onChange={onChange} inst={inst} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">סכום</label>
                <CardField field="amount" value={inst.amount} placeholder="₪" onChange={onChange} inst={inst} />
              </div>
            </>
          )}

          {inst.type === 'other' && (
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1">פירוט</label>
              <textarea
                value={inst.notes || ''}
                onChange={(e) => onChange({ ...inst, notes: e.target.value })}
                rows={3}
                autoComplete="off"
                placeholder="תיאור ההוראה..."
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-green-secondary focus:ring-1 focus:ring-green-secondary resize-none"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function TypeIcon({ type }) {
  if (type === 'new_investment') return (
    <svg className="w-6 h-6 text-green-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  )
  if (type === 'existing_investment') return (
    <svg className="w-6 h-6 text-green-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  )
  if (type === 'transfer') return (
    <svg className="w-6 h-6 text-green-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
  )
  return (
    <svg className="w-6 h-6 text-green-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
    </svg>
  )
}

// ── Validate instruction is complete ──────────────────────────
function isInstructionComplete(inst) {
  if (!inst.type) return false
  if (inst.type === 'new_investment') return !!(inst.investmentType && inst.manager && inst.amount)
  if (inst.type === 'existing_investment') return !!(inst.manager && inst.action)
  if (inst.type === 'transfer') return !!(inst.from && inst.to)
  if (inst.type === 'other') return !!(inst.notes?.trim())
  return false
}

// ── Build email body ──────────────────────────────────────────
function buildEmailBody(data) {
  const { clientName, clientId, advisorName, date, instructions } = data

  const TYPE_LABELS_HE = {
    new_investment: 'השקעה חדשה',
    existing_investment: 'טיפול בהשקעה קיימת',
    transfer: 'העברת כספים',
    other: 'אחר',
  }
  const INVESTMENT_HE = { portfolio: 'תיק השקעות', fund: 'קרן השקעה', savings_policy: 'פוליסת חיסכון' }
  const ACTION_HE = { increase: 'הגדלה', decrease: 'הקטנה', redemption: 'פדיון', change_track: 'שינוי מסלול' }

  let body = `הפניה לדסק תפעול\n`
  body += `תאריך: ${date}\n`
  body += `לקוח: ${clientName} | ת.ז: ${clientId}\n`
  body += `משווק: ${advisorName}\n\n`
  body += `הוראות:\n${'─'.repeat(40)}\n\n`

  instructions.forEach((inst, i) => {
    body += `${i + 1}. ${TYPE_LABELS_HE[inst.type] || inst.type}\n`
    if (inst.type === 'new_investment') {
      body += `   סוג: ${INVESTMENT_HE[inst.investmentType] || inst.investmentType}\n`
      body += `   גוף מנהל: ${inst.manager}\n`
      body += `   סכום: ${inst.amount}\n`
    } else if (inst.type === 'existing_investment') {
      body += `   גוף מנהל: ${inst.manager}\n`
      body += `   פעולה: ${ACTION_HE[inst.action] || inst.action}\n`
      if (inst.amount) body += `   סכום/אחוז: ${inst.amount}\n`
    } else if (inst.type === 'transfer') {
      body += `   מאיפה: ${inst.from}\n`
      body += `   לאיפה: ${inst.to}\n`
      if (inst.amount) body += `   סכום: ${inst.amount}\n`
    } else if (inst.type === 'other') {
      body += `   ${inst.notes}\n`
    }
    body += '\n'
  })

  return body
}

// ══════════════════════════════════════════════════════════════
// MAIN MODULE
// ══════════════════════════════════════════════════════════════
export default function DeskReferralModule({ user, session, onLogout, onAdmin, onSavePDF, onComplete, onBack }) {
  const [instructions, setInstructions] = useState([createInstruction()])
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [showEmailDialog, setShowEmailDialog] = useState(false)

  const dateStr = fmtDate()

  const addInstruction = () => setInstructions(prev => [...prev, createInstruction()])

  const updateInstruction = (id, updated) =>
    setInstructions(prev => prev.map(i => i.id === id ? updated : i))

  const removeInstruction = (id) =>
    setInstructions(prev => prev.filter(i => i.id !== id))

  const buildData = () => ({
    clientName: session.clientA?.fullName || '',
    clientId: session.clientA?.idNumber || '',
    advisorName: session.advisor?.name || '',
    date: dateStr,
    instructions,
  })

  const validate = () => {
    if (instructions.length === 0) return 'יש להוסיף לפחות הוראה אחת'
    const incomplete = instructions.filter(i => !isInstructionComplete(i))
    if (incomplete.length > 0) return `${incomplete.length} הוראות לא מלאות — בדוק את כל השדות`
    return null
  }

  // Build and fire the mailto URI
  const openMailto = () => {
    const settings = getAdminSettings()
    const to = settings.deskEmailPrimary
    const data = buildData()
    const subject = encodeURIComponent(`הפניה לדסק — ${data.clientName} — ${dateStr}`)
    const body = encodeURIComponent(buildEmailBody(data))
    const ccParam = settings.deskEmailSecondary ? `&cc=${encodeURIComponent(settings.deskEmailSecondary)}` : ''
    console.log('[DeskReferral] mailto → to:', to, '| cc:', settings.deskEmailSecondary || '(none)')
    window.location.href = `mailto:${to}?subject=${subject}${ccParam}&body=${body}`
  }

  // "שלח לדסק" click — validate then show dialog
  const handleEmailClick = () => {
    const settings = getAdminSettings()
    console.log('[DeskReferral] settings from localStorage:', settings)
    if (!settings.deskEmailPrimary) {
      setError('כתובת דסק לא מוגדרת — עדכן בממשק הניהול')
      return
    }
    const err = validate()
    if (err) { setError(err); return }
    setError(null)
    setShowEmailDialog(true)
  }

  // Dialog: "כן" — generate + download PDF, then open mailto after 1s
  const handleEmailWithPDF = async () => {
    setShowEmailDialog(false)
    setGenerating(true)
    try {
      const res = await generateDeskReferralPDF(buildData())
      const a = document.createElement('a')
      a.href = res.url
      a.download = res.fileName
      a.click()
      if (onSavePDF) onSavePDF(res.pdfBytes, res.fileName)
      URL.revokeObjectURL(res.url)
      setTimeout(() => openMailto(), 1000)
    } catch (e) {
      setError('שגיאה ביצירת ה-PDF')
    }
    setGenerating(false)
  }

  // Dialog: "לא" — open mailto directly
  const handleEmailWithoutPDF = () => {
    setShowEmailDialog(false)
    openMailto()
  }

  const handlePDF = async () => {
    const err = validate()
    if (err) { setError(err); return }
    setError(null)
    setGenerating(true)
    try {
      const res = await generateDeskReferralPDF(buildData())
      setResult(res)
    } catch (e) {
      setError('שגיאה ביצירת ה-PDF')
    }
    setGenerating(false)
  }

  const handleDownloadAndContinue = () => {
    if (result) {
      const a = document.createElement('a')
      a.href = result.url
      a.download = result.fileName
      a.click()
      if (onSavePDF) onSavePDF(result.pdfBytes, result.fileName)
      URL.revokeObjectURL(result.url)
    }
    onComplete()
  }

  // ── Preview screen ─────────────────────────────────────────
  if (result) {
    return (
      <div className="min-h-screen bg-surface-offwhite">
        <WizardHeader user={user} onLogout={onLogout} onAdmin={onAdmin} />
        <div className="max-w-2xl mx-auto px-4 py-5">
          <button onClick={() => setResult(null)} className="text-sm text-text-muted hover:text-green-primary transition-colors mb-4">
            ← חזרה לעריכה
          </button>
          <div className="bg-white rounded-card shadow-card border border-border/50 p-6">
            <h2 className="text-lg font-extrabold text-green-primary mb-1">הפניה לדסק תפעול</h2>
            <p className="text-sm text-text-muted mb-4">המסמך מוכן</p>
            <div className="border border-border rounded-card overflow-hidden mb-4" style={{ height: 400 }}>
              <iframe src={result.url} title="תצוגה מקדימה" className="w-full h-full" />
            </div>
            <div className="flex gap-3">
              <button onClick={handleDownloadAndContinue} className="flex-1 py-2.5 bg-green-primary text-white rounded-card text-sm font-bold hover:bg-green-secondary transition-colors shadow-card">
                הורד עכשיו
              </button>
              <button onClick={onComplete} className="flex-1 py-2.5 border border-green-primary text-green-primary rounded-card text-sm font-bold hover:bg-green-primary/5 transition-colors">
                המשך בלי להוריד
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Main form ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-surface-offwhite">
      <WizardHeader user={user} onLogout={onLogout} onAdmin={onAdmin} />
      <div className="max-w-2xl mx-auto px-4 py-5">
        <button onClick={onBack} className="text-sm text-text-muted hover:text-green-primary transition-colors mb-4">
          ← חזרה למודולים
        </button>

        <div className="bg-white rounded-card shadow-card border border-border/50 p-6 md:p-8">
          <h2 className="text-lg font-extrabold text-green-primary mb-1">הפניה לדסק תפעול</h2>
          <p className="text-sm text-text-muted mb-6">הוסף הוראות ושלח לדסק</p>
          <div className="h-[2px] bg-gold/30 mb-6 rounded-full" />

          {/* Client summary */}
          <div className="bg-surface-cream rounded-card border border-border/50 p-4 mb-6" dir="rtl">
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <div>
                <span className="text-text-muted text-xs block">לקוח</span>
                <span className="font-semibold text-text-primary">{session.clientA?.fullName || '—'}</span>
              </div>
              <div>
                <span className="text-text-muted text-xs block">תעודת זהות</span>
                <span className="font-semibold text-text-primary">{session.clientA?.idNumber || '—'}</span>
              </div>
              <div>
                <span className="text-text-muted text-xs block">משווק</span>
                <span className="font-semibold text-text-primary">{session.advisor?.name || '—'}</span>
              </div>
              <div>
                <span className="text-text-muted text-xs block">תאריך</span>
                <span className="font-semibold text-text-primary">{dateStr}</span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-4 mb-4" dir="rtl">
            {instructions.map((inst, i) => (
              <InstructionCard
                key={inst.id}
                inst={inst}
                index={i}
                onChange={(updated) => updateInstruction(inst.id, updated)}
                onRemove={() => removeInstruction(inst.id)}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={addInstruction}
            className="w-full py-2.5 border-2 border-dashed border-border text-text-muted rounded-card text-sm font-semibold hover:border-green-primary hover:text-green-primary transition-colors mb-6"
            dir="rtl"
          >
            + הוסף הוראה
          </button>

          {error && (
            <div className="bg-warning-bg border border-warning-border rounded-card p-3 mb-4 text-sm text-warning-red text-center">
              {error}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleEmailClick}
              disabled={generating}
              className="flex-1 py-3 bg-gold text-white rounded-card text-sm font-bold hover:bg-gold/80 transition-colors shadow-card disabled:opacity-50"
            >
              שלח לדסק
            </button>
            <button
              onClick={handlePDF}
              disabled={generating}
              className="flex-1 py-3 bg-green-primary text-white rounded-card text-sm font-bold hover:bg-green-secondary transition-colors shadow-card disabled:opacity-50"
            >
              {generating ? 'מפיק...' : 'הפק PDF'}
            </button>
          </div>
        </div>
      </div>

      {/* Email dialog */}
      {showEmailDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-card shadow-xl border border-border/50 p-6 max-w-xs w-full mx-4" dir="rtl">
            <h3 className="text-base font-extrabold text-green-primary mb-1">שליחה לדסק</h3>
            <p className="text-sm text-text-primary mb-6">רוצה לצרף את הסיכום כ-PDF?</p>
            <div className="flex gap-3">
              <button
                onClick={handleEmailWithPDF}
                className="flex-1 py-2.5 bg-green-primary text-white rounded-card text-sm font-bold hover:bg-green-secondary transition-colors shadow-card"
              >
                כן
              </button>
              <button
                onClick={handleEmailWithoutPDF}
                className="flex-1 py-2.5 border-2 border-green-primary text-green-primary rounded-card text-sm font-bold hover:bg-green-primary/5 transition-colors"
              >
                לא
              </button>
            </div>
            <button
              onClick={() => setShowEmailDialog(false)}
              className="mt-3 w-full text-xs text-text-muted hover:text-text-primary transition-colors text-center"
            >
              ביטול
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
