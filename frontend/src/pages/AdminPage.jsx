import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, ShoppingBag, Users, DollarSign, Clock, Star, Edit3, Trash2, Plus, Eye, EyeOff } from 'lucide-react'
import { useOrderStore } from '../store/useStore'
import { MENU_ITEMS, formatPrice } from '../utils/mockData'
import { useNavigate } from 'react-router-dom'

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div style={{
      background: '#1e293b',
      border: '1px solid rgba(148,163,184,0.08)',
      borderRadius: 18, padding: '20px 22px',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{
          width: 40, height: 40,
          background: `${color}15`,
          border: `1px solid ${color}25`,
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={18} color={color} />
        </div>
        <span style={{
          fontSize: 11, color: '#22c55e', fontWeight: 600,
          background: 'rgba(34,197,94,0.1)',
          padding: '3px 8px', borderRadius: 100,
        }}>+{sub}</span>
      </div>
      <p style={{ fontSize: 24, fontWeight: 800, color: '#f1f5f9', marginBottom: 4 }}>{value}</p>
      <p style={{ fontSize: 12, color: '#64748b' }}>{label}</p>
    </div>
  )
}

export default function AdminPage() {
  const navigate = useNavigate()
  const { orders } = useOrderStore()
  const [activeTab, setActiveTab] = useState('dashboard')

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0)
  const avgOrder = orders.length ? Math.round(totalRevenue / orders.length) : 0

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'menu', label: 'Menyu', icon: Edit3 },
    { id: 'orders', label: 'Patverwer', icon: ShoppingBag },
  ]

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'transparent', border: 'none',
              color: '#64748b', cursor: 'pointer', fontSize: 20,
            }}
          >←</button>
          <h1 style={{ fontSize: 17, fontWeight: 800 }}>SmartMenu Admin</h1>
        </div>
        <div style={{
          fontSize: 12, color: '#22c55e',
          background: 'rgba(34,197,94,0.1)',
          border: '1px solid rgba(34,197,94,0.2)',
          padding: '5px 12px', borderRadius: 100,
        }}>
          ● Akt'iv
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', borderBottom: '1px solid rgba(148,163,184,0.06)',
        padding: '0 24px',
        background: 'rgba(15,23,42,0.5)',
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '14px 20px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.id
                ? '2px solid #f97316' : '2px solid transparent',
              color: activeTab === tab.id ? '#f97316' : '#64748b',
              cursor: 'pointer', fontSize: 14, fontWeight: 600,
              transition: 'all 0.2s',
            }}
          >
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '24px' }}>
        {activeTab === 'dashboard' && (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 16, marginBottom: 28,
            }}>
              <StatCard icon={DollarSign} label="Yntaмenyi Yelumk" value={formatPrice(totalRevenue)} sub="12%" color="#f97316" />
              <StatCard icon={ShoppingBag} label="Patverwer" value={orders.length} sub="8%" color="#22c55e" />
              <StatCard icon={TrendingUp} label="Mij'hin Patvera" value={formatPrice(avgOrder)} sub="5%" color="#a78bfa" />
              <StatCard icon={Users} label="Hench'oc'ner" value="42" sub="15%" color="#60a5fa" />
            </div>

            {/* Recent orders */}
            <div style={{
              background: '#1e293b',
              border: '1px solid rgba(148,163,184,0.08)',
              borderRadius: 18, overflow: 'hidden',
            }}>
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid rgba(148,163,184,0.06)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <h3 style={{ fontSize: 15, fontWeight: 700 }}>Verwjin Patverwer</h3>
                <span style={{ fontSize: 12, color: '#475569' }}>{orders.length} yntaмenyi</span>
              </div>
              {orders.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#334155' }}>
                  Patverwer chen gtner
                </div>
              ) : (
                orders.slice(0, 8).map((order) => (
                  <div key={order.id} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 20px',
                    borderBottom: '1px solid rgba(148,163,184,0.04)',
                  }}>
                    <div style={{
                      width: 36, height: 36,
                      background: 'rgba(249,115,22,0.1)',
                      borderRadius: 10,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 700, color: '#f97316',
                    }}>
                      {order.tableId}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>
                        {order.items.length} utoest
                      </p>
                      <p style={{ fontSize: 11, color: '#475569' }}>
                        {new Date(order.createdAt).toLocaleString('hy-AM')}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#f97316' }}>
                        {formatPrice(order.total)}
                      </p>
                      <span style={{
                        fontSize: 10, fontWeight: 600,
                        color: order.status === 'delivered' ? '#22c55e' : '#f97316',
                        background: order.status === 'delivered'
                          ? 'rgba(34,197,94,0.1)' : 'rgba(249,115,22,0.1)',
                        padding: '2px 8px', borderRadius: 100,
                      }}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {activeTab === 'menu' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Menyui Utoestner ({MENU_ITEMS.length})</h3>
              <button className="btn btn-primary" style={{ fontSize: 13, padding: '9px 18px' }}>
                <Plus size={15} />
                Avełacnel
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {MENU_ITEMS.map((item) => (
                <div key={item.id} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 18px',
                  background: '#1e293b',
                  border: '1px solid rgba(148,163,184,0.08)',
                  borderRadius: 14,
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 10,
                    background: `${item.color}20`,
                    border: `1px solid ${item.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%',
                      background: item.color,
                    }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9' }}>{item.name}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                      <span style={{ fontSize: 11, color: '#64748b' }}>{item.category}</span>
                      <span style={{ fontSize: 11, color: '#475569' }}>·</span>
                      <Star size={10} fill="#f59e0b" color="#f59e0b" />
                      <span style={{ fontSize: 11, color: '#f59e0b' }}>{item.rating}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', marginRight: 8 }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: '#f97316' }}>
                      {formatPrice(item.price)}
                    </p>
                    <p style={{ fontSize: 11, color: '#475569' }}>{item.calories} kkk</p>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button style={{
                      width: 32, height: 32, background: 'rgba(96,165,250,0.1)',
                      border: '1px solid rgba(96,165,250,0.2)', borderRadius: 8,
                      cursor: 'pointer', color: '#60a5fa',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Edit3 size={13} />
                    </button>
                    <button style={{
                      width: 32, height: 32, background: 'rgba(239,68,68,0.08)',
                      border: '1px solid rgba(239,68,68,0.15)', borderRadius: 8,
                      cursor: 'pointer', color: '#ef4444',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <EyeOff size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
              Bolor Patverwer ({orders.length})
            </h3>
            {orders.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '60px', color: '#334155',
              }}>
                <ShoppingBag size={40} strokeWidth={1} style={{ margin: '0 auto 12px' }} />
                <p>Patverwer chen gtner</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {orders.map((order) => (
                  <div key={order.id} style={{
                    background: '#1e293b',
                    border: '1px solid rgba(148,163,184,0.08)',
                    borderRadius: 16, padding: '18px 20px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div>
                        <p style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>
                          #{order.id} · Segh. {order.tableId}
                        </p>
                        <p style={{ fontSize: 11, color: '#475569' }}>
                          {new Date(order.createdAt).toLocaleString('hy-AM')}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: 16, fontWeight: 800, color: '#f97316' }}>
                          {formatPrice(order.total)}
                        </p>
                        <span style={{
                          fontSize: 11, fontWeight: 600,
                          color: order.status === 'delivered' ? '#22c55e' : '#f97316',
                        }}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {order.items.map((item) => (
                        <span key={item.id} style={{
                          fontSize: 12, color: '#94a3b8',
                          background: 'rgba(148,163,184,0.06)',
                          padding: '4px 10px', borderRadius: 100,
                        }}>
                          {item.qty}× {item.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
