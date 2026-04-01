import { RadioGroup, TextInput, RefuseButton } from '../ui/FormField'

const GOAL_OPTIONS = [
  { value: 'preserve', label: 'שמירת ערך' },
  { value: 'income', label: 'הכנסה שוטפת' },
  { value: 'growth', label: 'צמיחה לטווח ארוך' },
  { value: 'pension', label: 'חיסכון לפנסיה' },
  { value: 'education', label: 'חינוך ילדים' },
  { value: 'intergenerational', label: 'העברה בין-דורית' },
  { value: 'other', label: 'אחר' },
]

export default function GoalsStep({ formData, updateForm, isRefused, toggleRefusal }) {
  const goals = formData.investmentGoals || []

  const toggleGoal = (value) => {
    const updated = goals.includes(value)
      ? goals.filter((g) => g !== value)
      : [...goals, value]
    updateForm({ investmentGoals: updated })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <p className="text-sm font-semibold text-text-primary mb-2">מטרות ההשקעה (ניתן לבחור יותר מאחת)</p>
          <div className="space-y-2">
            {GOAL_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={`
                  flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
                  ${goals.includes(opt.value)
                    ? 'border-green-secondary bg-green-secondary/5'
                    : 'border-border hover:border-green-secondary/40'
                  }
                `}
              >
                <input
                  type="checkbox"
                  checked={goals.includes(opt.value)}
                  onChange={() => toggleGoal(opt.value)}
                  className="accent-green-secondary w-4 h-4"
                />
                <span className="text-sm">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
        <RefuseButton field="investmentGoals" label="מטרות ההשקעה" isRefused={isRefused} toggleRefusal={toggleRefusal} />
      </div>

      {goals.includes('other') && (
        <TextInput
          label="פרט"
          value={formData.investmentGoalOther}
          onChange={(v) => updateForm({ investmentGoalOther: v })}
          placeholder="מטרה אחרת..."
        />
      )}

      <div className="flex items-start gap-2">
        <div className="flex-1">
          <RadioGroup
            label="אופק השקעה"
            name="investmentHorizon"
            value={formData.investmentHorizon}
            onChange={(v) => updateForm({ investmentHorizon: v })}
            options={[
              { value: 'up_to_2', label: 'עד שנתיים' },
              { value: '2_to_5', label: '2-5 שנים' },
              { value: '5_to_10', label: '5-10 שנים' },
              { value: 'over_10', label: 'מעל 10 שנים' },
            ]}
          />
        </div>
        <RefuseButton field="investmentHorizon" label="אופק השקעה" isRefused={isRefused} toggleRefusal={toggleRefusal} />
      </div>
    </div>
  )
}
