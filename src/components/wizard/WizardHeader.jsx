export default function WizardHeader({ user, onLogout, onAdmin }) {
  return (
    <header className="bg-green-primary shadow-metric">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logoLight.png" alt="GREEN" className="h-9 object-contain" />
          <div className="border-r border-white/20 h-6 mx-1" />
          <span className="text-xs font-semibold text-gold-light tracking-wide">איפיון צרכים</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-white/80 font-medium">{user.name}</span>
          {onAdmin && (
            <button
              onClick={onAdmin}
              className="text-xs px-3 py-1.5 border border-gold/50 text-gold-light rounded-pill hover:bg-gold/10 transition-colors font-semibold"
            >
              ניהול
            </button>
          )}
          <button
            onClick={onLogout}
            className="text-xs px-3 py-1.5 border border-white/25 text-white/70 rounded-pill hover:bg-white/10 transition-colors"
          >
            יציאה
          </button>
        </div>
      </div>
      {/* Gold accent bottom border per DESIGN.md */}
      <div className="h-[2.5px] bg-gold" />
    </header>
  )
}
