import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from '../firebase.js'
import { requireSuper, SECRET } from '../middleware/auth.js'

const router = Router()

// POST /api/auth/login  — admin login
router.post('/login', async (req, res) => {
  const { username, password, restaurantId } = req.body
  if (!username || !password || !restaurantId)
    return res.status(400).json({ error: 'username, password, restaurantId required' })
  try {
    const snap = await db.collection('admins')
      .where('username', '==', username)
      .where('restaurantId', '==', restaurantId)
      .get()
    if (snap.empty) return res.status(401).json({ error: 'Wrong credentials' })
    const admin = snap.docs[0].data()
    const valid = await bcrypt.compare(password, admin.passwordHash)
    if (!valid) return res.status(401).json({ error: 'Wrong credentials' })
    const token = jwt.sign(
      { role: 'admin', restaurantId: admin.restaurantId, adminId: admin.id, name: admin.name },
      SECRET, { expiresIn: '30d' }
    )
    res.json({ token, role: 'admin', restaurantId: admin.restaurantId, name: admin.name })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/auth/super/login  — superadmin login
router.post('/super/login', (req, res) => {
  const { username, password } = req.body
  const SU = process.env.SUPER_ADMIN_USER || 'superadmin'
  const SP = process.env.SUPER_ADMIN_PASS || 'SmartMenu2024!'
  if (username !== SU || password !== SP)
    return res.status(401).json({ error: 'Wrong credentials' })
  const token = jwt.sign({ role: 'superadmin' }, SECRET, { expiresIn: '30d' })
  res.json({ token, role: 'superadmin' })
})

// GET /api/auth/me
router.get('/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'No token' })
  try {
    const user = jwt.verify(token, SECRET)
    res.json(user)
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
})

// ── Super admin routes ──────────────────────────────────────────

// GET /api/auth/super/restaurants
router.get('/super/restaurants', requireSuper, async (_req, res) => {
  try {
    const snap = await db.collection('restaurants').orderBy('createdAt', 'desc').get()
    res.json({ restaurants: snap.docs.map((d) => d.data()) })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/auth/super/restaurants
router.post('/super/restaurants', requireSuper, async (req, res) => {
  const { name, slug } = req.body
  if (!name || !slug) return res.status(400).json({ error: 'name and slug required' })
  const id = slug.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  try {
    const exists = await db.collection('restaurants').doc(id).get()
    if (exists.exists) return res.status(400).json({ error: 'Slug already exists' })
    const restaurant = { id, name, slug: id, createdAt: new Date().toISOString() }
    await db.collection('restaurants').doc(id).set(restaurant)
    res.status(201).json(restaurant)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/auth/super/restaurants/:id
router.delete('/super/restaurants/:id', requireSuper, async (req, res) => {
  try {
    await db.collection('restaurants').doc(req.params.id).delete()
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/auth/super/admins
router.get('/super/admins', requireSuper, async (_req, res) => {
  try {
    const snap = await db.collection('admins').get()
    const admins = snap.docs.map((d) => {
      const { passwordHash, ...safe } = d.data()
      return safe
    })
    res.json({ admins })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/auth/super/admins
router.post('/super/admins', requireSuper, async (req, res) => {
  const { restaurantId, username, password, name } = req.body
  if (!restaurantId || !username || !password)
    return res.status(400).json({ error: 'restaurantId, username, password required' })
  try {
    const passwordHash = await bcrypt.hash(password, 10)
    const id = `${restaurantId}_${username}`
    const admin = { id, restaurantId, username, name: name || username, passwordHash, createdAt: new Date().toISOString() }
    await db.collection('admins').doc(id).set(admin)
    const { passwordHash: _, ...safe } = admin
    res.status(201).json(safe)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/auth/super/admins/:id
router.delete('/super/admins/:id', requireSuper, async (req, res) => {
  try {
    await db.collection('admins').doc(req.params.id).delete()
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/auth/super/admins/:id/reset-password
router.post('/super/admins/:id/reset-password', requireSuper, async (req, res) => {
  const { password } = req.body
  if (!password) return res.status(400).json({ error: 'password required' })
  try {
    const passwordHash = await bcrypt.hash(password, 10)
    await db.collection('admins').doc(req.params.id).update({ passwordHash })
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
