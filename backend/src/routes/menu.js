import { Router } from 'express'
import { v4 as uuid } from 'uuid'
import { db } from '../firebase.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
const COL = 'menu'

// GET /api/menu?restaurantId=xxx  (public)
router.get('/', async (req, res) => {
  try {
    const { category, available, restaurantId } = req.query
    const snap = await db.collection(COL).get()
    let items = snap.docs.map((d) => d.data())
    if (restaurantId) items = items.filter((i) => i.restaurantId === restaurantId)
    if (category && category !== 'all') items = items.filter((i) => i.category === category)
    if (available === 'true') items = items.filter((i) => i.available)
    items.sort((a, b) => (a.order || 0) - (b.order || 0))
    res.json({ items, total: items.length })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/menu/:id  (public)
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection(COL).doc(req.params.id).get()
    if (!doc.exists) return res.status(404).json({ error: 'Not found' })
    res.json(doc.data())
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/menu  (admin)
router.post('/', requireAuth, async (req, res) => {
  try {
    const id = uuid()
    const item = {
      id, ...req.body,
      restaurantId: req.user.restaurantId,
      available: true,
      createdAt: new Date().toISOString(),
    }
    await db.collection(COL).doc(id).set(item)
    res.status(201).json(item)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/menu/:id  (admin)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const ref = db.collection(COL).doc(req.params.id)
    const doc = await ref.get()
    if (!doc.exists) return res.status(404).json({ error: 'Not found' })
    await ref.update({ ...req.body, updatedAt: new Date().toISOString() })
    res.json((await ref.get()).data())
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH /api/menu/:id/toggle  (admin)
router.patch('/:id/toggle', requireAuth, async (req, res) => {
  try {
    const ref = db.collection(COL).doc(req.params.id)
    const doc = await ref.get()
    if (!doc.exists) return res.status(404).json({ error: 'Not found' })
    const available = !doc.data().available
    await ref.update({ available })
    res.json({ ...doc.data(), available })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/menu/:id  (admin)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await db.collection(COL).doc(req.params.id).delete()
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/menu/seed  (admin)
router.post('/seed', requireAuth, async (req, res) => {
  const restaurantId = req.user.restaurantId
  const items = [
    { id: uuid(), name: 'Կеsari Aghcan', nameEn: 'Caesar Salad', category: 'starters', price: 2800, description: 'Fresh romaine, croutons, parmesan, caesar sauce', calories: 320, prepTime: '10 ր', rating: 4.8, reviews: 124, tags: ['Veg'], spicy: false, available: true, color: '#4ade80', order: 1 },
    { id: uuid(), name: 'Classic Burger', nameEn: 'Classic Burger', category: 'burgers', price: 4500, description: '200g beef patty, cheddar, lettuce, tomato', calories: 680, prepTime: '15 ր', rating: 4.9, reviews: 287, tags: ['Bestseller'], spicy: false, available: true, color: '#f97316', order: 2 },
    { id: uuid(), name: 'Margarita Pizza', nameEn: 'Margherita Pizza', category: 'pizza', price: 5200, description: '32cm, mozzarella, basil, tomato sauce', calories: 890, prepTime: '20 ր', rating: 4.7, reviews: 198, tags: ['Veg'], spicy: false, available: true, color: '#ef4444', order: 3 },
  ]
  try {
    const batch = db.batch()
    items.forEach((item) => {
      batch.set(db.collection(COL).doc(item.id), { ...item, restaurantId, createdAt: new Date().toISOString() })
    })
    await batch.commit()
    res.json({ ok: true, count: items.length })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
