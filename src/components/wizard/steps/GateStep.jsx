export default function GateStep({ formData, updateForm }) {
  const options = [
    { value: 'single', label: 'לקוח יחיד', desc: 'סט פרטים אישיים אחד, חתימה אחת' },
    { value: 'couple', label: 'שני בני זוג', desc: 'שני סטים של פרטים אישיים, שתי חתימות' },
  ]

  return (
    <div className="space-y-4">
      <p className="text-sm text-text-muted mb-4">
        התמונה הכלכלית מתייחסת תמיד לתא המשפחתי כולו.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => updateForm({ signerType: opt.value })}
            className={`
              p-6 rounded-card border-2 text-right transition-all
              ${formData.signerType === opt.value
                ? 'border-green-secondary bg-green-secondary/5 shadow-sm'
                : 'border-border hover:border-green-secondary/40'
              }
            `}
          >
            <div className="text-lg font-bold text-green-primary mb-1">{opt.label}</div>
            <div className="text-sm text-text-muted">{opt.desc}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
