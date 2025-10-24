import { createContext, useContext, useState, useEffect } from "react"

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])

  // ✅ Load cart from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("cart")
    if (saved) {
      setCart(JSON.parse(saved))
    }
  }, [])

  // ✅ Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + qty } : item
        )
      }
      return [...prev, { ...product, qty }]
    })
  }

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const updateQty = (id, qty) => {
    if (qty < 1) return
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty } : item))
    )
  }

  const clearCart = () => setCart([])

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}