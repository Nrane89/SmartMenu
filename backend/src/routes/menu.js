import { Router } from 'express'
import { v4 as uuid } from 'uuid'
import { db } from '../firebase.js'

const router = Router()
const COL = 'menu'

// GET /api/menu
router.get('/', async (req, res) => {
  try {
    const { category, available } = req.query
    let query = db.collection(COL)
    const snap = await query.get()
    let items = snap.docs.map((d) => d.data())
    if (category && category !== 'all') items = items.filter((i) => i.category === category)
    if (available === 'true') items = items.filter((i) => i.available)
    items.sort((a, b) => (a.order || 0) - (b.order || 0))
    res.json({ items, total: items.length })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/menu/:id
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection(COL).doc(req.params.id).get()
    if (!doc.exists) return res.status(404).json({ error: 'Not found' })
    res.json(doc.data())
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/menu
router.post('/', async (req, res) => {
  try {
    const id = uuid()
    const item = { id, ...req.body, available: true, createdAt: new Date().toISOString() }
    await db.collection(COL).doc(id).set(item)
    res.status(201).json(item)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/menu/:id
router.put('/:id', async (req, res) => {
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

// PATCH /api/menu/:id/toggle
router.patch('/:id/toggle', async (req, res) => {
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

// DELETE /api/menu/:id
router.delete('/:id', async (req, res) => {
  try {
    await db.collection(COL).doc(req.params.id).delete()
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/menu/seed — populate initial data
router.post('/seed', async (req, res) => {
  const items = [
    { id: '1', name: 'Կեսարի Աղցան', nameEn: 'Caesar Salad', category: 'starters', price: 2800, description: 'Թարմ ռոմեն սալաթ, կռեկեր, պարմեզան, կեսարի սոուս', calories: 320, prepTime: '10 ր', rating: 4.8, reviews: 124, tags: ['Վեգ', 'Հայտնի'], spicy: false, available: true, color: '#4ade80', order: 1 },
    { id: '2', name: 'Մսային Burger Classic', nameEn: 'Classic Burger', category: 'burgers', price: 4500, description: '200գ տավարի միս, չեդդեր, կաղամբ, լոլիկ, հատուկ սոուս', calories: 680, prepTime: '15 ր', rating: 4.9, reviews: 287, tags: ['Bestseller'], spicy: false, available: true, color: '#f97316', order: 2 },
    { id: '3', name: 'Մարգարիտ Պիցցա', nameEn: 'Margherita Pizza', category: 'pizza', price: 5200, description: '32սմ, մոցառելլա, թարմ բազիլ, լոլիկի սոուս', calories: 890, prepTime: '20 ր', rating: 4.7, reviews: 198, tags: ['Վեգ'], spicy: false, available: true, color: '#ef4444', order: 3 },
    { id: '4', name: 'Հրո Հավ', nameEn: 'Spicy Chicken', category: 'mains', price: 5800, description: 'Կծու մարինադով հավի ֆիլե, ձկնաբույն բրինձ, բանջարեղեն', calories: 720, prepTime: '25 ր', rating: 4.6, reviews: 156, tags: ['Կծու'], spicy: true, available: true, color: '#f59e0b', order: 4 },
    { id: '5', name: 'Շոկոլադե Ֆոնդան', nameEn: 'Chocolate Fondant', category: 'desserts', price: 2200, description: 'Տաք շոկոլադե կեքս հեղուկ կենտրոնով, վանիլի պաղպաղակ', calories: 480, prepTime: '12 ր', rating: 4.9, reviews: 312, tags: ['Bestseller'], spicy: false, available: true, color: '#8b5cf6', order: 5 },
    { id: '6', name: 'Թարմ Մրգային Ըմպելիք', nameEn: 'Fresh Fruit Juice', category: 'drinks', price: 1500, description: 'Թարմ մրգեր, ձմերուկ, ելակ', calories: 120, prepTime: '5 ր', rating: 4.7, reviews: 89, tags: ['Vegan'], spicy: false, available: true, color: '#ec4899', order: 6 },
    { id: '7', name: 'Ծովամթերք Ռիզոտտո', nameEn: 'Seafood Risotto', category: 'mains', price: 7200, description: 'Արբոռիո բրինձ, ծովախեցգետին, ականջ, մուսել, պարմեզան', calories: 640, prepTime: '30 ր', rating: 4.8, reviews: 143, tags: ['Chef\'s Choice'], spicy: false, available: true, color: '#06b6d4', order: 7 },
    { id: '8', name: 'Պեպերոնի Պիցցա', nameEn: 'Pepperoni Pizza', category: 'pizza', price: 5900, description: '32սմ, պեպերոնի, մոցառելլա, լոլիկի սոուս', calories: 960, prepTime: '20 ր', rating: 4.9, reviews: 421, tags: ['Bestseller'], spicy: true, available: true, color: '#dc2626', order: 8 },
    { id: '9', name: 'Տիրամիսու', nameEn: 'Tiramisu', category: 'desserts', price: 2500, description: 'Դասական իտալական տիրամիսու, մասկարպոնե, կաֆե, կակաո', calories: 420, prepTime: '0 ր', rating: 4.8, reviews: 267, tags: ['Vegan friendly'], spicy: false, available: true, color: '#a78bfa', order: 9 },
    { id: '10', name: 'BBQ Կողիկ', nameEn: 'BBQ Ribs', category: 'mains', price: 8500, description: '400գ կողիկ BBQ սոուսով, կարտոֆիլ, կաղամբ', calories: 1100, prepTime: '35 ր', rating: 4.9, reviews: 178, tags: ['Chef\'s Choice'], spicy: false, available: true, color: '#b45309', order: 10 },
  ]
  try {
    const batch = db.batch()
    items.forEach((item) => {
      batch.set(db.collection(COL).doc(item.id), { ...item, createdAt: new Date().toISOString() })
    })
    await batch.commit()
    res.json({ ok: true, count: items.length })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
