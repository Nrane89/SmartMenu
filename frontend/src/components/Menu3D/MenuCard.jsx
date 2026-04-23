import { motion } from 'framer-motion'
import { Star, Clock, Plus, Check } from 'lucide-react'
import DishViewer from './DishViewer'
import { useCartStore, useUIStore } from '../../store/useStore'
import { formatPrice } from '../../utils/mockData'

export default function MenuCard({ item, index }) {
  const { addItem, items } = useCartStore()
  const { setSelectedItem } = useUIStore()
  const inCart = items.some((i) => i.id === item.id)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35, ease: 'easeOut' }}
      onClick={() => setSelectedItem(item)}
      style={{
        background: '#1e293b',
        borderRadius: 20,
        overflow: 'hidden',
        border: '1px solid rgba(148,163,184,0.1)',
        cursor: 'pointer',
        transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
        position: 'relative',
      }}
      whileHover={{
        y: -4,
        borderColor: `${item.color}40`,
        boxShadow: `0 12px 40px ${item.color}20`,
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* 3D Preview */}
      <div style={{ position: 'relative' }}>
        <DishViewer item={item} compact />

        {/* Tags overlay */}
        {item.tags?.[0] && (
          <div style={{
            position: 'absolute', top: 10, left: 10,
          }}>
            <span className="tag" style={{ fontSize: 10 }}>
              {item.tags[0]}
            </span>
          </div>
        )}

        {item.spicy && (
          <div style={{
            position: 'absolute', top: 10, right: 10,
          }}>
            <span style={{ fontSize: 16 }}>🌶️</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '14px 16px 16px' }}>
        <h3 style={{
          fontSize: 15, fontWeight: 700,
          color: '#f1f5f9',
          marginBottom: 4,
          lineHeight: 1.3,
        }}>
          {item.name}
        </h3>

        <p style={{
          fontSize: 12, color: '#64748b',
          marginBottom: 10,
          lineHeight: 1.4,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {item.description}
        </p>

        {/* Rating & time */}
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: 10, marginBottom: 14,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Star size={11} fill="#f59e0b" color="#f59e0b" />
            <span style={{ fontSize: 12, color: '#f59e0b', fontWeight: 600 }}>
              {item.rating}
            </span>
            <span style={{ fontSize: 11, color: '#475569' }}>
              ({item.reviews})
            </span>
          </div>
          <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#334155' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Clock size={11} color="#475569" />
            <span style={{ fontSize: 12, color: '#475569' }}>{item.prepTime}</span>
          </div>
        </div>

        {/* Price + Add button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{
            fontSize: 17, fontWeight: 800,
            color: '#f97316',
          }}>
            {formatPrice(item.price)}
          </span>

          <motion.button
            onClick={(e) => {
              e.stopPropagation()
              addItem(item)
            }}
            whileTap={{ scale: 0.88 }}
            style={{
              width: 36, height: 36,
              borderRadius: 10,
              background: inCart
                ? 'rgba(34,197,94,0.15)'
                : `linear-gradient(135deg, #f97316, #ea580c)`,
              border: inCart
                ? '1px solid rgba(34,197,94,0.3)'
                : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              color: inCart ? '#22c55e' : 'white',
              boxShadow: inCart ? 'none' : '0 4px 12px rgba(249,115,22,0.4)',
              transition: 'all 0.25s ease',
            }}
          >
            {inCart ? <Check size={15} /> : <Plus size={16} />}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
