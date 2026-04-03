import { useState, useCallback } from 'react'
import { createEmptySession, PATH_MODULES } from '../../data/advisors'
import WizardHeader from '../wizard/WizardHeader'
import AdvisorSelect from './AdvisorSelect'
import ClientTypeStep from './ClientTypeStep'
import ClientDetailsStep from './ClientDetailsStep'
import ModuleSelection from './ModuleSelection'
import Wizard from '../wizard/Wizard'

// Session steps: advisor → clientType → clientDetails → modules → (module work)
const STEPS = ['advisor', 'clientType', 'clientDetails', 'modules']

export default function SessionFlow({ user, onLogout, onAdmin }) {
  const [session, setSession] = useState(createEmptySession())
  const [step, setStep] = useState('advisor')
  const [activeModule, setActiveModule] = useState(null)

  const updateSession = useCallback((updates) => {
    setSession((prev) => ({ ...prev, ...updates }))
  }, [])

  const resetSession = useCallback(() => {
    setSession(createEmptySession())
    setStep('advisor')
    setActiveModule(null)
  }, [])

  // Step: Advisor selected
  const handleAdvisorSelect = (advisor) => {
    updateSession({ advisor })
    setStep('clientType')
  }

  // Step: Client type + sub-type done → move to details
  const handleClientTypeDone = () => {
    setStep('clientDetails')
  }

  // Step: Client details done → populate modules from path, go to module selection
  const handleClientDetailsDone = () => {
    const pathModules = PATH_MODULES[session.path] || []
    updateSession({ modules: pathModules.map((m) => ({ ...m })) })
    setStep('modules')
  }

  // Module: start working on a specific module
  const handleModuleStart = (moduleId) => {
    setActiveModule(moduleId)
  }

  // Module: completed, return to module selection
  const handleModuleComplete = (moduleId) => {
    setSession((prev) => ({
      ...prev,
      completedModules: prev.completedModules.includes(moduleId)
        ? prev.completedModules
        : [...prev.completedModules, moduleId],
    }))
    setActiveModule(null)
  }

  // Back to modules from active module
  const handleModuleBack = () => {
    setActiveModule(null)
  }

  // Update module list (add/remove)
  const handleUpdateModules = (newModules) => {
    updateSession({ modules: newModules })
  }

  // Build clientData object for KYC wizard / PDF generators
  const buildClientData = () => ({
    signerType: session.signerType,
    clientA: { ...session.clientA },
    clientB: session.signerType === 'couple' ? { ...session.clientB } : null,
    advisor: session.advisor,
    clientType: session.clientType,
    clientSubType: session.clientSubType,
    path: session.path,
  })

  // If an active module is selected, render that module
  if (activeModule) {
    if (activeModule === 'kyc') {
      return (
        <Wizard
          user={user}
          onLogout={onLogout}
          onAdmin={onAdmin}
          clientData={buildClientData()}
          onComplete={() => handleModuleComplete('kyc')}
          onBack={handleModuleBack}
        />
      )
    }

    // Placeholder for future modules
    return (
      <div className="min-h-screen bg-surface-offwhite">
        <WizardHeader user={user} onLogout={onLogout} onAdmin={onAdmin} />
        <div className="max-w-2xl mx-auto px-4 py-10 text-center">
          <h2 className="text-xl font-extrabold text-green-primary mb-4">
            {session.modules.find((m) => m.id === activeModule)?.name || activeModule}
          </h2>
          <p className="text-sm text-text-muted mb-8">מודול זה בפיתוח</p>
          <button
            onClick={handleModuleBack}
            className="px-6 py-2.5 border border-border rounded-card text-sm font-semibold text-text-primary hover:bg-surface-light transition-colors"
          >
            חזרה למודולים
          </button>
        </div>
      </div>
    )
  }

  // Session flow steps
  return (
    <div className="min-h-screen bg-surface-offwhite">
      <WizardHeader user={user} onLogout={onLogout} onAdmin={onAdmin} />
      <div className="max-w-3xl mx-auto px-4 py-5">
        {/* Step indicator */}
        {step !== 'advisor' && (
          <div className="flex items-center justify-center gap-2 mb-6">
            {STEPS.map((s, i) => {
              const stepIndex = STEPS.indexOf(step)
              const isActive = s === step
              const isDone = i < stepIndex
              return (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full transition-all ${
                    isActive ? 'bg-green-primary scale-125' : isDone ? 'bg-gold' : 'bg-border'
                  }`} />
                  {i < STEPS.length - 1 && (
                    <div className={`w-8 h-0.5 ${isDone ? 'bg-gold' : 'bg-border'}`} />
                  )}
                </div>
              )
            })}
          </div>
        )}

        {step === 'advisor' && (
          <AdvisorSelect onSelect={handleAdvisorSelect} />
        )}

        {step === 'clientType' && (
          <ClientTypeStep
            session={session}
            onUpdate={updateSession}
            onNext={handleClientTypeDone}
            onBack={() => {
              updateSession({ advisor: null, clientType: '', clientSubType: '', path: '' })
              setStep('advisor')
            }}
          />
        )}

        {step === 'clientDetails' && (
          <ClientDetailsStep
            session={session}
            onUpdate={updateSession}
            onNext={handleClientDetailsDone}
            onBack={() => {
              updateSession({ clientType: '', clientSubType: '', path: '' })
              setStep('clientType')
            }}
          />
        )}

        {step === 'modules' && (
          <ModuleSelection
            session={session}
            onModuleStart={handleModuleStart}
            onUpdateModules={handleUpdateModules}
            onEndSession={resetSession}
          />
        )}
      </div>
    </div>
  )
}
