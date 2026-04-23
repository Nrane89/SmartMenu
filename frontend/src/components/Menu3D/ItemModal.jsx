import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, Clock, Flame, Plus, Minus, ShoppingCart, Zap } from 'lucide-react'
import DishViewer from './DishViewer'
import { useCartStore, useUIStore } from '../../store/useStore'
import { useLang } from '../../hooks/useLang'
import { formatPrice } from '../../utils/mockData'

export default function ItemModal() {
  const { selectedItem, closeViewer } = useUIStore()
  const { t } = useLang()
  const { addItem, updateQty, items } = useCartStore()

  const cartItem = selectedItem ? items.find((i) => i.id === selectedItem.id) : null
  const qty = cartItem?.qty || 0

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && closeViewer()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeViewer])

  return (
    <AnimatePresence>
      {selectedItem && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeViewer}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(8px)',
              zIndex: 100,
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'fixed',
              bottom: 0, left: 0, right: 0,
              zIndex: 101,
              maxWidth: 560,
              margin: '0 auto',
              background: '#1e293b',
              borderRadius: '28px 28px 0 0',
              overflow: 'hidden',
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Image or 3D Viewer */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              {selectedItem.image ? (
                <div style={{ height: 220, background: '#0f172a', overflow: 'hidden' }}>
                  <img src={selectedItem.image} alt={selectedItem.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ) : (
                <DishViewer item={selectedItem} />
              )}

              {/* Close button */}
              <button
                onClick={closeViewer}
                style={{
                  position: 'absolute', top: 16, right: 16,
                  width: 36, height: 36,
                  background: 'rgba(15,23,42,0.8)',
                  border: '1px solid rgba(148,163,184,0.15)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#94a3b8',
                }}
              >
                <X size={16} />
              </button>

              {/* Tags */}
              <div style={{
                position: 'absolute', top: 16, left: 16,
                display: 'flex', gap: 6,
              }}>
                {selectedItem.tags?.map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
                {selectedItem.spicy && (
                  <span className="tag" style={{
                    background: 'rgba(239,68,68,0.15)',
                    color: '#f87171',
                    borderColor: 'rgba(239,68,68,0.25)',
                  }}>
                    🌶️ {t("spicy")}
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div style={{ overflowY: 'auto', padding: '24px 24px 32px' }}>
              {/* Title row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', lineHeight: 1.2 }}>
                    {selectedItem.name}
                  </h2>
                  <p style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{selectedItem.nameEn}</p>
                </div>
                <span style={{
                  fontSize: 22, fontWeight: 800,
                  color: '#f97316',
                  whiteSpace: 'nowrap', marginLeft: 12,
                }}>
                  {formatPrice(selectedItem.price)}
                </span>
              </div>

              {/* Stats */}
              <div style={{
                display: 'flex', gap: 16, marginBottom: 16,
                padding: '12px 16px',
                background: 'rgba(15,23,42,0.5)',
                borderRadius: 12,
              }}>
                <StatItem icon={<Star size={14} color="#f59e0b" fill="#f59e0b" />}
                  label="Գնահատական" value={selectedItem.rating} />
                <div style={{ width: 1, background: 'rgba(148,163,184,0.1)' }} />
                <StatItem icon={<Clock size={14} color="#60a5fa" />}
                  label="Պատրաստման ժամ" value={selectedItem.prepTime} />
                <div style={{ width: 1, background: 'rgba(148,163,184,0.1)' }} />
                <StatItem icon={<Zap size={14} color="#a78bfa" />}
                  label={t("calories")} value={`${selectedItem.calories} կկ`} />
              </div>

              {/* Description */}
              <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
                {selectedItem.description}
              </p>

              {/* Add to cart */}
              {qty === 0 ? (
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', fontSize: 16, padding: '15px 24px' }}
                  onClick={() => {
                    addItem(selectedItem)
                    closeViewer()
                  }}
                >
                  <ShoppingCart size={18} />
                  Ավելացնել զամբյուղ — {formatPrice(selectedItem.price)}
                </button>
              ) : (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 0,
                    background: 'rgba(15,23,42,0.6)',
                    borderRadius: 12, border: '1px solid rgba(148,163,184,0.12)',
                    overflow: 'hidden', flex: '0 0 auto',
                  }}>
                    <button
                      onClick={() => updateQty(selectedItem.id, qty - 1)}
                      style={{
                        width: 44, height: 50, background: 'transparent',
                        border: 'none', color: '#94a3b8', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18,
                      }}
                    >
                      <Minus size={16} />
                    </button>
                    <span style={{
                      width: 40, textAlign: 'center',
                      fontSize: 18, fontWeight: 700, color: '#f1f5f9',
                    }}>
                      {qty}
                    </span>
                    <button
                      onClick={() => addItem(selectedItem)}
                      style={{
                        width: 44, height: 50, background: 'transparent',
                        border: 'none', color: '#f97316', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button
                    className="btn btn-primary"
                    style={{ flex: 1, fontSize: 15, padding: '13px 20px' }}
                    onClick={closeViewer}
                  >
                    <ShoppingCart size={16} />
                    Ընդամենը — {formatPrice(selectedItem.price * qty)}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function StatItem({ icon, label, value }) {
  return (
    <div style={{ flex: 1, textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 2 }}>
        {icon}
        <span style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>{value}</span>
      </div>
      <span style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </span>
    </div>
  )
}


