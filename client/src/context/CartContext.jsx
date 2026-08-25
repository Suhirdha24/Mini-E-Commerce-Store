import { createContext, useContext, useEffect, useState } from 'react';
import { safeGetJSON, safeSetJSON } from '../utils/storage';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const raw = safeGetJSON('cart_items', []);
    if (Array.isArray(raw)) {
      return raw.filter(item => item && item.product && (item.product.id || item.product._id));
    }
    return [];
  });

  useEffect(() => {
    safeSetJSON('cart_items', items);
  }, [items]);

  const getProductId = (p) => (p ? String(p._id || p.id) : '');

  // 1. ADD TO CART (Ensures each unique product gets its own distinct entry)
  const add = (product, quantity = 1) => {
    if (!product) return;
    const pId = getProductId(product);
    setItems((prevItems) => {
      const validItems = (prevItems || []).filter(item => item && item.product);
      const existingIndex = validItems.findIndex((item) => getProductId(item.product) === pId);
      if (existingIndex > -1) {
        return validItems.map((item, index) => {
          if (index === existingIndex) {
            const newQty = Math.min((item.quantity || 1) + quantity, product.stock || 99);
            return { ...item, quantity: newQty };
          }
          return item;
        });
      } else {
        return [...validItems, { product, quantity: Math.min(quantity, product.stock || 99) }];
      }
    });
  };

  // 2. UPDATE QUANTITY (+ / - Controls)
  const update = (productId, newQuantity) => {
    const cleanId = String(productId);
    setItems((prevItems) => {
      const validItems = (prevItems || []).filter(item => item && item.product);
      if (newQuantity <= 0) {
        return validItems.filter((item) => getProductId(item.product) !== cleanId);
      }
      return validItems.map((item) => {
        if (getProductId(item.product) === cleanId) {
          const maxStock = item.product.stock || 99;
          return { ...item, quantity: Math.min(newQuantity, maxStock) };
        }
        return item;
      });
    });
  };

  // 3. REMOVE PRODUCT FROM CART
  const remove = (productId) => {
    const cleanId = String(productId);
    setItems((prevItems) => (prevItems || []).filter((item) => item && item.product && getProductId(item.product) !== cleanId));
  };

  const clear = () => setItems([]);

  // Recalculate total quantity & price subtotal safely
  const count = (items || []).reduce((sum, item) => sum + (Number(item?.quantity) || 0), 0);
  const total = (items || []).reduce((sum, item) => {
    if (!item || !item.product) return sum;
    const price = Number(item.product.price || item.product.salePrice || item.product.regularPrice || 0);
    const qty = Number(item.quantity) || 1;
    return sum + price * qty;
  }, 0);

  return (
    <CartContext.Provider value={{ items: items || [], add, update, remove, clear, count, total }}>
      {children}
    </CartContext.Provider>
  );
}