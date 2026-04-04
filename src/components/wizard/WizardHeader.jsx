export default function WizardHeader({ user, onLogout, onAdmin }) {
  return (
    <header>
      {/* Thin dark green nav bar — TOP */}
      <div className="bg-green-primary">
        <div className="max-w-3xl mx-auto px-4 py-1.5 flex items-center justify-between">
          <span className="text-xs font-semibold text-gold-light tracking-wide">פורטל טפסים GREEN</span>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gold-light/70 font-medium">{user.name}</span>
            {onAdmin && (
              <button
                onClick={onAdmin}
                className="text-[10px] px-2.5 py-1 border border-gold-light/40 text-gold-light rounded-pill hover:bg-white/10 transition-colors font-semibold"
              >
                ניהול
              </button>
            )}
            <button
              onClick={onLogout}
              className="text-[10px] px-2.5 py-1 border border-gold-light/30 text-gold-light/70 rounded-pill hover:bg-white/10 transition-colors"
            >
              יציאה
            </button>
          </div>
        </div>
      </div>
      {/* Logo bar - beige background BELOW nav */}
      <div style={{ backgroundColor: '#F4F3EF' }}>
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center">
          <img
            src="/logoLight.png"
            alt="GREEN Wealth Management"
            className="h-10 object-contain"
            style={{ mixBlendMode: 'multiply', background: 'transparent' }}
          />
        </div>
      </div>
    </header>
  )
}
