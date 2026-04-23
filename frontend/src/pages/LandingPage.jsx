import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { QrCode, ChefHat, Zap, Shield, Star, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  const navigate = useNavigate()
  const [tableInput, setTableInput] = useState('')

  const goToMenu = (table) => {
    const t = table || tableInput || 'T1'
    navigate(`/menu/${t.toUpperCase()}`)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #0f172a 0%, #0a1628 50%, #0f172a 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', padding: '0 24px',
    }}>
      {/* Hero */}
      <div style={{
        maxWidth: 600, width: '100%',
        textAlign: 'center',
        paddingTop: 80, paddingBottom: 60,
      }}>
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200 }}
          style={{ marginBottom: 24 }}
        >
          <div style={{
            width: 80, height: 80,
            background: 'radial-gradient(circle, rgba(249,115,22,0.2), transparent)',
            border: '1px solid rgba(249,115,22,0.3)',
            borderRadius: 22,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto',
            boxShadow: '0 0 40px rgba(249,115,22,0.2)',
          }}>
            <span style={{ fontSize: 36 }}>🍽️</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px',
            background: 'rgba(249,115,22,0.1)',
            border: '1px solid rgba(249,115,22,0.2)',
            borderRadius: 100,
            marginBottom: 20,
          }}>
            <Zap size={12} color="#f97316" />
            <span style={{ fontSize: 12, color: '#f97316', fontWeight: 600 }}>
              Նոր սերնդի ռեստորանային փորձ
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 8vw, 60px)',
            fontWeight: 900, lineHeight: 1.1,
            marginBottom: 16,
          }}>
            <span style={{ color: '#f1f5f9' }}>Smart</span>
            <span style={{
              background: 'linear-gradient(135deg, #f97316, #fb923c)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Menu</span>
            <span style={{
              fontSize: 'clamp(18px, 4vw, 28px)',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #a78bfa, #818cf8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginLeft: 8,
            }}>3D</span>
          </h1>

          <p style={{
            fontSize: 17, color: '#64748b',
            lineHeight: 1.7, marginBottom: 40,
          }}>
            Ինտerактив QR-մenyu՝ <strong style={{ color: '#94a3b8' }}>3D վizualizaciyayov</strong>,
            anlarg վcharvum ev{' '}
            <strong style={{ color: '#94a3b8' }}>real-time</strong> patverweri karavarcutyamb
          </p>

          {/* Table selector */}
          <div style={{
            display: 'flex', gap: 10,
            maxWidth: 400, margin: '0 auto',
            marginBottom: 16,
          }}>
            <input
              value={tableInput}
              onChange={(e) => setTableInput(e.target.value)}
              placeholder="Մuтагrел seghani hamara (T1, T2...)"
              onKeyDown={(e) => e.key === 'Enter' && goToMenu()}
              style={{
                flex: 1, padding: '14px 18px',
                background: 'rgba(30,41,59,0.8)',
                border: '1px solid rgba(148,163,184,0.15)',
                borderRadius: 14, color: '#f1f5f9',
                fontSize: 14, outline: 'none', fontFamily: 'inherit',
              }}
            />
            <button
              className="btn btn-primary"
              onClick={() => goToMenu()}
              style={{ padding: '14px 20px', borderRadius: 14 }}
            >
              <ArrowRight size={18} />
            </button>
          </div>

          <p style={{ fontSize: 12, color: '#334155', marginBottom: 32 }}>
            Կամ sch'anavarela QR kodna
          </p>

          {/* Demo buttons */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['T1', 'T2', 'T3', 'T4'].map((t) => (
              <button
                key={t}
                onClick={() => goToMenu(t)}
                style={{
                  padding: '10px 20px',
                  background: 'rgba(30,41,59,0.8)',
                  border: '1px solid rgba(148,163,184,0.12)',
                  borderRadius: 10, cursor: 'pointer',
                  color: '#94a3b8', fontSize: 14, fontWeight: 600,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = 'rgba(249,115,22,0.4)'
                  e.target.style.color = '#f97316'
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = 'rgba(148,163,184,0.12)'
                  e.target.style.color = '#94a3b8'
                }}
              >
                🪑 Segh. {t}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{
          maxWidth: 900, width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: 16, marginBottom: 60,
        }}
      >
        {[
          {
            icon: '🎮',
            title: '3D Utosteteri Dashnagrut\'yun',
            desc: 'Pttec\'ek\' ev teset\'ek\' yuraqanchyur utoest bolor kormerits\'',
            color: '#f97316',
          },
          {
            icon: '⚡',
            title: 'Real-time Patverwer',
            desc: 'Xohanoc\'n aks\'ntathorapen stoanaum e yur patverin',
            color: '#22c55e',
          },
          {
            icon: '💳',
            title: 'Anhpum Vcharum',
            desc: 'Apple Pay, Google Pay kam bankayin qart anvtang vcharumov',
            color: '#a78bfa',
          },
          {
            icon: '📊',
            title: 'Admin Dashboard',
            desc: 'Karavaret\'ek\' menu, patverwer ev chek\'er irasakan jamanakim',
            color: '#60a5fa',
          },
        ].map((feat, i) => (
          <div
            key={i}
            style={{
              background: 'rgba(30,41,59,0.4)',
              border: '1px solid rgba(148,163,184,0.08)',
              borderRadius: 18, padding: '24px 22px',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = `${feat.color}30`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(148,163,184,0.08)'
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 12 }}>{feat.icon}</div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>
              {feat.title}
            </h3>
            <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{feat.desc}</p>
          </div>
        ))}
      </motion.div>

      {/* Staff links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{
          display: 'flex', gap: 12, marginBottom: 40, flexWrap: 'wrap', justifyContent: 'center',
        }}
      >
        <button
          onClick={() => navigate('/kds')}
          className="btn btn-ghost"
          style={{ fontSize: 13 }}
        >
          <ChefHat size={15} />
          Xohanoci Ekran (KDS)
        </button>
        <button
          onClick={() => navigate('/admin')}
          className="btn btn-ghost"
          style={{ fontSize: 13 }}
        >
          <Shield size={15} />
          Admin Panel
        </button>
      </motion.div>

      <p style={{ fontSize: 11, color: '#1e293b', marginBottom: 24 }}>
        © 2025 SmartMenu 3D · Handmade with ❤️
      </p>
    </div>
  )
}
