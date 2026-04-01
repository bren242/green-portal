export default function WizardProgress({ steps, currentStep, onStepClick }) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
      {steps.map((step, index) => {
        const isActive = index === currentStep
        const isDone = index < currentStep
        return (
          <button
            key={step.id}
            onClick={() => onStepClick(index)}
            className={`
              flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-pill text-xs font-semibold transition-all cursor-pointer
              ${isActive
                ? 'bg-green-primary text-white shadow-card'
                : isDone
                  ? 'bg-green-secondary/10 text-green-secondary border border-green-secondary/20'
                  : 'bg-white text-text-muted border border-border hover:border-green-secondary/30'
              }
            `}
          >
            <span className={`
              inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold
              ${isActive
                ? 'bg-white/20 text-white'
                : isDone
                  ? 'bg-green-secondary/20 text-green-secondary'
                  : 'bg-surface-light text-text-muted'
              }
            `}>
              {isDone ? '✓' : index + 1}
            </span>
            <span className="hidden sm:inline">{step.title}</span>
          </button>
        )
      })}
    </div>
  )
}
