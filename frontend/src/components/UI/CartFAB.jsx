import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'
import { useCartStore, useUIStore } from '../../store/useStore'
import { formatPrice } from '../../utils/mockData'

export default function CartFAB() {
  const { totalItems, total } = useCartStore()
  const { openCart } = useUIStore()
  const count = totalItems()

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.button
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          onClick={openCart}
          style={{
            position: 'fixed',
            bottom: 24, left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 50,
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '14px 24px',
            background: 'linear-gradient(135deg, #f97316, #ea580c)',
            border: 'none', borderRadius: 100,
            cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(249,115,22,0.5)',
            color: 'white',
            whiteSpace: 'nowrap',
          }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Badge */}
          <div style={{
            background: 'rgba(255,255,255,0.25)',
            borderRadius: '50%',
            width: 28, height: 28,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 800,
          }}>
            {count}
          </div>

          <span style={{ fontSize: 15, fontWeight: 700 }}>Դիտել Զամբյուղ</span>

          <span style={{
            fontSize: 15, fontWeight: 800,
            background: 'rgba(255,255,255,0.2)',
            padding: '4px 12px',
            borderRadius: 100,
          }}>
            {formatPrice(total())}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
