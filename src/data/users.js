// User management — persisted in localStorage
// Admin config data is the ONE exception to the "no localStorage" rule.
// Client data stays in React state only.

const LS_KEY = 'green_users'

const DEFAULT_USERS = [
  {
    id: '1',
    username: 'eyal',
    password: 'green2026',
    name: 'אייל ברנר',
    idNumber: '',
    license: '',
    role: 'admin',
  },
  {
    id: '2',
    username: 'yuval',
    password: 'green2026',
    name: 'יובל לרר',
    idNumber: '',
    license: '',
    role: 'advisor',
  },
  {
    id: '3',
    username: 'yuval_koren',
    password: 'green2026',
    name: 'יובל קורן',
    idNumber: '',
    license: '',
    role: 'advisor',
  },
]

function loadUsers() {
  try {
    const stored = localStorage.getItem(LS_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Guard: filter out any null/undefined entries that could corrupt .map() calls
      const valid = Array.isArray(parsed) ? parsed.filter((u) => u && u.id) : null
      if (valid && valid.length > 0) return valid
    }
  } catch (e) {
    console.warn('Failed to load users from localStorage:', e)
  }
  return DEFAULT_USERS.map((u) => ({ ...u }))
}

function saveUsers() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(users))
  } catch (e) {
    console.warn('Failed to save users to localStorage:', e)
  }
}

let users = loadUsers()

export function getUsers() {
  return users.filter((u) => u && u.id).map((u) => ({ ...u, password: undefined }))
}

export function getUsersFull() {
  return users.filter((u) => u && u.id)
}

export function authenticate(username, password) {
  const user = users.find(
    (u) => u.username === username && u.password === password
  )
  return user ? { ...user, password: undefined } : null
}

export function addUser(userData) {
  const id = String(Date.now())
  const newUser = { id, ...userData }
  users = [...users, newUser]
  saveUsers()
  return { ...newUser, password: undefined }
}

export function updateUser(id, updates) {
  users = users.map((u) => (u.id === id ? { ...u, ...updates } : u))
  saveUsers()
  return getUsersFull().find((u) => u.id === id)
}

export function deleteUser(id) {
  users = users.filter((u) => u.id !== id)
  saveUsers()
}

// Get all advisors (for session advisor selector)
export function getAdvisors() {
  console.log('[users] getAdvisors — raw users:', JSON.stringify(users.map(u => u?.id)))
  return users.filter((u) => u && u.id).map((u) => ({
    id: u.id,
    name: u.name,
    idNumber: u.idNumber || '',
    license: u.license || '',
  }))
}

// Get user with full details (for PDF)
export function getUserById(id) {
  const user = users.find((u) => u.id === id)
  return user ? { ...user, password: undefined } : null
}
