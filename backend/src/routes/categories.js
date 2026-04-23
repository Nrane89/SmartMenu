import { Router } from 'express'
import { db } from '../firebase.js'

const router = Router()
const COL = 'categories'

router.get('/', async (_req, res) => {
  try {
    const snap = await db.collection(COL).orderBy('order').get()
    if (snap.empty) {
      const defaults = [
        { id: 'starters', label: 'Նախուտեստ', emoji: '🥗', order: 1 },
        { id: 'mains', label: 'Հիմնական', emoji: '🍖', order: 2 },
        { id: 'pizza', label: 'Պիցցա', emoji: '🍕', order: 3 },
        { id: 'burgers', label: 'Բուրգեր', emoji: '🍔', order: 4 },
        { id: 'desserts', label: 'Անուշաբույր', emoji: '🍰', order: 5 },
        { id: 'drinks', label: 'Ըմպելիք', emoji: '🥤', order: 6 },
      ]
      return res.json({ categories: defaults })
    }
    res.json({ categories: snap.docs.map((d) => d.data()) })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const { label, emoji } = req.body
    if (!label) return res.status(400).json({ error: 'label required' })
    const snap = await db.collection(COL).get()
    const order = snap.size + 1
    const id = label.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') + '_' + Date.now()
    const cat = { id, label, emoji: emoji || '🍽️', order }
    await db.collection(COL).doc(id).set(cat)
    res.status(201).json(cat)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { label, emoji } = req.body
    const ref = db.collection(COL).doc(req.params.id)
    await ref.update({ label, emoji })
    res.json((await ref.get()).data())
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await db.collection(COL).doc(req.params.id).delete()
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/seed', async (_req, res) => {
  try {
    const defaults = [
      { id: 'starters', label: 'Նախուտեստ', emoji: '🥗', order: 1 },
      { id: 'mains', label: 'Հիմնական', emoji: '🍖', order: 2 },
      { id: 'pizza', label: 'Պիցցա', emoji: '🍕', order: 3 },
      { id: 'burgers', label: 'Բուրգեր', emoji: '🍔', order: 4 },
      { id: 'desserts', label: 'Անուշաբույր', emoji: '🍰', order: 5 },
      { id: 'drinks', label: 'Ըմպելիք', emoji: '🥤', order: 6 },
    ]
    const batch = db.batch()
    defaults.forEach((c) => batch.set(db.collection(COL).doc(c.id), c))
    await batch.commit()
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
