import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { v4 as uuid } from 'uuid'
import { db } from './firebase.js'
import ordersRouter from './routes/orders.js'
import menuRouter from './routes/menu.js'

const app = express()
const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  },
})

app.use(cors({ origin: '*' }))
app.use(express.json())

app.use((req, _res, next) => {
  req.io = io
  next()
})

app.use('/api/orders', ordersRouter)
app.use('/api/menu', menuRouter)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

// Socket.io
io.on('connection', (socket) => {
  console.log(`[WS] Client connected: ${socket.id}`)

  socket.on('join-room', (room) => {
    socket.join(room)
  })

  socket.on('new-order', async (order) => {
    const enriched = {
      ...order,
      id: order.id || `ORD-${uuid().slice(0, 8).toUpperCase()}`,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    }

    // Save to Firebase
    try {
      await db.collection('orders').doc(enriched.id).set(enriched)
      console.log(`[FIREBASE] Order saved: ${enriched.id}`)
    } catch (err) {
      console.error('[FIREBASE] Error saving order:', err.message)
    }

    io.to('kitchen').emit('new-order', enriched)
    socket.emit('order-confirmed', enriched)
    console.log(`[ORDER] New order: ${enriched.id} table=${enriched.tableId}`)
  })

  socket.on('update-order-status', async ({ orderId, status }) => {
    try {
      await db.collection('orders').doc(orderId).update({ status })
    } catch (err) {
      console.error('[FIREBASE] Error updating status:', err.message)
    }
    io.to('kitchen').emit('order-status-updated', { orderId, status })
  })

  socket.on('disconnect', () => {
    console.log(`[WS] Client disconnected: ${socket.id}`)
  })
})

const PORT = process.env.PORT || 5000
httpServer.listen(PORT, () => {
  console.log(`🚀 SmartMenu 3D backend running at http://localhost:${PORT}`)
})
