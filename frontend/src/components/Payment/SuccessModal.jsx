import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Clock, ChefHat, Bell, Download } from 'lucide-react'
import { useUIStore, useOrderStore } from '../../store/useStore'

export default function SuccessModal() {
  const { successOpen, closeSuccess } = useUIStore()
  const { orders } = useOrderStore()
  const lastOrder = orders[0]

  const steps = [
    { icon: CheckCircle, label: 'Պատվեր Ընդունված', done: true, color: '#22c55e' },
    { icon: ChefHat, label: 'Պատրաստվում է', done: false, color: '#f97316' },
    { icon: Bell, label: 'Պատրաստ Հասցնելու', done: false, color: '#a78bfa' },
  ]

  return (
    <AnimatePresence>
      {successOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(12px)',
              zIndex: 400,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 24,
            }}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 250 }}
              style={{
                background: '#1e293b',
                borderRadius: 28,
                padding: '40px 32px',
                maxWidth: 380,
                width: '100%',
                textAlign: 'center',
                border: '1px solid rgba(34,197,94,0.2)',
                boxShadow: '0 0 60px rgba(34,197,94,0.1)',
              }}
            >
              {/* Check animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.3, 1] }}
                transition={{ delay: 0.1, duration: 0.5, times: [0, 0.6, 1] }}
                style={{ marginBottom: 20 }}
              >
                <div style={{
                  width: 80, height: 80,
                  background: 'radial-gradient(circle, rgba(34,197,94,0.2), transparent)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto',
                  border: '2px solid rgba(34,197,94,0.3)',
                }}>
                  <CheckCircle size={40} color="#22c55e" fill="rgba(34,197,94,0.15)" />
                </div>
              </motion.div>

              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>
                Ձեր Պատվերն Ընդունված Է!
              </h2>
              <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>
                Խոհանոցն արդեն պատրաստում է ձեր ուտեստները
              </p>

              {/* Order ID */}
              {lastOrder && (
                <div style={{
                  background: 'rgba(15,23,42,0.6)',
                  borderRadius: 12, padding: '12px 20px',
                  marginBottom: 24,
                }}>
                  <p style={{ fontSize: 11, color: '#475569', marginBottom: 4 }}>ՊԱՏՎԵՐԻ ՀԱՄԱՐ</p>
                  <p style={{ fontSize: 18, fontWeight: 800, color: '#f97316', letterSpacing: '0.1em' }}>
                    #{lastOrder.id}
                  </p>
                </div>
              )}

              {/* Steps */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 0, marginBottom: 28 }}>
                {steps.map((step, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <div style={{
                        width: 36, height: 36,
                        borderRadius: '50%',
                        background: step.done ? `${step.color}20` : 'rgba(30,41,59,0.8)',
                        border: `2px solid ${step.done ? step.color : 'rgba(148,163,184,0.15)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <step.icon size={16} color={step.done ? step.color : '#475569'} />
                      </div>
                      <span style={{ fontSize: 10, color: step.done ? '#94a3b8' : '#475569', textAlign: 'center', maxWidth: 70 }}>
                        {step.label}
                      </span>
                    </div>
                    {i < steps.length - 1 && (
                      <div style={{
                        width: 32, height: 2,
                        background: i === 0 ? '#22c55e' : 'rgba(148,163,184,0.1)',
                        marginBottom: 24,
                        marginLeft: -2, marginRight: -2,
                        flexShrink: 0,
                      }} />
                    )}
                  </div>
                ))}
              </div>

              {/* Est. time */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 8, marginBottom: 28,
                padding: '10px 20px',
                background: 'rgba(249,115,22,0.08)',
                borderRadius: 10,
              }}>
                <Clock size={16} color="#f97316" />
                <span style={{ fontSize: 14, color: '#f97316' }}>
                  Մոտ <strong>20-30 ր</strong> սպասել
                </span>
              </div>

              <button
                className="btn btn-primary"
                style={{ width: '100%', marginBottom: 10 }}
                onClick={closeSuccess}
              >
                Հիանալի, շնորհակա՜լ
              </button>

              <button
                className="btn btn-ghost"
                style={{ width: '100%', fontSize: 13 }}
                onClick={closeSuccess}
              >
                <Download size={14} />
                Ներբեռնել Հաշիվ-Ապրանքագիր
              </button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
