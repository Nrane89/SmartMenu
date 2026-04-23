import { Router } from 'express'

const router = Router()

// In-memory menu (replace with DB)
const MENU = [
  { id: '1', name: 'Կeesari Aghcan', category: 'starters', price: 2800, calories: 320, prepTime: '10 r', rating: 4.8, reviews: 124, tags: ['Veg', 'Haytni'], spicy: false, available: true, color: '#4ade80' },
  { id: '2', name: 'Classic Burger', category: 'burgers', price: 4500, calories: 680, prepTime: '15 r', rating: 4.9, reviews: 287, tags: ['Bestseller'], spicy: false, available: true, color: '#f97316' },
  { id: '3', name: 'Margherita Pizza', category: 'pizza', price: 5200, calories: 890, prepTime: '20 r', rating: 4.7, reviews: 198, tags: ['Veg'], spicy: false, available: true, color: '#ef4444' },
  { id: '4', name: 'Ktsuu Hav', category: 'mains', price: 5800, calories: 720, prepTime: '25 r', rating: 4.6, reviews: 156, tags: ['Ktsuu'], spicy: true, available: true, color: '#f59e0b' },
  { id: '5', name: 'Shokollade Fondan', category: 'desserts', price: 2200, calories: 480, prepTime: '12 r', rating: 4.9, reviews: 312, tags: ['Bestseller'], spicy: false, available: true, color: '#8b5cf6' },
  { id: '6', name: 'Tarme Mrgayin Ympeliq', category: 'drinks', price: 1500, calories: 120, prepTime: '5 r', rating: 4.7, reviews: 89, tags: ['Vegan'], spicy: false, available: true, color: '#ec4899' },
]

// GET /api/menu
router.get('/', (req, res) => {
  const { category, available } = req.query
  let items = [...MENU]
  if (category && category !== 'all') items = items.filter((i) => i.category === category)
  if (available === 'true') items = items.filter((i) => i.available)
  res.json({ items, total: items.length })
})

// GET /api/menu/:id
router.get('/:id', (req, res) => {
  const item = MENU.find((i) => i.id === req.params.id)
  if (!item) return res.status(404).json({ error: 'Menu item not found' })
  res.json(item)
})

// PATCH /api/menu/:id/toggle
router.patch('/:id/toggle', (req, res) => {
  const item = MENU.find((i) => i.id === req.params.id)
  if (!item) return res.status(404).json({ error: 'Menu item not found' })
  item.available = !item.available
  res.json(item)
})

export default router
