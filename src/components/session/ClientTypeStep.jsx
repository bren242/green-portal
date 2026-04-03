export default function ClientTypeStep({ session, onUpdate, onNext, onBack }) {
  const { clientType, clientSubType } = session

  const handleClientType = (type) => {
    onUpdate({ clientType: type, clientSubType: '' })
  }

  const handleSubType = (subType) => {
    const path = `${clientType}_${subType}`
    onUpdate({ clientSubType: subType, path })
    onNext()
  }

  // Step 1: New or existing?
  if (!clientType) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-full max-w-md">
          <h2 className="text-xl font-extrabold text-green-primary text-center mb-2">
            סוג לקוח
          </h2>
          <p className="text-sm text-text-muted text-center mb-8">
            לקוח חדש או קיים?
          </p>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleClientType('new')}
              className="bg-white rounded-card shadow-card border border-border/50 p-6 text-center hover:border-gold hover:shadow-metric transition-all group"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-primary/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <span className="text-base font-bold text-green-primary">לקוח חדש</span>
            </button>

            <button
              onClick={() => handleClientType('existing')}
              className="bg-white rounded-card shadow-card border border-border/50 p-6 text-center hover:border-gold hover:shadow-metric transition-all group"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gold/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-base font-bold text-green-primary">לקוח קיים</span>
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={onBack}
              className="text-sm text-text-muted hover:text-green-primary transition-colors"
            >
              ← חזרה לבחירת משווק
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Step 2: Sub-type based on client type
  if (clientType === 'new') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-full max-w-md">
          <h2 className="text-xl font-extrabold text-green-primary text-center mb-2">
            סיווג לקוח חדש
          </h2>
          <p className="text-sm text-text-muted text-center mb-8">
            האם הלקוח כשיר?
          </p>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleSubType('regular')}
              className="bg-white rounded-card shadow-card border border-border/50 p-6 text-center hover:border-gold hover:shadow-metric transition-all"
            >
              <span className="text-base font-bold text-green-primary block mb-1">לא כשיר</span>
              <span className="text-xs text-text-muted">לקוח רגיל</span>
            </button>

            <button
              onClick={() => handleSubType('qualified')}
              className="bg-white rounded-card shadow-card border border-border/50 p-6 text-center hover:border-gold hover:shadow-metric transition-all"
            >
              <span className="text-base font-bold text-green-primary block mb-1">לקוח כשיר</span>
              <span className="text-xs text-text-muted">נכסים מעל הסף</span>
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => onUpdate({ clientType: '', clientSubType: '' })}
              className="text-sm text-text-muted hover:text-green-primary transition-colors"
            >
              ← חזרה
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Existing client sub-type
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <h2 className="text-xl font-extrabold text-green-primary text-center mb-2">
          סוג פגישה
        </h2>
        <p className="text-sm text-text-muted text-center mb-8">
          מה אופי הפגישה?
        </p>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleSubType('regular')}
            className="bg-white rounded-card shadow-card border border-border/50 p-6 text-center hover:border-gold hover:shadow-metric transition-all"
          >
            <span className="text-base font-bold text-green-primary block mb-1">פגישה רגילה</span>
            <span className="text-xs text-text-muted">מעקב שוטף</span>
          </button>

          <button
            onClick={() => handleSubType('fund')}
            className="bg-white rounded-card shadow-card border border-border/50 p-6 text-center hover:border-gold hover:shadow-metric transition-all"
          >
            <span className="text-base font-bold text-green-primary block mb-1">קרן השקעה</span>
            <span className="text-xs text-text-muted">דורש הצהרת כשירות</span>
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => onUpdate({ clientType: '', clientSubType: '' })}
            className="text-sm text-text-muted hover:text-green-primary transition-colors"
          >
            ← חזרה
          </button>
        </div>
      </div>
    </div>
  )
}
