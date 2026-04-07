import { useState, useMemo } from 'react'
import { createEmptyForm, WIZARD_STEPS, validateStep } from '../../data/formSchema'
import WizardHeader from './WizardHeader'
import WizardProgress from './WizardProgress'
import GateStep from './steps/GateStep'
import PersonalStep from './steps/PersonalStep'
import FinancialStep from './steps/FinancialStep'
import GoalsStep from './steps/GoalsStep'
import LiquidityStep from './steps/LiquidityStep'
import RiskStep from './steps/RiskStep'
import AdvisorStep from './steps/AdvisorStep'

export default function Wizard({ user, onLogout, onAdmin, clientData, onSavePDF, onComplete, onBack }) {
  // When clientData is passed from session, pre-fill and skip gate+personal steps
  const hasSessionData = !!clientData

  const initialForm = useMemo(() => {
    const form = createEmptyForm()
    if (clientData) {
      form.signerType = clientData.signerType || ''
      if (clientData.clientA) form.clientA = { ...form.clientA, ...clientData.clientA }
      if (clientData.clientB) form.clientB = { ...form.clientB, ...clientData.clientB }
    }
    return form
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // If session data provided, skip gate and personal steps (already filled)
  const activeSteps = useMemo(() => {
    if (hasSessionData) {
      return WIZARD_STEPS.filter((s) => s.id !== 'gate' && s.id !== 'personal')
    }
    return WIZARD_STEPS
  }, [hasSessionData])

  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState(initialForm)
  const [validationErrors, setValidationErrors] = useState([])

  const updateForm = (updates) => {
    setFormData((prev) => ({ ...prev, ...updates }))
    // Clear validation errors when user edits
    if (validationErrors.length > 0) setValidationErrors([])
  }

  const toggleRefusal = (field, label) => {
    setFormData((prev) => {
      const exists = prev.refusals.find((r) => r.field === field)
      if (exists) {
        return { ...prev, refusals: prev.refusals.filter((r) => r.field !== field) }
      }
      return { ...prev, refusals: [...prev.refusals, { field, label }] }
    })
  }

  const isRefused = (field) => formData.refusals.some((r) => r.field === field)

  const nextStep = () => {
    const stepId = activeSteps[currentStep].id
    const errors = validateStep(stepId, formData)
    if (errors.length > 0) {
      setValidationErrors(errors)
      window.scrollTo(0, 0)
      return
    }
    setValidationErrors([])
    if (currentStep < activeSteps.length - 1) {
      setCurrentStep((s) => s + 1)
      window.scrollTo(0, 0)
    }
  }

  const prevStep = () => {
    setValidationErrors([])
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1)
      window.scrollTo(0, 0)
    }
  }

  const goToStep = (index) => {
    setValidationErrors([])
    setCurrentStep(index)
    window.scrollTo(0, 0)
  }

  // When session provides advisor data, use it for PDF generation instead of login user
  // IMPORTANT: id must also be overridden so getSignature() uses the advisor's signature, not the logged-in user's
  const effectiveUser = hasSessionData && clientData.advisor
    ? { ...user, id: clientData.advisor.id, name: clientData.advisor.name, idNumber: clientData.advisor.idNumber, license: clientData.advisor.license }
    : user
  console.log('[Wizard] signature key:', effectiveUser.id, '— advisor:', clientData.advisor?.name || 'none')

  const stepProps = {
    formData,
    updateForm,
    toggleRefusal,
    isRefused,
    user: effectiveUser,
    onSavePDF,
    onComplete,
  }

  const renderStep = () => {
    switch (activeSteps[currentStep].id) {
      case 'gate': return <GateStep {...stepProps} />
      case 'personal': return <PersonalStep {...stepProps} />
      case 'financial': return <FinancialStep {...stepProps} />
      case 'goals': return <GoalsStep {...stepProps} />
      case 'liquidity': return <LiquidityStep {...stepProps} />
      case 'risk': return <RiskStep {...stepProps} />
      case 'advisor': return <AdvisorStep {...stepProps} />
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-surface-offwhite">
      <WizardHeader user={user} onLogout={onLogout} onAdmin={onAdmin} />
      <div className="max-w-3xl mx-auto px-4 py-5">
        {/* Back to modules button (when inside session flow) */}
        {hasSessionData && (
          <button
            onClick={onBack}
            className="text-sm text-text-muted hover:text-green-primary transition-colors mb-3"
          >
            ← חזרה למודולים
          </button>
        )}

        <WizardProgress
          steps={activeSteps}
          currentStep={currentStep}
          onStepClick={goToStep}
        />

        {/* Validation errors */}
        {validationErrors.length > 0 && (
          <div className="bg-warning-bg border border-warning-border rounded-card p-4 mt-4">
            <p className="text-sm font-bold text-warning-red mb-2">נא לתקן את השדות הבאים:</p>
            <ul className="text-sm text-warning-red space-y-1">
              {validationErrors.map((err) => (
                <li key={err.field}>• {err.message}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Main card */}
        <div className="bg-white rounded-card shadow-card border border-border/50 p-6 md:p-8 mt-4">
          <div className="mb-6">
            <h2 className="text-lg font-extrabold text-green-primary">
              {activeSteps[currentStep].title}
            </h2>
            <p className="text-sm text-text-muted mt-0.5">
              {activeSteps[currentStep].subtitle}
            </p>
            <div className="h-[2px] bg-gold/30 mt-3 rounded-full" />
          </div>
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-5">
          <button
            onClick={currentStep === 0 && hasSessionData ? onBack : prevStep}
            disabled={currentStep === 0 && !hasSessionData}
            className="px-6 py-2.5 border border-border rounded-card text-sm font-semibold text-text-primary hover:bg-surface-light transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
          >
            הקודם
          </button>
          {currentStep < activeSteps.length - 1 ? (
            <button
              onClick={nextStep}
              className="px-8 py-2.5 bg-green-primary text-white rounded-card text-sm font-bold hover:bg-green-secondary transition-colors shadow-card"
            >
              הבא
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
