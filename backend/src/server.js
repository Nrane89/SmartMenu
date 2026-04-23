import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { v4 as uuid } from 'uuid'
import ordersRouter from './routes/orders.js'
import menuRouter from './routes/menu.js'

const app = express()
const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:4173'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  },
})

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:4173'],
  credentials: true,
}))
app.use(express.json())

// Attach io to every request so routes can emit events
app.use((req, _res, next) => {
  req.io = io
  next()
})

app.use('/api/orders', ordersRouter)
app.use('/api/menu', menuRouter)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

// In-memory order store (replace with DB in production)
const orders = []
export { orders }

// Socket.io
io.on('connection', (socket) => {
  console.log(`[WS] Client connected: ${socket.id}`)

  // Client joins a room (table or kitchen)
  socket.on('join-room', (room) => {
    socket.join(room)
    console.log(`[WS] ${socket.id} joined room: ${room}`)
  })

  // New order from customer
  socket.on('new-order', (order) => {
    const enriched = {
      ...order,
      id: order.id || `ORD-${uuid().slice(0, 8).toUpperCase()}`,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    }
    orders.unshift(enriched)

    // Broadcast to kitchen
    io.to('kitchen').emit('new-order', enriched)
    // Confirm to customer
    socket.emit('order-confirmed', enriched)
    console.log(`[ORDER] New order: ${enriched.id} table=${enriched.tableId}`)
  })

  // KDS status update
  socket.on('update-order-status', ({ orderId, status }) => {
    const order = orders.find((o) => o.id === orderId)
    if (order) {
      order.status = status
      // Notify all clients in the table room
      io.to(`table-${order.tableId}`).emit('order-status-updated', { orderId, status })
      io.to('kitchen').emit('order-status-updated', { orderId, status })
    }
  })

  socket.on('disconnect', () => {
    console.log(`[WS] Client disconnected: ${socket.id}`)
  })
})

const PORT = process.env.PORT || 5000
httpServer.listen(PORT, () => {
  console.log(`🚀 SmartMenu 3D backend running at http://localhost:${PORT}`)
})
