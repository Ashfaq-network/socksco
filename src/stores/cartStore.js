import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, { size = null, color = null, quantity = 1 } = {}) => {
        const { items } = get()
        const price = Number(product.price_per_pair) || 0

        const existing = items.find(
          (item) =>
            item.product_id === product.id &&
            item.size === size &&
            item.color === color
        )

        if (existing) {
          set({
            items: items.map((item) =>
              item === existing
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          })
        } else {
          const newItem = {
            id: `${product.id}-${size || ''}-${color || ''}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            product_id: product.id,
            name: product.name,
            slug: product.slug,
            price,
            image: product.images?.[0] || null,
            size,
            color,
            quantity,
            stock: product.stock,
            moq: product.moq,
          }
          set({ items: [...items, newItem] })
        }
      },

      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),

      updateQuantity: (id, quantity) => {
        if (quantity < 1) return
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })
      },

      clearCart: () => set({ items: [] }),

      getSubtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      getItemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'socksco-cart' }
  )
)
