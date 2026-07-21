"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CartDrawer } from "./CartDrawer";
import { FloatingWhatsApp } from "./FloatingWhatsApp";
import { FloatingCart } from "./FloatingCart";

export const LayoutShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const pathname = usePathname();
  const isAdmin = pathname === "/admin";

  return (
    <div className="flex flex-col min-h-screen w-full min-w-0 overflow-x-hidden">
      {!isAdmin && <Header onCartToggle={() => setIsCartOpen(true)} />}
      <main className="flex-grow flex flex-col min-w-0 overflow-x-hidden">{children}</main>
      {!isAdmin && <Footer />}
      {!isAdmin && <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />}
      {!isAdmin && <FloatingWhatsApp />}
      {!isAdmin && <FloatingCart onCartToggle={() => setIsCartOpen(true)} />}
    </div>
  );
};
