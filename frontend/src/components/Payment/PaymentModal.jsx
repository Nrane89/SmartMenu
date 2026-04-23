import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CreditCard, Smartphone, Check, Loader, Lock, ChevronRight } from 'lucide-react'
import { useCartStore, useUIStore, useOrderStore } from '../../store/useStore'
import { formatPrice } from '../../utils/mockData'
import { socket } from '../../utils/socket'

const PAYMENT_METHODS = [
  { id: 'card', label: 'Բանկային Քարտ', icon: '💳', desc: 'Visa, Mastercard, AMEX' },
  { id: 'apple', label: 'Apple Pay', icon: '🍎', desc: 'Touch ID կամ Face ID' },
  { id: 'google', label: 'Google Pay', icon: '🔵', desc: 'Tap to Pay' },
]

export default function PaymentModal() {
  const { paymentOpen, closePayment, openSuccess } = useUIStore()
  const { items, total, tableId, note, clearCart } = useCartStore()
  const { addOrder } = useOrderStore()

  const [method, setMethod] = useState('card')
  const [step, setStep] = useState('select') // select | card-form | processing | done
  const [cardData, setCardData] = useState({ number: '', name: '', expiry: '', cvv: '' })
  const [error, setError] = useState('')

  const subtotal = total()
  const tax = Math.round(subtotal * 0.12)
  const grandTotal = subtotal + tax

  const handlePay = async () => {
    if (method === 'card') {
      if (cardData.number.replace(/\s/g, '').length < 16) {
        setError('Քարտի համարը սխալ է')
        return
      }
      if (!cardData.name) {
        setError('Մուտքագրեք քարտատիրոջ անունը')
        return
      }
      if (cardData.expiry.length < 5) {
        setError('Ժամկետը սխալ է')
        return
      }
      if (cardData.cvv.length < 3) {
        setError('CVV սխալ է')
        return
      }
    }
    setError('')
    setStep('processing')

    await new Promise((r) => setTimeout(r, 2000))

    const order = {
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      tableId: tableId || 'T1',
      items: items.map((i) => ({ ...i, status: 'pending' })),
      note,
      total: grandTotal,
      status: 'confirmed',
      paymentMethod: method,
      createdAt: new Date().toISOString(),
    }

    addOrder(order)
    socket.emit('new-order', order)

    clearCart()
    setStep('done')
    setTimeout(() => {
      closePayment()
      openSuccess()
      setStep('select')
    }, 1200)
  }

  const formatCard = (val) => {
    const v = val.replace(/\D/g, '').slice(0, 16)
    return v.replace(/(.{4})/g, '$1 ').trim()
  }

  const formatExpiry = (val) => {
    const v = val.replace(/\D/g, '').slice(0, 4)
    if (v.length >= 3) return `${v.slice(0, 2)}/${v.slice(2)}`
    return v
  }

  return (
    <AnimatePresence>
      {paymentOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePayment}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(8px)',
              zIndex: 300,
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            style={{
              position: 'fixed',
              bottom: 0, left: 0, right: 0,
              maxWidth: 480, margin: '0 auto',
              background: '#0f172a',
              borderRadius: '28px 28px 0 0',
              zIndex: 301,
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px 24px 16px',
              borderBottom: '1px solid rgba(148,163,184,0.08)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Lock size={16} color="#22c55e" />
                <h2 style={{ fontSize: 17, fontWeight: 700, color: '#f1f5f9' }}>
                  Անվտանգ Վճարում
                </h2>
              </div>
              {step !== 'processing' && step !== 'done' && (
                <button
                  onClick={closePayment}
                  style={{
                    width: 34, height: 34,
                    background: 'rgba(148,163,184,0.08)',
                    border: 'none', borderRadius: 8,
                    cursor: 'pointer', color: '#94a3b8',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Content */}
            <div style={{ padding: '20px 24px 32px' }}>
              {(step === 'select' || step === 'card-form') && (
                <>
                  {/* Summary */}
                  <div style={{
                    background: 'rgba(249,115,22,0.06)',
                    border: '1px solid rgba(249,115,22,0.15)',
                    borderRadius: 14, padding: '14px 18px',
                    marginBottom: 20,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ color: '#94a3b8', fontSize: 13 }}>Ենթաընդամենը</span>
                      <span style={{ color: '#94a3b8', fontSize: 13 }}>{formatPrice(subtotal)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                      <span style={{ color: '#94a3b8', fontSize: 13 }}>ԱԱՀ (12%)</span>
                      <span style={{ color: '#94a3b8', fontSize: 13 }}>{formatPrice(tax)}</span>
                    </div>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      borderTop: '1px solid rgba(249,115,22,0.15)',
                      paddingTop: 10,
                    }}>
                      <span style={{ color: '#f1f5f9', fontSize: 16, fontWeight: 700 }}>Ընդամենը</span>
                      <span style={{ color: '#f97316', fontSize: 18, fontWeight: 800 }}>
                        {formatPrice(grandTotal)}
                      </span>
                    </div>
                  </div>

                  {/* Payment methods */}
                  <p style={{ fontSize: 12, color: '#64748b', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                    Վճարման Եղանակ
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                    {PAYMENT_METHODS.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setMethod(m.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 14,
                          padding: '14px 16px',
                          background: method === m.id
                            ? 'rgba(249,115,22,0.1)'
                            : 'rgba(30,41,59,0.6)',
                          border: method === m.id
                            ? '1px solid rgba(249,115,22,0.4)'
                            : '1px solid rgba(148,163,184,0.08)',
                          borderRadius: 12,
                          cursor: 'pointer', textAlign: 'left',
                          transition: 'all 0.2s',
                        }}
                      >
                        <span style={{ fontSize: 22 }}>{m.icon}</span>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9' }}>{m.label}</p>
                          <p style={{ fontSize: 12, color: '#64748b' }}>{m.desc}</p>
                        </div>
                        {method === m.id && (
                          <div style={{
                            width: 20, height: 20,
                            borderRadius: '50%',
                            background: '#f97316',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <Check size={11} color="white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Card form */}
                  {method === 'card' && (
                    <div style={{ marginBottom: 20 }}>
                      <Input
                        label="Քարտի Համար"
                        value={cardData.number}
                        onChange={(v) => setCardData({ ...cardData, number: formatCard(v) })}
                        placeholder="0000 0000 0000 0000"
                        maxLength={19}
                        icon={<CreditCard size={15} color="#64748b" />}
                      />
                      <Input
                        label="Քարտատիրոջ Անուն"
                        value={cardData.name}
                        onChange={(v) => setCardData({ ...cardData, name: v.toUpperCase() })}
                        placeholder="JOHN DOE"
                      />
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <Input
                          label="Ժամկետ"
                          value={cardData.expiry}
                          onChange={(v) => setCardData({ ...cardData, expiry: formatExpiry(v) })}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                        <Input
                          label="CVV"
                          value={cardData.cvv}
                          onChange={(v) => setCardData({ ...cardData, cvv: v.replace(/\D/g, '').slice(0, 3) })}
                          placeholder="•••"
                          type="password"
                          maxLength={3}
                        />
                      </div>
                    </div>
                  )}

                  {error && (
                    <p style={{
                      color: '#ef4444', fontSize: 13, marginBottom: 12,
                      padding: '10px 14px',
                      background: 'rgba(239,68,68,0.08)',
                      borderRadius: 8,
                    }}>
                      ⚠️ {error}
                    </p>
                  )}

                  <button
                    className="btn btn-primary"
                    style={{ width: '100%', fontSize: 16, padding: '15px' }}
                    onClick={handlePay}
                  >
                    Վճարել — {formatPrice(grandTotal)}
                    <ChevronRight size={18} />
                  </button>
                </>
              )}

              {step === 'processing' && (
                <div style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  padding: '40px 0', gap: 16,
                }}>
                  <div style={{
                    width: 64, height: 64,
                    border: '3px solid rgba(249,115,22,0.2)',
                    borderTop: '3px solid #f97316',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                  }} />
                  <p style={{ fontSize: 16, color: '#94a3b8' }}>Մշակվում է...</p>
                  <p style={{ fontSize: 13, color: '#475569' }}>Խնդրում ենք սպասել</p>
                </div>
              )}

              {step === 'done' && (
                <div style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  padding: '40px 0', gap: 12,
                }}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                    style={{
                      width: 64, height: 64,
                      background: 'rgba(34,197,94,0.15)',
                      border: '2px solid #22c55e',
                      borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Check size={28} color="#22c55e" />
                  </motion.div>
                  <p style={{ fontSize: 16, fontWeight: 600, color: '#22c55e' }}>Վճարումն ընդունված է!</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function Input({ label, value, onChange, placeholder, type = 'text', maxLength, icon }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 6, display: 'block' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        {icon && (
          <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          style={{
            width: '100%',
            padding: icon ? '12px 14px 12px 38px' : '12px 14px',
            background: 'rgba(30,41,59,0.8)',
            border: '1px solid rgba(148,163,184,0.12)',
            borderRadius: 10,
            color: '#f1f5f9',
            fontSize: 14,
            outline: 'none',
            fontFamily: 'inherit',
          }}
        />
      </div>
    </div>
  )
}
