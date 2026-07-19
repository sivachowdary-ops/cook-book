"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCountry } from "@/context/CountryContext";
import { useCart } from "@/context/CartContext";
import { CountryCode } from "@/lib/pricing";
import { ShoppingBag, Menu, X, ChevronDown, PhoneCall } from "lucide-react";

interface HeaderProps {
  onCartToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onCartToggle }) => {
  const pathname = usePathname();
  const { country, setCountry } = useCountry();
  const { cart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  const cartItemCount = cart.reduce((acc, item) => acc + (item.product.unit === "piece" ? 1 : 1), 0);
  // Actually, let's display total unique items or total sum. Total unique items is cleaner, or total count.
  const totalItems = cart.length;

  const countries = [
    { code: "IN" as CountryCode, name: "India", currency: "₹ INR", flag: "🇮🇳" },
    { code: "UK" as CountryCode, name: "United Kingdom", currency: "£ GBP", flag: "🇬🇧" },
    { code: "US" as CountryCode, name: "United States", currency: "$ USD", flag: "🇺🇸" },
  ];

  const activeCountry = countries.find((c) => c.code === country) || countries[0];

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Our Heritage", href: "/about" },
    { name: "How to Order", href: "/how-to-order" },
    { name: "Contact", href: "/contact" },
  ];

  const handleCountrySelect = (code: CountryCode) => {
    setCountry(code);
    setIsCountryDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-border-brand shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Brand Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-accent/40 shadow-xs flex items-center justify-center bg-white shrink-0">
              <img
                src="/images/cook_book_logo.webp"
                alt="Cook Book Logo"
                className="w-full h-full object-cover scale-110"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-wide text-primary leading-tight group-hover:text-primary-hover transition-colors">
                Cook Book
              </span>
              <span className="text-[10px] tracking-widest text-accent uppercase font-semibold">
                Taste the Magic
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-all relative py-2 ${
                    isActive
                      ? "text-primary font-semibold"
                      : "text-text-dark/70 hover:text-primary"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent rounded-full animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right section controls */}
          <div className="flex items-center gap-4">
            {/* Country Selector */}
            <div className="relative">
              <button
                onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border-brand hover:border-accent bg-bg-cream/40 text-sm font-medium transition-colors"
                id="country-selector-btn"
                aria-label="Select Country"
              >
                <span>{activeCountry.flag}</span>
                <span className="hidden sm:inline text-xs text-text-dark/80 uppercase">
                  {activeCountry.code}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-text-dark/60" />
              </button>

              {isCountryDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsCountryDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-border-brand rounded-xl shadow-xl z-40 overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold text-text-dark/40 border-b border-border-brand">
                      Shipping Destination
                    </div>
                    {countries.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => handleCountrySelect(c.code)}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-bg-cream/50 transition-colors ${
                          c.code === country
                            ? "bg-bg-cream font-semibold text-primary"
                            : "text-text-dark/80"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{c.flag}</span>
                          <span>{c.name}</span>
                        </div>
                        <span className="text-xs text-text-dark/40 font-mono">
                          {c.currency}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Shopping Cart Button */}
            <button
              onClick={onCartToggle}
              className="relative p-2.5 text-text-dark/80 hover:text-primary hover:bg-bg-cream/50 rounded-full transition-all border border-transparent hover:border-border-brand"
              id="cart-toggle-btn"
              aria-label="Toggle Shopping Cart"
            >
              <ShoppingBag className="w-5.5 h-5.5" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-text-dark/80 hover:text-primary rounded-lg"
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-border-brand shadow-inner py-4 px-6 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-base font-medium py-1.5 ${
                    isActive ? "text-primary font-bold border-l-4 border-accent pl-3" : "text-text-dark/70 pl-3"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            
            <div className="border-t border-border-brand pt-4 mt-2">
              <div className="flex items-center justify-between text-xs text-text-dark/50 px-3 py-1">
                <span>Active Currency:</span>
                <span className="font-semibold text-primary">{activeCountry.name} ({activeCountry.currency})</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
