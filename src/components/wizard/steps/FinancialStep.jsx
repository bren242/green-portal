import { AssetRow, TextInput, RadioGroup, RefuseButton } from '../ui/FormField'

function SectionTitle({ children }) {
  return (
    <h3 className="text-base font-bold text-green-primary border-b-2 border-gold/30 pb-2 mt-6 first:mt-0">
      {children}
    </h3>
  )
}

export default function FinancialStep({ formData, updateForm, isRefused, toggleRefusal }) {
  const updateIncome = (key, value) => {
    updateForm({ income: { ...formData.income, [key]: value } })
  }

  const updateAsset = (key, value) => {
    updateForm({ assets: { ...formData.assets, [key]: value } })
  }

  const updateLiability = (key, value) => {
    updateForm({ liabilities: { ...formData.liabilities, [key]: value } })
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-text-muted bg-surface-cream p-3 rounded-lg">
        כלל הנתונים מתייחסים לתא המשפחתי כולו
      </p>

      {/* Income */}
      <SectionTitle>הכנסות</SectionTitle>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <AssetRow label="שכר נטו" asset={formData.income.salary} onChange={(v) => updateIncome('salary', v)} />
          </div>
          <RefuseButton field="income.salary" label="שכר נטו" isRefused={isRefused} toggleRefusal={toggleRefusal} />
        </div>
        <AssetRow label="פנסיה / קצבה" asset={formData.income.pension} onChange={(v) => updateIncome('pension', v)} />
        <AssetRow label="הכנסות מנדל״ן" asset={formData.income.realEstate} onChange={(v) => updateIncome('realEstate', v)} />
        <AssetRow label="הכנסות אחרות" asset={formData.income.other} onChange={(v) => updateIncome('other', v)} />
      </div>

      {/* Cash & equivalents */}
      <SectionTitle>עו״ש, מזומן ופקדונות</SectionTitle>
      <div className="space-y-1">
        <AssetRow label="עו״ש / מזומן" asset={formData.assets.cash} onChange={(v) => updateAsset('cash', v)} />
        <AssetRow label="פקדונות בנקאיים" asset={formData.assets.deposits} onChange={(v) => updateAsset('deposits', v)} />
        <AssetRow label="קרנות כספיות" asset={formData.assets.moneyMarket} onChange={(v) => updateAsset('moneyMarket', v)} />
      </div>

      {/* Securities */}
      <SectionTitle>ני״ע בארץ ובחו״ל</SectionTitle>
      <div className="space-y-1">
        <AssetRow label="תיק מנוהל" asset={formData.assets.managedPortfolio} onChange={(v) => updateAsset('managedPortfolio', v)} />
        <AssetRow label="מניות / אג״ח ישיר" asset={formData.assets.stocks} onChange={(v) => updateAsset('stocks', v)} />
        <AssetRow label="ETF" asset={formData.assets.etf} onChange={(v) => updateAsset('etf', v)} />
        <AssetRow label="ברוקר זר / חו״ל" asset={formData.assets.foreignBroker} onChange={(v) => updateAsset('foreignBroker', v)} />
      </div>

      {/* Savings, Gemel, Hishtalmut */}
      <SectionTitle>חיסכון, גמל והשתלמות</SectionTitle>
      <div className="space-y-1">
        <AssetRow label="קרן השתלמות" asset={formData.assets.hishtalmut} onChange={(v) => updateAsset('hishtalmut', v)} />
        <AssetRow label="קופת גמל" asset={formData.assets.gemel} onChange={(v) => updateAsset('gemel', v)} />
        <AssetRow label="גמל להשקעה" asset={formData.assets.gemelInvestment} onChange={(v) => updateAsset('gemelInvestment', v)} />
        <AssetRow label="פוליסת חיסכון" asset={formData.assets.savingsPolicy} onChange={(v) => updateAsset('savingsPolicy', v)} />
      </div>

      {/* Pension */}
      <SectionTitle>פנסיה</SectionTitle>
      <div className="space-y-1">
        <AssetRow label="קרן פנסיה" asset={formData.assets.pensionFund} onChange={(v) => updateAsset('pensionFund', v)} />
        <AssetRow label="ביטוח מנהלים" asset={formData.assets.bituachMenahalim} onChange={(v) => updateAsset('bituachMenahalim', v)} showGuaranteed />
      </div>

      {/* Real estate */}
      <SectionTitle>נדל״ן</SectionTitle>
      <div className="space-y-1">
        <AssetRow label="נדל״ן להשקעה" asset={formData.assets.investmentRealEstate} onChange={(v) => updateAsset('investmentRealEstate', v)} />
        <AssetRow label="נדל״ן מגורים (שווי)" asset={formData.assets.residenceRealEstate} onChange={(v) => updateAsset('residenceRealEstate', v)} />
      </div>

      {/* Other */}
      <SectionTitle>אחר</SectionTitle>
      <div className="space-y-1">
        <AssetRow label="עסק / שותפות" asset={formData.assets.business} onChange={(v) => updateAsset('business', v)} />
        <AssetRow label="אחר" asset={formData.assets.other} onChange={(v) => updateAsset('other', v)} />
      </div>

      {/* Liabilities */}
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
        <TextInput label="הוצאות שוטפות חודשיות" value={formData.liabilities.monthlyExpenses} onChange={(v) => updateLiability('monthlyExpenses', v)} placeholder="₪" />
      </div>

      {/* Managed portion */}
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
