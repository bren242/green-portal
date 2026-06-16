import { useState } from 'react'
import { getAdvisors } from '../../data/users'
import { BLANK_FORMS } from '../../data/advisors'
import { generateBlankPDF } from '../pdf/generateBlankPDF'
import { generateMarketingAgreementBlank } from '../pdf/generateMarketingAgreement'
import { generateMeetingSummaryBlank } from '../pdf/generateMeetingSummary'
import { generateQualifiedInvestorBlank } from '../pdf/generateQualifiedInvestor'
import { generateQualifiedAdvisorBlank } from '../pdf/generateQualifiedAdvisor'
import { generateSpecialRiskBlank } from '../pdf/generateSpecialRisk'
import { saveSignature, saveCompanyStamp } from '../pdf/../../data/signatures'

const BLANK_GENERATORS = {
  generateBlankPDF,
  generateMarketingAgreementBlank,
  generateMeetingSummaryBlank,
  generateQualifiedInvestorBlank,
  generateQualifiedAdvisorBlank,
  generateSpecialRiskBlank,
}

export default function AdvisorSelect({ onSelect }) {
  const [showBlankForms, setShowBlankForms] = useState(false)
  const [downloading, setDownloading] = useState(null)
  const [importMsg, setImportMsg] = useState(null)
  const [importError, setImportError] = useState(null)
  const advisors = getAdvisors()

  const handleImportSettings = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result)
        if (data.signatures) {
          Object.entries(data.signatures).forEach(([userId, sig]) => saveSignature(userId, sig))
        }
        if (data.companyStamp) saveCompanyStamp(data.companyStamp)
        if (data.qualifiedAmounts) localStorage.setItem('green_qualified_amounts', data.qualifiedAmounts)
        if (data.adminSettings) localStorage.setItem('green_admin_settings', data.adminSettings)
        if (data.userProfiles && Array.isArray(data.userProfiles)) {
          try {
            const raw = localStorage.getItem('green_users')
            const stored = raw ? JSON.parse(raw) : null
            if (stored && Array.isArray(stored)) {
              const merged = stored.map(u => {
                const p = data.userProfiles.find(x => x.id === u.id)
                return p ? { ...u, idNumber: p.idNumber || u.idNumber, license: p.license || u.license } : u
              })
              localStorage.setItem('green_users', JSON.stringify(merged))
            }
          } catch { /* ignore */ }
        }
        setImportMsg('ההגדרות נטענו בהצלחה ✓')
        setImportError(null)
        setTimeout(() => setImportMsg(null), 4000)
      } catch {
        setImportError('קובץ לא תקין')
        setTimeout(() => setImportError(null), 4000)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleBlankDownload = async (form) => {
    setDownloading(form.id)
    try {
      const generator = BLANK_GENERATORS[form.generator]
      const result = await generator()
      const a = document.createElement('a')
      a.href = result.url
      a.download = result.fileName
      a.click()
      URL.revokeObjectURL(result.url)
    } catch (err) {
      console.error('Error generating blank form:', err)
    }
    setDownloading(null)
  }

  if (showBlankForms) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-full max-w-md">
          <h2 className="text-xl font-extrabold text-green-primary text-center mb-2">
            טפסים להדפסה ידנית
          </h2>
          <p className="text-sm text-text-muted text-center mb-8">
            הורדת טפסים ריקים למילוי ידני
          </p>

          <div className="space-y-3 mb-8">
            {BLANK_FORMS.map((form) => (
              <button
                key={form.id}
                onClick={() => handleBlankDownload(form)}
                disabled={downloading === form.id}
                className="w-full bg-white rounded-card shadow-card border border-border/50 p-4 text-right hover:border-gold hover:shadow-metric transition-all group disabled:opacity-60"
              >
                <div className="flex items-center justify-between flex-row-reverse">
                  <span className="text-sm font-bold text-green-primary group-hover:text-green-secondary transition-colors">
                    {form.name}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-surface-cream border border-border/50 flex items-center justify-center text-gold">
                    {downloading === form.id ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowBlankForms(false)}
            className="w-full py-3 border-2 border-green-primary text-green-primary font-bold rounded-card hover:bg-green-primary hover:text-white transition-all text-sm"
          >
            חזרה
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <h2 className="text-xl font-extrabold text-green-primary text-center mb-2">
          בחירת משווק
        </h2>
        <p className="text-sm text-text-muted text-center mb-8">
          מי מנהל את הפגישה?
        </p>

        <div className="space-y-3">
          {advisors.map((advisor) => (
            <button
              key={advisor.id}
              onClick={() => onSelect(advisor)}
              className="w-full bg-white rounded-card shadow-card border border-border/50 p-5 text-right hover:border-gold hover:shadow-metric transition-all group"
            >
              <div className="flex items-center justify-between flex-row-reverse">
                <div>
                  <span className="text-base font-bold text-green-primary group-hover:text-green-secondary transition-colors">
                    {advisor.name}
                  </span>
                  {advisor.license && (
                    <span className="block text-xs text-text-muted mt-0.5">
                      רישיון: {advisor.license}
                    </span>
                  )}
                </div>
                <div className="w-10 h-10 rounded-full bg-surface-cream border border-border/50 flex items-center justify-center text-gold font-bold text-lg">
                  {advisor.name.charAt(0)}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Blank forms + import settings */}
        <div className="mt-10 pt-6 border-t border-border/50 flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={() => setShowBlankForms(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface-cream border-2 border-gold/60 text-green-primary font-bold rounded-card hover:bg-gold/10 hover:border-gold transition-all text-sm shadow-card"
          >
            <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18.25 7.034V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659" />
            </svg>
            טפסים להדפסה ידנית
          </button>

          <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-surface-cream border-2 border-border text-text-muted font-bold rounded-card hover:border-green-secondary hover:text-green-primary transition-all text-sm shadow-card">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            ייבא הגדרות
            <input type="file" accept=".json" className="hidden" onChange={handleImportSettings} />
          </label>
        </div>

        {/* Import feedback */}
        {(importMsg || importError) && (
          <div className={`mt-3 text-center text-sm font-semibold ${importMsg ? 'text-positive' : 'text-warning-red'}`}>
            {importMsg || importError}
          </div>
        )}
      </div>
    </div>
  )
}
