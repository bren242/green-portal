import { RadioGroup, TextInput, RefuseButton } from '../ui/FormField'
import { calculateRiskScore, RISK_LEVELS } from '../../../data/formSchema'

export default function RiskStep({ formData, updateForm, isRefused, toggleRefusal }) {
  const riskResult = calculateRiskScore(formData)

  return (
    <div className="space-y-8">
      {/* Q1 - Asymmetry */}
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <RadioGroup
            label="שאלה 1 — איזו אפשרות עדיפה עליך?"
            name="riskQ1"
            value={formData.riskQ1}
            onChange={(v) => updateForm({ riskQ1: v })}
            options={[
              { value: 'a', label: 'סיכוי להרוויח עד 6%, סיכון להפסיד עד 5%' },
              { value: 'b', label: 'סיכוי להרוויח עד 14%, סיכון להפסיד עד 10%' },
              { value: 'c', label: 'סיכוי להרוויח עד 20%, סיכון להפסיד עד 15%' },
              { value: 'd', label: 'סיכוי להרוויח מעל 20%, סיכון להפסיד מעל 15%' },
            ]}
          />
        </div>
        <RefuseButton field="riskQ1" label="שאלה 1 סיכון" isRefused={isRefused} toggleRefusal={toggleRefusal} />
      </div>

      {/* Q2 - Personal feeling */}
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <RadioGroup
            label="שאלה 2 — בחר את המשפט שהכי מתאר אותך:"
            name="riskQ2"
            value={formData.riskQ2}
            onChange={(v) => updateForm({ riskQ2: v })}
            options={[
              { value: 'a', label: 'אני מעדיף לישון בשקט — גם אם זה אומר תשואה נמוכה יותר' },
              { value: 'b', label: 'אני מוכן לתנודות אם זה אומר תשואה טובה יותר לאורך זמן' },
              { value: 'c', label: 'אני משקיע לטווח ארוך — תנודות הן חלק מהדרך ולא מדאיגות אותי' },
            ]}
          />
        </div>
        <RefuseButton field="riskQ2" label="שאלה 2 סיכון" isRefused={isRefused} toggleRefusal={toggleRefusal} />
      </div>

      {/* Q3 - Concrete scenario */}
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <RadioGroup
            label="שאלה 3 — התיק שלך ירד ב-15% אחרי שנה קשה. מה עובר לך בראש?"
            name="riskQ3"
            value={formData.riskQ3}
            onChange={(v) => updateForm({ riskQ3: v })}
            options={[
              { value: 'a', label: 'אני רוצה לצאת — זה לא בשבילי' },
              { value: 'b', label: 'לא נעים, אני שוקל לצמצם סיכון' },
              { value: 'c', label: 'לא נעים, אבל אני מחזיק ומחכה' },
              { value: 'd', label: 'אני רואה הזדמנות — שוקל להוסיף' },
            ]}
          />
        </div>
        <RefuseButton field="riskQ3" label="שאלה 3 סיכון" isRefused={isRefused} toggleRefusal={toggleRefusal} />
      </div>

      {/* Q4 - Personal priority */}
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <RadioGroup
            label="שאלה 4 — מה חשוב לך יותר?"
            name="riskQ4"
            value={formData.riskQ4}
            onChange={(v) => updateForm({ riskQ4: v })}
            options={[
              { value: 'a', label: 'לא להפסיד — גם אם זה אומר תשואה נמוכה' },
              { value: 'b', label: 'לשמור על ערך הכסף מעל האינפלציה' },
              { value: 'c', label: 'לצמוח לטווח ארוך, גם אם יש תנודות בדרך' },
            ]}
          />
        </div>
        <RefuseButton field="riskQ4" label="שאלה 4 סיכון" isRefused={isRefused} toggleRefusal={toggleRefusal} />
      </div>

      {/* Risk score result */}
      {riskResult.level > 0 && (
        <div className="bg-surface-cream border border-border rounded-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-green-primary">דרגת סיכון מוצעת:</span>
            <span className="text-2xl font-extrabold text-green-primary">
              {riskResult.level}
              <span className="text-sm font-semibold text-text-muted mr-2">
                ({RISK_LEVELS[riskResult.level - 1].name})
              </span>
            </span>
          </div>
          <div className="text-xs text-text-muted">
            ממוצע: {riskResult.average} | הפסד מקסימלי: {RISK_LEVELS[riskResult.level - 1].maxLoss} | מניות מקס׳: {RISK_LEVELS[riskResult.level - 1].maxStocks}
          </div>
          {riskResult.hasGap && (
            <div className="bg-warning-bg border border-warning-border text-warning-red text-sm p-3 rounded-lg">
              {riskResult.gapDetails}
            </div>
          )}
        </div>
      )}

      {/* Scoring table */}
      <div className="bg-white border border-border rounded-table overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-green-primary text-gold-light">
              <th className="p-2 text-right font-semibold">שאלה</th>
              <th className="p-2 text-center font-semibold">א</th>
              <th className="p-2 text-center font-semibold">ב</th>
              <th className="p-2 text-center font-semibold">ג</th>
              <th className="p-2 text-center font-semibold">ד</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/50">
              <td className="p-2 font-medium">שאלה 1</td>
              <td className="p-2 text-center">1</td>
              <td className="p-2 text-center">2</td>
              <td className="p-2 text-center">3</td>
              <td className="p-2 text-center">5</td>
            </tr>
            <tr className="border-b border-border/50 bg-surface-light">
              <td className="p-2 font-medium">שאלה 2</td>
              <td className="p-2 text-center">1</td>
              <td className="p-2 text-center">3</td>
              <td className="p-2 text-center">5</td>
              <td className="p-2 text-center text-text-muted">—</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="p-2 font-medium">שאלה 3</td>
              <td className="p-2 text-center">1</td>
              <td className="p-2 text-center">2</td>
              <td className="p-2 text-center">3</td>
              <td className="p-2 text-center">5</td>
            </tr>
            <tr className="bg-surface-light">
              <td className="p-2 font-medium">שאלה 4</td>
              <td className="p-2 text-center">1</td>
              <td className="p-2 text-center">3</td>
              <td className="p-2 text-center">5</td>
              <td className="p-2 text-center text-text-muted">—</td>
            </tr>
          </tbody>
        </table>
        <div className="p-3 text-xs text-text-muted bg-surface-cream border-t border-border">
          חישוב: סכום הנקודות ÷ 4 = ציון ממוצע → דרגת סיכון מוצעת
        </div>
      </div>

      {/* Prior experience */}
      <div className="space-y-3 pt-4 border-t border-border">
        <RadioGroup
          label="ניסיון קודם בשוק ההון"
          name="priorExperience"
          value={formData.priorExperience}
          onChange={(v) => updateForm({ priorExperience: v })}
          options={[
            { value: 'yes', label: 'כן — נעזרתי בעבר בייעוץ / שיווק השקעות' },
            { value: 'no', label: 'לא' },
          ]}
        />
        {formData.priorExperience === 'yes' && (
          <TextInput
            label="פרט"
            value={formData.priorExperienceDetails}
            onChange={(v) => updateForm({ priorExperienceDetails: v })}
            placeholder="פירוט הניסיון הקודם..."
          />
        )}
      </div>
    </div>
  )
}
