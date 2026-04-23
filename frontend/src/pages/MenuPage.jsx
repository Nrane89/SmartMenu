import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Search, SlidersHorizontal, Wifi } from 'lucide-react'
import { motion } from 'framer-motion'
import MenuCard from '../components/Menu3D/MenuCard'
import ItemModal from '../components/Menu3D/ItemModal'
import CartDrawer from '../components/Cart/CartDrawer'
import CartFAB from '../components/UI/CartFAB'
import PaymentModal from '../components/Payment/PaymentModal'
import SuccessModal from '../components/Payment/SuccessModal'
import { useMenuStore, useCartStore } from '../store/useStore'
import { CATEGORIES, MENU_ITEMS } from '../utils/mockData'
import { connectSocket, socket } from '../utils/socket'

export default function MenuPage() {
  const { tableId } = useParams()
  const { selectedCategory, setSelectedCategory, searchQuery, setSearchQuery, filteredItems, setMenuItems, setCategories } = useMenuStore()
  const { setTableId } = useCartStore()
  const [connected, setConnected] = useState(false)
  const searchRef = useRef()

  useEffect(() => {
    setTableId(tableId || 'T1')
    setMenuItems(MENU_ITEMS)
    setCategories(CATEGORIES)

    connectSocket()
    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))

    return () => {
      socket.off('connect')
      socket.off('disconnect')
    }
  }, [tableId])

  const items = filteredItems()

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0f172a 0%, #0a1628 100%)',
    }}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: 'rgba(15,23,42,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(148,163,184,0.06)',
        padding: '16px 20px 0',
      }}>
        {/* Top row */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 14,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9' }}>SmartMenu</span>
              <span style={{
                fontSize: 10, fontWeight: 700,
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                color: 'white', padding: '2px 8px',
                borderRadius: 100,
              }}>3D</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: connected ? '#22c55e' : '#ef4444',
                boxShadow: `0 0 6px ${connected ? '#22c55e' : '#ef4444'}`,
              }} />
              <span style={{ fontSize: 11, color: '#64748b' }}>
                Սեղան {tableId || 'T1'}
              </span>
            </div>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '6px 12px',
            background: 'rgba(249,115,22,0.1)',
            border: '1px solid rgba(249,115,22,0.2)',
            borderRadius: 10,
          }}>
            <Wifi size={13} color="#f97316" />
            <span style={{ fontSize: 12, color: '#f97316', fontWeight: 600 }}>Ուղիղ</span>
          </div>
        </div>

        {/* Search */}
        <div style={{
          position: 'relative', marginBottom: 14,
        }}>
          <Search size={15} color="#64748b" style={{
            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
          }} />
          <input
            ref={searchRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Որոնել ուտեստ..."
            style={{
              width: '100%',
              padding: '11px 14px 11px 38px',
              background: 'rgba(30,41,59,0.8)',
              border: '1px solid rgba(148,163,184,0.1)',
              borderRadius: 12,
              color: '#f1f5f9', fontSize: 14,
              outline: 'none', fontFamily: 'inherit',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'transparent', border: 'none', color: '#64748b',
                cursor: 'pointer', fontSize: 16,
              }}
            >×</button>
          )}
        </div>

        {/* Categories */}
        <div style={{
          display: 'flex', gap: 8, overflowX: 'auto',
          paddingBottom: 14,
          scrollbarWidth: 'none',
        }}>
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              whileTap={{ scale: 0.94 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 16px',
                background: selectedCategory === cat.id
                  ? 'linear-gradient(135deg, #f97316, #ea580c)'
                  : 'rgba(30,41,59,0.8)',
                border: selectedCategory === cat.id
                  ? 'none'
                  : '1px solid rgba(148,163,184,0.1)',
                borderRadius: 100,
                color: selectedCategory === cat.id ? 'white' : '#94a3b8',
                cursor: 'pointer', whiteSpace: 'nowrap',
                fontSize: 13, fontWeight: 600,
                flexShrink: 0,
                boxShadow: selectedCategory === cat.id
                  ? '0 4px 16px rgba(249,115,22,0.4)'
                  : 'none',
                transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: 14 }}>{cat.emoji}</span>
              {cat.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div style={{ padding: '20px 16px 120px' }}>
        {/* Results count */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 16,
        }}>
          <p style={{ fontSize: 13, color: '#475569' }}>
            {items.length} ուտեստ
            {searchQuery && ` «${searchQuery}»-ի արդյունքներ`}
          </p>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'transparent', border: 'none',
            color: '#64748b', cursor: 'pointer', fontSize: 13,
          }}>
            <SlidersHorizontal size={13} />
            Ֆilter
          </button>
        </div>

        {items.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '60px 0',
            color: '#475569',
          }}>
            <p style={{ fontSize: 48, marginBottom: 12 }}>🔍</p>
            <p style={{ fontSize: 15 }}>Ոչ մի ուտեստ չի գտնվել</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all') }}
              style={{
                marginTop: 12, background: 'transparent',
                border: '1px solid rgba(148,163,184,0.2)',
                color: '#94a3b8', padding: '8px 20px',
                borderRadius: 8, cursor: 'pointer', fontSize: 13,
              }}
            >
              Մաքրել ֆilter-ը
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 16,
          }}>
            {items.map((item, i) => (
              <MenuCard key={item.id} item={item} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* Overlays */}
      <ItemModal />
      <CartDrawer />
      <PaymentModal />
      <SuccessModal />
      <CartFAB />
    </div>
  )
}
