import { useState, useEffect, useCallback } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/auth/Login'
import Wizard from './components/wizard/Wizard'
import AdminPanel from './components/admin/AdminPanel'
import PDFPreviewPage from './components/pdf/PDFPreviewPage'

const INACTIVITY_TIMEOUT = 10 * 60 * 1000 // 10 minutes

function App() {
  const [user, setUser] = useState(null)
  const [view, setView] = useState('wizard') // 'wizard' | 'admin'
  const [lastActivity, setLastActivity] = useState(Date.now())

  const handleLogout = useCallback(() => {
    setUser(null)
    setView('wizard')
  }, [])

  // Inactivity timeout
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
    return <AdminPanel onBack={() => setView('wizard')} />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Wizard
              user={user}
              onLogout={handleLogout}
              onAdmin={user.role === 'admin' ? () => setView('admin') : null}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
