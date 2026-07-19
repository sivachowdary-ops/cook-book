"use client";

import React, { useState } from "react";
import { Product } from "@/data/products";
import { useCountry } from "@/context/CountryContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { convertPrice, formatPrice } from "@/lib/pricing";
import { X, ShoppingBag, Leaf, ShieldAlert } from "lucide-react";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { country, rates } = useCountry();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  
  const [selectedWeight, setSelectedWeight] = useState<number>(0.5); // Default weight in kg
  const [selectedQuantity, setSelectedQuantity] = useState<number>(10); // Default quantity for pieces

  if (!product) return null;

  const isKg = product.unit === "kg";
  const unitPrice = convertPrice(product.basePriceINR, country, rates);
  
  const totalPrice = isKg 
    ? unitPrice * selectedWeight 
    : unitPrice * selectedQuantity;

  const handleAddToCart = () => {
    const qty = isKg ? selectedWeight : selectedQuantity;
    addToCart(product, qty);
    showToast(`Added ${qty}${isKg ? "kg" : " pieces"} of ${product.name} to cart ✓`);
    onClose();
  };

  // SVG graphic helper
  const getCategoryDetails = () => {
    switch (product.category) {
      case "sweets":
        return { color: "bg-yellow-500", text: "Rich & Ghee-Rich Telugu Dessert" };
      case "snacks":
        return { color: "bg-orange-500", text: "Traditional Crunchy Savory Bite" };
      case "veg-pickles":
        return { color: "bg-green-600", text: "Tangy Homemade Veg Preserve" };
      case "non-veg-pickles":
        return { color: "bg-red-700", text: "Spicy Meat Cured Delicacy" };
      default:
        return { color: "bg-amber-600", text: "Authentic Coarse-Ground Masala" };
    }
  };

  const catDetails = getCategoryDetails();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="absolute inset-0" 
        onClick={onClose} 
      />
      
      <div className="relative bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 ornate-border border border-border-brand">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/85 text-text-dark/70 hover:text-text-dark p-1.5 rounded-full hover:bg-white shadow-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Hero Banner */}
        <div className="h-44 relative flex items-center justify-center text-center p-6 overflow-hidden">
          <img
            src={product.image || (
              product.category === "sweets" ? "/images/categories/sweets_category.webp" :
              product.category === "snacks" ? "/images/categories/snacks_category.webp" :
              product.category === "veg-pickles" ? "/images/categories/veg_pickles_category.webp" :
              product.category === "non-veg-pickles" ? "/images/categories/nonveg_pickles_category.webp" :
              "/images/categories/powders_category.webp"
            )}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover animate-in zoom-in-105 duration-500"
          />
          <div className="absolute inset-0 bg-primary/75" />
          
          <div className="relative space-y-1">
            <span className={`inline-block px-2.5 py-0.5 rounded text-[9px] uppercase tracking-widest font-bold text-white ${product.isVeg ? "bg-green-600" : "bg-red-600"}`}>
              {product.isVeg ? "Veg" : "Non-Veg"}
            </span>
            <h3 className="font-serif text-2xl font-bold text-accent drop-shadow-md">
              {product.name}
            </h3>
            <p className="text-white/80 text-xs italic">
              {catDetails.text}
            </p>
          </div>
        </div>

        {/* Modal Info Area */}
        <div className="p-6 space-y-5">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-text-dark/40 uppercase tracking-widest block">Description</span>
            <p className="text-sm text-text-dark/85 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="flex gap-4 p-3 bg-bg-cream/40 rounded-xl border border-border-brand/40 text-xs">
            <Leaf className="w-5 h-5 text-accent shrink-0" />
            <div className="space-y-0.5 text-text-dark/80">
              <span className="font-bold">Ingredients note:</span>
              <p className="leading-relaxed">
                Made using standard household ingredients: premium rice flour, cold-pressed oils, native red chilies, fresh garlic, and traditional seasonings. Contains no artificial colors, preservatives, or taste enhancers.
              </p>
            </div>
          </div>

          {/* Size / Weight Selector */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-text-dark/40 uppercase tracking-widest block">
              {isKg ? "Select Weight (kg)" : "Select Quantity (pieces)"}
            </span>
            {isKg ? (
              <div className="flex gap-2">
                {[0.5, 1.0, 2.0, 5.0].map((w) => (
                  <button
                    key={w}
                    onClick={() => setSelectedWeight(w)}
                    className={`flex-1 py-2 text-center text-xs font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                      selectedWeight === w
                        ? "bg-primary border-primary text-white shadow-xs"
                        : "bg-white border-border-brand text-text-dark hover:bg-bg-cream/40"
                    }`}
                  >
                    {w} kg
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex gap-2">
                {[10, 20, 50, 100].map((q) => (
                  <button
                    key={q}
                    onClick={() => setSelectedQuantity(q)}
                    className={`flex-1 py-2 text-center text-xs font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                      selectedQuantity === q
                        ? "bg-primary border-primary text-white shadow-xs"
                        : "bg-white border-border-brand text-text-dark hover:bg-bg-cream/40"
                    }`}
                  >
                    {q} pcs
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Custom checkout indicators */}
          {isKg && selectedWeight < 2 && (
            <div className="flex gap-2 items-center text-[10px] text-amber-700 bg-amber-50 border border-amber-200/60 p-2.5 rounded-lg leading-snug">
              <ShieldAlert className="w-4.5 h-4.5 text-amber-500 shrink-0" />
              <span>Note: Orders containing per-kg items must reach a total weight of 2kg minimum to checkout.</span>
            </div>
          )}

          {/* Pricing display & action */}
          <div className="flex items-center justify-between pt-4 border-t border-border-brand/40">
            <div className="flex flex-col">
              <span className="text-[10px] text-text-dark/40 uppercase font-semibold">Total Price</span>
              <span className="text-xl font-bold text-primary font-mono">
                {formatPrice(totalPrice, country)}
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              className="bg-primary hover:bg-primary-hover text-white py-3 px-5 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-accent" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
