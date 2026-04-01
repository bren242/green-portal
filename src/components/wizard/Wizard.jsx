import { useState } from 'react'
import { createEmptyForm, WIZARD_STEPS } from '../../data/formSchema'
import WizardHeader from './WizardHeader'
import WizardProgress from './WizardProgress'
import GateStep from './steps/GateStep'
import PersonalStep from './steps/PersonalStep'
import FinancialStep from './steps/FinancialStep'
import GoalsStep from './steps/GoalsStep'
import LiquidityStep from './steps/LiquidityStep'
import RiskStep from './steps/RiskStep'
import AdvisorStep from './steps/AdvisorStep'

export default function Wizard({ user, onLogout, onAdmin }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState(createEmptyForm())

  const updateForm = (updates) => {
    setFormData((prev) => ({ ...prev, ...updates }))
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
    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep((s) => s + 1)
      window.scrollTo(0, 0)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1)
      window.scrollTo(0, 0)
    }
  }

  const goToStep = (index) => {
    setCurrentStep(index)
    window.scrollTo(0, 0)
  }

  const stepProps = {
    formData,
    updateForm,
    toggleRefusal,
    isRefused,
    user,
  }

  const renderStep = () => {
    switch (WIZARD_STEPS[currentStep].id) {
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
      <div className="max-w-3xl mx-auto px-4 py-6">
        <WizardProgress
          steps={WIZARD_STEPS}
          currentStep={currentStep}
          onStepClick={goToStep}
        />
        <div className="bg-white rounded-card shadow-card p-6 md:p-8 mt-6">
          <h2 className="text-xl font-bold text-green-primary mb-1">
            {WIZARD_STEPS[currentStep].title}
          </h2>
          <p className="text-sm text-text-muted mb-6">
            {WIZARD_STEPS[currentStep].subtitle}
          </p>
          {renderStep()}
        </div>
        <div className="flex justify-between mt-6">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-6 py-2.5 border border-border rounded-lg text-sm font-semibold text-text-primary hover:bg-surface-light transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            הקודם
          </button>
          {currentStep < WIZARD_STEPS.length - 1 ? (
            <button
              onClick={nextStep}
              className="px-6 py-2.5 bg-green-primary text-white rounded-lg text-sm font-semibold hover:bg-green-secondary transition-colors"
            >
              הבא
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
