import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useMenuStore = create((set, get) => ({
  menuItems: [],
  categories: [],
  selectedCategory: 'all',
  searchQuery: '',
  isLoading: false,

  setMenuItems: (items) => set({ menuItems: items }),
  setCategories: (cats) => set({ categories: cats }),
  setSelectedCategory: (cat) => set({ selectedCategory: cat }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setLoading: (v) => set({ isLoading: v }),

  filteredItems: () => {
    const { menuItems, selectedCategory, searchQuery } = get()
    return menuItems.filter((item) => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
      return matchCat && matchSearch
    })
  },
}))

export const useCartStore = create(
  persist(
    (set, get) => ({
      tableId: null,
      items: [],
      note: '',

      setTableId: (id) => set({ tableId: id }),
      setNote: (note) => set({ note }),

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, qty: i.qty + 1 } : i
              ),
            }
          }
          return { items: [...state.items, { ...item, qty: 1 }] }
        }),

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQty: (id, qty) =>
        set((state) => {
          if (qty <= 0) return { items: state.items.filter((i) => i.id !== id) }
          return { items: state.items.map((i) => (i.id === id ? { ...i, qty } : i)) }
        }),

      clearCart: () => set({ items: [], note: '' }),

      total: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
      totalItems: () => get().items.reduce((sum, i) => sum + i.qty, 0),
    }),
    { name: 'smartmenu-cart' }
  )
)

export const useOrderStore = create((set) => ({
  orders: [],
  activeOrderId: null,

  setOrders: (orders) => set({ orders }),
  addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
  setActiveOrder: (id) => set({ activeOrderId: id }),

  updateOrderStatus: (orderId, status) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, status } : o
      ),
    })),

  updateItemStatus: (orderId, itemId, status) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              items: o.items.map((i) =>
                i.id === itemId ? { ...i, status } : i
              ),
            }
          : o
      ),
    })),
}))

export const useUIStore = create((set) => ({
  selectedItem: null,
  cartOpen: false,
  paymentOpen: false,
  successOpen: false,

  setSelectedItem: (item) => set({ selectedItem: item }),
  closeViewer: () => set({ selectedItem: null }),
  toggleCart: () => set((s) => ({ cartOpen: !s.cartOpen })),
  openCart: () => set({ cartOpen: true }),
  closeCart: () => set({ cartOpen: false }),
  openPayment: () => set({ paymentOpen: true, cartOpen: false }),
  closePayment: () => set({ paymentOpen: false }),
  openSuccess: () => set({ successOpen: true, paymentOpen: false }),
  closeSuccess: () => set({ successOpen: false }),
}))
