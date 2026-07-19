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
      className="group bg-card-bg rounded-2xl border border-border-brand overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer h-full ornate-border hover:translate-y-[-2px]"
    >
      <div>
        {/* Product image block */}
        <div className="overflow-hidden relative">
          <img
            src={getProductImage()}
            alt={product.name}
            className="w-full h-32 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-500 border-b border-border-brand/40"
          />
          
          {/* Veg / Non-Veg badge tag */}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-white/95 backdrop-blur-xs px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-xs flex items-center gap-1 border border-border-brand/60">
            <span className={`w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full ${product.isVeg ? "bg-green-600" : "bg-red-600"}`} />
            <span className="text-[8px] sm:text-[10px] font-bold text-text-dark/80 uppercase tracking-wider">
              {product.isVeg ? "Veg" : "Non"}
            </span>
          </div>

          {product.inStock === false && (
            <div className="absolute inset-0 bg-black/45 flex items-center justify-center backdrop-blur-[1px]">
              <span className="bg-red-600 text-white text-[8px] sm:text-[10px] font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-full uppercase tracking-widest shadow-md">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Content details */}
        <div className="p-3 sm:p-4 space-y-1 text-left">
          <h3 className="font-serif font-bold text-sm sm:text-base text-text-dark group-hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-[10px] sm:text-xs text-text-dark/60 leading-relaxed line-clamp-2 min-h-[28px] sm:min-h-8">
            {product.description}
          </p>
        </div>
      </div>

      {/* Pricing and cart action section */}
      <div className="p-3 sm:p-4 pt-0 flex items-center justify-between mt-auto">
        <div className="flex flex-col text-left">
          <span className="text-[9px] text-text-dark/40 uppercase font-semibold">Price</span>
          <span className="text-sm sm:text-base font-bold text-primary font-mono">
            {displayPrice}
            <span className="text-[10px] sm:text-xs font-normal text-text-dark/50 font-sans">/{product.unit}</span>
          </span>
        </div>

        {product.inStock === false ? (
          <span className="text-[8px] sm:text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg uppercase tracking-wider">
            Sold Out
          </span>
        ) : (
          <button
            onClick={handleAddToCart}
            className="bg-accent hover:bg-accent-hover text-primary py-1 sm:py-1.5 px-2 sm:px-3.5 rounded-lg sm:rounded-xl transition-all shadow-xs flex items-center gap-1 cursor-pointer font-bold text-[10px] sm:text-xs hover:scale-105 active:scale-95"
            id={`add-to-cart-${product.id}`}
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 stroke-[3]" />
            <span className="hidden sm:inline">Add to Cart</span>
            <span className="sm:inline hidden"></span>
            <span className="sm:hidden">Add</span>
          </button>
        )}
      </div>
    </div>
  );
};
