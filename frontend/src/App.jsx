import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MenuPage from './pages/MenuPage'
import KDSPage from './pages/KDSPage'
import AdminPage from './pages/AdminPage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SuperLoginPage from './pages/SuperLoginPage'
import SuperAdminPage from './pages/SuperAdminPage'
import { getUser } from './utils/auth'

function RequireAdmin({ children }) {
  const user = getUser()
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />
  return children
}

function RequireSuper({ children }) {
  const user = getUser()
  if (!user || user.role !== 'superadmin') return <Navigate to="/super/login" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/super/login" element={<SuperLoginPage />} />
        <Route path="/super" element={<RequireSuper><SuperAdminPage /></RequireSuper>} />
        <Route path="/menu/:tableId" element={<MenuPage />} />
        <Route path="/menu/:restaurantId/:tableId" element={<MenuPage />} />
        <Route path="/kds" element={<KDSPage />} />
        <Route path="/kds/:restaurantId" element={<KDSPage />} />
        <Route path="/admin" element={<RequireAdmin><AdminPage /></RequireAdmin>} />
      </Routes>
    </BrowserRouter>
  )
}
