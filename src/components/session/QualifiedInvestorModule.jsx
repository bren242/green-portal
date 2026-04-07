import { useState, useMemo } from 'react'
import WizardHeader from '../wizard/WizardHeader'
import { generateQualifiedInvestorStyled } from '../pdf/generateQualifiedInvestor'
import { getQualifiedAmounts } from '../../data/qualifiedAmounts'

export default function QualifiedInvestorModule({ user, session, onLogout, onAdmin, onSavePDF, onComplete, onBack }) {
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  // Form state — which checkbox is selected
  const [selectedOption, setSelectedOption] = useState(null) // 1, 2, or 3
  const amounts = useMemo(() => getQualifiedAmounts(), [])

  const buildData = () => ({
    clientName: session.clientA?.fullName || '',
    clientId: session.clientA?.idNumber || '',
    option1: selectedOption === 1,
    option2: selectedOption === 2,
    option3: selectedOption === 3,
  })

  const handleGenerate = async () => {
    if (!selectedOption) {
      setError('יש לבחור לפחות תנאי אחד')
      return
    }
    setGenerating(true)
    setError(null)
    try {
      const data = buildData()
      const res = await generateQualifiedInvestorStyled(data)
      setResult(res)
    } catch (err) {
      setError(`שגיאה ביצירת ההצהרה: ${err.message}`)
    }
    setGenerating(false)
  }

  const handleDownload = () => {
    if (!result) return
    const a = document.createElement('a')
    a.href = result.url
    a.download = result.fileName
    a.click()
  }

  const handleDownloadAndContinue = () => {
    handleDownload()
    if (onSavePDF && result) onSavePDF(result.pdfBytes, result.fileName)
    if (result?.url) URL.revokeObjectURL(result.url)
    onComplete()
  }

  const handleContinueWithout = () => {
    if (onSavePDF && result) onSavePDF(result.pdfBytes, result.fileName)
    if (result?.url) URL.revokeObjectURL(result.url)
    onComplete()
  }

  // ── Result screen ──
  if (result) {
    return (
      <div className="min-h-screen bg-surface-offwhite">
        <WizardHeader user={user} onLogout={onLogout} onAdmin={onAdmin} />
        <div className="max-w-2xl mx-auto px-4 py-5">
          <button onClick={onBack} className="text-sm text-text-muted hover:text-green-primary transition-colors mb-4">
            ← חזרה למודולים
          </button>
          <div className="bg-white rounded-card shadow-card border border-border/50 p-6 md:p-8">
            <h2 className="text-lg font-extrabold text-green-primary mb-1">הצהרת משקיע כשיר</h2>
            <p className="text-sm text-text-muted mb-4">המסמך מוכן</p>
            <div className="border border-border rounded-card overflow-hidden mb-4" style={{ height: '400px' }}>
              <iframe src={result.url} title="תצוגה מקדימה" className="w-full h-full" />
            </div>
            <div className="flex gap-3">
              <button onClick={handleDownloadAndContinue} className="flex-1 py-2.5 bg-green-primary text-white rounded-card text-sm font-bold hover:bg-green-secondary transition-colors shadow-card">
                הורד עכשיו
              </button>
              <button onClick={handleContinueWithout} className="flex-1 py-2.5 border border-green-primary text-green-primary rounded-card text-sm font-bold hover:bg-green-primary/5 transition-colors">
                המשך בלי להוריד
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Form screen ──
  return (
    <div className="min-h-screen bg-surface-offwhite">
      <WizardHeader user={user} onLogout={onLogout} onAdmin={onAdmin} />
      <div className="max-w-2xl mx-auto px-4 py-5">
        <button onClick={onBack} className="text-sm text-text-muted hover:text-green-primary transition-colors mb-4">
          ← חזרה למודולים
        </button>

        <div className="bg-white rounded-card shadow-card border border-border/50 p-6 md:p-8">
          <h2 className="text-lg font-extrabold text-green-primary mb-1">הצהרת משקיע כשיר</h2>
          <p className="text-sm text-text-muted mb-6">בחר את התנאי המתקיים ללקוח</p>
          <div className="h-[2px] bg-gold/30 mb-6 rounded-full" />

          {/* Client summary */}
          <div className="bg-surface-cream rounded-card border border-border/50 p-4 mb-6" dir="rtl">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-text-muted text-xs block">לקוח</span>
                <span className="font-semibold text-text-primary">{session.clientA?.fullName}</span>
              </div>
              <div>
                <span className="text-text-muted text-xs block">תעודת זהות</span>
                <span className="font-semibold text-text-primary">{session.clientA?.idNumber}</span>
              </div>
            </div>
          </div>

          {/* Option selection */}
          <div className="space-y-3 mb-6" dir="rtl">
            <label className="block text-sm font-semibold text-text-primary mb-3">תנאי כשירות (בחר אחד):</label>

            {[
              { value: 1, label: `נכסים נזילים מעל ${amounts.amount1} מיליון ש"ח` },
              { value: 2, label: `הכנסה שנתית מעל ${amounts.amount2} מיליון ש"ח (או תא משפחתי מעל ${amounts.amount3} מיליון ש"ח)` },
              { value: 3, label: `נכסים נזילים מעל ${amounts.amount4} מיליון ש"ח + הכנסה שנתית מעל ${amounts.amount5} ש"ח` },
            ].map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center gap-3 p-4 border rounded-card cursor-pointer transition-all ${
                  selectedOption === opt.value
                    ? 'border-green-primary bg-green-primary/5'
                    : 'border-border/50 hover:border-gold'
                }`}
              >
                <input
                  type="radio"
                  name="qualifiedOption"
                  value={opt.value}
                  checked={selectedOption === opt.value}
                  onChange={() => setSelectedOption(opt.value)}
                  className="accent-green-primary w-4 h-4"
                />
                <span className="text-sm text-text-primary">{opt.label}</span>
              </label>
            ))}
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
            {generating ? 'מפיק הצהרה...' : 'הפק הצהרת משקיע כשיר'}
          </button>
        </div>
      </div>
    </div>
  )
}
