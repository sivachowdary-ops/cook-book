"use client";

import React from "react";
import { CountryProvider } from "@/context/CountryContext";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import { ProductProvider } from "@/context/ProductContext";

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ToastProvider>
      <ProductProvider>
        <CountryProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </CountryProvider>
      </ProductProvider>
    </ToastProvider>
  );
};
