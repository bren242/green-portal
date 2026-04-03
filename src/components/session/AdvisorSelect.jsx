import { getAdvisors } from '../../data/users'

export default function AdvisorSelect({ onSelect }) {
  const advisors = getAdvisors()

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <h2 className="text-xl font-extrabold text-green-primary text-center mb-2">
          בחירת משווק
        </h2>
        <p className="text-sm text-text-muted text-center mb-8">
          מי מנהל את הפגישה?
        </p>

        <div className="space-y-3">
          {advisors.map((advisor) => (
            <button
              key={advisor.id}
              onClick={() => onSelect(advisor)}
              className="w-full bg-white rounded-card shadow-card border border-border/50 p-5 text-right hover:border-gold hover:shadow-metric transition-all group"
            >
              <div className="flex items-center justify-between flex-row-reverse">
                <div>
                  <span className="text-base font-bold text-green-primary group-hover:text-green-secondary transition-colors">
                    {advisor.name}
                  </span>
                  {advisor.license && (
                    <span className="block text-xs text-text-muted mt-0.5">
                      רישיון: {advisor.license}
                    </span>
                  )}
                </div>
                <div className="w-10 h-10 rounded-full bg-surface-cream border border-border/50 flex items-center justify-center text-gold font-bold text-lg">
                  {advisor.name.charAt(0)}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
