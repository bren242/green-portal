// User management - in-memory store
// Initial users loaded on app start, admin can modify via UI
// Changes persist only during the session (no backend)

let users = [
  {
    id: '1',
    username: 'eyal',
    password: 'green2024',
    name: 'אייל גרין',
    idNumber: '',
    license: '',
    role: 'admin',
  },
  {
    id: '2',
    username: 'yuval',
    password: 'green2024',
    name: 'יובל',
    idNumber: '',
    license: '',
    role: 'advisor',
  },
  {
    id: '3',
    username: 'advisor3',
    password: 'green2024',
    name: 'יועץ 3',
    idNumber: '',
    license: '',
    role: 'advisor',
  },
]

export function getUsers() {
  return users.map((u) => ({ ...u, password: undefined }))
}

export function getUsersFull() {
  return [...users]
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
  return { ...newUser, password: undefined }
}

export function updateUser(id, updates) {
  users = users.map((u) => (u.id === id ? { ...u, ...updates } : u))
  return getUsersFull().find((u) => u.id === id)
}

export function deleteUser(id) {
  users = users.filter((u) => u.id !== id)
}

// Get user with full details (for PDF)
export function getUserById(id) {
  const user = users.find((u) => u.id === id)
  return user ? { ...user, password: undefined } : null
}
