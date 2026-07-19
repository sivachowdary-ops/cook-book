"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/data/products";

export interface CartItem {
  product: Product;
  quantity: number; // weight in kg (for kg items) or count (for piece items)
}

interface CartContextProps {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalWeight: number; // Sum of weight-based items
  totalPieceCount: number; // Sum of piece-based items
  isValidOrder: boolean;
  weightError: string | null;
  pieceError: string | null;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cook_book_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error loading cart from localStorage", e);
      }
    }
    setHydrated(true);
  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("cook_book_cart", JSON.stringify(cart));
    }
  }, [cart, hydrated]);

  const addToCart = (product: Product, quantity?: number) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      
      // Default initial step
      const defaultQty = product.unit === "piece" ? 10 : 0.5;
      const qtyToAdd = quantity !== undefined ? quantity : defaultQty;

      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + qtyToAdd }
            : item
        );
      }
      return [...prevCart, { product, quantity: qtyToAdd }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculations
  const weightItems = cart.filter((item) => item.product.unit === "kg");
  const pieceItems = cart.filter((item) => item.product.unit === "piece");

  const totalWeight = weightItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPieceCount = pieceItems.reduce((acc, item) => acc + item.quantity, 0);

  // Enforce minimum weight (2kg) if any weight item exists
  const hasWeightItems = weightItems.length > 0;
  const weightError =
    hasWeightItems && totalWeight < 2
      ? `Minimum order weight is 2kg. You currently have ${totalWeight.toFixed(1)}kg.`
      : null;

  // Enforce minimum quantity for piece items (e.g. Sarvapindi min 10)
  const hasPieceItems = pieceItems.length > 0;
  const pieceError =
    hasPieceItems && totalPieceCount < 10
      ? `Minimum order quantity for piece items is 10. You currently have ${totalPieceCount} pieces.`
      : null;

  // An order is valid if it is not empty, and there are no errors
  const isValidOrder =
    cart.length > 0 && !weightError && !pieceError;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalWeight,
        totalPieceCount,
        isValidOrder,
        weightError,
        pieceError,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
