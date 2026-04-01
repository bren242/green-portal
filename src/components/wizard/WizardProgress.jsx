export default function WizardProgress({ steps, currentStep, onStepClick }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 pb-1">
      {steps.map((step, index) => {
        const isActive = index === currentStep
        const isDone = index < currentStep
        return (
          <button
            key={step.id}
            onClick={() => onStepClick(index)}
            className={`
              flex items-center gap-1 px-2.5 py-1.5 rounded-pill text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap
              ${isActive
                ? 'bg-green-primary text-white shadow-card'
                : isDone
                  ? 'bg-green-secondary/10 text-green-secondary border border-green-secondary/20'
                  : 'bg-white text-text-muted border border-border hover:border-green-secondary/30'
              }
            `}
          >
            <span className={`
              inline-flex items-center justify-center w-4.5 h-4.5 rounded-full text-[9px] font-bold leading-none
              ${isActive
                ? 'bg-white/20 text-white'
                : isDone
                  ? 'bg-green-secondary/20 text-green-secondary'
                  : 'bg-surface-light text-text-muted'
              }
            `}>
              {isDone ? '✓' : index + 1}
            </span>
            <span>{step.title}</span>
          </button>
        )
      })}
    </div>
  )
}
