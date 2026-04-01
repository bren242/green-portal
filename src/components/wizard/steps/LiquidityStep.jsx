import { RadioGroup, RefuseButton } from '../ui/FormField'

export default function LiquidityStep({ formData, updateForm, isRefused, toggleRefusal }) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <RadioGroup
            label="מתי תזדקק לכל הכסף?"
            name="liquidityTimeline"
            value={formData.liquidityTimeline}
            onChange={(v) => updateForm({ liquidityTimeline: v })}
            options={[
              { value: 'up_to_2', label: 'עד שנתיים' },
              { value: '2_to_5', label: '2-5 שנים' },
              { value: 'over_5', label: 'מעל 5 שנים' },
            ]}
          />
        </div>
        <RefuseButton field="liquidityTimeline" label="ציר זמן נזילות" isRefused={isRefused} toggleRefusal={toggleRefusal} />
      </div>

      <div className="flex items-start gap-2">
        <div className="flex-1">
          <RadioGroup
            label="כמה מהתיק תצטרך ב-3 השנים הקרובות?"
            name="liquidityNext3Years"
            value={formData.liquidityNext3Years}
            onChange={(v) => updateForm({ liquidityNext3Years: v })}
            options={[
              { value: '0', label: '0% — לא צפוי' },
              { value: 'up_to_30', label: 'עד 30%' },
              { value: 'up_to_50', label: 'עד 50%' },
              { value: 'over_50', label: 'מעל 50%' },
            ]}
          />
        </div>
        <RefuseButton field="liquidityNext3Years" label="נזילות 3 שנים" isRefused={isRefused} toggleRefusal={toggleRefusal} />
      </div>
    </div>
  )
}
