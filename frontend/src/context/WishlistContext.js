import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Failed to parse wishlist:', error);
        setWishlist([]);
      }
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Toggle an item in the wishlist
  const toggleWishlistItem = (productId) => {
    setWishlist(currentWishlist => {
      if (currentWishlist.includes(productId)) {
        return currentWishlist.filter(id => id !== productId);
      } else {
        return [...currentWishlist, productId];
      }
    });
  };

  // Check if an item is in the wishlist
  const isItemInWishlist = (productId) => {
    return wishlist.includes(productId);
  };

  // Clear the wishlist
  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider 
      value={{ 
        wishlist, 
        toggleWishlistItem, 
        isItemInWishlist, 
        clearWishlist 
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}; 