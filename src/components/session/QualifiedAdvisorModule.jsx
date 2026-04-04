import { useState } from 'react'
import WizardHeader from '../wizard/WizardHeader'
import { generateQualifiedAdvisorStyled } from '../pdf/generateQualifiedAdvisor'

export default function QualifiedAdvisorModule({ user, session, onLogout, onAdmin, onSavePDF, onComplete, onBack }) {
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [step, setStep] = useState('conditions') // 'conditions' | 'questionnaire' | null

  // Conditions state
  const [conditions, setConditions] = useState({
    condition1: false,
    condition2: false,
    condition3: false,
  })
  const [condition2Role, setCondition2Role] = useState(null)
  const [condition2Other, setCondition2Other] = useState('')
  const [experienceDetails, setExperienceDetails] = useState('')

  // Extended questionnaire state
  const [q1_assets, setQ1Assets] = useState('')
  const [q2_role, setQ2Role] = useState(null)
  const [q2_otherText, setQ2OtherText] = useState('')
  const [q3_years, setQ3Years] = useState('')
  const [q4, setQ4] = useState({ economics: '', accounting: '', finance: '', math: '', other: '' })
  const [q5, setQ5] = useState({ instrument1: '', instrument2: '' })
  const [q6, setQ6] = useState({
    electronic_daily: false, electronic_weekly: false, electronic_yearly: false,
    press_daily: false, press_weekly: false, press_yearly: false,
  })
  const [q7_initiative, setQ7Initiative] = useState(null)
  const [q8_understanding, setQ8Understanding] = useState(null)
  const [additionalNotes, setAdditionalNotes] = useState('')

  const selectedCount = [conditions.condition1, conditions.condition2, conditions.condition3].filter(Boolean).length
  const needsExtended = conditions.condition2 && condition2Role === 'other'

  const handleConditionsDone = () => {
    if (selectedCount < 2) {
      setError('יש לבחור לפחות 2 תנאים מתוך 3')
      return
    }
    if (conditions.condition2 && !condition2Role) {
      setError('יש לבחור תפקיד בתנאי (2)')
      return
    }
    setError(null)
    if (needsExtended) {
      setStep('questionnaire')
    } else {
      handleGenerate()
    }
  }

  const buildData = () => ({
    clientName: session.clientA?.fullName || '',
    clientId: session.clientA?.idNumber || '',
    advisorName: session.advisor?.name || '',
    condition1: conditions.condition1,
    condition2: conditions.condition2,
    condition3: conditions.condition3,
    condition2Role,
    condition2Other,
    experienceDetails,
    // Extended questionnaire
    q1_assets,
    q2_role: q2_role,
    q2_otherText,
    q3_years,
    q4_economics: q4.economics,
    q4_accounting: q4.accounting,
    q4_finance: q4.finance,
    q4_math: q4.math,
    q4_other: q4.other,
    q5_instrument1: q5.instrument1,
    q5_instrument2: q5.instrument2,
    q6_electronic_daily: q6.electronic_daily,
    q6_electronic_weekly: q6.electronic_weekly,
    q6_electronic_yearly: q6.electronic_yearly,
    q6_press_daily: q6.press_daily,
    q6_press_weekly: q6.press_weekly,
    q6_press_yearly: q6.press_yearly,
    q7_initiative,
    q8_understanding,
    additionalNotes,
  })

  const handleGenerate = async () => {
    setGenerating(true)
    setError(null)
    try {
      const data = buildData()
      const res = await generateQualifiedAdvisorStyled(data)
      setResult(res)
    } catch (err) {
      console.error('Error generating qualified advisor declaration:', err)
      setError('שגיאה ביצירת המסמך')
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

  const radioClass = (selected) =>
    `flex items-center gap-3 p-3 border rounded-card cursor-pointer transition-all ${
      selected ? 'border-green-primary bg-green-primary/5' : 'border-border/50 hover:border-gold'
    }`

  const checkboxClass = (selected) =>
    `flex items-center gap-3 p-4 border rounded-card cursor-pointer transition-all ${
      selected ? 'border-green-primary bg-green-primary/5' : 'border-border/50 hover:border-gold'
    }`

  const fieldClass = 'w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-green-secondary text-right'

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
            <h2 className="text-lg font-extrabold text-green-primary mb-1">לקוח כשיר — חוק הייעוץ</h2>
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

  // ── Extended Questionnaire ──
  if (step === 'questionnaire') {
    return (
      <div className="min-h-screen bg-surface-offwhite">
        <WizardHeader user={user} onLogout={onLogout} onAdmin={onAdmin} />
        <div className="max-w-2xl mx-auto px-4 py-5">
          <button onClick={() => setStep('conditions')} className="text-sm text-text-muted hover:text-green-primary transition-colors mb-4">
            ← חזרה לתנאים
          </button>

          <div className="bg-white rounded-card shadow-card border border-border/50 p-6 md:p-8" dir="rtl">
            <h2 className="text-lg font-extrabold text-green-primary mb-1">שאלון מורחב</h2>
            <p className="text-sm text-text-muted mb-6">נדרש כאשר נבחר "אחר" בתנאי (2)</p>
            <div className="h-[2px] bg-gold/30 mb-6 rounded-full" />

            {/* Q1 */}
            <div className="mb-5">
              <label className="text-sm font-semibold text-text-primary block mb-2">1. יתרת נכסים פיננסיים בניכויי התחייבויות וני"ע שאינם סחירים</label>
              <input className={fieldClass} value={q1_assets} onChange={(e) => setQ1Assets(e.target.value)} placeholder="סכום" />
            </div>

            {/* Q2 */}
            <div className="mb-5">
              <label className="text-sm font-semibold text-text-primary block mb-2">2. תפקיד מקצועי הדורש מומחיות בשוק ההון</label>
              <div className="space-y-2">
                {[
                  { value: 'ceo', label: 'מנכ"ל/בעלים של חברה בשוק ההון / ביטוח' },
                  { value: 'cfo', label: 'מנהל כספים' },
                  { value: 'investment', label: 'מנהל השקעות' },
                  { value: 'trader', label: 'סוחר' },
                  { value: 'other', label: 'אחר' },
                ].map((opt) => (
                  <label key={opt.value} className={radioClass(q2_role === opt.value)}>
                    <input type="radio" name="q2role" value={opt.value} checked={q2_role === opt.value}
                      onChange={() => setQ2Role(opt.value)} className="accent-green-primary w-4 h-4" />
                    <span className="text-sm text-text-primary">{opt.label}</span>
                  </label>
                ))}
                {q2_role === 'other' && (
                  <input className={fieldClass + ' mt-2'} value={q2_otherText} onChange={(e) => setQ2OtherText(e.target.value)} placeholder="פרט" />
                )}
              </div>
            </div>

            {/* Q3 */}
            <div className="mb-5">
              <label className="text-sm font-semibold text-text-primary block mb-2">3. סה"כ ניסיון עיסוק בשנים</label>
              <input className={fieldClass} value={q3_years} onChange={(e) => setQ3Years(e.target.value)} placeholder="מספר שנים ופירוט" />
            </div>

            {/* Q4 */}
            <div className="mb-5">
              <label className="text-sm font-semibold text-text-primary block mb-2">4. השכלה רלוונטית למומחיות בשוק ההון</label>
              {[
                { key: 'economics', label: 'כלכלה' },
                { key: 'accounting', label: 'חשבונאות' },
                { key: 'finance', label: 'מימון' },
                { key: 'math', label: 'מתמטיקה/פיזיקה' },
                { key: 'other', label: 'אחר' },
              ].map((f) => (
                <div key={f.key} className="flex items-center gap-3 mb-2">
                  <span className="text-sm text-text-primary w-28 shrink-0">{f.label}</span>
                  <input className={fieldClass} value={q4[f.key]} onChange={(e) => setQ4({ ...q4, [f.key]: e.target.value })} placeholder="פרט" />
                </div>
              ))}
            </div>

            {/* Q5 */}
            <div className="mb-5">
              <label className="text-sm font-semibold text-text-primary block mb-2">5. פרט (לפחות) 3 מכשירים פיננסיים מורכבים</label>
              <p className="text-xs text-text-muted mb-2">אופציות, קרנות גידור, מוצרים מובנים וכדומה</p>
              <input className={fieldClass + ' mb-2'} value={q5.instrument1} onChange={(e) => setQ5({ ...q5, instrument1: e.target.value })} placeholder="מכשיר 1" />
              <input className={fieldClass} value={q5.instrument2} onChange={(e) => setQ5({ ...q5, instrument2: e.target.value })} placeholder="מכשיר 2, 3..." />
            </div>

            {/* Q6 */}
            <div className="mb-5">
              <label className="text-sm font-semibold text-text-primary block mb-3">6. תדירות ואופן התעדכנות בשווקים הפיננסיים</label>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-surface-cream">
                      <th className="p-2 text-right font-medium"></th>
                      <th className="p-2 text-center font-medium">אלקטרוני/מערכות מחקר</th>
                      <th className="p-2 text-center font-medium">עתונות כתובה/מאמרים</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { key: 'daily', label: 'לפחות יומית' },
                      { key: 'weekly', label: 'לפחות שבועית' },
                      { key: 'yearly', label: 'שנה ומעלה' },
                    ].map((row) => (
                      <tr key={row.key} className="border-b border-border/30">
                        <td className="p-2 text-right text-sm">{row.label}</td>
                        <td className="p-2 text-center">
                          <input type="checkbox" checked={q6[`electronic_${row.key}`]}
                            onChange={(e) => setQ6({ ...q6, [`electronic_${row.key}`]: e.target.checked })}
                            className="accent-green-primary w-4 h-4" />
                        </td>
                        <td className="p-2 text-center">
                          <input type="checkbox" checked={q6[`press_${row.key}`]}
                            onChange={(e) => setQ6({ ...q6, [`press_${row.key}`]: e.target.checked })}
                            className="accent-green-primary w-4 h-4" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Q7 */}
            <div className="mb-5">
              <label className="text-sm font-semibold text-text-primary block mb-2">7. האם הנך יוזם פעילות עצמאית בתיק ני"ע שלך?</label>
              <div className="flex gap-4">
                <label className={radioClass(q7_initiative === 'yes')}>
                  <input type="radio" name="q7" value="yes" checked={q7_initiative === 'yes'}
                    onChange={() => setQ7Initiative('yes')} className="accent-green-primary w-4 h-4" />
                  <span className="text-sm">כן</span>
                </label>
                <label className={radioClass(q7_initiative === 'no')}>
                  <input type="radio" name="q7" value="no" checked={q7_initiative === 'no'}
                    onChange={() => setQ7Initiative('no')} className="accent-green-primary w-4 h-4" />
                  <span className="text-sm">לא</span>
                </label>
              </div>
            </div>

            {/* Q8 */}
            <div className="mb-5">
              <label className="text-sm font-semibold text-text-primary block mb-2">8. רמת הבנה ובקיאות בשוק ההון</label>
              <div className="flex gap-3">
                {[
                  { value: 'high', label: 'גבוהה' },
                  { value: 'medium', label: 'בינונית' },
                  { value: 'low', label: 'נמוכה' },
                ].map((opt) => (
                  <label key={opt.value} className={radioClass(q8_understanding === opt.value)}>
                    <input type="radio" name="q8" value={opt.value} checked={q8_understanding === opt.value}
                      onChange={() => setQ8Understanding(opt.value)} className="accent-green-primary w-4 h-4" />
                    <span className="text-sm">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional notes */}
            <div className="mb-6">
              <label className="text-sm font-semibold text-text-primary block mb-2">הערות נוספות</label>
              <textarea className={fieldClass + ' min-h-[60px]'} value={additionalNotes} onChange={(e) => setAdditionalNotes(e.target.value)} placeholder="אופציונלי" />
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
              {generating ? 'מפיק מסמך...' : 'הפק מסמך לקוח כשיר'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Conditions selection ──
  return (
    <div className="min-h-screen bg-surface-offwhite">
      <WizardHeader user={user} onLogout={onLogout} onAdmin={onAdmin} />
      <div className="max-w-2xl mx-auto px-4 py-5">
        <button onClick={onBack} className="text-sm text-text-muted hover:text-green-primary transition-colors mb-4">
          ← חזרה למודולים
        </button>

        <div className="bg-white rounded-card shadow-card border border-border/50 p-6 md:p-8">
          <h2 className="text-lg font-extrabold text-green-primary mb-1">לקוח כשיר — חוק הייעוץ</h2>
          <p className="text-sm text-text-muted mb-6">בחר לפחות 2 תנאים מתוך 3 המתקיימים ללקוח</p>
          <div className="h-[2px] bg-gold/30 mb-6 rounded-full" />

          {/* Client summary */}
          <div className="bg-surface-cream rounded-card border border-border/50 p-4 mb-6" dir="rtl">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-text-muted text-xs block">לקוח</span>
                <span className="font-semibold text-text-primary">{session.clientA?.fullName}</span>
              </div>
              <div>
                <span className="text-text-muted text-xs block">ת.ז</span>
                <span className="font-semibold text-text-primary">{session.clientA?.idNumber}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-6" dir="rtl">
            {/* Condition 1 */}
            <label className={checkboxClass(conditions.condition1)}>
              <input type="checkbox" checked={conditions.condition1}
                onChange={(e) => setConditions({ ...conditions, condition1: e.target.checked })}
                className="accent-green-primary w-4 h-4 shrink-0" />
              <div>
                <span className="text-sm font-semibold text-text-primary block">(1) שווי נכסים פיננסיים</span>
                <span className="text-xs text-text-muted">מזומנים, פיקדונות, נכסים פיננסיים וני"ע מעל 12 מיליון ש"ח</span>
              </div>
            </label>

            {/* Condition 2 */}
            <label className={checkboxClass(conditions.condition2)}>
              <input type="checkbox" checked={conditions.condition2}
                onChange={(e) => {
                  setConditions({ ...conditions, condition2: e.target.checked })
                  if (!e.target.checked) setCondition2Role(null)
                }}
                className="accent-green-primary w-4 h-4 shrink-0" />
              <div>
                <span className="text-sm font-semibold text-text-primary block">(2) מומחיות וכשירות בשוק ההון</span>
                <span className="text-xs text-text-muted">בעל מומחיות או הועסק בתפקיד מקצועי בשוק ההון</span>
              </div>
            </label>

            {/* Condition 2 role selection */}
            {conditions.condition2 && (
              <div className="mr-8 space-y-2">
                <label className="text-sm font-semibold text-text-primary block mb-2">תפקיד:</label>
                {[
                  { value: 'ceo', label: 'מנכ"ל/בעלים של חברה בשוק ההון / ביטוח' },
                  { value: 'cfo', label: 'מנהל כספים' },
                  { value: 'investment', label: 'מנהל השקעות' },
                  { value: 'trader', label: 'סוחר' },
                  { value: 'other', label: 'אחר (ימלא שאלון מורחב)' },
                ].map((opt) => (
                  <label key={opt.value} className={radioClass(condition2Role === opt.value)}>
                    <input type="radio" name="condition2role" value={opt.value}
                      checked={condition2Role === opt.value}
                      onChange={() => setCondition2Role(opt.value)}
                      className="accent-green-primary w-4 h-4" />
                    <span className="text-sm text-text-primary">{opt.label}</span>
                  </label>
                ))}
                {condition2Role === 'other' && (
                  <input className={fieldClass + ' mt-2'} value={condition2Other} onChange={(e) => setCondition2Other(e.target.value)} placeholder='פרט תפקיד' />
                )}
                <div className="mt-2">
                  <label className="text-sm font-semibold text-text-primary block mb-1">פירוט ניסיון רלוונטי</label>
                  <textarea className={fieldClass + ' min-h-[50px]'} value={experienceDetails} onChange={(e) => setExperienceDetails(e.target.value)} placeholder="תאר את הניסיון" />
                </div>
              </div>
            )}

            {/* Condition 3 */}
            <label className={checkboxClass(conditions.condition3)}>
              <input type="checkbox" checked={conditions.condition3}
                onChange={(e) => setConditions({ ...conditions, condition3: e.target.checked })}
                className="accent-green-primary w-4 h-4 shrink-0" />
              <div>
                <span className="text-sm font-semibold text-text-primary block">(3) 30 עסקאות לרבעון</span>
                <span className="text-xs text-text-muted">ביצוע לפחות 30 עסקאות בממוצע בכל רבעון ב-4 רבעונים אחרונים</span>
              </div>
            </label>
          </div>

          {/* Selection counter */}
          <div className="text-center mb-4">
            <span className={`text-xs font-semibold ${selectedCount >= 2 ? 'text-positive' : 'text-text-muted'}`}>
              {selectedCount}/3 תנאים נבחרו {selectedCount >= 2 ? '✓' : '(מינימום 2)'}
            </span>
          </div>

          {error && (
            <div className="bg-warning-bg border border-warning-border rounded-card p-3 mb-4 text-sm text-warning-red text-center">
              {error}
            </div>
          )}

          <button
            onClick={handleConditionsDone}
            disabled={generating}
            className="w-full py-3 bg-green-primary text-white rounded-card text-sm font-bold hover:bg-green-secondary transition-colors shadow-card disabled:opacity-50"
          >
            {generating ? 'מפיק מסמך...' : needsExtended ? 'המשך לשאלון מורחב' : 'הפק מסמך לקוח כשיר'}
          </button>
        </div>
      </div>
    </div>
  )
}
