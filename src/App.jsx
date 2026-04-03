import { useState, useEffect, useCallback } from 'react'
import Login from './components/auth/Login'
import AdminPanel from './components/admin/AdminPanel'
import SessionFlow from './components/session/SessionFlow'
import PDFPreviewPage from './components/pdf/PDFPreviewPage'

const INACTIVITY_TIMEOUT = 10 * 60 * 1000 // 10 minutes

function App() {
  const [user, setUser] = useState(null)
  const [view, setView] = useState('session') // 'session' | 'admin'
  const [lastActivity, setLastActivity] = useState(Date.now())

  const handleLogout = useCallback(() => {
    setUser(null)
    setView('session')
  }, [])

  // Inactivity timeout — resets ALL state back to login
  useEffect(() => {
    if (!user) return

    const checkInactivity = setInterval(() => {
      if (Date.now() - lastActivity > INACTIVITY_TIMEOUT) {
        handleLogout()
      }
    }, 30000)

    const resetActivity = () => setLastActivity(Date.now())
    window.addEventListener('mousemove', resetActivity)
    window.addEventListener('keydown', resetActivity)
    window.addEventListener('click', resetActivity)
    window.addEventListener('touchstart', resetActivity)

    return () => {
      clearInterval(checkInactivity)
      window.removeEventListener('mousemove', resetActivity)
      window.removeEventListener('keydown', resetActivity)
      window.removeEventListener('click', resetActivity)
      window.removeEventListener('touchstart', resetActivity)
    }
  }, [user, lastActivity, handleLogout])

  // Dev preview mode — bypass login
  if (window.location.search.includes('preview=pdf')) {
    return <PDFPreviewPage />
  }

  if (!user) {
    return <Login onLogin={setUser} />
  }

  if (view === 'admin' && user.role === 'admin') {
    return <AdminPanel onBack={() => setView('session')} />
  }

  return (
    <SessionFlow
      user={user}
      onLogout={handleLogout}
      onAdmin={user.role === 'admin' ? () => setView('admin') : null}
    />
  )
}

export default App
