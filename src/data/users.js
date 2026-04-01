// Simple auth - prevents random access only
// Users are hardcoded. In production, move to .env
export const USERS = [
  {
    username: 'eyal',
    password: 'green2024',
    name: 'אייל גרין',
    role: 'admin', // admin + advisor
    license: '12345', // placeholder - update with real license number
  },
  {
    username: 'yuval',
    password: 'green2024',
    name: 'יובל',
    role: 'advisor',
    license: '12346',
  },
  {
    username: 'advisor3',
    password: 'green2024',
    name: 'יועץ 3',
    role: 'advisor',
    license: '12347',
  },
]

export function authenticate(username, password) {
  const user = USERS.find(
    (u) => u.username === username && u.password === password
  )
  return user ? { ...user, password: undefined } : null
}
