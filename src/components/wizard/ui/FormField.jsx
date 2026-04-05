export function TextInput({ label, value, onChange, placeholder, type = 'text', disabled, inputMode, onlyDigits }) {
  const handleChange = (e) => {
    const v = e.target.value
    if (onlyDigits && v !== '' && !/^\d*$/.test(v)) return
    onChange(v)
  }
  return (
    <div>
      <label className="block text-sm font-semibold text-text-primary mb-1">{label}</label>
      <input
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-green-secondary focus:ring-1 focus:ring-green-secondary disabled:bg-surface-light disabled:opacity-50"
      />
    </div>
  )
}

export function SelectInput({ label, value, onChange, options, disabled }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-text-primary mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-green-secondary focus:ring-1 focus:ring-green-secondary bg-white disabled:bg-surface-light disabled:opacity-50"
      >
        <option value="">בחר...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}

export function RadioGroup({ label, name, value, onChange, options, disabled }) {
  return (
    <div>
      {label && <p className="text-sm font-semibold text-text-primary mb-2">{label}</p>}
      <div className="space-y-2">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={`
              flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
              ${value === opt.value
                ? 'border-green-secondary bg-green-secondary/5'
                : 'border-border hover:border-green-secondary/40'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              disabled={disabled}
              className="accent-green-secondary"
            />
            <span className="text-sm">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

export function Checkbox({ label, checked, onChange, disabled }) {
  return (
    <label className={`flex items-center gap-2 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="accent-green-secondary w-4 h-4"
      />
      <span className="text-sm">{label}</span>
    </label>
  )
}

export function TextArea({ label, value, onChange, placeholder, rows = 3, disabled }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-text-primary mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        autoComplete="off"
        className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-green-secondary focus:ring-1 focus:ring-green-secondary resize-none disabled:bg-surface-light disabled:opacity-50"
      />
    </div>
  )
}

export function RefuseButton({ field, label, isRefused, toggleRefusal }) {
  const refused = isRefused(field)
  return (
    <button
      type="button"
      onClick={() => toggleRefusal(field, label)}
      className={`
        text-xs px-3 py-1 rounded-pill border transition-colors
        ${refused
          ? 'bg-warning-bg border-warning-border text-warning-red'
          : 'border-border text-text-muted hover:border-warning-border hover:text-warning-red'
        }
      `}
    >
      {refused ? 'סירוב ✓' : 'מסרב/ת להשיב'}
    </button>
  )
}

export function AssetRow({ label, asset, onChange, showGuaranteed }) {
  return (
    <div className="flex flex-wrap items-center gap-3 py-2 border-b border-border/50 last:border-0">
      <label className="flex items-center gap-2 min-w-[140px]">
        <input
          type="checkbox"
          checked={asset.has}
          onChange={(e) => onChange({ ...asset, has: e.target.checked })}
          className="accent-green-secondary w-4 h-4"
        />
        <span className="text-sm font-medium">{label}</span>
      </label>
      {asset.has && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={asset.amount}
            onChange={(e) => onChange({ ...asset, amount: e.target.value })}
            placeholder="סכום ₪"
            autoComplete="off"
            className="w-32 px-2 py-1.5 border border-border rounded-lg text-sm focus:outline-none focus:border-green-secondary"
          />
          {showGuaranteed && (
            <label className="flex items-center gap-1 text-xs text-text-muted">
              <input
                type="checkbox"
                checked={asset.guaranteedYield || false}
                onChange={(e) => onChange({ ...asset, guaranteedYield: e.target.checked })}
                className="accent-gold w-3.5 h-3.5"
              />
              תשואה מובטחת
            </label>
          )}
        </div>
      )}
    </div>
  )
}
