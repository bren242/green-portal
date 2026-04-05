import { TextArea, SelectInput, RadioGroup, RefuseButton } from '../ui/FormField'

// ── Range options (identical for income & expenses) ──────────────
const RANGE_OPTIONS = [
  { value: 'up_to_10', label: 'עד 10,000 ₪' },
  { value: '10_20', label: '10,000 – 20,000 ₪' },
  { value: '20_30', label: '20,000 – 30,000 ₪' },
  { value: '30_50', label: '30,000 – 50,000 ₪' },
  { value: '50_plus', label: '50,000 ₪ ומעלה' },
]

const RANGE_MIDPOINTS = {
  up_to_10: 7500,
  '10_20': 15000,
  '20_30': 25000,
  '30_50': 40000,
  '50_plus': 60000,
}

// ── Asset group definitions ──────────────────────────────────────
const ASSET_GROUPS = [
  { key: 'cashDeposits', label: 'מזומן ופקדונות', oldKey: 'cash', notesKey: 'cashNotes' },
  { key: 'securities', label: 'תיק ני״ע (מנוהל/עצמאי)', oldKey: 'managedPortfolio', notesKey: 'securitiesNotes' },
  { key: 'pensionSavings', label: 'פנסיוני כולל קרה״ש', oldKey: 'pensionFund', notesKey: 'savingsNotes' },
  { key: 'realEstate', label: 'נדל״ן', oldKey: 'investmentRealEstate', notesKey: 'realEstateNotes' },
  { key: 'other', label: 'אחר', oldKey: 'other', notesKey: 'otherAssetsNotes' },
]

function SectionTitle({ children }) {
  return (
    <h3 className="text-base font-bold text-green-primary border-b-2 border-gold/30 pb-2 mt-6 first:mt-0">
      {children}
    </h3>
  )
}

