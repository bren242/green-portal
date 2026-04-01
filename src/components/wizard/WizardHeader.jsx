export default function WizardHeader({ user, onLogout, onAdmin }) {
  return (
    <header>
      {/* Logo bar - beige background */}
      <div className="bg-surface-offwhite border-b border-border/50">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <img src="/logoLight.png" alt="GREEN Wealth Management" className="h-10 object-contain" />
          <div className="flex items-center gap-3">
            <span className="text-sm text-text-muted font-medium">{user.name}</span>
            {onAdmin && (
              <button
                onClick={onAdmin}
                className="text-xs px-3 py-1.5 border border-gold text-gold rounded-pill hover:bg-gold/10 transition-colors font-semibold"
              >
                ניהול
              </button>
            )}
            <button
              onClick={onLogout}
              className="text-xs px-3 py-1.5 border border-border text-text-muted rounded-pill hover:bg-surface-light transition-colors"
            >
              יציאה
            </button>
          </div>
        </div>
      </div>
      {/* Thin dark green nav bar */}
      <div className="bg-green-primary">
        <div className="max-w-3xl mx-auto px-4 py-1.5 flex items-center">
          <span className="text-xs font-semibold text-gold-light tracking-wide">איפיון צרכים</span>
        </div>
      </div>
    </header>
  )
}
