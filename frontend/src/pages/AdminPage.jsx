import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart3, ShoppingBag, DollarSign, TrendingUp, Edit3,
  Plus, X, Check, AlertCircle, RefreshCw, QrCode, Download,
  ToggleLeft, ToggleRight, Trash2, ChevronDown, Star,
} from 'lucide-react'
import { formatPrice, CATEGORIES } from '../utils/mockData'
import { useNavigate } from 'react-router-dom'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

const STATUS_LABELS = {
  confirmed: 'Ընդունված',
  preparing: 'Պատրաստվում',
  ready: 'Պատրաստ',
  delivered: 'Մատուցված',
}
const STATUS_COLORS = {
  confirmed: '#60a5fa',
  preparing: '#f97316',
  ready: '#22c55e',
  delivered: '#475569',
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div style={{
      background: '#1e293b',
      border: '1px solid rgba(148,163,184,0.08)',
      borderRadius: 16, padding: '18px 20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div style={{
          width: 38, height: 38,
          background: `${color}20`,
          border: `1px solid ${color}30`,
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={17} color={color} />
        </div>
        <p style={{ fontSize: 12, color: '#64748b' }}>{label}</p>
      </div>
      <p style={{ fontSize: 24, fontWeight: 800, color: '#f1f5f9' }}>{value}</p>
    </div>
  )
}

function ItemForm({ item, onSave, onClose }) {
  const [form, setForm] = useState(item || {
    name: '', nameEn: '', category: 'mains', price: '',
    description: '', calories: '', prepTime: '', color: '#f97316',
    spicy: false, tags: [], image: '',
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!form.name || !form.price) return
    setSaving(true)
    try {
      const method = item ? 'PUT' : 'POST'
      const url = item ? `${BACKEND}/api/menu/${item.id}` : `${BACKEND}/api/menu`
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, price: Number(form.price), calories: Number(form.calories) }),
      })
      const data = await res.json()
      onSave(data)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(8px)',
      zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: '#0f172a',
          border: '1px solid rgba(148,163,184,0.1)',
          borderRadius: 20,
          padding: 24,
          width: '100%', maxWidth: 480,
          maxHeight: '90vh', overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: '#f1f5f9' }}>
            {item ? 'Խմբագրել ուտեստը' : 'Ավելացնել ուտեստ'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {[
          { key: 'name', label: 'Անվանում (հայ)', type: 'text' },
          { key: 'nameEn', label: 'Անվանում (eng)', type: 'text' },
          { key: 'price', label: 'Գին (AMD)', type: 'number' },
          { key: 'calories', label: 'Կալորիա', type: 'number' },
          { key: 'prepTime', label: 'Պատրաստման ժամ', type: 'text' },
          { key: 'image', label: 'Նկարի URL (https://...)', type: 'text' },
        ].map(({ key, label, type }) => (
          <div key={key} style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {label}
            </label>
            <input
              type={type}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              style={{
                width: '100%', padding: '10px 14px',
                background: 'rgba(30,41,59,0.8)',
                border: '1px solid rgba(148,163,184,0.12)',
                borderRadius: 10, color: '#f1f5f9',
                fontSize: 14, outline: 'none', fontFamily: 'inherit',
              }}
            />
          </div>
        ))}

        {form.image ? (
          <div style={{ marginBottom: 14, borderRadius: 12, overflow: 'hidden', height: 140 }}>
            <img src={form.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.style.display='none'} />
          </div>
        ) : null}

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Կատեգորիա
          </label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            style={{
              width: '100%', padding: '10px 14px',
              background: 'rgba(30,41,59,0.8)',
              border: '1px solid rgba(148,163,184,0.12)',
              borderRadius: 10, color: '#f1f5f9',
              fontSize: 14, outline: 'none', fontFamily: 'inherit',
            }}
          >
            {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
              <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Նկարագրություն
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            style={{
              width: '100%', padding: '10px 14px',
              background: 'rgba(30,41,59,0.8)',
              border: '1px solid rgba(148,163,184,0.12)',
              borderRadius: 10, color: '#f1f5f9',
              fontSize: 14, outline: 'none', fontFamily: 'inherit', resize: 'vertical',
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <label style={{ fontSize: 13, color: '#94a3b8' }}>Կծու</label>
          <button
            onClick={() => setForm({ ...form, spicy: !form.spicy })}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: form.spicy ? '#f97316' : '#475569' }}
          >
            {form.spicy ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
          </button>

          <label style={{ fontSize: 13, color: '#94a3b8', marginLeft: 12 }}>Գույն</label>
          <input
            type="color"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
            style={{ width: 36, height: 36, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'none' }}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving || !form.name || !form.price}
          style={{
            width: '100%', padding: '13px',
            background: 'linear-gradient(135deg, #f97316, #ea580c)',
            border: 'none', borderRadius: 12,
            color: 'white', fontSize: 15, fontWeight: 700,
            cursor: saving ? 'wait' : 'pointer',
            opacity: (!form.name || !form.price) ? 0.5 : 1,
          }}
        >
          {saving ? 'Պահվում...' : item ? 'Պահպանել' : 'Ավելացնել'}
        </button>
      </motion.div>
    </div>
  )
}

