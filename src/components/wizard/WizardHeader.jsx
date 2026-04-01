export default function WizardHeader({ user, onLogout, onAdmin }) {
  return (
    <header className="bg-green-primary text-white shadow-md">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logoLight.png" alt="GREEN" className="h-8 object-contain brightness-0 invert" />
          <span className="text-sm font-semibold opacity-80">איפיון צרכים</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm opacity-80">{user.name}</span>
          {onAdmin && (
            <button
              onClick={onAdmin}
              className="text-xs px-3 py-1 border border-gold/50 text-gold-light rounded-lg hover:bg-white/10 transition-colors"
            >
              ניהול
            </button>
          )}
          <button
            onClick={onLogout}
            className="text-xs px-3 py-1 border border-white/30 rounded-lg hover:bg-white/10 transition-colors"
          >
            יציאה
          </button>
        </div>
      </div>
    </header>
  )
}
