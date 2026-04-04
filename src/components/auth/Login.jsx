import { useState } from 'react'
import { authenticate } from '../../data/users'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const user = authenticate(username, password)
    if (user) {
      onLogin(user)
    } else {
      setError('שם משתמש או סיסמה שגויים')
    }
  }

  return (
    <div className="min-h-screen bg-surface-offwhite flex items-center justify-center p-4">
      <div className="bg-white rounded-card shadow-metric w-full max-w-sm p-8">
        <div className="flex justify-center mb-6">
          <img
            src="/logoLight.png"
            alt="GREEN Wealth Management"
            className="h-16 object-contain"
          />
        </div>
        <h1 className="text-xl font-bold text-green-primary text-center mb-1 font-assistant">
          פורטל טפסים GREEN
        </h1>
        <p className="text-sm text-text-muted text-center mb-6">
          כניסה למערכת
        </p>

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-text-primary mb-1">
              שם משתמש
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                setError('')
              }}
              autoComplete="off"
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-green-secondary focus:ring-1 focus:ring-green-secondary"
              placeholder="הכנס שם משתמש"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-text-primary mb-1">
              סיסמה
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              autoComplete="off"
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-green-secondary focus:ring-1 focus:ring-green-secondary"
              placeholder="הכנס סיסמה"
            />
          </div>

          {error && (
            <p className="text-negative text-sm mb-4 text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-green-primary text-white font-semibold rounded-lg hover:bg-green-secondary transition-colors"
          >
            כניסה
          </button>
        </form>
      </div>
    </div>
  )
}
