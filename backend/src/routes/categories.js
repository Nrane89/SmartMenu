import { Router } from 'express'
import { db } from '../firebase.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
const COL = 'categories'

const DEFAULT_CATS = [
  { id: 'starters', label: 'Նախуtestv', emoji: '🥗', order: 1 },
  { id: 'mains', label: 'Himnakan', emoji: '🍖', order: 2 },
  { id: 'pizza', label: 'Pizza', emoji: '🍕', order: 3 },
  { id: 'burgers', label: 'Burger', emoji: '🍔', order: 4 },
  { id: 'desserts', label: 'Desserts', emoji: '🍰', order: 5 },
  { id: 'drinks', label: 'Drinks', emoji: '🥤', order: 6 },
]

// GET /api/categories?restaurantId=xxx  (public)
router.get('/', async (req, res) => {
  try {
    const { restaurantId } = req.query
    const snap = await db.collection(COL).orderBy('order').get()
    let cats = snap.docs.map((d) => d.data())
    if (restaurantId) cats = cats.filter((c) => c.restaurantId === restaurantId)
    if (cats.length === 0) return res.json({ categories: DEFAULT_CATS })
    res.json({ categories: cats })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/categories  (admin)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { label, emoji } = req.body
    const restaurantId = req.user.restaurantId
    if (!label) return res.status(400).json({ error: 'label required' })
    const snap = await db.collection(COL).where('restaurantId', '==', restaurantId).get()
    const order = snap.size + 1
    const id = `${restaurantId}_${label.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')}_${Date.now()}`
    const cat = { id, label, emoji: emoji || '🍽️', order, restaurantId }
    await db.collection(COL).doc(id).set(cat)
    res.status(201).json(cat)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/categories/:id  (admin)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { label, emoji } = req.body
    const ref = db.collection(COL).doc(req.params.id)
    await ref.update({ label, emoji })
    res.json((await ref.get()).data())
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/categories/:id  (admin)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await db.collection(COL).doc(req.params.id).delete()
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
