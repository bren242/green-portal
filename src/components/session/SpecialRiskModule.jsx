import { useState } from 'react'
import WizardHeader from '../wizard/WizardHeader'
import { generateSpecialRisk } from '../pdf/generateSpecialRisk'

const fmtDate = () => {
  const d = new Date()
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

export default function SpecialRiskModule({ user, session, onLogout, onAdmin, onSavePDF, onComplete, onBack }) {
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleGenerate = async () => {
    setGenerating(true)
    setError(null)
    try {
      const res = await generateSpecialRisk({ clientA: session.clientA, advisor: session.advisor })
      setResult(res)
    } catch {
      setError('שגיאה ביצירת ה-PDF')
    }
    setGenerating(false)
  }

  const handleDownloadAndComplete = () => {
    if (result) {
      const a = document.createElement('a')
      a.href = result.url
      a.download = result.fileName
      a.click()
      if (onSavePDF) onSavePDF(null, result.fileName)
      URL.revokeObjectURL(result.url)
    }
    onComplete()
  }

  // ── Preview ──────────────────────────────────────────────────
  if (result) {
    return (
      <div className="min-h-screen bg-surface-offwhite">
        <WizardHeader user={user} onLogout={onLogout} onAdmin={onAdmin} />
        <div className="max-w-2xl mx-auto px-4 py-5">
          <button onClick={() => setResult(null)} className="text-sm text-text-muted hover:text-green-primary transition-colors mb-4">
            ← חזרה
          </button>
          <div className="bg-white rounded-card shadow-card border border-border/50 p-6">
            <h2 className="text-lg font-extrabold text-green-primary mb-1">נספח השקעות בסיכון מיוחד</h2>
            <p className="text-sm text-text-muted mb-4">המסמך מוכן להדפסה וחתימה</p>
            <div className="border border-border rounded-card overflow-hidden mb-4" style={{ height: 400 }}>
              <iframe src={result.url} title="תצוגה מקדימה" className="w-full h-full" />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDownloadAndComplete}
                className="flex-1 py-2.5 bg-green-primary text-white rounded-card text-sm font-bold hover:bg-green-secondary transition-colors shadow-card"
              >
                הורד עכשיו
              </button>
              <button
                onClick={onComplete}
                className="flex-1 py-2.5 border border-green-primary text-green-primary rounded-card text-sm font-bold hover:bg-green-primary/5 transition-colors"
              >
                המשך בלי להוריד
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Main screen ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-surface-offwhite">
      <WizardHeader user={user} onLogout={onLogout} onAdmin={onAdmin} />
      <div className="max-w-2xl mx-auto px-4 py-5">
        <button onClick={onBack} className="text-sm text-text-muted hover:text-green-primary transition-colors mb-4">
          ← חזרה למודולים
        </button>

        <div className="bg-white rounded-card shadow-card border border-border/50 p-6 md:p-8">
          <h2 className="text-lg font-extrabold text-green-primary mb-1">נספח השקעות בסיכון מיוחד</h2>
          <p className="text-sm text-text-muted mb-6">
            הצהרת לקוח על קבלת שירותים בסיכון מיוחד, מוצרים מובנים וקרנות גידור
          </p>
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
                <span className="font-semibold text-text-primary">{fmtDate()}</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-warning-bg border border-warning-border rounded-card p-3 mb-4 text-sm text-warning-red text-center">
              {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full py-3 bg-green-primary text-white rounded-card text-sm font-bold hover:bg-green-secondary transition-colors shadow-card disabled:opacity-50"
          >
            {generating ? 'מפיק...' : 'הפק נספח לחתימה'}
          </button>
        </div>
      </div>
    </div>
  )
}
