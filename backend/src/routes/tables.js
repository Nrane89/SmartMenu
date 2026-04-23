import { Router } from 'express'
import { db } from '../firebase.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
const COL = 'tables'

// GET /api/tables?restaurantId=xxx  (public/admin)
router.get('/', async (req, res) => {
  try {
    const { restaurantId } = req.query
    const snap = await db.collection(COL).orderBy('order').get()
    let tables = snap.docs.map((d) => d.data())
    if (restaurantId) tables = tables.filter((t) => t.restaurantId === restaurantId)
    if (tables.length === 0 && !restaurantId) {
      return res.json({ tables: Array.from({ length: 10 }, (_, i) => ({ id: `T${i+1}`, name: `Table ${i+1}`, order: i+1 })) })
    }
    res.json({ tables })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/tables  (admin)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { name } = req.body
    const restaurantId = req.user.restaurantId
    if (!name) return res.status(400).json({ error: 'name required' })
    const snap = await db.collection(COL).where('restaurantId', '==', restaurantId).get()
    const order = snap.size + 1
    const id = `${restaurantId}_T${Date.now()}`
    const table = { id, name, order, restaurantId, status: 'free' }
    await db.collection(COL).doc(id).set(table)
    res.status(201).json(table)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/tables/:id  (admin)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { name } = req.body
    const ref = db.collection(COL).doc(req.params.id)
    await ref.update({ name })
    res.json((await ref.get()).data())
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH /api/tables/:id/status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body
    const ref = db.collection(COL).doc(req.params.id)
    await ref.update({ status })
    const data = (await ref.get()).data()
    req.io?.emit('table-status', { tableId: req.params.id, status })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/tables/:id  (admin)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await db.collection(COL).doc(req.params.id).delete()
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
