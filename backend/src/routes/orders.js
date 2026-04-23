import { Router } from 'express'
import { v4 as uuid } from 'uuid'
import { orders } from '../server.js'

const router = Router()

// GET /api/orders
router.get('/', (_req, res) => {
  res.json({ orders, total: orders.length })
})

// GET /api/orders/:id
router.get('/:id', (req, res) => {
  const order = orders.find((o) => o.id === req.params.id)
  if (!order) return res.status(404).json({ error: 'Order not found' })
  res.json(order)
})

// POST /api/orders
router.post('/', (req, res) => {
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

  orders.unshift(order)
  req.io.to('kitchen').emit('new-order', order)
  req.io.to(`table-${tableId}`).emit('order-confirmed', order)

  res.status(201).json(order)
})

// PATCH /api/orders/:id/status
router.patch('/:id/status', (req, res) => {
  const order = orders.find((o) => o.id === req.params.id)
  if (!order) return res.status(404).json({ error: 'Order not found' })

  const { status } = req.body
  const valid = ['confirmed', 'preparing', 'ready', 'delivered']
  if (!valid.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${valid.join(', ')}` })
  }

  order.status = status
  order.updatedAt = new Date().toISOString()

  req.io.to('kitchen').emit('order-status-updated', { orderId: order.id, status })
  req.io.to(`table-${order.tableId}`).emit('order-status-updated', { orderId: order.id, status })

  res.json(order)
})

// PATCH /api/orders/:id/items/:itemId/status
router.patch('/:id/items/:itemId/status', (req, res) => {
  const order = orders.find((o) => o.id === req.params.id)
  if (!order) return res.status(404).json({ error: 'Order not found' })

  const item = order.items.find((i) => i.id === req.params.itemId)
  if (!item) return res.status(404).json({ error: 'Item not found' })

  item.status = req.body.status || 'done'
  req.io.to('kitchen').emit('item-status-updated', {
    orderId: order.id, itemId: item.id, status: item.status,
  })

  res.json(order)
})

export default router
