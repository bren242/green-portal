import { useState } from 'react'

export default function ClientDetailsStep({ session, onUpdate, onNext, onBack }) {
  const [errors, setErrors] = useState([])
  const isNew = session.clientType === 'new'

  const handleSignerType = (type) => {
    onUpdate({ signerType: type })
  }

  const updateClient = (key, field, value) => {
    onUpdate({
      [key]: { ...session[key], [field]: value },
    })
    if (errors.length > 0) setErrors([])
  }

  const validate = () => {
    const errs = []
    if (!session.signerType) {
      errs.push('נא לבחור יחיד או זוג')
      return errs
    }

    // Client A — always required
    if (!session.clientA.fullName) errs.push('נא למלא שם מלא')
    if (!session.clientA.idNumber) errs.push('נא למלא תעודת זהות')

    if (isNew) {
      if (!session.clientA.phone) errs.push('נא למלא טלפון')
      if (!session.clientA.email) errs.push('נא למלא דוא״ל')
    }

    // Client B — only if couple
    if (session.signerType === 'couple') {
      if (!session.clientB.fullName) errs.push('נא למלא שם מלא (לקוח ב׳)')
      if (!session.clientB.idNumber) errs.push('נא למלא ת.ז (לקוח ב׳)')
      if (isNew) {
        if (!session.clientB.phone) errs.push('נא למלא טלפון (לקוח ב׳)')
        if (!session.clientB.email) errs.push('נא למלא דוא״ל (לקוח ב׳)')
      }
    }

    return errs
  }

  const handleNext = () => {
    const errs = validate()
    if (errs.length > 0) {
      setErrors(errs)
      window.scrollTo(0, 0)
      return
    }
    onNext()
  }

  const renderClientFields = (clientKey, label) => {
    const client = session[clientKey]
    return (
      <div className="space-y-4">
        {label && (
          <h4 className="text-sm font-bold text-gold border-b border-border/50 pb-2 mb-3">{label}</h4>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1">שם מלא *</label>
            <input
              type="text"
              value={client.fullName}
              onChange={(e) => updateClient(clientKey, 'fullName', e.target.value)}
              autoComplete="off"
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-green-secondary focus:ring-1 focus:ring-green-secondary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-1">תעודת זהות *</label>
            <input
              type="text"
              inputMode="numeric"
              value={client.idNumber}
              onChange={(e) => {
                const v = e.target.value
                if (v !== '' && !/^\d*$/.test(v)) return
                updateClient(clientKey, 'idNumber', v)
              }}
              autoComplete="off"
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-green-secondary focus:ring-1 focus:ring-green-secondary"
            />
          </div>
        </div>

        {isNew && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1">תאריך לידה</label>
                <input
                  type="date"
                  value={client.birthDate}
                  onChange={(e) => updateClient(clientKey, 'birthDate', e.target.value)}
                  autoComplete="off"
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-green-secondary focus:ring-1 focus:ring-green-secondary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1">מצב משפחתי</label>
                <select
                  value={client.maritalStatus}
                  onChange={(e) => updateClient(clientKey, 'maritalStatus', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-green-secondary focus:ring-1 focus:ring-green-secondary bg-white"
                >
                  <option value="">בחר</option>
                  <option value="single">רווק/ה</option>
                  <option value="married">נשוי/אה</option>
                  <option value="divorced">גרוש/ה</option>
                  <option value="widowed">אלמן/ה</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1">טלפון סלולרי *</label>
                <input
                  type="tel"
                  value={client.phone}
                  onChange={(e) => updateClient(clientKey, 'phone', e.target.value)}
                  autoComplete="off"
                  dir="ltr"
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-green-secondary focus:ring-1 focus:ring-green-secondary text-left"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1">דוא״ל *</label>
                <input
                  type="email"
                  value={client.email}
                  onChange={(e) => updateClient(clientKey, 'email', e.target.value)}
                  autoComplete="off"
                  dir="ltr"
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-green-secondary focus:ring-1 focus:ring-green-secondary text-left"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1">כתובת</label>
              <input
                type="text"
                value={client.address}
                onChange={(e) => updateClient(clientKey, 'address', e.target.value)}
                autoComplete="off"
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-green-secondary focus:ring-1 focus:ring-green-secondary"
                placeholder="רחוב, עיר"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1">עיסוק</label>
                <input
                  type="text"
                  value={client.occupation}
                  onChange={(e) => updateClient(clientKey, 'occupation', e.target.value)}
                  autoComplete="off"
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-green-secondary focus:ring-1 focus:ring-green-secondary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1">נפשות תלויות</label>
                <input
                  type="number"
                  min="0"
                  value={client.dependents}
                  onChange={(e) => updateClient(clientKey, 'dependents', e.target.value)}
                  autoComplete="off"
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-green-secondary focus:ring-1 focus:ring-green-secondary"
                />
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-extrabold text-green-primary text-center mb-2">
        פרטי לקוח
      </h2>
      <p className="text-sm text-text-muted text-center mb-6">
        {isNew ? 'פרטים מלאים ללקוח חדש' : 'פרטים מזהים ללקוח קיים'}
      </p>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="bg-warning-bg border border-warning-border rounded-card p-4 mb-5">
          <ul className="text-sm text-warning-red space-y-1">
            {errors.map((err, i) => (
              <li key={i}>• {err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Single / Couple selector */}
      <div className="bg-white rounded-card shadow-card border border-border/50 p-6 mb-5">
        <label className="block text-sm font-bold text-green-primary mb-3">מי חותם?</label>
        <div className="flex gap-3">
          <button
            onClick={() => handleSignerType('single')}
            className={`flex-1 py-3 rounded-card text-sm font-bold border transition-all ${
              session.signerType === 'single'
                ? 'bg-green-primary text-white border-green-primary shadow-card'
                : 'bg-white text-text-primary border-border hover:border-gold'
            }`}
          >
            יחיד
          </button>
          <button
            onClick={() => handleSignerType('couple')}
            className={`flex-1 py-3 rounded-card text-sm font-bold border transition-all ${
              session.signerType === 'couple'
                ? 'bg-green-primary text-white border-green-primary shadow-card'
                : 'bg-white text-text-primary border-border hover:border-gold'
            }`}
          >
            זוג
          </button>
        </div>
      </div>

      {/* Client A */}
      {session.signerType && (
        <div className="bg-white rounded-card shadow-card border border-border/50 p-6 mb-5">
          {renderClientFields(
            'clientA',
            session.signerType === 'couple' ? 'לקוח א׳' : null
          )}
        </div>
      )}

      {/* Client B — only for couple */}
      {session.signerType === 'couple' && (
        <div className="bg-white rounded-card shadow-card border border-border/50 p-6 mb-5">
          {renderClientFields('clientB', 'לקוח ב׳')}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-6 py-2.5 border border-border rounded-card text-sm font-semibold text-text-primary hover:bg-surface-light transition-colors shadow-sm"
        >
          הקודם
        </button>
        <button
          onClick={handleNext}
          className="px-8 py-2.5 bg-green-primary text-white rounded-card text-sm font-bold hover:bg-green-secondary transition-colors shadow-card"
        >
          הבא
        </button>
      </div>
    </div>
  )
}
