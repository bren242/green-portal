import { useState } from 'react'
import WizardHeader from '../wizard/WizardHeader'
import { generateMarketingAgreementStyled } from '../pdf/generateMarketingAgreement'

export default function AgreementModule({ user, session, onLogout, onAdmin, onSavePDF, onComplete, onBack }) {
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [city, setCity] = useState('רמת גן')

  // Build clientData for the agreement PDF
  const buildAgreementData = () => ({
    advisorUserId: session.advisor?.id || '',
    advisorName: session.advisor?.name || '',
    advisorId: session.advisor?.idNumber || '',
    advisorLicense: session.advisor?.license || '',
    clientAName: session.clientA?.fullName || '',
    clientAId: session.clientA?.idNumber || '',
    clientAPhone: session.clientA?.phone || '',
    clientAEmail: session.clientA?.email || '',
    clientAAddress: session.clientA?.address || '',
    clientBName: session.signerType === 'couple' ? (session.clientB?.fullName || '') : '',
    clientBId: session.signerType === 'couple' ? (session.clientB?.idNumber || '') : '',
    clientBPhone: session.signerType === 'couple' ? (session.clientB?.phone || '') : '',
    clientBEmail: session.signerType === 'couple' ? (session.clientB?.email || '') : '',
    clientBAddress: session.signerType === 'couple' ? (session.clientB?.address || '') : '',
    city: city,
  })

  const handleGenerate = async () => {
    setGenerating(true)
    setError(null)
    try {
      const data = buildAgreementData()
      const res = await generateMarketingAgreementStyled(data)
      setResult(res)
    } catch (err) {
      console.error('[AgreementModule] CRASH:', err.message)
      console.error('[AgreementModule] stack:', err.stack)
      setError('שגיאה ביצירת ההסכם: ' + err.message)
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

  return (
    <div className="min-h-screen bg-surface-offwhite">
      <WizardHeader user={user} onLogout={onLogout} onAdmin={onAdmin} />
      <div className="max-w-2xl mx-auto px-4 py-5">
        <button
          onClick={onBack}
          className="text-sm text-text-muted hover:text-green-primary transition-colors mb-4"
        >
          ← חזרה למודולים
        </button>

        <div className="bg-white rounded-card shadow-card border border-border/50 p-6 md:p-8">
          <h2 className="text-lg font-extrabold text-green-primary mb-1">הסכם שיווק השקעות</h2>
          <p className="text-sm text-text-muted mb-6">הפקת הסכם עם פרטי הלקוח והמשווק</p>
          <div className="h-[2px] bg-gold/30 mb-6 rounded-full" />

          {/* Summary */}
          <div className="bg-surface-cream rounded-card border border-border/50 p-4 mb-6">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-right">
                <span className="text-text-muted text-xs block">משווק</span>
                <span className="font-semibold text-text-primary">{session.advisor?.name}</span>
              </div>
              <div className="text-right">
                <span className="text-text-muted text-xs block">לקוח</span>
                <span className="font-semibold text-text-primary">
                  {session.clientA?.fullName}
                  {session.signerType === 'couple' && session.clientB?.fullName && ` + ${session.clientB.fullName}`}
                </span>
              </div>
              {session.advisor?.idNumber && (
                <div className="text-right">
                  <span className="text-text-muted text-xs block">ת.ז משווק</span>
                  <span className="font-semibold text-text-primary">{session.advisor.idNumber}</span>
                </div>
              )}
              <div className="text-right">
                <span className="text-text-muted text-xs block">ת.ז לקוח</span>
                <span className="font-semibold text-text-primary">{session.clientA?.idNumber}</span>
              </div>
            </div>
          </div>

          {/* City field */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-text-primary mb-1">מקום החתימה</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              autoComplete="off"
              placeholder="רמת גן"
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-green-secondary focus:ring-1 focus:ring-green-secondary"
            />
          </div>

          {error && (
            <div className="bg-warning-bg border border-warning-border rounded-card p-3 mb-4 text-sm text-warning-red text-center">
              {error}
            </div>
          )}

          {!result ? (
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full py-3 bg-green-primary text-white rounded-card text-sm font-bold hover:bg-green-secondary transition-colors shadow-card disabled:opacity-50"
            >
              {generating ? 'מפיק הסכם...' : 'הפק הסכם שיווק'}
            </button>
          ) : (
            <div className="space-y-3">
              {/* Preview */}
              <div className="border border-border rounded-card overflow-hidden" style={{ height: '400px' }}>
                <iframe
                  src={result.url}
                  title="תצוגה מקדימה"
                  className="w-full h-full"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDownloadAndContinue}
                  className="flex-1 py-2.5 bg-green-primary text-white rounded-card text-sm font-bold hover:bg-green-secondary transition-colors shadow-card"
                >
                  הורד עכשיו
                </button>
                <button
                  onClick={handleContinueWithout}
                  className="flex-1 py-2.5 border border-green-primary text-green-primary rounded-card text-sm font-bold hover:bg-green-primary/5 transition-colors"
                >
                  המשך בלי להוריד
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
