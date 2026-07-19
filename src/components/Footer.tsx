"use client";

import React from "react";
import Link from "next/link";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-white border-t-4 border-accent relative overflow-hidden">
      {/* Ornate corner flourish effect in footer */}
      <div className="absolute top-4 left-4 w-10 h-10 border-t border-l border-accent/40 pointer-events-none" />
      <div className="absolute top-4 right-4 w-10 h-10 border-t border-r border-accent/40 pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-10 h-10 border-b border-l border-accent/40 pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-10 h-10 border-b border-r border-accent/40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold tracking-wide text-accent">
                Cook Book
              </span>
            </div>
            <p className="text-sm text-white/80 leading-relaxed max-w-xs">
              Savor the authentic flavors of traditional Andhra & Telangana homemade sweets, snacks, pickles, and spices. Prepared fresh and packed with love.
            </p>
            <div className="text-xs text-accent/90 font-medium">
              FSSAI Lic No: 23624033000572 (Applied)
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-bold text-accent mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link href="/" className="hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-accent transition-colors">
                  Our Catalog
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-accent transition-colors">
                  Our Heritage
                </Link>
              </li>
              <li>
                <Link href="/how-to-order" className="hover:text-accent transition-colors">
                  How to Order & FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Delivery & Customs Info */}
          <div>
            <h3 className="font-serif text-lg font-bold text-accent mb-4">International shipping</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>🇮🇳 Pan India Delivery</li>
              <li>🇬🇧 Shipping to United Kingdom</li>
              <li>🇺🇸 Shipping to United States</li>
              <li className="text-[11px] leading-snug text-white/60 mt-2">
                * Customs duty / import charges for international orders are the customer's responsibility.
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="font-serif text-lg font-bold text-accent mb-4">Get In Touch</h3>
            <ul className="space-y-2.5 text-sm text-white/80">
              <li>
                <span className="font-medium text-accent">WhatsApp:</span>{" "}
                <a href="https://wa.me/919553977566" className="hover:underline">
                  +91 95539 77566
                </a>
              </li>
              <li>
                <span className="font-medium text-accent">Email:</span>{" "}
                <a href="mailto:info@cookbookfoods.com" className="hover:underline">
                  info@cookbookfoods.com
                </a>
              </li>
              <li>
                <span className="font-medium text-accent">Instagram:</span>{" "}
                <a href="https://instagram.com/cookbook.taste" target="_blank" rel="noopener noreferrer" className="hover:underline">
                  @cookbook.taste
                </a>
              </li>
              <li className="text-xs text-white/60">
                Hyderabad, Telangana, India
              </li>
            </ul>
          </div>
        </div>

        {/* Footer bottom bar */}
        <div className="border-t border-white/20 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 gap-4">
          <p>© {new Date().getFullYear()} Cook Book. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="text-[10px] bg-accent/20 px-2 py-0.5 rounded text-accent border border-accent/30">
              Export Quality Cured Foods
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
