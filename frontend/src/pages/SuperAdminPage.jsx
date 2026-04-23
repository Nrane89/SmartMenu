import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Plus, Trash2, RefreshCw, Building2, User, Key, LogOut, Copy, Check } from 'lucide-react'
import { getToken, getUser, clearAuth, authHeaders } from '../utils/auth'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

export default function SuperAdminPage() {
  const navigate = useNavigate()
  const user = getUser()

  useEffect(() => {
    if (!user || user.role !== 'superadmin') navigate('/super/login')
  }, [])

  const [restaurants, setRestaurants] = useState([])
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('restaurants')
  const [copied, setCopied] = useState('')

  const [newRest, setNewRest] = useState({ name: '', slug: '' })
  const [newAdmin, setNewAdmin] = useState({ restaurantId: '', username: '', password: '', name: '' })
  const [resetId, setResetId] = useState(null)
  const [resetPass, setResetPass] = useState('')

  const fetchAll = async () => {
    setLoading(true)
    const headers = { 'Content-Type': 'application/json', ...authHeaders() }
    const [rRes, aRes] = await Promise.all([
      fetch(`${BACKEND}/api/auth/super/restaurants`, { headers }),
      fetch(`${BACKEND}/api/auth/super/admins`, { headers }),
    ])
    const rData = await rRes.json()
    const aData = await aRes.json()
    setRestaurants(rData.restaurants || [])
    setAdmins(aData.admins || [])
    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

  const addRestaurant = async () => {
    if (!newRest.name || !newRest.slug) return
    const res = await fetch(`${BACKEND}/api/auth/super/restaurants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(newRest),
    })
    const data = await res.json()
    if (res.ok) { setRestaurants((p) => [data, ...p]); setNewRest({ name: '', slug: '' }) }
    else alert(data.error)
  }

  const deleteRestaurant = async (id) => {
    if (!confirm(`Удалить ресторан ${id}?`)) return
    await fetch(`${BACKEND}/api/auth/super/restaurants/${id}`, { method: 'DELETE', headers: authHeaders() })
    setRestaurants((p) => p.filter((r) => r.id !== id))
  }

  const addAdmin = async () => {
    if (!newAdmin.restaurantId || !newAdmin.username || !newAdmin.password) return
    const res = await fetch(`${BACKEND}/api/auth/super/admins`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(newAdmin),
    })
    const data = await res.json()
    if (res.ok) { setAdmins((p) => [...p, data]); setNewAdmin({ restaurantId: '', username: '', password: '', name: '' }) }
    else alert(data.error)
  }

  const deleteAdmin = async (id) => {
    if (!confirm('Удалить этого админа?')) return
    await fetch(`${BACKEND}/api/auth/super/admins/${id}`, { method: 'DELETE', headers: authHeaders() })
    setAdmins((p) => p.filter((a) => a.id !== id))
  }

  const resetPassword = async (id) => {
    if (!resetPass.trim()) return
    await fetch(`${BACKEND}/api/auth/super/admins/${id}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ password: resetPass }),
    })
    setResetId(null)
    setResetPass('')
    alert('Пароль изменён')
  }

  const copyText = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(text)
    setTimeout(() => setCopied(''), 2000)
  }

  const inputStyle = {
    padding: '10px 14px',
    background: '#0f172a',
    border: '1px solid rgba(148,163,184,0.12)',
    borderRadius: 10, color: '#f1f5f9',
    fontSize: 14, outline: 'none', fontFamily: 'inherit',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080f1c', color: '#f1f5f9' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 24px',
        background: 'rgba(15,23,42,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(167,139,250,0.1)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Shield size={20} color="#a78bfa" />
          <h1 style={{ fontSize: 17, fontWeight: 800 }}>SmartMenu — Супер-админ</h1>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={fetchAll} style={{ background: 'rgba(148,163,184,0.08)', border: 'none', borderRadius: 8, padding: '7px 12px', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <RefreshCw size={14} /> Обновить
          </button>
          <button onClick={() => { clearAuth(); navigate('/super/login') }} style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 8, padding: '7px 12px', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <LogOut size={14} /> Выйти
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(148,163,184,0.06)', padding: '0 24px', background: 'rgba(15,23,42,0.5)' }}>
        {[
          { id: 'restaurants', label: 'Рестораны', icon: Building2 },
          { id: 'admins', label: 'Администраторы', icon: User },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '13px 18px', background: 'transparent', border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #a78bfa' : '2px solid transparent',
              color: activeTab === tab.id ? '#a78bfa' : '#64748b',
              cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
            }}
          >
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>

        {/* RESTAURANTS */}
        {activeTab === 'restaurants' && (
          <>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Рестораны ({restaurants.length})</h3>

            {/* Add restaurant */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
              <input value={newRest.name} onChange={(e) => setNewRest({ ...newRest, name: e.target.value })} placeholder="Название ресторана" style={{ ...inputStyle, flex: '1 1 180px' }} />
              <input value={newRest.slug} onChange={(e) => setNewRest({ ...newRest, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} placeholder="slug (aadem, pizza-house...)" style={{ ...inputStyle, flex: '1 1 160px' }} />
              <button onClick={addRestaurant} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', background: 'linear-gradient(135deg, #a78bfa, #7c3aed)', border: 'none', borderRadius: 10, color: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}>
                <Plus size={15} /> Добавить
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {restaurants.map((r) => {
                const menuUrl = `https://menu.aadem.am/menu/${r.id}/T1`
                const kdsUrl = `https://menu.aadem.am/kds/${r.id}`
                const adminCnt = admins.filter((a) => a.restaurantId === r.id).length
                return (
                  <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', background: '#1e293b', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 14 }}>
                    <div style={{ width: 42, height: 42, background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Building2 size={18} color="#a78bfa" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>{r.name}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
                        <code style={{ fontSize: 11, color: '#64748b', background: 'rgba(15,23,42,0.5)', padding: '2px 7px', borderRadius: 6 }}>{r.id}</code>
                        <span style={{ fontSize: 11, color: '#475569' }}>{adminCnt} адм.</span>
                      </div>
                    </div>
                    <button onClick={() => copyText(menuUrl)} title="Меню URL" style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.15)', borderRadius: 8, padding: '7px 10px', cursor: 'pointer', color: '#60a5fa', display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                      {copied === menuUrl ? <Check size={13} /> : <Copy size={13} />}
                      Меню
                    </button>
                    <button onClick={() => copyText(kdsUrl)} title="KDS URL" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 8, padding: '7px 10px', cursor: 'pointer', color: '#22c55e', display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                      {copied === kdsUrl ? <Check size={13} /> : <Copy size={13} />}
                      KDS
                    </button>
                    <button onClick={() => deleteRestaurant(r.id)} style={{ width: 34, height: 34, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)', borderRadius: 8, cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                )
              })}
              {restaurants.length === 0 && !loading && (
                <div style={{ textAlign: 'center', padding: 48, color: '#334155' }}>
                  <Building2 size={40} strokeWidth={1} style={{ margin: '0 auto 12px' }} />
                  <p>Рестораны не добавлены</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* ADMINS */}
        {activeTab === 'admins' && (
          <>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Администраторы ({admins.length})</h3>

            {/* Add admin */}
            <div style={{ background: '#1e293b', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 14, padding: 18, marginBottom: 24 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 14 }}>Новый администратор</p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
                <select
                  value={newAdmin.restaurantId}
                  onChange={(e) => setNewAdmin({ ...newAdmin, restaurantId: e.target.value })}
                  style={{ ...inputStyle, flex: '1 1 160px' }}
                >
                  <option value="">Выбрать ресторан</option>
                  {restaurants.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
                <input value={newAdmin.name} onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })} placeholder="Имя (необязательно)" style={{ ...inputStyle, flex: '1 1 150px' }} />
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <input value={newAdmin.username} onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })} placeholder="Логин" style={{ ...inputStyle, flex: '1 1 140px' }} />
                <input value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} placeholder="Пароль" type="password" style={{ ...inputStyle, flex: '1 1 140px' }} />
                <button onClick={addAdmin} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', background: 'linear-gradient(135deg, #a78bfa, #7c3aed)', border: 'none', borderRadius: 10, color: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}>
                  <Plus size={15} /> Добавить
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {admins.map((a) => {
                const rest = restaurants.find((r) => r.id === a.restaurantId)
                return (
                  <div key={a.id} style={{ padding: '14px 18px', background: '#1e293b', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 14 }}>
                    {resetId === a.id ? (
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <input value={resetPass} onChange={(e) => setResetPass(e.target.value)} placeholder="Новый пароль" type="password" style={{ ...inputStyle, flex: 1 }} />
                        <button onClick={() => resetPassword(a.id)} style={{ padding: '9px 16px', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 8, color: '#22c55e', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Сохранить</button>
                        <button onClick={() => setResetId(null)} style={{ padding: '9px 12px', background: 'rgba(148,163,184,0.08)', border: 'none', borderRadius: 8, color: '#64748b', cursor: 'pointer' }}>Отмена</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ width: 38, height: 38, background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <User size={16} color="#60a5fa" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>{a.name || a.username}</p>
                          <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
                            <code style={{ fontSize: 11, color: '#64748b', background: 'rgba(15,23,42,0.5)', padding: '1px 6px', borderRadius: 5 }}>{a.username}</code>
                            <span style={{ fontSize: 11, color: '#a78bfa' }}>{rest?.name || a.restaurantId}</span>
                          </div>
                        </div>
                        <button onClick={() => { setResetId(a.id); setResetPass('') }} title="Сменить пароль" style={{ width: 34, height: 34, background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.15)', borderRadius: 8, cursor: 'pointer', color: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Key size={14} />
                        </button>
                        <button onClick={() => deleteAdmin(a.id)} style={{ width: 34, height: 34, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)', borderRadius: 8, cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
              {admins.length === 0 && !loading && (
                <div style={{ textAlign: 'center', padding: 48, color: '#334155' }}>
                  <User size={40} strokeWidth={1} style={{ margin: '0 auto 12px' }} />
                  <p>Администраторы не добавлены</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
