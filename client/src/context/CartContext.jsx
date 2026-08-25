import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cart_items') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart_items', JSON.stringify(items));
  }, [items]);

  const getProductId = (p) => p._id || p.id;

  // 1. ADD TO CART (Ensures each unique product gets its own distinct entry)
  const add = (product, quantity = 1) => {
    const pId = getProductId(product);
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => getProductId(item.product) === pId);
      if (existingIndex > -1) {
        return prevItems.map((item, index) => {
          if (index === existingIndex) {
            const newQty = Math.min(item.quantity + quantity, product.stock || 99);
            return { ...item, quantity: newQty };
          }
          return item;
        });
      } else {
        return [...prevItems, { product, quantity: Math.min(quantity, product.stock || 99) }];
      }
    });
  };

  // 2. UPDATE QUANTITY (+ / - Controls)
  const update = (productId, newQuantity) => {
    setItems((prevItems) => {
      if (newQuantity <= 0) {
        return prevItems.filter((item) => getProductId(item.product) !== productId);
      }
      return prevItems.map((item) => {
        if (getProductId(item.product) === productId) {
          const maxStock = item.product.stock || 99;
          return { ...item, quantity: Math.min(newQuantity, maxStock) };
        }
        return item;
      });
    });
  };

  // 3. REMOVE PRODUCT FROM CART
  const remove = (productId) => {
    setItems((prevItems) => prevItems.filter((item) => getProductId(item.product) !== productId));
  };

  const clear = () => setItems([]);

  // Recalculate total quantity & price subtotal
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + (item.product.price || 0) * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, add, update, remove, clear, count, total }}>
      {children}
    </CartContext.Provider>
  );
}