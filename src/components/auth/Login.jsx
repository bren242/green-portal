import { useState } from 'react'
import { authenticate } from '../../data/users'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

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
          פורטל טפסים גרין
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
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
                autoComplete="off"
                className="w-full px-3 py-2 pl-10 border border-border rounded-lg text-sm focus:outline-none focus:border-green-secondary focus:ring-1 focus:ring-green-secondary"
                placeholder="הכנס סיסמה"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-green-primary transition-colors p-1"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
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
