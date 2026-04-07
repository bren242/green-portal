import { useState } from 'react'
import WizardHeader from '../wizard/WizardHeader'
import { generateMeetingSummaryStyled } from '../pdf/generateMeetingSummary'

const TOPIC_LABELS = [
  'שינויים בפרטים אישיים',
  'שינויים בהכנסות/הוצאות',
  'שינויים בנכסים/התחייבויות',
  'שינוי במטרות ההשקעה',
  'שינוי ביחס לסיכון',
  'אחר',
]

export default function MeetingSummaryModule({ user, session, onLogout, onAdmin, onSavePDF, onComplete, onBack }) {
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  // Form state
  const [meetingReason, setMeetingReason] = useState('')
  const [meetingType, setMeetingType] = useState('')
  const [meetingInitiator, setMeetingInitiator] = useState('')
  const [initiatorOther, setInitiatorOther] = useState('')
  const [meetingDuration, setMeetingDuration] = useState('')
  const [topics, setTopics] = useState(Array(6).fill(null)) // null | 'yes' | 'no'
  const [summary, setSummary] = useState('')
  const [recommendation, setRecommendation] = useState('')
  const [conflictOfInterest, setConflictOfInterest] = useState(false)
  const [decision, setDecision] = useState('')
  const [tasks, setTasks] = useState('')

  // Contact update popup
  const [showContactPopup, setShowContactPopup] = useState(false)
  const [contactAddress, setContactAddress] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactMobile, setContactMobile] = useState('')
  const [contactDraft, setContactDraft] = useState({ address: '', phone: '', email: '', mobile: '' })

  const setTopic = (idx, val) => {
    setTopics((prev) => {
      const next = [...prev]
      next[idx] = next[idx] === val ? null : val
      return next
    })
    // Open contact popup when "שינויים בפרטים אישיים" is checked yes
    if (idx === 0 && val === 'yes') {
      setContactDraft({ address: contactAddress, phone: contactPhone, email: contactEmail, mobile: contactMobile })
      setShowContactPopup(true)
    }
  }

  const handleContactSave = () => {
    setContactAddress(contactDraft.address)
    setContactPhone(contactDraft.phone)
    setContactEmail(contactDraft.email)
    setContactMobile(contactDraft.mobile)
    setShowContactPopup(false)
  }

  const handleContactClose = () => {
    setShowContactPopup(false)
  }

  const buildMeetingData = () => ({
    clientName: session.clientA?.fullName || '',
    clientId: session.clientA?.idNumber || '',
    advisorName: session.advisor?.name || '',
    advisorId: session.advisor?.idNumber || '',
    advisorLicense: session.advisor?.license || '',
    address: contactAddress || '',
    phone: contactPhone || '',
    email: contactEmail || '',
    mobile: contactMobile || '',
    meetingReason,
    meetingType,
    meetingInitiator,
    initiatorOther,
    meetingDuration,
    topics,
    summary,
    recommendation,
    conflictOfInterest,
    decision,
    tasks,
  })

  const handleGenerate = async () => {
    const missing = []
    if (!meetingReason) missing.push('סיבת הפגישה')
    if (!meetingType) missing.push('אופן הפגישה')
    if (!meetingInitiator) missing.push('יוזם הפגישה')
    if (!meetingDuration) missing.push('משך הפגישה')
    // First 5 topics (not "אחר") must have yes/no
    const requiredTopics = topics.slice(0, 5)
    if (requiredTopics.some(t => t === null)) missing.push('יש לסמן כן/לא בכל הנושאים (חוץ מאחר)')
    if (missing.length > 0) {
      setError(`שדות חובה חסרים: ${missing.join(', ')}`)
      return
    }

    setGenerating(true)
    setError(null)
    try {
      const data = buildMeetingData()
      const res = await generateMeetingSummaryStyled(data)
      setResult(res)
    } catch (err) {
      console.error('Error generating meeting summary:', err)
      setError('שגיאה ביצירת סיכום הפגישה')
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

  const RadioBtn = ({ name, value, current, onChange, label }) => (
    <label className="flex items-center gap-1.5 cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={current === value}
        onChange={() => onChange(value)}
        className="accent-green-primary w-3.5 h-3.5"
      />
      <span className="text-sm text-text-primary">{label}</span>
    </label>
  )

  if (result) {
    return (
      <div className="min-h-screen bg-surface-offwhite">
        <WizardHeader user={user} onLogout={onLogout} onAdmin={onAdmin} />
        <div className="max-w-2xl mx-auto px-4 py-5">
          <button onClick={onBack} className="text-sm text-text-muted hover:text-green-primary transition-colors mb-4">
            ← חזרה למודולים
          </button>
          <div className="bg-white rounded-card shadow-card border border-border/50 p-6 md:p-8">
            <h2 className="text-lg font-extrabold text-green-primary mb-1">סיכום פגישה</h2>
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

  return (
    <div className="min-h-screen bg-surface-offwhite">
      {showContactPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-card shadow-metric w-full max-w-md p-6" dir="rtl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-extrabold text-green-primary">עדכון פרטי התקשרות</h3>
              <div className="h-0.5 flex-1 mx-4 bg-gold/40 rounded-full" />
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">כתובת</label>
                <input
                  type="text"
                  value={contactDraft.address}
                  onChange={(e) => setContactDraft(d => ({ ...d, address: e.target.value }))}
                  autoComplete="off"
                  placeholder="רחוב, עיר..."
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-green-secondary focus:ring-1 focus:ring-green-secondary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">טלפון</label>
                <input
                  type="tel"
                  value={contactDraft.phone}
                  onChange={(e) => setContactDraft(d => ({ ...d, phone: e.target.value }))}
                  autoComplete="off"
                  placeholder="03-..."
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-green-secondary focus:ring-1 focus:ring-green-secondary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">סלולרי</label>
                <input
                  type="tel"
                  value={contactDraft.mobile}
                  onChange={(e) => setContactDraft(d => ({ ...d, mobile: e.target.value }))}
                  autoComplete="off"
                  placeholder="05..."
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-green-secondary focus:ring-1 focus:ring-green-secondary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">אימייל</label>
                <input
                  type="text"
                  value={contactDraft.email}
                  onChange={(e) => setContactDraft(d => ({ ...d, email: e.target.value }))}
                  autoComplete="off"
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-green-secondary focus:ring-1 focus:ring-green-secondary"
                />
              </div>
            </div>
            <p className="text-xs text-text-muted mt-3">רק שדות שמולאו יופיעו ב-PDF</p>
            <div className="flex gap-3 mt-5">
              <button
                onClick={handleContactSave}
                className="flex-1 py-2.5 bg-green-primary text-white rounded-card text-sm font-bold hover:bg-green-secondary transition-colors shadow-card"
              >
                שמור
              </button>
              <button
                onClick={handleContactClose}
                className="flex-1 py-2.5 border border-border text-text-muted rounded-card text-sm font-bold hover:border-green-primary hover:text-green-primary transition-colors"
              >
                סגור
              </button>
            </div>
          </div>
        </div>
      )}
      <WizardHeader user={user} onLogout={onLogout} onAdmin={onAdmin} />
      <div className="max-w-2xl mx-auto px-4 py-5">
        <button onClick={onBack} className="text-sm text-text-muted hover:text-green-primary transition-colors mb-4">
          ← חזרה למודולים
        </button>

        <div className="bg-white rounded-card shadow-card border border-border/50 p-6 md:p-8">
          <h2 className="text-lg font-extrabold text-green-primary mb-1">סיכום פגישה</h2>
          <p className="text-sm text-text-muted mb-6">מילוי פרטי הפגישה והפקת סיכום</p>
          <div className="h-[2px] bg-gold/30 mb-6 rounded-full" />

          {/* Client summary */}
          <div className="bg-surface-cream rounded-card border border-border/50 p-4 mb-6" dir="rtl">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-text-muted text-xs block">לקוח</span>
                <span className="font-semibold text-text-primary">{session.clientA?.fullName}</span>
              </div>
              <div>
                <span className="text-text-muted text-xs block">משווק</span>
                <span className="font-semibold text-text-primary">{session.advisor?.name}</span>
              </div>
            </div>
          </div>

          {/* Meeting meta */}
          <div className="space-y-4 mb-6" dir="rtl">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">סיבת הפגישה</label>
              <div className="flex flex-wrap gap-4">
                <RadioBtn name="reason" value="periodic" current={meetingReason} onChange={setMeetingReason} label="תקופתית" />
                <RadioBtn name="reason" value="client_request" current={meetingReason} onChange={setMeetingReason} label="בקשת לקוח" />
                <RadioBtn name="reason" value="advisor_request" current={meetingReason} onChange={setMeetingReason} label="יוזמת משווק" />
                <RadioBtn name="reason" value="other" current={meetingReason} onChange={setMeetingReason} label="אחר" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">אופן הפגישה</label>
              <div className="flex flex-wrap gap-4">
                <RadioBtn name="type" value="in_person" current={meetingType} onChange={setMeetingType} label="פרונטלית" />
                <RadioBtn name="type" value="phone" current={meetingType} onChange={setMeetingType} label="טלפונית" />
                <RadioBtn name="type" value="video" current={meetingType} onChange={setMeetingType} label="וידאו" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">יוזם הפגישה</label>
              <div className="flex flex-wrap gap-4">
                <RadioBtn name="init" value="client" current={meetingInitiator} onChange={setMeetingInitiator} label="לקוח" />
                <RadioBtn name="init" value="advisor" current={meetingInitiator} onChange={setMeetingInitiator} label="משווק" />
                <RadioBtn name="init" value="other" current={meetingInitiator} onChange={setMeetingInitiator} label="אחר" />
              </div>
              {meetingInitiator === 'other' && (
                <input
                  type="text"
                  value={initiatorOther}
                  onChange={(e) => setInitiatorOther(e.target.value)}
                  placeholder="פירוט"
                  autoComplete="off"
                  className="mt-2 w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-green-secondary focus:ring-1 focus:ring-green-secondary"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1">משך הפגישה (דקות)</label>
              <input
                type="number"
                min="0"
                value={meetingDuration}
                onChange={(e) => setMeetingDuration(e.target.value)}
                autoComplete="off"
                className="w-32 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-green-secondary focus:ring-1 focus:ring-green-secondary"
              />
            </div>
          </div>

          {/* Topics table */}
          <div className="mb-6" dir="rtl">
            <label className="block text-sm font-semibold text-text-primary mb-3">נושאים שנדונו</label>
            <div className="border border-border rounded-lg overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-[1fr_auto_auto] bg-green-primary text-white text-xs font-bold">
                <div className="py-2 px-3">נושא</div>
                <div className="py-2 px-3 w-14 text-center">כן</div>
                <div className="py-2 px-3 w-14 text-center">לא</div>
              </div>
              {TOPIC_LABELS.map((label, i) => (
                <div key={i} className={`grid grid-cols-[1fr_auto_auto] border-t border-border/50 ${i % 2 === 0 ? 'bg-surface-light' : ''}`}>
                  <div className="py-2.5 px-3 text-sm text-text-primary flex items-center gap-2">
                    {label}
                    {i === 0 && topics[0] === 'yes' && (
                      <button
                        type="button"
                        onClick={() => {
                          setContactDraft({ address: contactAddress, phone: contactPhone, email: contactEmail, mobile: contactMobile })
                          setShowContactPopup(true)
                        }}
                        className="text-xs text-gold hover:text-gold/70 font-semibold underline underline-offset-2 transition-colors"
                      >
                        {contactAddress || contactPhone || contactEmail || contactMobile ? 'ערוך פרטים' : 'הוסף פרטים'}
                      </button>
                    )}
                  </div>
                  <div className="py-2.5 px-3 w-14 flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={topics[i] === 'yes'}
                      onChange={() => setTopic(i, 'yes')}
                      className="accent-green-primary w-4 h-4"
                    />
                  </div>
                  <div className="py-2.5 px-3 w-14 flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={topics[i] === 'no'}
                      onChange={() => setTopic(i, 'no')}
                      className="accent-green-primary w-4 h-4"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Text areas */}
          <div className="space-y-4 mb-6" dir="rtl">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1">סיכום הפגישה</label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={4}
                autoComplete="off"
                placeholder="סיכום תוכן הפגישה..."
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-green-secondary focus:ring-1 focus:ring-green-secondary resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1">המלצת המשווק</label>
              <textarea
                value={recommendation}
                onChange={(e) => setRecommendation(e.target.value)}
                rows={3}
                autoComplete="off"
                placeholder="המלצות מקצועיות..."
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-green-secondary focus:ring-1 focus:ring-green-secondary resize-none"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={conflictOfInterest}
                  onChange={(e) => setConflictOfInterest(e.target.checked)}
                  className="accent-green-primary w-4 h-4"
                />
                <span className="text-sm text-text-primary">הובהר ללקוח ניגוד עניינים אפשרי</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1">החלטה</label>
              <textarea
                value={decision}
                onChange={(e) => setDecision(e.target.value)}
                rows={2}
                autoComplete="off"
                placeholder="החלטות שהתקבלו..."
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-green-secondary focus:ring-1 focus:ring-green-secondary resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1">משימות להמשך</label>
              <textarea
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
                rows={2}
                autoComplete="off"
                placeholder="משימות לטיפול..."
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-green-secondary focus:ring-1 focus:ring-green-secondary resize-none"
              />
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
            {generating ? 'מפיק סיכום...' : 'הפק סיכום פגישה'}
          </button>
        </div>
      </div>
    </div>
  )
}
