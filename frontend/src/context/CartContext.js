import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useAuth(); // Get current user from AuthContext

  // Load cart from localStorage on mount and when user changes
  useEffect(() => {
    if (user) {
      // Load user-specific cart using user.id
      const savedCart = localStorage.getItem(`cart_${user.id}`);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      } else {
        // Clear cart if no saved cart found for user
        setCart([]);
      }
    } else {
      // Clear cart when no user is logged in
      setCart([]);
    }
  }, [user]); // Depend on user to reload cart when user changes

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      // Save cart with user-specific key
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart));
    }
  }, [cart, user]);

  const addToCart = (product) => {
    if (!user) {
      // Optionally redirect to login or show message
      alert('Please login to add items to cart');
      return;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: product.quantity || 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    if (!user) return;
    
    setCart([]);
    localStorage.removeItem(`cart_${user.id}`);
  };

  const updateItemQuantity = (id, quantity) => {
    if (!user) return;
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (id) => {
    if (!user) return;
    
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    updateItemQuantity,
    removeItem,
    isAuthenticated: !!user
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}; 