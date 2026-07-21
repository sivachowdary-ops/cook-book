"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";

interface FloatingCartProps {
  onCartToggle: () => void;
}

export const FloatingCart: React.FC<FloatingCartProps> = ({ onCartToggle }) => {
  const { cart } = useCart();
  
  if (cart.length === 0) return null;
  
  const totalItems = cart.length;

  return (
    <button
      onClick={onCartToggle}
      className="fixed bottom-24 right-6 z-40 bg-accent hover:bg-accent/90 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
      aria-label="Open Shopping Cart"
    >
      <ShoppingCart className="w-6 h-6" />
      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
        {totalItems}
      </span>
      
      {/* Tooltip on hover */}
      <span className="absolute right-16 bg-text-dark text-white text-xs px-3 py-1.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none font-medium">
        View Cart
      </span>
    </button>
  );
};
