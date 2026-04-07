// Admin settings — persisted in localStorage
// Non-sensitive config only (emails, not credentials)

const LS_KEY = 'green_admin_settings'

const DEFAULT_SETTINGS = {
  deskEmailPrimary: '',
  deskEmailSecondary: '',
}

export function getAdminSettings() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return { ...DEFAULT_SETTINGS }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export function saveAdminSettings(updates) {
  const current = getAdminSettings()
  const next = { ...current, ...updates }
  localStorage.setItem(LS_KEY, JSON.stringify(next))
  return next
}
