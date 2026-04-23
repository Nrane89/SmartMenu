import { Router } from 'express'
import { db } from '../firebase.js'

const router = Router()
const COL = 'tables'

// GET /api/tables
router.get('/', async (_req, res) => {
  try {
    const snap = await db.collection(COL).orderBy('order').get()
    if (snap.empty) {
      const defaults = Array.from({ length: 10 }, (_, i) => ({
        id: `T${i + 1}`,
        name: `Սեղան ${i + 1}`,
        order: i + 1,
      }))
      return res.json({ tables: defaults })
    }
    res.json({ tables: snap.docs.map((d) => d.data()) })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/tables
router.post('/', async (req, res) => {
  try {
    const { name } = req.body
    if (!name) return res.status(400).json({ error: 'name required' })
    const snap = await db.collection(COL).get()
    const order = snap.size + 1
    const id = `T${Date.now()}`
    const table = { id, name, order }
    await db.collection(COL).doc(id).set(table)
    res.status(201).json(table)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/tables/:id
router.put('/:id', async (req, res) => {
  try {
    const { name } = req.body
    const ref = db.collection(COL).doc(req.params.id)
    await ref.update({ name })
    res.json((await ref.get()).data())
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/tables/:id
router.delete('/:id', async (req, res) => {
  try {
    await db.collection(COL).doc(req.params.id).delete()
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/tables/seed
router.post('/seed', async (_req, res) => {
  try {
    const batch = db.batch()
    Array.from({ length: 10 }, (_, i) => {
      const id = `T${i + 1}`
      batch.set(db.collection(COL).doc(id), { id, name: `Սեղան ${i + 1}`, order: i + 1 })
    })
    await batch.commit()
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
