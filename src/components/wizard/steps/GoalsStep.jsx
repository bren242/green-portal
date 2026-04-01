import { RadioGroup, TextInput, RefuseButton } from '../ui/FormField'

export default function GoalsStep({ formData, updateForm, isRefused, toggleRefusal }) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <RadioGroup
            label="מטרת ההשקעה הראשית"
            name="investmentGoal"
            value={formData.investmentGoal}
            onChange={(v) => updateForm({ investmentGoal: v })}
            options={[
              { value: 'preserve', label: 'שמירת ערך' },
              { value: 'income', label: 'הכנסה שוטפת' },
              { value: 'growth', label: 'צמיחה לטווח ארוך' },
              { value: 'pension', label: 'חיסכון לפנסיה' },
              { value: 'education', label: 'חינוך ילדים' },
              { value: 'intergenerational', label: 'העברה בין-דורית' },
              { value: 'other', label: 'אחר' },
            ]}
          />
        </div>
        <RefuseButton field="investmentGoal" label="מטרת ההשקעה" isRefused={isRefused} toggleRefusal={toggleRefusal} />
      </div>

      {formData.investmentGoal === 'other' && (
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
