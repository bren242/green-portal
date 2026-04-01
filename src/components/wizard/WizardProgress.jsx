export default function WizardProgress({ steps, currentStep, onStepClick }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-2">
      {steps.map((step, index) => {
        const isActive = index === currentStep
        const isDone = index < currentStep
        return (
          <button
            key={step.id}
            onClick={() => onStepClick(index)}
            className={`
              flex-shrink-0 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer
              ${isActive
                ? 'bg-green-primary text-white shadow-sm'
                : isDone
                  ? 'bg-green-secondary/10 text-green-secondary'
                  : 'bg-white text-text-muted border border-border'
              }
            `}
          >
            <span className="inline-block ml-1 font-bold">{index + 1}</span>
            <span className="hidden sm:inline">{step.title}</span>
          </button>
        )
      })}
    </div>
  )
}