function QRModal({ table, onClose }) {
  const url = `https://menu.aadem.am/menu/${table.id}`
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        style={{ background: '#0f172a', border: '1px solid rgba(148,163,184,0.1)', borderRadius: 20, padding: 28, width: '100%', maxWidth: 360, textAlign: 'center' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: '#f1f5f9' }}>QR — {table.name}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={20} /></button>
        </div>
        <img src={qrUrl} alt="QR Code" style={{ width: 220, height: 220, borderRadius: 12, margin: '0 auto 16px' }} />
        <p style={{ fontSize: 12, color: '#64748b', marginBottom: 16, wordBreak: 'break-all' }}>{url}</p>
        <a href={qrUrl} download={`QR-${table.id}.png`}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', background: 'linear-gradient(135deg, #f97316, #ea580c)', borderRadius: 12, color: 'white', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}
        >
          <Download size={16} />
          Ներբեռնել QR
        </a>
      </motion.div>
    </div>
  )
}

export default function AdminPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [menuItems, setMenuItems] = useState([])
  const [orders, setOrders] = useState([])
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(true)
  const [editItem, setEditItem] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [qrTable, setQrTable] = useState(null)
  const [newTableName, setNewTableName] = useState('')
  const [editTableId, setEditTableId] = useState(null)
  const [editTableName, setEditTableName] = useState('')

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [menuRes, ordersRes, tablesRes] = await Promise.all([
        fetch(`${BACKEND}/api/menu`),
        fetch(`${BACKEND}/api/orders`),
        fetch(`${BACKEND}/api/tables`),
      ])
      const menuData = await menuRes.json()
      const ordersData = await ordersRes.json()
      const tablesData = await tablesRes.json()
      setMenuItems(menuData.items || [])
      setOrders(ordersData.orders || [])
      setTables(tablesData.tables || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const addTable = async () => {
    if (!newTableName.trim()) return
    const res = await fetch(`${BACKEND}/api/tables`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newTableName.trim() }) })
    const t = await res.json()
    setTables((prev) => [...prev, t])
    setNewTableName('')
  }

  const renameTable = async (id) => {
    if (!editTableName.trim()) return
    const res = await fetch(`${BACKEND}/api/tables/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: editTableName.trim() }) })
    const t = await res.json()
    setTables((prev) => prev.map((tb) => tb.id === id ? t : tb))
    setEditTableId(null)
    setEditTableName('')
  }

  const deleteTable = async (id) => {
    if (!confirm('Հեռացնե՞լ սեղանը')) return
    await fetch(`${BACKEND}/api/tables/${id}`, { method: 'DELETE' })
    setTables((prev) => prev.filter((t) => t.id !== id))
  }

  const seedMenu = async () => {
    if (!confirm('Seed անել սկզբնական մենյու՞ (միայն եթե Firebase-ը դատարկ է)')) return
    await fetch(`${BACKEND}/api/menu/seed`, { method: 'POST' })
    fetchAll()
  }

  const toggleItem = async (id) => {
    await fetch(`${BACKEND}/api/menu/${id}/toggle`, { method: 'PATCH' })
    setMenuItems((prev) => prev.map((i) => i.id === id ? { ...i, available: !i.available } : i))
  }

  const deleteItem = async (id) => {
    if (!confirm('Հեռացնե՞լ ուտեստը')) return
    await fetch(`${BACKEND}/api/menu/${id}`, { method: 'DELETE' })
    setMenuItems((prev) => prev.filter((i) => i.id !== id))
  }

  const handleSaved = (item) => {
    setMenuItems((prev) => {
      const idx = prev.findIndex((i) => i.id === item.id)
      if (idx >= 0) { const n = [...prev]; n[idx] = item; return n }
      return [...prev, item]
    })
    setEditItem(null)
    setShowAddForm(false)
  }

  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0)
  const avgOrder = orders.length ? Math.round(totalRevenue / orders.length) : 0
  const activeOrders = orders.filter((o) => o.status !== 'delivered').length

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'menu', label: 'Մենյու', icon: Edit3 },
    { id: 'orders', label: 'Պատվերներ', icon: ShoppingBag },
    { id: 'qr', label: 'QR Կոդ', icon: QrCode },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#080f1c', color: '#f1f5f9' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 24px',
        background: 'rgba(15,23,42,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(148,163,184,0.06)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 20 }}>←</button>
          <h1 style={{ fontSize: 17, fontWeight: 800 }}>SmartMenu Admin</h1>
        </div>
        <button
          onClick={fetchAll}
          style={{ background: 'rgba(148,163,184,0.08)', border: 'none', borderRadius: 8, padding: '7px 12px', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}
        >
          <RefreshCw size={14} />
          Թարմացնել
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(148,163,184,0.06)', padding: '0 24px', background: 'rgba(15,23,42,0.5)', overflowX: 'auto' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '13px 18px', background: 'transparent', border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #f97316' : '2px solid transparent',
              color: activeTab === tab.id ? '#f97316' : '#64748b',
              cursor: 'pointer', fontSize: 13, fontWeight: 600,
              whiteSpace: 'nowrap', transition: 'all 0.2s',
            }}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '24px' }}>
        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
              <StatCard icon={DollarSign} label="Ընդհանուր եկամուտ" value={formatPrice(totalRevenue)} color="#f97316" />
              <StatCard icon={ShoppingBag} label="Բոլոր պատվերներ" value={orders.length} color="#22c55e" />
              <StatCard icon={TrendingUp} label="Ակտիվ պատվերներ" value={activeOrders} color="#60a5fa" />
              <StatCard icon={DollarSign} label="Միջին չեկ" value={formatPrice(avgOrder)} color="#a78bfa" />
            </div>

            <div style={{ background: '#1e293b', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(148,163,184,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: 14, fontWeight: 700 }}>Վերջին պատվերներ</h3>
                <span style={{ fontSize: 12, color: '#475569' }}>{orders.length} ընդամենը</span>
              </div>
              {orders.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', color: '#334155' }}>Պատվերներ չկան</div>
              ) : (
                orders.slice(0, 10).map((order) => (
                  <div key={order.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 20px', borderBottom: '1px solid rgba(148,163,184,0.04)' }}>
                    <div style={{ width: 34, height: 34, background: 'rgba(249,115,22,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#f97316', flexShrink: 0 }}>
                      {order.tableId}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>#{order.id}</p>
                      <p style={{ fontSize: 11, color: '#475569' }}>{new Date(order.createdAt).toLocaleString('hy-AM')}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#f97316' }}>{formatPrice(order.total)}</p>
                      <span style={{ fontSize: 10, fontWeight: 600, color: STATUS_COLORS[order.status] || '#64748b' }}>
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* MENU */}
        {activeTab === 'menu' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>Ուտեստներ ({menuItems.length})</h3>
              <div style={{ display: 'flex', gap: 10 }}>
                {menuItems.length === 0 && (
                  <button onClick={seedMenu} style={{ padding: '8px 16px', background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)', borderRadius: 10, color: '#60a5fa', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                    Seed մենյու
                  </button>
                )}
                <button
                  onClick={() => setShowAddForm(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'linear-gradient(135deg, #f97316, #ea580c)', border: 'none', borderRadius: 10, color: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}
                >
                  <Plus size={15} />
                  Ավելացնել
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {menuItems.map((item) => (
                <div key={item.id} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 16px',
                  background: '#1e293b',
                  border: `1px solid ${item.available ? 'rgba(148,163,184,0.08)' : 'rgba(239,68,68,0.15)'}`,
                  borderRadius: 14,
                  opacity: item.available ? 1 : 0.6,
                }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `${item.color}20`, border: `1px solid ${item.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: item.color }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
                      {item.spicy && <span style={{ fontSize: 10 }}>🌶️</span>}
                      {!item.available && <span style={{ fontSize: 10, color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '1px 6px', borderRadius: 100, fontWeight: 600 }}>Stop-list</span>}
                    </div>
                    <p style={{ fontSize: 11, color: '#64748b' }}>{item.category} · {item.calories} կկալ</p>
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#f97316', flexShrink: 0 }}>{formatPrice(item.price)}</p>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <button
                      onClick={() => toggleItem(item.id)}
                      title={item.available ? 'Stop-list' : 'Վերականգնել'}
                      style={{ width: 32, height: 32, background: item.available ? 'rgba(239,68,68,0.08)' : 'rgba(34,197,94,0.08)', border: `1px solid ${item.available ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)'}`, borderRadius: 8, cursor: 'pointer', color: item.available ? '#ef4444' : '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      {item.available ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                    </button>
                    <button
                      onClick={() => setEditItem(item)}
                      style={{ width: 32, height: 32, background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)', borderRadius: 8, cursor: 'pointer', color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      style={{ width: 32, height: 32, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)', borderRadius: 8, cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ORDERS */}
        {activeTab === 'orders' && (
          <>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Բոլոր պատվերներ ({orders.length})</h3>
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60, color: '#334155' }}>
                <ShoppingBag size={40} strokeWidth={1} style={{ margin: '0 auto 12px' }} />
                <p>Պատվերներ չկան</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {orders.map((order) => (
                  <div key={order.id} style={{ background: '#1e293b', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 14, padding: '16px 18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>#{order.id} · Սեղ. {order.tableId}</p>
                        <p style={{ fontSize: 11, color: '#475569' }}>{new Date(order.createdAt).toLocaleString('hy-AM')}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: 15, fontWeight: 800, color: '#f97316' }}>{formatPrice(order.total)}</p>
                        <span style={{ fontSize: 11, fontWeight: 600, color: STATUS_COLORS[order.status] || '#64748b' }}>
                          {STATUS_LABELS[order.status] || order.status}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {(order.items || []).map((item, i) => (
                        <span key={i} style={{ fontSize: 11, color: '#94a3b8', background: 'rgba(148,163,184,0.06)', padding: '3px 10px', borderRadius: 100 }}>
                          {item.qty || 1}× {item.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* QR CODES */}
        {activeTab === 'qr' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>Սեղաններ ({tables.length})</h3>
            </div>

            {/* Add new table */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              <input
                value={newTableName}
                onChange={(e) => setNewTableName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTable()}
                placeholder="Օր․ Տերաս 1, VIP 2, Սեղան 11..."
                style={{ flex: 1, padding: '10px 14px', background: '#1e293b', border: '1px solid rgba(148,163,184,0.12)', borderRadius: 10, color: '#f1f5f9', fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
              />
              <button
                onClick={addTable}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', background: 'linear-gradient(135deg, #f97316, #ea580c)', border: 'none', borderRadius: 10, color: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}
              >
                <Plus size={15} />
                Ավելացնել
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
              {tables.map((t) => (
                <div key={t.id} style={{ background: '#1e293b', border: '1px solid rgba(148,163,184,0.08)', borderRadius: 14, padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {editTableId === t.id ? (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <input
                        value={editTableName}
                        onChange={(e) => setEditTableName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && renameTable(t.id)}
                        autoFocus
                        style={{ flex: 1, padding: '6px 10px', background: '#0f172a', border: '1px solid rgba(249,115,22,0.4)', borderRadius: 8, color: '#f1f5f9', fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
                      />
                      <button onClick={() => renameTable(t.id)} style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', color: '#22c55e' }}><Check size={14} /></button>
                      <button onClick={() => setEditTableId(null)} style={{ background: 'rgba(148,163,184,0.06)', border: '1px solid rgba(148,163,184,0.12)', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', color: '#64748b' }}><X size={14} /></button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>{t.name}</p>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => { setEditTableId(t.id); setEditTableName(t.name) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 4 }}><Edit3 size={13} /></button>
                        <button onClick={() => deleteTable(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: 4 }}><Trash2 size={13} /></button>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => setQrTable(t)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px', background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 10, cursor: 'pointer', color: '#f97316', fontSize: 13, fontWeight: 600 }}
                  >
                    <QrCode size={16} />
                    QR Դիտել
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {(showAddForm || editItem) && (
        <ItemForm
          item={editItem}
          onSave={handleSaved}
          onClose={() => { setEditItem(null); setShowAddForm(false) }}
        />
      )}

      {qrTable && <QRModal table={qrTable} onClose={() => setQrTable(null)} />}
    </div>
  )
}
