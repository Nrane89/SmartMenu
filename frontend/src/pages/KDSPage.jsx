import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChefHat, Bell, BellOff, Clock, CheckCircle, Wifi, WifiOff } from 'lucide-react'
import { useOrderStore } from '../store/useStore'
import { connectSocket, socket } from '../utils/socket'
import { formatPrice } from '../utils/mockData'

function playOrderSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const notes = [523, 659, 784, 1047] // C5 E5 G5 C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.value = freq
      const t = ctx.currentTime + i * 0.12
      gain.gain.setValueAtTime(0, t)
      gain.gain.linearRampToValueAtTime(0.4, t + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3)
      osc.start(t)
      osc.stop(t + 0.3)
    })
  } catch (_) {}
}

const STATUS_CONFIG = {
  confirmed: { label: 'Ընդունված', color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.25)' },
  preparing: { label: 'Պատրաստվում', color: '#f97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.3)', pulse: true },
  ready: { label: 'Պատրաստ', color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)' },
  delivered: { label: 'Մատուցված', color: '#475569', bg: 'rgba(71,85,105,0.1)', border: 'rgba(71,85,105,0.2)' },
}

function formatTime(iso) {
  const d = new Date(iso)
  return d.toLocaleTimeString('hy-AM', { hour: '2-digit', minute: '2-digit' })
}

function elapsed(iso) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 1) return 'Հիմա'
  return `${mins} ր առաջ`
}

