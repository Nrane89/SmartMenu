import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'smartmenu-jwt-secret-2024'

export function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'No token' })
  try {
    req.user = jwt.verify(token, SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}

export function requireSuper(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'No token' })
  try {
    const user = jwt.verify(token, SECRET)
    if (user.role !== 'superadmin') return res.status(403).json({ error: 'Forbidden' })
    req.user = user
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}

export { SECRET }
