// Advisor details for session selection
// Each advisor has name, ID number, and ISA license number

export const ADVISORS = [
  {
    id: 'eyal',
    name: 'אייל ברנר',
    idNumber: '',
    license: '',
  },
  {
    id: 'yuval_lerer',
    name: 'יובל לרר',
    idNumber: '',
    license: '',
  },
  {
    id: 'yuval_koren',
    name: 'יובל קורן',
    idNumber: '',
    license: '',
  },
]

// Path definitions — which modules are required per client path
export const PATH_MODULES = {
  new_regular: [
    { id: 'agreement', name: 'הסכם שיווק השקעות', status: 'pending' },
    { id: 'kyc', name: 'איפיון צרכים', status: 'pending' },
    { id: 'meeting', name: 'סיכום פגישה', status: 'pending' },
  ],
  new_qualified: [
    { id: 'agreement', name: 'הסכם שיווק השקעות', status: 'pending', includeQualifiedPage: true },
    { id: 'kyc', name: 'איפיון צרכים', status: 'pending' },
    { id: 'qualified', name: 'הצהרת לקוח כשיר', status: 'pending' },
    { id: 'meeting', name: 'סיכום פגישה', status: 'pending' },
  ],
  existing_regular: [
    { id: 'meeting', name: 'סיכום פגישה', status: 'pending' },
  ],
  existing_fund: [
    { id: 'meeting', name: 'סיכום פגישה', status: 'pending' },
    { id: 'qualified', name: 'הצהרת לקוח כשיר', status: 'pending' },
  ],
}

// All available modules for manual add
export const ALL_MODULES = [
  { id: 'agreement', name: 'הסכם שיווק השקעות' },
  { id: 'kyc', name: 'איפיון צרכים' },
  { id: 'qualified', name: 'הצהרת לקוח כשיר' },
  { id: 'meeting', name: 'סיכום פגישה' },
]

// Blank forms available for manual printing
export const BLANK_FORMS = [
  { id: 'kyc_blank', name: 'איפיון צרכים (ידני)', generator: 'generateBlankPDF' },
  { id: 'agreement_blank', name: 'הסכם שיווק (ידני)', generator: 'generateMarketingAgreementBlank' },
]

// Session data factory
export function createEmptySession() {
  return {
    advisor: null,
    clientType: '',       // 'new' | 'existing'
    clientSubType: '',    // new: 'regular' | 'qualified' / existing: 'regular' | 'fund'
    path: '',             // 'new_regular' | 'new_qualified' | 'existing_regular' | 'existing_fund'
    signerType: '',       // 'single' | 'couple'
    clientA: createEmptyClientDetails(),
    clientB: createEmptyClientDetails(),
    modules: [],          // populated from PATH_MODULES based on path
    completedModules: [], // IDs of completed modules
  }
}

function createEmptyClientDetails() {
  return {
    fullName: '',
    idNumber: '',
    birthDate: '',
    maritalStatus: '',
    phone: '',
    email: '',
    occupation: '',
    dependents: '',
  }
}
