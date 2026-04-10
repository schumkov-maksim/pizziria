import { defineStore } from 'pinia'

export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
  }),
  getters: {
    totalCount: (state) =>
      state.items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: (state) =>
      state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  },
  actions: {
    addItem(item: Omit<CartItem, 'quantity'>) {
      const existing = this.items.find((i) => i.id === item.id)
      if (existing) {
        existing.quantity++
      } else {
        this.items.push({ ...item, quantity: 1 })
      }
    },
    removeItem(id: number) {
      this.items = this.items.filter((i) => i.id !== id)
    },
    clearCart() {
      this.items = []
    },
  },
})
