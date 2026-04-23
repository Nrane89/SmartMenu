import { Router } from 'express'
import { v4 as uuid } from 'uuid'
import { db } from '../firebase.js'

const router = Router()

// GET /api/orders
router.get('/', async (_req, res) => {
  try {
    const snap = await db.collection('orders').orderBy('createdAt', 'desc').get()
    const orders = snap.docs.map((d) => d.data())
    res.json({ orders, total: orders.length })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/orders/:id
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('orders').doc(req.params.id).get()
    if (!doc.exists) return res.status(404).json({ error: 'Order not found' })
    res.json(doc.data())
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/orders
router.post('/', async (req, res) => {
  const { tableId, items, note, total, paymentMethod } = req.body
  if (!tableId || !items?.length) {
    return res.status(400).json({ error: 'tableId and items are required' })
  }

  const order = {
    id: `ORD-${uuid().slice(0, 8).toUpperCase()}`,
    tableId,
    items: items.map((i) => ({ ...i, status: 'pending' })),
    note: note || '',
    total: total || 0,
    paymentMethod: paymentMethod || 'card',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  }

  try {
    await db.collection('orders').doc(order.id).set(order)
    req.io.to('kitchen').emit('new-order', order)
    req.io.to(`table-${tableId}`).emit('order-confirmed', order)
    res.status(201).json(order)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH /api/orders/:id/status
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body
  const valid = ['confirmed', 'preparing', 'ready', 'delivered']
  if (!valid.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${valid.join(', ')}` })
  }

  try {
    const ref = db.collection('orders').doc(req.params.id)
    const doc = await ref.get()
    if (!doc.exists) return res.status(404).json({ error: 'Order not found' })

    await ref.update({ status, updatedAt: new Date().toISOString() })
    const updated = (await ref.get()).data()

    req.io.to('kitchen').emit('order-status-updated', { orderId: updated.id, status })
    req.io.to(`table-${updated.tableId}`).emit('order-status-updated', { orderId: updated.id, status })

    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH /api/orders/:id/items/:itemId/status
router.patch('/:id/items/:itemId/status', async (req, res) => {
  try {
    const ref = db.collection('orders').doc(req.params.id)
    const doc = await ref.get()
    if (!doc.exists) return res.status(404).json({ error: 'Order not found' })

    const order = doc.data()
    const items = order.items.map((i) =>
      i.id === req.params.itemId ? { ...i, status: req.body.status || 'done' } : i
    )

    await ref.update({ items })
    const updated = (await ref.get()).data()
    const item = updated.items.find((i) => i.id === req.params.itemId)

    req.io.to('kitchen').emit('item-status-updated', {
      orderId: updated.id, itemId: item.id, status: item.status,
    })

    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
