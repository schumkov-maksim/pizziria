import { defineStore } from 'pinia'

export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items:  [] as CartItem[],
    isOpen: false,
  }),
  getters: {
    totalCount: (state) =>
      state.items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: (state) =>
      state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  },
  actions: {
    addItem(item: Omit<CartItem, 'quantity'>, qty = 1) {
      const existing = this.items.find((i) => i.id === item.id)
      if (existing) {
        existing.quantity += qty
      } else {
        this.items.push({ ...item, quantity: qty })
      }
    },
    removeItem(id: number) {
      this.items = this.items.filter((i) => i.id !== id)
    },
    clearCart() {
      this.items = []
    },
    openCart()  { this.isOpen = true  },
    closeCart() { this.isOpen = false },
    toggleCart() { this.isOpen = !this.isOpen },
  },
})
