import { useState } from 'react'
import { ALL_MODULES, BLANK_FORMS } from '../../data/advisors'
import { generateBlankPDF } from '../pdf/generateBlankPDF'
import { generateMarketingAgreementBlank } from '../pdf/generateMarketingAgreement'
import { generateMeetingSummaryBlank } from '../pdf/generateMeetingSummary'
import { generateQualifiedInvestorBlank } from '../pdf/generateQualifiedInvestor'
import { generateQualifiedAdvisorBlank } from '../pdf/generateQualifiedAdvisor'
import { mergeSessionPDFs, pathSupportsKit, getKitModuleOrder } from '../../utils/mergePDFs'

const MODULE_ICONS = {
  agreement: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  kyc: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
    </svg>
  ),
  qualified: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
  qualifiedAdvisor: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
    </svg>
  ),
  meeting: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
    </svg>
  ),
}

const BLANK_GENERATORS = {
  generateBlankPDF,
  generateMarketingAgreementBlank,
  generateMeetingSummaryBlank,
  generateQualifiedInvestorBlank,
  generateQualifiedAdvisorBlank,
}

export default function ModuleSelection({ session, onModuleStart, onUpdateModules, onEndSession }) {
  const [showAddModule, setShowAddModule] = useState(false)
  const [downloading, setDownloading] = useState(null)
  const [mergingKit, setMergingKit] = useState(false)

  const { modules, completedModules, completedPDFs } = session

  // Modules not yet in the session list
  const availableToAdd = ALL_MODULES.filter(
    (m) => !modules.some((sm) => sm.id === m.id)
  )

  const handleAddModule = (mod) => {
    onUpdateModules([...modules, { ...mod, status: 'pending' }])
    setShowAddModule(false)
  }

  const handleRemoveModule = (moduleId) => {
    onUpdateModules(modules.filter((m) => m.id !== moduleId))
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

  const handleModulePDFDownload = (moduleId) => {
    const entry = completedPDFs.find((p) => p.moduleId === moduleId)
    if (!entry) return
    const blob = new Blob([entry.pdfBytes], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = entry.fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDownloadKit = async () => {
    setMergingKit(true)
    try {
      const result = await mergeSessionPDFs(completedPDFs, session.path, session.clientA.fullName)
      const a = document.createElement('a')
      a.href = result.url
      a.download = result.fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(result.url)
    } catch (err) {
      console.error('Error merging PDFs:', err)
    }
    setMergingKit(false)
  }

  const allCompleted = modules.length > 0 && modules.every((m) => completedModules.includes(m.id))

  // Kit availability: path supports it + all kit modules are completed with PDFs
  const supportsKit = pathSupportsKit(session.path)
  const kitModules = getKitModuleOrder(session.path)
  const kitReady = supportsKit && kitModules.every((id) => completedPDFs.some((p) => p.moduleId === id))

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header with client info */}
      <div className="bg-white rounded-card shadow-card border border-border/50 p-5 mb-5" dir="rtl">
        <div className="flex items-center justify-between">
          <div className="text-right">
            <h2 className="text-lg font-extrabold text-green-primary">
              {session.clientA.fullName || 'לקוח'}
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              {session.clientA.idNumber && `ת.ז ${session.clientA.idNumber}`}
              {session.signerType === 'couple' && session.clientB.fullName && ` · ${session.clientB.fullName}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-pill bg-surface-cream border border-border/50 text-text-muted font-medium">
              {session.advisor?.name}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-pill bg-green-primary/10 text-green-primary font-semibold">
              {session.clientType === 'new' ? 'חדש' : 'קיים'}
              {session.clientSubType === 'qualified' && ' · כשיר'}
              {session.clientSubType === 'fund' && ' · קרן'}
            </span>
          </div>
        </div>
      </div>

      {/* Module list */}
      <h3 className="text-base font-bold text-green-primary mb-3">מודולים לפגישה זו</h3>
      <div className="space-y-3 mb-6">
        {modules.map((mod) => {
          const isCompleted = completedModules.includes(mod.id)
          const isAvailable = mod.id === 'kyc' || mod.id === 'agreement' || mod.id === 'meeting' || mod.id === 'qualified' || mod.id === 'qualifiedAdvisor'
          const isFuture = !isAvailable

          return (
            <div
              key={mod.id}
              className={`bg-white rounded-card shadow-card border p-4 flex items-center justify-between flex-row-reverse transition-all ${
                isCompleted ? 'border-positive/30 bg-positive/5' : 'border-border/50'
              }`}
            >
              <div className="flex items-center gap-3 flex-row-reverse">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                  isCompleted ? 'bg-positive/15 text-positive' : 'bg-surface-cream text-green-primary'
                }`}>
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : (
                    MODULE_ICONS[mod.id] || MODULE_ICONS.meeting
                  )}
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-text-primary">{mod.name}</span>
                  {isCompleted && <span className="block text-xs text-positive font-medium">הושלם</span>}
                  {isFuture && <span className="block text-xs text-text-muted">בפיתוח</span>}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!isCompleted && isAvailable && (
                  <button
                    onClick={() => onModuleStart(mod.id)}
                    className="px-4 py-1.5 bg-green-primary text-white rounded-card text-xs font-bold hover:bg-green-secondary transition-colors"
                  >
                    התחל
                  </button>
                )}
                {isCompleted && isAvailable && (
                  <>
                    {completedPDFs.some((p) => p.moduleId === mod.id) && (
                      <button
                        onClick={() => handleModulePDFDownload(mod.id)}
                        className="w-8 h-8 flex items-center justify-center text-green-primary hover:bg-green-primary/10 rounded-full transition-colors"
                        title="הורד PDF"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={() => onModuleStart(mod.id)}
                      className="px-4 py-1.5 border border-green-primary text-green-primary rounded-card text-xs font-semibold hover:bg-green-primary/5 transition-colors"
                    >
                      ערוך מחדש
                    </button>
                  </>
                )}
                {isFuture && (
                  <span className="px-3 py-1.5 bg-surface-light text-text-muted rounded-card text-xs font-medium border border-border/50">
                    בקרוב
                  </span>
                )}
                {!completedModules.includes(mod.id) && (
                  <button
                    onClick={() => handleRemoveModule(mod.id)}
                    className="w-7 h-7 flex items-center justify-center text-text-muted hover:text-negative transition-colors rounded-full hover:bg-warning-bg"
                    title="הסר מודול"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Add module */}
      {availableToAdd.length > 0 && (
        <div className="mb-6">
          {!showAddModule ? (
            <button
              onClick={() => setShowAddModule(true)}
              className="w-full py-3 border-2 border-dashed border-border rounded-card text-sm font-semibold text-text-muted hover:border-gold hover:text-gold transition-colors"
            >
              + הוסף מודול
            </button>
          ) : (
            <div className="bg-surface-cream rounded-card border border-border/50 p-4">
              <div className="flex items-center justify-between mb-3 flex-row-reverse">
                <span className="text-sm font-bold text-green-primary">בחר מודול להוספה</span>
                <button
                  onClick={() => setShowAddModule(false)}
                  className="text-xs text-text-muted hover:text-text-primary"
                >
                  ביטול
                </button>
              </div>
              <div className="space-y-2">
                {availableToAdd.map((mod) => (
                  <button
                    key={mod.id}
                    onClick={() => handleAddModule(mod)}
                    className="w-full bg-white rounded-lg border border-border/50 p-3 text-right text-sm font-medium text-text-primary hover:border-gold transition-colors"
                  >
                    {mod.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Full kit download */}
      {kitReady && (
        <button
          onClick={handleDownloadKit}
          disabled={mergingKit}
          className="w-full py-3.5 rounded-card text-sm font-bold transition-colors shadow-card mb-6 disabled:opacity-50"
          style={{ backgroundColor: '#B8975A', color: '#fff' }}
        >
          {mergingKit ? 'ממזג מסמכים...' : 'הורד קיט מלא'}
        </button>
      )}

      {/* Divider */}
      <div className="h-px bg-border/50 my-6" />

      {/* Blank forms section */}
      <h3 className="text-base font-bold text-green-primary mb-3">טפסים ידניים להדפסה</h3>
      <div className="grid grid-cols-2 gap-3 mb-8">
        {BLANK_FORMS.map((form) => (
          <button
            key={form.id}
            onClick={() => handleBlankDownload(form)}
            disabled={downloading === form.id}
            className="bg-white rounded-card shadow-card border border-border/50 p-4 text-center hover:border-gold hover:shadow-metric transition-all disabled:opacity-50"
          >
            <svg className="w-6 h-6 mx-auto mb-2 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            <span className="text-sm font-semibold text-text-primary block">
              {downloading === form.id ? 'מוריד...' : form.name}
            </span>
          </button>
        ))}
      </div>

      {/* End session */}
      <div className="text-center pb-8">
        <button
          onClick={onEndSession}
          className={`px-8 py-3 rounded-card text-sm font-bold transition-colors shadow-card ${
            allCompleted
              ? 'bg-green-primary text-white hover:bg-green-secondary'
              : 'bg-surface-light text-text-muted border border-border hover:bg-warning-bg hover:text-warning-red hover:border-warning-border'
          }`}
        >
          {allCompleted ? 'סיים סשן ✓' : 'סיים סשן'}
        </button>
      </div>
    </div>
  )
}