export default function KDSPage() {
  const { orders, addOrder, updateOrderStatus, updateItemStatus } = useOrderStore()
  const [connected, setConnected] = useState(false)
  const [filter, setFilter] = useState('active')
  const [, tick] = useState(0)
  const [soundOn, setSoundOn] = useState(() => localStorage.getItem('kds-sound') !== 'off')
  const soundRef = useRef(soundOn)
  soundRef.current = soundOn

  useEffect(() => {
    const joinKitchen = () => {
      setConnected(true)
      socket.emit('join-room', 'kitchen')
    }

    connectSocket()

    if (socket.connected) joinKitchen()

    socket.on('connect', joinKitchen)
    socket.on('disconnect', () => setConnected(false))
    socket.on('new-order', (order) => {
      addOrder(order)
      if (soundRef.current) playOrderSound()
      if (Notification.permission === 'granted') {
        new Notification(`Նոր պատվեր - Սեղ. ${order.tableId}`, {
          body: `${order.items.length} ուտեստ — ${formatPrice(order.total)}`,
          icon: '/favicon.svg',
        })
      }
    })

    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }

    const t = setInterval(() => tick((n) => n + 1), 30000)
    return () => {
      clearInterval(t)
      socket.off('new-order')
      socket.off('connect')
      socket.off('disconnect')
    }
  }, [])

  const filtered = orders.filter((o) => {
    if (filter === 'active') return o.status !== 'delivered'
    if (filter === 'ready') return o.status === 'ready'
    if (filter === 'done') return o.status === 'delivered'
    return true
  })

  const activeCnt = orders.filter((o) => o.status !== 'delivered').length
  const readyCnt = orders.filter((o) => o.status === 'ready').length

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080f1c',
      color: '#f1f5f9',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 24px',
        background: 'rgba(15,23,42,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(148,163,184,0.06)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40,
            background: 'rgba(249,115,22,0.15)',
            border: '1px solid rgba(249,115,22,0.3)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ChefHat size={20} color="#f97316" />
          </div>
          <div>
            <h1 style={{ fontSize: 17, fontWeight: 800 }}>Խոհանոցի Էկրան</h1>
            <p style={{ fontSize: 11, color: '#475569' }}>Kitchen Display System</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Stats chips */}
          {activeCnt > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px',
              background: 'rgba(249,115,22,0.1)',
              border: '1px solid rgba(249,115,22,0.25)',
              borderRadius: 100,
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: '#f97316',
                animation: 'pulse-glow 1.5s ease-in-out infinite',
              }} />
              <span style={{ fontSize: 13, color: '#f97316', fontWeight: 700 }}>
                {activeCnt} ակտիվ
              </span>
            </div>
          )}
          {readyCnt > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px',
              background: 'rgba(34,197,94,0.1)',
              border: '1px solid rgba(34,197,94,0.25)',
              borderRadius: 100,
            }}>
              <Bell size={13} color="#22c55e" />
              <span style={{ fontSize: 13, color: '#22c55e', fontWeight: 700 }}>
                {readyCnt} պատրաստ
              </span>
            </div>
          )}

          <button
            onClick={() => setSoundOn((v) => {
              localStorage.setItem('kds-sound', !v ? 'on' : 'off')
              return !v
            })}
            title={soundOn ? 'Выключить звук' : 'Включить звук'}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px',
              background: soundOn ? 'rgba(167,139,250,0.1)' : 'rgba(71,85,105,0.1)',
              border: `1px solid ${soundOn ? 'rgba(167,139,250,0.3)' : 'rgba(71,85,105,0.2)'}`,
              borderRadius: 100, cursor: 'pointer',
              color: soundOn ? '#a78bfa' : '#475569',
              fontSize: 13, fontWeight: 600,
            }}
          >
            {soundOn ? <Bell size={13} /> : <BellOff size={13} />}
            {soundOn ? 'Звук вкл' : 'Звук выкл'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {connected
              ? <Wifi size={14} color="#22c55e" />
              : <WifiOff size={14} color="#ef4444" />}
            <span style={{ fontSize: 11, color: connected ? '#22c55e' : '#ef4444' }}>
              {connected ? 'Ուղiղ' : 'Անջատված'}
            </span>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{
        display: 'flex', gap: 8, padding: '16px 24px 0',
      }}>
        {[
          { id: 'active', label: 'Ակտիվ' },
          { id: 'ready', label: 'Պատրաստ' },
          { id: 'done', label: 'Ավարտված' },
          { id: 'all', label: 'Բոլորը' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            style={{
              padding: '8px 18px',
              background: filter === tab.id
                ? 'linear-gradient(135deg, #f97316, #ea580c)'
                : 'rgba(30,41,59,0.6)',
              border: filter === tab.id ? 'none' : '1px solid rgba(148,163,184,0.1)',
              borderRadius: 100,
              color: filter === tab.id ? 'white' : '#64748b',
              cursor: 'pointer', fontSize: 13, fontWeight: 600,
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders grid */}
      <div style={{ padding: '20px 24px 40px' }}>
        {filtered.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '80px 0', gap: 12, color: '#334155',
          }}>
            <ChefHat size={48} strokeWidth={1} />
            <p style={{ fontSize: 16 }}>Ակտիվ պատվեր չկա</p>
            <p style={{ fontSize: 13, color: '#1e293b' }}>Պատվերները կհայտնվեն այստեղ</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 16,
          }}>
            <AnimatePresence>
              {filtered.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onStatusChange={(s) => updateOrderStatus(order.id, s)}
                  onItemStatusChange={(itemId, s) => updateItemStatus(order.id, itemId, s)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}

function OrderCard({ order, onStatusChange, onItemStatusChange }) {
  const cfg = STATUS_CONFIG[order.status]
  const allItemsDone = order.items.every((i) => i.status === 'done')

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      style={{
        background: '#1e293b',
        borderRadius: 20,
        border: `1px solid ${cfg.border}`,
        overflow: 'hidden',
        boxShadow: cfg.pulse ? '0 0 30px rgba(249,115,22,0.1)' : 'none',
      }}
    >
      {/* Card header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 18px',
        background: cfg.bg,
        borderBottom: `1px solid ${cfg.border}`,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9' }}>
              Սեղ. {order.tableId}
            </span>
            <span style={{
              fontSize: 11, fontWeight: 600, color: cfg.color,
              background: `${cfg.color}20`,
              padding: '2px 8px', borderRadius: 100,
            }}>
              {cfg.label}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
            <Clock size={11} color="#64748b" />
            <span style={{ fontSize: 11, color: '#64748b' }}>
              {formatTime(order.createdAt)} · {elapsed(order.createdAt)}
            </span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 11, color: '#475569' }}>#{order.id.split('-')[1]}</p>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#f97316' }}>
            {formatPrice(order.total)}
          </p>
        </div>
      </div>

      {/* Items */}
      <div style={{ padding: '14px 18px' }}>
        {order.items.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 0',
              borderBottom: '1px solid rgba(148,163,184,0.06)',
              opacity: item.status === 'done' ? 0.5 : 1,
              transition: 'opacity 0.3s',
            }}
          >
            <div style={{
              width: 28, height: 28,
              background: `${item.color}15`,
              border: `1px solid ${item.color}25`,
              borderRadius: 7,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, flexShrink: 0,
            }}>
              {item.qty}×
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{item.name}</p>
            </div>
            <button
              onClick={() => onItemStatusChange(item.id, item.status === 'done' ? 'pending' : 'done')}
              style={{
                width: 28, height: 28,
                background: item.status === 'done'
                  ? 'rgba(34,197,94,0.15)' : 'rgba(148,163,184,0.08)',
                border: item.status === 'done'
                  ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(148,163,184,0.12)',
                borderRadius: 7,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: item.status === 'done' ? '#22c55e' : '#475569',
                transition: 'all 0.2s',
              }}
            >
              <CheckCircle size={14} />
            </button>
          </div>
        ))}

        {order.note && (
          <div style={{
            marginTop: 10, padding: '8px 12px',
            background: 'rgba(249,115,22,0.06)',
            borderRadius: 8,
            fontSize: 12, color: '#94a3b8',
          }}>
            💬 {order.note}
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{
        padding: '12px 18px',
        display: 'flex', gap: 8,
        borderTop: '1px solid rgba(148,163,184,0.06)',
      }}>
        {order.status === 'confirmed' && (
          <button
            onClick={() => onStatusChange('preparing')}
            style={{
              flex: 1, padding: '10px',
              background: 'rgba(249,115,22,0.15)',
              border: '1px solid rgba(249,115,22,0.3)',
              borderRadius: 10, cursor: 'pointer',
              color: '#f97316', fontSize: 13, fontWeight: 600,
            }}
          >
            🔥 Սկսել Պատրաստել
          </button>
        )}
        {order.status === 'preparing' && (
          <button
            onClick={() => onStatusChange('ready')}
            style={{
              flex: 1, padding: '10px',
              background: 'rgba(34,197,94,0.15)',
              border: '1px solid rgba(34,197,94,0.3)',
              borderRadius: 10, cursor: 'pointer',
              color: '#22c55e', fontSize: 13, fontWeight: 600,
            }}
          >
            ✅ Պատրաստ է
          </button>
        )}
        {order.status === 'ready' && (
          <button
            onClick={() => onStatusChange('delivered')}
            style={{
              flex: 1, padding: '10px',
              background: 'rgba(96,165,250,0.15)',
              border: '1px solid rgba(96,165,250,0.3)',
              borderRadius: 10, cursor: 'pointer',
              color: '#60a5fa', fontSize: 13, fontWeight: 600,
            }}
          >
            🛎 Մատուցված
          </button>
        )}
        {order.status === 'delivered' && (
          <div style={{
            flex: 1, padding: '10px',
            textAlign: 'center',
            color: '#334155', fontSize: 13,
          }}>
            ✓ Ավarտed
          </div>
        )}
      </div>
    </motion.div>
  )
}
