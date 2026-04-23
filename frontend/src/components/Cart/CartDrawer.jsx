import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, Plus, Minus, ShoppingBag, ChevronRight, MessageSquare } from 'lucide-react'
import { useCartStore, useUIStore } from '../../store/useStore'
import { formatPrice } from '../../utils/mockData'

export default function CartDrawer() {
  const { items, updateQty, removeItem, total, totalItems, note, setNote } = useCartStore()
  const { cartOpen, closeCart, openPayment } = useUIStore()

  const subtotal = total()
  const tax = Math.round(subtotal * 0.12)
  const grandTotal = subtotal + tax

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)',
              zIndex: 200,
            }}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            style={{
              position: 'fixed', right: 0, top: 0, bottom: 0,
              width: '100%', maxWidth: 420,
              background: '#0f172a',
              zIndex: 201,
              display: 'flex', flexDirection: 'column',
              boxShadow: '-24px 0 64px rgba(0,0,0,0.5)',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px 24px',
              borderBottom: '1px solid rgba(148,163,184,0.08)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <ShoppingBag size={20} color="#f97316" />
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9' }}>Զամբյուղ</h2>
                <span style={{
                  background: '#f97316',
                  color: 'white', fontSize: 12, fontWeight: 700,
                  width: 22, height: 22, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {totalItems()}
                </span>
              </div>
              <button
                onClick={closeCart}
                style={{
                  width: 36, height: 36,
                  background: 'rgba(148,163,184,0.08)',
                  border: 'none', borderRadius: 8,
                  cursor: 'pointer', color: '#94a3b8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
              {items.length === 0 ? (
                <div style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  height: '100%', gap: 12,
                  color: '#475569',
                }}>
                  <ShoppingBag size={48} strokeWidth={1} />
                  <p style={{ fontSize: 15 }}>Զամբյուղը դատարկ է</p>
                  <button
                    className="btn btn-ghost"
                    onClick={closeCart}
                    style={{ fontSize: 13, padding: '8px 20px' }}
                  >
                    Շարունակել ընտրությունը
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onAdd={() => updateQty(item.id, item.qty + 1)}
                      onRemove={() => updateQty(item.id, item.qty - 1)}
                      onDelete={() => removeItem(item.id)}
                    />
                  ))}

                  {/* Note */}
                  <div style={{
                    background: 'rgba(30,41,59,0.6)',
                    borderRadius: 12,
                    padding: 14,
                    border: '1px solid rgba(148,163,184,0.08)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                      <MessageSquare size={14} color="#64748b" />
                      <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>
                        Լրացուցիչ ցուցում
                      </span>
                    </div>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Ալերգիա, հատուկ խնդրանք..."
                      rows={2}
                      style={{
                        width: '100%', background: 'transparent',
                        border: 'none', outline: 'none',
                        color: '#94a3b8', fontSize: 13,
                        resize: 'none', fontFamily: 'inherit',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div style={{
                padding: '20px 24px',
                borderTop: '1px solid rgba(148,163,184,0.08)',
                background: '#0f172a',
              }}>
                {/* Totals */}
                <div style={{ marginBottom: 16 }}>
                  <Row label="Ենթաընդամենը" value={formatPrice(subtotal)} />
                  <Row label="ԱԱՀ (12%)" value={formatPrice(tax)} muted />
                  <div style={{
                    height: 1, background: 'rgba(148,163,184,0.08)',
                    margin: '10px 0',
                  }} />
                  <Row
                    label="Ընդամենը"
                    value={formatPrice(grandTotal)}
                    bold
                  />
                </div>

                <button
                  className="btn btn-primary"
                  style={{ width: '100%', fontSize: 16, padding: '15px' }}
                  onClick={openPayment}
                >
                  Անցնել վճարման
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function CartItem({ item, onAdd, onRemove, onDelete }) {
  return (
    <div style={{
      background: 'rgba(30,41,59,0.6)',
      borderRadius: 14,
      padding: '12px 14px',
      border: '1px solid rgba(148,163,184,0.08)',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      {/* Color dot */}
      <div style={{
        width: 44, height: 44,
        borderRadius: 10,
        background: `${item.color}20`,
        border: `1px solid ${item.color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20, flexShrink: 0,
      }}>
        🍽️
      </div>

      {/* Name + price */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: 14, fontWeight: 600, color: '#f1f5f9',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {item.name}
        </p>
        <p style={{ fontSize: 13, color: '#f97316', fontWeight: 700, marginTop: 2 }}>
          {formatPrice(item.price * item.qty)}
        </p>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
        <button
          onClick={onRemove}
          style={{
            width: 28, height: 28,
            background: 'rgba(148,163,184,0.08)',
            border: 'none', borderRadius: 7,
            cursor: 'pointer', color: '#94a3b8',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Minus size={12} />
        </button>
        <span style={{
          width: 24, textAlign: 'center',
          fontSize: 14, fontWeight: 700, color: '#f1f5f9',
        }}>
          {item.qty}
        </span>
        <button
          onClick={onAdd}
          style={{
            width: 28, height: 28,
            background: 'rgba(249,115,22,0.15)',
            border: 'none', borderRadius: 7,
            cursor: 'pointer', color: '#f97316',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Plus size={12} />
        </button>
        <button
          onClick={onDelete}
          style={{
            width: 28, height: 28, marginLeft: 4,
            background: 'rgba(239,68,68,0.08)',
            border: 'none', borderRadius: 7,
            cursor: 'pointer', color: '#ef4444',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  )
}

function Row({ label, value, bold, muted }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      marginBottom: 6,
    }}>
      <span style={{
        fontSize: bold ? 15 : 13,
        color: muted ? '#475569' : bold ? '#f1f5f9' : '#94a3b8',
        fontWeight: bold ? 700 : 400,
      }}>{label}</span>
      <span style={{
        fontSize: bold ? 16 : 13,
        color: bold ? '#f97316' : muted ? '#475569' : '#94a3b8',
        fontWeight: bold ? 800 : 500,
      }}>{value}</span>
    </div>
  )
}
