import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Eye, EyeOff } from 'lucide-react'
import { saveAuth } from '../utils/auth'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

export default function SuperLoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${BACKEND}/api/auth/super/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) return setError(data.error || 'Ошибка входа')
      saveAuth(data.token, { role: 'superadmin' })
      navigate('/super')
    } catch {
      setError('Сервер недоступен')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0f172a 0%, #0a1628 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: '100%', maxWidth: 380,
          background: '#1e293b',
          border: '1px solid rgba(167,139,250,0.2)',
          borderRadius: 24, padding: 32,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 56, height: 56,
            background: 'rgba(167,139,250,0.15)',
            border: '1px solid rgba(167,139,250,0.3)',
            borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px',
          }}>
            <Shield size={24} color="#a78bfa" />
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9' }}>Супер-админ</h1>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>SmartMenu</p>
        </div>

        <form onSubmit={handleLogin}>
          {[
            { key: 'username', label: 'Логин', placeholder: 'Супер-логин' },
            { key: 'password', label: 'Пароль', placeholder: 'Супер-пароль', isPass: true },
          ].map(({ key, label, placeholder, isPass }) => (
            <div key={key} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {label}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={isPass && !showPass ? 'password' : 'text'}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  required
                  style={{
                    width: '100%', padding: isPass ? '11px 44px 11px 14px' : '11px 14px',
                    background: '#0f172a',
                    border: '1px solid rgba(167,139,250,0.15)',
                    borderRadius: 10, color: '#f1f5f9',
                    fontSize: 14, outline: 'none', fontFamily: 'inherit',
                  }}
                />
                {isPass && (
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                )}
              </div>
            </div>
          ))}

          {error && (
            <div style={{ marginBottom: 14, padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, color: '#f87171', fontSize: 13 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '13px',
              background: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
              border: 'none', borderRadius: 12,
              color: 'white', fontSize: 15, fontWeight: 700,
              cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.7 : 1,
              marginTop: 6,
            }}
          >
            {loading ? 'Входим...' : 'Войти'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <button
            onClick={() => navigate('/login')}
            style={{ background: 'none', border: 'none', color: '#475569', fontSize: 12, cursor: 'pointer' }}
          >
            ← Войти как обычный админ
          </button>
        </div>
      </motion.div>
    </div>
  )
}
