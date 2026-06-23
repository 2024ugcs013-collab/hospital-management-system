import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const stored = window.localStorage.getItem('hms_cart');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    window.localStorage.setItem('hms_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (medicine, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.medicineId === medicine._id);
      if (existing) {
        return prev.map((item) =>
          item.medicineId === medicine._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, {
        medicineId: medicine._id,
        name: medicine.name,
        brand: medicine.brand,
        price: medicine.price,
        image: medicine.image,
        stock: medicine.stock,
        quantity
      }];
    });
  };

  const updateQuantity = (medicineId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(medicineId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.medicineId === medicineId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (medicineId) => {
    setCartItems((prev) => prev.filter((item) => item.medicineId !== medicineId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
