import { useState } from 'react'
import { getUsersFull, addUser, updateUser, deleteUser } from '../../data/users'
import { getQualifiedAmounts, saveQualifiedAmounts, DEFAULT_QUALIFIED_AMOUNTS } from '../../data/qualifiedAmounts'
import { getAdminSettings, saveAdminSettings } from '../../data/adminSettings'

export default function AdminPanel({ onBack }) {
  const [activeTab, setActiveTab] = useState('users')

  const tabs = [
    { id: 'users', label: 'משתמשים' },
    { id: 'qualified', label: 'סכומי כשיר' },
    { id: 'desk', label: 'דסק תפעול' },
    { id: 'scoring', label: 'טבלת ניקוד' },
    { id: 'questions', label: 'שאלות סיכון' },
  ]

  return (
    <div className="min-h-screen bg-surface-offwhite">
      <header>
        <div className="bg-surface-offwhite border-b border-border/50">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <img src="/logoLight.png" alt="GREEN" className="h-10 object-contain" />
            <button
              onClick={onBack}
              className="text-xs px-4 py-1.5 border border-border text-text-muted rounded-pill hover:bg-surface-light transition-colors"
            >
              חזרה לשאלון
            </button>
          </div>
        </div>
        <div className="bg-green-primary">
          <div className="max-w-4xl mx-auto px-4 py-1.5">
            <span className="text-xs font-semibold text-gold-light">ניהול מערכת</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-pill text-sm font-semibold transition-all ${
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
          {activeTab === 'users' && <UsersTab />}
          {activeTab === 'qualified' && <QualifiedAmountsTab />}
          {activeTab === 'desk' && <DeskSettingsTab />}
          {activeTab === 'scoring' && <ScoringTab />}
          {activeTab === 'questions' && <QuestionsTab />}
        </div>
      </div>
    </div>
  )
}

function UsersTab() {
  const [users, setUsers] = useState(getUsersFull())
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})
  const [showNew, setShowNew] = useState(false)
  const [newUser, setNewUser] = useState({ username: '', password: '', name: '', idNumber: '', license: '', role: 'advisor' })

  const refreshUsers = () => setUsers(getUsersFull())

  const startEdit = (user) => {
    setEditingId(user.id)
    setEditData({ ...user })
  }

  const saveEdit = () => {
    updateUser(editingId, editData)
    setEditingId(null)
    refreshUsers()
  }

  const handleDelete = (id, name) => {
    if (confirm(`למחוק את ${name}?`)) {
      deleteUser(id)
      refreshUsers()
    }
  }

  const handleAdd = () => {
    if (!newUser.username || !newUser.password || !newUser.name) {
      alert('נא למלא שם משתמש, סיסמה ושם מלא')
      return
    }
    addUser(newUser)
    setNewUser({ username: '', password: '', name: '', idNumber: '', license: '', role: 'advisor' })
    setShowNew(false)
    refreshUsers()
  }

  const fieldClass = "w-full px-2 py-1.5 border border-border rounded-lg text-sm focus:outline-none focus:border-green-secondary"

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-green-primary">ניהול משווקים</h2>
        <button
          onClick={() => setShowNew(!showNew)}
          className="text-sm px-4 py-2 bg-green-primary text-white rounded-lg hover:bg-green-secondary transition-colors font-semibold"
        >
          {showNew ? 'ביטול' : '+ הוסף משווק'}
        </button>
      </div>

      {/* New user form */}
      {showNew && (
        <div className="border border-gold rounded-card p-4 bg-surface-cream space-y-3">
          <h3 className="text-sm font-bold text-green-primary">משווק חדש</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <input className={fieldClass} placeholder="שם מלא *" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} autoComplete="off" />
            <input className={fieldClass} placeholder="שם משתמש *" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} autoComplete="off" />
            <input className={fieldClass} placeholder="סיסמה *" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} autoComplete="off" />
            <input className={fieldClass} placeholder="תעודת זהות" value={newUser.idNumber} onChange={(e) => setNewUser({ ...newUser, idNumber: e.target.value })} autoComplete="off" />
            <input className={fieldClass} placeholder="מספר רישיון" value={newUser.license} onChange={(e) => setNewUser({ ...newUser, license: e.target.value })} autoComplete="off" />
            <select className={fieldClass} value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} autoComplete="off">
              <option value="advisor">משווק</option>
              <option value="admin">מנהל + משווק</option>
            </select>
          </div>
          <button onClick={handleAdd} className="px-5 py-2 bg-green-primary text-white rounded-lg text-sm font-semibold hover:bg-green-secondary">שמור</button>
        </div>
      )}

      {/* Users list */}
      <div className="space-y-3">
        {users.map((u) => (
          <div key={u.id} className="border border-border rounded-card p-4">
            {editingId === u.id ? (
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs text-text-muted">שם מלא</label>
                    <input className={fieldClass} value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} autoComplete="off" />
                  </div>
                  <div>
                    <label className="text-xs text-text-muted">שם משתמש</label>
                    <input className={fieldClass} value={editData.username} onChange={(e) => setEditData({ ...editData, username: e.target.value })} autoComplete="off" />
                  </div>
                  <div>
                    <label className="text-xs text-text-muted">סיסמה</label>
                    <input className={fieldClass} value={editData.password} onChange={(e) => setEditData({ ...editData, password: e.target.value })} autoComplete="off" />
                  </div>
                  <div>
                    <label className="text-xs text-text-muted">תעודת זהות</label>
                    <input className={fieldClass} value={editData.idNumber || ''} onChange={(e) => setEditData({ ...editData, idNumber: e.target.value })} autoComplete="off" />
                  </div>
                  <div>
                    <label className="text-xs text-text-muted">מספר רישיון</label>
                    <input className={fieldClass} value={editData.license || ''} onChange={(e) => setEditData({ ...editData, license: e.target.value })} autoComplete="off" />
                  </div>
                  <div>
                    <label className="text-xs text-text-muted">תפקיד</label>
                    <select className={fieldClass} value={editData.role} onChange={(e) => setEditData({ ...editData, role: e.target.value })} autoComplete="off">
                      <option value="advisor">משווק</option>
                      <option value="admin">מנהל + משווק</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={saveEdit} className="px-4 py-1.5 bg-green-primary text-white rounded-lg text-sm font-semibold hover:bg-green-secondary">שמור</button>
                  <button onClick={() => setEditingId(null)} className="px-4 py-1.5 border border-border rounded-lg text-sm text-text-muted hover:bg-surface-light">ביטול</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-text-primary">{u.name}</div>
                  <div className="text-xs text-text-muted mt-0.5">
                    {u.username} {u.idNumber ? `| ת.ז: ${u.idNumber}` : ''} {u.license ? `| רישיון: ${u.license}` : ''}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-3 py-1 rounded-pill font-semibold ${
                    u.role === 'admin'
                      ? 'bg-gold/20 text-green-primary border border-gold'
                      : 'bg-surface-light text-text-muted border border-border'
                  }`}>
                    {u.role === 'admin' ? 'מנהל' : 'משווק'}
                  </span>
                  <button onClick={() => startEdit(u)} className="text-xs px-3 py-1 border border-border rounded-lg text-text-muted hover:bg-surface-light">עריכה</button>
                  <button onClick={() => handleDelete(u.id, u.name)} className="text-xs px-3 py-1 border border-warning-border rounded-lg text-warning-red hover:bg-warning-bg">מחיקה</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function QualifiedAmountsTab() {
  const [amounts, setAmounts] = useState(getQualifiedAmounts())
  const [saved, setSaved] = useState(false)

  const handleChange = (key, value) => {
    setAmounts((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const handleSave = () => {
    saveQualifiedAmounts(amounts)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    setAmounts({ ...DEFAULT_QUALIFIED_AMOUNTS })
    setSaved(false)
  }

  const fieldClass = "w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-green-secondary text-right"

  const fields = [
    { key: 'amount1', label: 'תנאי 1: נכסים נזילים', desc: 'מיליון ש"ח' },
    { key: 'amount2', label: 'תנאי 2: הכנסה אישית', desc: 'מיליון ש"ח' },
    { key: 'amount3', label: 'תנאי 2: הכנסת תא משפחתי', desc: 'מיליון ש"ח' },
    { key: 'amount4', label: 'תנאי 3: נכסים נזילים (משולב)', desc: 'מיליון ש"ח' },
    { key: 'amount5', label: 'תנאי 3: הכנסה אישית (משולב)', desc: 'ש"ח' },
    { key: 'amount6', label: 'תנאי 3: הכנסת תא משפחתי (משולב)', desc: 'מיליון ש"ח' },
    { key: 'amount_advisor', label: 'חוק הייעוץ: שווי נכסים', desc: 'מיליון ש"ח' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-green-primary">סכומי לקוח כשיר</h2>
        <span className="text-xs text-text-muted">מתעדכנים שנתית לפי רגולציה</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="text-xs font-semibold text-text-primary block mb-1">{f.label}</label>
            <div className="flex items-center gap-2">
              <input
                className={fieldClass}
                value={amounts[f.key]}
                onChange={(e) => handleChange(f.key, e.target.value)}
                autoComplete="off"
              />
              <span className="text-xs text-text-muted whitespace-nowrap">{f.desc}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-green-primary text-white rounded-lg text-sm font-semibold hover:bg-green-secondary transition-colors"
        >
          שמור
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 border border-border rounded-lg text-sm text-text-muted hover:bg-surface-light transition-colors"
        >
          אפס לברירת מחדל
        </button>
        {saved && (
          <span className="text-sm text-positive font-semibold">✓ נשמר</span>
        )}
      </div>
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
              <th className="p-3 text-right font-semibold">טווח</th>
              <th className="p-3 text-right font-semibold">הפסד מקס׳</th>
              <th className="p-3 text-right font-semibold">מניות</th>
              <th className="p-3 text-right font-semibold">אג״ח</th>
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
    </div>
  )
}

function QuestionsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-green-primary">שאלות מחשבון הסיכון</h2>
      <p className="text-sm text-text-muted">עריכת שאלות תהיה זמינה בגרסה הבאה.</p>
      {[1, 2, 3, 4].map((q) => (
        <div key={q} className="border border-border rounded-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-green-primary">שאלה {q}</span>
            <span className="text-xs text-text-muted bg-surface-light px-2 py-1 rounded-pill">
              {q === 1 || q === 3 ? '4 תשובות' : '3 תשובות'}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

function DeskSettingsTab() {
  const _init = getAdminSettings()
  const [primary, setPrimary] = useState(_init.deskEmailPrimary || '')
  const [secondary, setSecondary] = useState(_init.deskEmailSecondary || '')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    saveAdminSettings({ deskEmailPrimary: primary, deskEmailSecondary: secondary })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h2 className="text-lg font-bold text-green-primary mb-1">הגדרות דסק תפעול</h2>
        <p className="text-sm text-text-muted">כתובות המייל לשליחת הפניות לדסק.</p>
      </div>

      <div className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1">מייל ראשי (TO)</label>
          <input
            type="text"
            value={primary}
            onChange={(e) => { setPrimary(e.target.value); setSaved(false) }}
            placeholder="desk@example.com"
            autoComplete="off"
            dir="ltr"
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-green-secondary focus:ring-1 focus:ring-green-secondary"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1">מייל משני (CC) — אופציונלי</label>
          <input
            type="text"
            value={secondary}
            onChange={(e) => { setSecondary(e.target.value); setSaved(false) }}
            placeholder="cc@example.com"
            autoComplete="off"
            dir="ltr"
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-green-secondary focus:ring-1 focus:ring-green-secondary"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-green-primary text-white rounded-card text-sm font-bold hover:bg-green-secondary transition-colors shadow-card"
        >
          שמור
        </button>
        {saved && (
          <span className="text-sm text-positive font-semibold">נשמר</span>
        )}
      </div>
    </div>
  )
}
