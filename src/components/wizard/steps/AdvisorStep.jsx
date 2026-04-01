import { useState } from 'react'
import { TextArea, TextInput, RadioGroup, Checkbox } from '../ui/FormField'
import { calculateRiskScore, RISK_LEVELS } from '../../../data/formSchema'
import { generatePDF } from '../../pdf/generatePDF'
import PDFPreview from '../../pdf/PDFPreview'

export default function AdvisorStep({ formData, updateForm, user }) {
  const [generating, setGenerating] = useState(false)
  const [pdfData, setPdfData] = useState(null)
  const riskResult = calculateRiskScore(formData)
  const hasRefusals = formData.refusals && formData.refusals.length > 0

  const canGeneratePDF = !hasRefusals || formData.refusalsConfirmed

  const handleGeneratePDF = async () => {
    if (hasRefusals && !formData.refusalsConfirmed) return
    setGenerating(true)
    try {
      const result = await generatePDF(formData, user)
      setPdfData(result)
    } catch (err) {
      console.error('PDF generation error:', err)
      alert('שגיאה ביצירת PDF: ' + err.message)
    }
    setGenerating(false)
  }

  const handleDownload = () => {
    if (!pdfData) return
    const blob = new Blob([pdfData.pdfBytes], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = pdfData.fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="bg-surface-cream border border-gold/30 rounded-card p-4 text-sm">
        <span className="font-bold text-green-primary">סיכום והמלצת בעל הרישיון</span>
      </div>

      <TextArea
        label="סיכום וניתוח"
        value={formData.advisorSummary}
        onChange={(v) => updateForm({ advisorSummary: v })}
        placeholder="סיכום הפגישה, תובנות, הערכה מקצועית..."
        rows={4}
      />

      <TextArea
        label="העדפות / הגבלות לקוח"
        value={formData.clientPreferences}
        onChange={(v) => updateForm({ clientPreferences: v })}
        placeholder="העדפות ספציפיות, הגבלות, דגשים..."
        rows={3}
      />

      {/* Risk level selection */}
      <div className="bg-white border border-border rounded-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-green-primary">דרגת סיכון מחושבת:</span>
          <span className="text-xl font-extrabold text-green-primary">
            {riskResult.level > 0 ? `${riskResult.level} (${RISK_LEVELS[riskResult.level - 1]?.name})` : 'טרם חושב'}
          </span>
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">
            דרגת סיכון סופית (נקבעת ע״י בעל הרישיון)
          </label>
          <div className="flex gap-2">
            {RISK_LEVELS.map((rl) => (
              <button
                key={rl.level}
                onClick={() => updateForm({ finalRiskLevel: rl.level })}
                className={`
                  flex-1 py-3 rounded-lg text-center transition-all border-2
                  ${formData.finalRiskLevel === rl.level
                    ? 'border-green-secondary bg-green-secondary/10 text-green-primary font-bold'
                    : 'border-border text-text-muted hover:border-green-secondary/40'
                  }
                `}
              >
                <div className="text-lg font-bold">{rl.level}</div>
                <div className="text-xs">{rl.name}</div>
              </button>
            ))}
          </div>
        </div>

        {formData.finalRiskLevel > 0 && formData.finalRiskLevel !== riskResult.level && (
          <TextArea
            label="נימוק לפער בין הדרגה המחושבת לסופית"
            value={formData.finalRiskJustification}
            onChange={(v) => updateForm({ finalRiskJustification: v })}
            placeholder='לדוגמה: "מכיוון שניהול התיקים מהווה ~50% מסך נכסי הלקוח..."'
            rows={3}
          />
        )}

        {formData.finalRiskLevel > 0 && (
          <div className="bg-surface-light rounded-lg p-3 text-sm space-y-1">
            <div className="font-semibold text-green-primary">
              משמעות דרגה {formData.finalRiskLevel} — {RISK_LEVELS[formData.finalRiskLevel - 1].name}
            </div>
            <div className="text-text-muted">
              {RISK_LEVELS[formData.finalRiskLevel - 1].description}
            </div>
            <div className="text-text-muted text-xs mt-1">
              הפסד מקסימלי: {RISK_LEVELS[formData.finalRiskLevel - 1].maxLoss} |
              מניות מקס׳: {RISK_LEVELS[formData.finalRiskLevel - 1].maxStocks} |
              אג״ח קונצרני: {RISK_LEVELS[formData.finalRiskLevel - 1].corpBonds}
            </div>
          </div>
        )}
      </div>

      {/* Policy parameters */}
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput
          label="אחוז מניות מקסימלי"
          value={formData.equityPct}
          onChange={(v) => updateForm({ equityPct: v })}
          placeholder="%"
        />
        <RadioGroup
          label="אג״ח קונצרני"
          name="corporateBondsPct"
          value={formData.corporateBondsPct}
          onChange={(v) => updateForm({ corporateBondsPct: v })}
          options={[
            { value: '50', label: 'עד 50%' },
            { value: '100', label: 'עד 100%' },
          ]}
        />
      </div>

      <div className="flex gap-6">
        <Checkbox label="מט״ח" checked={formData.forex} onChange={(v) => updateForm({ forex: v })} />
        <Checkbox label="אג״ח בדירוג נמוך / לא מדורג" checked={formData.lowRatedBonds} onChange={(v) => updateForm({ lowRatedBonds: v })} />
      </div>

      {/* Refusals block with confirmation */}
      {hasRefusals && (
        <div className="bg-warning-bg border border-warning-border rounded-card p-4 space-y-3">
          <h4 className="text-sm font-bold text-warning-red">שאלות שהלקוח סירב להשיב:</h4>
          <ul className="text-sm text-warning-red space-y-1">
            {formData.refusals.map((r) => (
              <li key={r.field}>• {r.label}</li>
            ))}
          </ul>
          <div className="border-t border-warning-border pt-3">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.refusalsConfirmed}
                onChange={(e) => updateForm({ refusalsConfirmed: e.target.checked })}
                className="accent-warning-red w-4 h-4 mt-0.5"
              />
              <span className="text-sm text-text-primary">
                הלקוח אישר כי הובהר לו שאי מסירת מידע עלולה לפגוע באיכות ההמלצה וביכולת ההתאמה
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Generate PDF */}
      <div className="pt-4 border-t border-border">
        <button
          onClick={handleGeneratePDF}
          disabled={generating || !canGeneratePDF}
          className="w-full py-3 bg-green-primary text-white font-bold rounded-lg hover:bg-green-secondary transition-colors text-base disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {generating ? 'מייצר PDF...' : hasRefusals && !formData.refusalsConfirmed ? 'נא לאשר את בלוק הסירובים' : 'תצוגה מקדימה וייצוא PDF'}
        </button>
      </div>

      {pdfData && (
        <PDFPreview
          pdfUrl={pdfData.url}
          fileName={pdfData.fileName}
          onClose={() => setPdfData(null)}
          onDownload={handleDownload}
        />
      )}
    </div>
  )
}
