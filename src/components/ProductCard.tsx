"use client";

import React from "react";
import { Product } from "@/data/products";
import { useCountry } from "@/context/CountryContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { convertPrice, formatPrice } from "@/lib/pricing";
import { Plus } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onDetailClick?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onDetailClick }) => {
  const { country, rates } = useCountry();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const convertedPrice = convertPrice(product.basePriceINR, country, rates);
  const displayPrice = formatPrice(convertedPrice, country);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering detail click
    addToCart(product);
    showToast(`Added ${product.name} to cart ✓`);
  };

  // Fallback to high-quality AI-generated category WebP images so that ALL products have dynamic imagery
  const getProductImage = () => {
    if (product.image) return product.image;
    if (product.category === "sweets") return "/images/categories/sweets_category.webp";
    if (product.category === "snacks") return "/images/categories/snacks_category.webp";
    if (product.category === "veg-pickles") return "/images/categories/veg_pickles_category.webp";
    if (product.category === "non-veg-pickles") return "/images/categories/nonveg_pickles_category.webp";
    if (product.category === "powders") return "/images/categories/powders_category.webp";
    return "/images/categories/sweets_category.webp";
  };

  return (
    <div
      onClick={() => onDetailClick && onDetailClick(product)}
      className="group bg-card-bg rounded-xl sm:rounded-2xl border border-border-brand overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer h-full ornate-border hover:translate-y-[-2px] min-w-0"
    >
      <div>
        {/* Product image block — aspect-[4/3] keeps consistent height in both columns */}
        <div className="overflow-hidden relative aspect-[4/3]">
          <img
            src={getProductImage()}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 border-b border-border-brand/40"
          />

          {/* Veg / Non-Veg badge */}
          <div className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 bg-white/95 backdrop-blur-xs px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full shadow-xs flex items-center gap-0.5 border border-border-brand/60">
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${product.isVeg ? "bg-green-600" : "bg-red-600"}`} />
            <span className="text-[7px] sm:text-[9px] font-bold text-text-dark/80 uppercase tracking-wide leading-none">
              {product.isVeg ? "Veg" : "Non"}
            </span>
          </div>

          {product.inStock === false && (
            <div className="absolute inset-0 bg-black/45 flex items-center justify-center backdrop-blur-[1px]">
              <span className="bg-red-600 text-white text-[8px] sm:text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest shadow-md">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Content details */}
        <div className="p-2 sm:p-3 space-y-0.5 text-left">
          <h3 className="font-serif font-bold text-xs sm:text-sm text-text-dark group-hover:text-primary transition-colors line-clamp-1 leading-snug">
            {product.name}
          </h3>
          <p className="text-[9px] sm:text-xs text-text-dark/60 leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </div>
      </div>

      <div className="p-2 sm:p-3 pt-0 flex flex-col sm:flex-row sm:items-center sm:justify-between mt-auto gap-2">
        <div className="flex flex-col text-left min-w-0">
          <span className="text-[8px] sm:text-[9px] text-text-dark/40 uppercase font-semibold leading-none mb-0.5">Price</span>
          <span className="text-xs sm:text-sm font-bold text-primary font-mono leading-tight truncate">
            {displayPrice}
            <span className="text-[8px] sm:text-[10px] font-normal text-text-dark/50 font-sans">/{product.unit}</span>
          </span>
        </div>

        {product.inStock === false ? (
          <span className="w-full sm:w-auto text-[7px] sm:text-[9px] font-bold text-red-600 bg-red-50 border border-red-100 px-1.5 py-1 rounded-md uppercase tracking-wide text-center">
            Sold Out
          </span>
        ) : (
          <button
            onClick={handleAddToCart}
            className="w-full sm:w-auto bg-accent hover:bg-accent-hover text-primary py-1.5 px-2 sm:py-1.5 sm:px-3 rounded-lg transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer font-bold text-[9px] sm:text-xs hover:scale-105 active:scale-95 text-center"
            id={`add-to-cart-${product.id}`}
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus className="w-3.5 h-3.5 sm:w-3.5 sm:h-3.5 stroke-[3] shrink-0" />
            <span>Add</span>
          </button>
        )}
      </div>
    </div>
  );
};