export default function FinancialStep({ formData, updateForm, isRefused, toggleRefusal }) {

  // ── Income handler — syncs midpoint to legacy fields for PDF ───
  const handleIncomeChange = (value) => {
    const mid = RANGE_MIDPOINTS[value] || 0
    updateForm({
      incomeRange: value,
      income: {
        salary: value ? { has: true, amount: String(mid) } : { has: false, amount: '' },
        pension: { has: false, amount: '' },
        realEstate: { has: false, amount: '' },
        other: { has: false, amount: '' },
      },
    })
  }

  // ── Expense handler — syncs midpoint to legacy monthlyExpenses ─
  const handleExpenseChange = (value) => {
    const mid = RANGE_MIDPOINTS[value] || 0
    updateForm({
      expenseRange: value,
      liabilities: {
        ...formData.liabilities,
        monthlyExpenses: value ? String(mid) : '',
      },
    })
  }

  // ── Asset group handler — syncs to legacy asset fields ─────────
  const handleAssetGroup = (groupKey, field, value) => {
    const groups = formData.assetGroups || {}
    const current = groups[groupKey] || { amount: '', notes: '' }
    const newGroups = { ...groups, [groupKey]: { ...current, [field]: value } }

    const group = ASSET_GROUPS.find(g => g.key === groupKey)
    const updates = { assetGroups: newGroups }

    if (field === 'amount') {
      updates.assets = {
        ...formData.assets,
        [group.oldKey]: { has: !!value, amount: value },
      }
    }
    if (field === 'notes') {
      updates[group.notesKey] = value
    }

    updateForm(updates)
  }

  // ── Liability helpers (mortgage / loans unchanged) ─────────────
  const updateLiability = (key, value) => {
    updateForm({ liabilities: { ...formData.liabilities, [key]: value } })
  }

  // ── Cash flow calculation ──────────────────────────────────────
  const incomeMid = RANGE_MIDPOINTS[formData.incomeRange] || 0
  const expenseMid = RANGE_MIDPOINTS[formData.expenseRange] || 0
  const cashFlow = incomeMid - expenseMid
  const showCashFlow = formData.incomeRange && formData.expenseRange

  return (
    <div className="space-y-4">
      <p className="text-sm text-text-muted bg-surface-cream p-3 rounded-lg">
        כלל הנתונים מתייחסים לתא המשפחתי כולו
      </p>

      {/* ── Income & Expenses ─────────────────────────────────── */}
      <SectionTitle>הכנסות והוצאות (חודשי)</SectionTitle>
      <div className="space-y-4">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <SelectInput
              label="הכנסה חודשית נטו"
              value={formData.incomeRange}
              onChange={handleIncomeChange}
              options={RANGE_OPTIONS}
            />
          </div>
          <div className="pb-0.5">
            <RefuseButton field="income.salary" label="הכנסה חודשית" isRefused={isRefused} toggleRefusal={toggleRefusal} />
          </div>
        </div>

        <SelectInput
          label="הוצאות חודשיות"
          value={formData.expenseRange}
          onChange={handleExpenseChange}
          options={RANGE_OPTIONS}
        />

        {showCashFlow && (
          <div className={`flex items-center gap-3 p-3 rounded-lg border ${
            cashFlow > 0
              ? 'bg-emerald-50 border-emerald-200'
              : cashFlow < 0
                ? 'bg-red-50 border-red-200'
                : 'bg-amber-50 border-amber-200'
          }`}>
            <span className="text-xl leading-none">
              {cashFlow > 0 ? '↑' : cashFlow < 0 ? '↓' : '='}
            </span>
            <div>
              <span className={`text-sm font-bold ${
                cashFlow > 0 ? 'text-emerald-700' : cashFlow < 0 ? 'text-red-700' : 'text-amber-700'
              }`}>
                תזרים חודשי: {cashFlow > 0 ? 'חיובי' : cashFlow < 0 ? 'שלילי' : 'מאוזן'}
              </span>
              <span className="text-xs text-text-muted mr-2">(הערכה לפי אמצע המדרגה)</span>
            </div>
          </div>
        )}
      </div>

      <TextArea
        label="הערות להכנסות/הוצאות"
        value={formData.incomeNotes || ''}
        onChange={(v) => updateForm({ incomeNotes: v })}
        placeholder="פירוט נוסף..."
        rows={2}
      />

      {/* ── Asset Groups ──────────────────────────────────────── */}
      <SectionTitle>נכסים</SectionTitle>
      <div className="space-y-3">
        {ASSET_GROUPS.map((group) => {
          const data = formData.assetGroups?.[group.key] || { amount: '', notes: '' }
          return (
            <div key={group.key} className="bg-white border border-border/50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-green-primary min-w-[160px]">
                  {group.label}
                </span>
                <input
                  type="text"
                  value={data.amount}
                  onChange={(e) => handleAssetGroup(group.key, 'amount', e.target.value)}
                  placeholder="סכום ₪"
                  autoComplete="off"
                  className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-green-secondary focus:ring-1 focus:ring-green-secondary"
                />
              </div>
              {data.amount && (
                <textarea
                  value={data.notes}
                  onChange={(e) => handleAssetGroup(group.key, 'notes', e.target.value)}
                  placeholder="הערות (אופציונלי)"
                  rows={1}
                  autoComplete="off"
                  className="w-full mt-2 px-3 py-1.5 border border-border/40 rounded-lg text-xs text-text-muted focus:outline-none focus:border-green-secondary resize-none"
                />
              )}
            </div>
          )
        })}
      </div>

      {/* ── Liabilities ───────────────────────────────────────── */}
      <SectionTitle>התחייבויות</SectionTitle>
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3 py-2 border-b border-border/50">
          <label className="flex items-center gap-2 min-w-[140px]">
            <input
              type="checkbox"
              checked={formData.liabilities.mortgage.has}
              onChange={(e) => updateLiability('mortgage', { ...formData.liabilities.mortgage, has: e.target.checked })}
              className="accent-green-secondary w-4 h-4"
            />
            <span className="text-sm font-medium">משכנתא</span>
          </label>
          {formData.liabilities.mortgage.has && (
            <div className="flex gap-2">
              <input type="text" value={formData.liabilities.mortgage.monthly} onChange={(e) => updateLiability('mortgage', { ...formData.liabilities.mortgage, monthly: e.target.value })} placeholder="חודשי ₪" autoComplete="off" className="w-28 px-2 py-1.5 border border-border rounded-lg text-sm focus:outline-none focus:border-green-secondary" />
              <input type="text" value={formData.liabilities.mortgage.total} onChange={(e) => updateLiability('mortgage', { ...formData.liabilities.mortgage, total: e.target.value })} placeholder="יתרה ₪" autoComplete="off" className="w-28 px-2 py-1.5 border border-border rounded-lg text-sm focus:outline-none focus:border-green-secondary" />
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3 py-2 border-b border-border/50">
          <label className="flex items-center gap-2 min-w-[140px]">
            <input
              type="checkbox"
              checked={formData.liabilities.loans.has}
              onChange={(e) => updateLiability('loans', { ...formData.liabilities.loans, has: e.target.checked })}
              className="accent-green-secondary w-4 h-4"
            />
            <span className="text-sm font-medium">הלוואות</span>
          </label>
          {formData.liabilities.loans.has && (
            <div className="flex gap-2">
              <input type="text" value={formData.liabilities.loans.monthly} onChange={(e) => updateLiability('loans', { ...formData.liabilities.loans, monthly: e.target.value })} placeholder="חודשי ₪" autoComplete="off" className="w-28 px-2 py-1.5 border border-border rounded-lg text-sm focus:outline-none focus:border-green-secondary" />
              <input type="text" value={formData.liabilities.loans.total} onChange={(e) => updateLiability('loans', { ...formData.liabilities.loans, total: e.target.value })} placeholder="יתרה ₪" autoComplete="off" className="w-28 px-2 py-1.5 border border-border rounded-lg text-sm focus:outline-none focus:border-green-secondary" />
            </div>
          )}
        </div>
      </div>
      <TextArea
        label="הערות להתחייבויות"
        value={formData.liabilitiesNotes || ''}
        onChange={(v) => updateForm({ liabilitiesNotes: v })}
        placeholder="פירוט נוסף..."
        rows={2}
      />

      {/* ── Managed portion ───────────────────────────────────── */}
      <SectionTitle>שיעור הנכסים המופנה לניהול</SectionTitle>
      <RadioGroup
        name="managedPortion"
        value={formData.managedPortion}
        onChange={(v) => updateForm({ managedPortion: v })}
        options={[
          { value: 'up_to_35', label: 'עד 35% מנכסיי' },
          { value: '35_to_70', label: '35%-70% מנכסיי' },
          { value: 'over_70', label: 'מעל 70% מנכסיי' },
        ]}
      />
    </div>
  )
}
