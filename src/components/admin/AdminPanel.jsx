import { useState } from 'react'

export default function AdminPanel({ onBack }) {
  const [activeTab, setActiveTab] = useState('questions')

  const tabs = [
    { id: 'questions', label: 'שאלות סיכון' },
    { id: 'scoring', label: 'טבלת ניקוד' },
    { id: 'users', label: 'משתמשים' },
  ]

  return (
    <div className="min-h-screen bg-surface-offwhite">
      <header className="bg-green-primary text-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logoLight.png" alt="GREEN" className="h-8 object-contain brightness-0 invert" />
            <span className="text-sm font-semibold opacity-80">ניהול מערכת</span>
          </div>
          <button
            onClick={onBack}
            className="text-xs px-3 py-1 border border-white/30 rounded-lg hover:bg-white/10 transition-colors"
          >
            חזרה לשאלון
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-green-primary text-white'
                  : 'bg-white border border-border text-text-muted hover:border-green-secondary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-card shadow-card p-6">
          {activeTab === 'questions' && <QuestionsTab />}
          {activeTab === 'scoring' && <ScoringTab />}
          {activeTab === 'users' && <UsersTab />}
        </div>
      </div>
    </div>
  )
}

function QuestionsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-green-primary">שאלות מחשבון הסיכון</h2>
      <p className="text-sm text-text-muted">
        כאן ניתן לערוך את שאלות הסיכון ותשובותיהן. שינויים ישפיעו על שאלונים חדשים בלבד.
      </p>

      {[1, 2, 3, 4].map((q) => (
        <div key={q} className="border border-border rounded-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-green-primary">שאלה {q}</span>
            <span className="text-xs text-text-muted bg-surface-light px-2 py-1 rounded-pill">
              {q === 1 || q === 3 ? '4 תשובות' : '3 תשובות'}
            </span>
          </div>
          <div className="bg-surface-cream rounded-lg p-3 text-sm text-text-muted">
            עריכת שאלות תהיה זמינה בגרסה הבאה.
            <br />
            כרגע השאלות מוגדרות בקוד לפי התכנון שאושר.
          </div>
        </div>
      ))}
    </div>
  )
}

function ScoringTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-green-primary">טבלת ניקוד ודרגות</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-green-primary text-gold-light">
              <th className="p-3 text-right font-semibold">דרגה</th>
              <th className="p-3 text-right font-semibold">שם</th>
              <th className="p-3 text-right font-semibold">טווח ציון</th>
              <th className="p-3 text-right font-semibold">הפסד מקסימלי</th>
              <th className="p-3 text-right font-semibold">מניות מקס׳</th>
              <th className="p-3 text-right font-semibold">אג״ח קונצרני</th>
            </tr>
          </thead>
          <tbody>
            {[
              { level: 1, name: 'שמרן', range: '1.0-1.9', loss: 'עד 5%', stocks: '0%', bonds: 'עד 25%' },
              { level: 2, name: 'שמרן-מתון', range: '2.0-2.9', loss: 'עד 10%', stocks: 'עד 15%', bonds: 'עד 50%' },
              { level: 3, name: 'מאוזן', range: '3.0-3.7', loss: 'עד 15%', stocks: 'עד 25%', bonds: 'עד 100%' },
              { level: 4, name: 'צמיחה', range: '3.8-4.4', loss: 'מעל 15%', stocks: 'עד 35%', bonds: 'עד 100%' },
              { level: 5, name: 'אגרסיבי', range: '4.5-5.0', loss: 'משמעותי', stocks: 'עד 100%', bonds: '100%' },
            ].map((row, i) => (
              <tr key={row.level} className={i % 2 === 0 ? 'bg-white' : 'bg-surface-light'}>
                <td className="p-3 font-bold text-green-primary">{row.level}</td>
                <td className="p-3">{row.name}</td>
                <td className="p-3">{row.range}</td>
                <td className="p-3">{row.loss}</td>
                <td className="p-3">{row.stocks}</td>
                <td className="p-3">{row.bonds}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-surface-cream rounded-lg p-3 text-sm text-text-muted">
        עריכת הטבלה תהיה זמינה בגרסה הבאה.
      </div>
    </div>
  )
}

function UsersTab() {
  const users = [
    { username: 'eyal', name: 'אייל גרין', role: 'admin' },
    { username: 'yuval', name: 'יובל', role: 'advisor' },
    { username: 'advisor3', name: 'יועץ 3', role: 'advisor' },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-green-primary">משתמשים</h2>

      <div className="space-y-3">
        {users.map((u) => (
          <div key={u.username} className="flex items-center justify-between p-4 border border-border rounded-card">
            <div>
              <div className="font-semibold text-text-primary">{u.name}</div>
              <div className="text-sm text-text-muted">{u.username}</div>
            </div>
            <span className={`text-xs px-3 py-1 rounded-pill font-semibold ${
              u.role === 'admin'
                ? 'bg-gold/20 text-green-primary border border-gold'
                : 'bg-surface-light text-text-muted border border-border'
            }`}>
              {u.role === 'admin' ? 'מנהל + יועץ' : 'יועץ'}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-surface-cream rounded-lg p-3 text-sm text-text-muted">
        הוספת ועריכת משתמשים תהיה זמינה בגרסה הבאה.
      </div>
    </div>
  )
}
