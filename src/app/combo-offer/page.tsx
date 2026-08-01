"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCountry } from "@/context/CountryContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { Product } from "@/data/products";
import { useProducts } from "@/context/ProductContext";
import {
  comboCategories,
  comboPricing,
  tierLabels,
  offerMeta,
  getOfferStatus,
  getTimeRemaining,
  formatComboPrice,
  countryToCurrency,
  WeightTier,
  ComboCategory,
} from "@/data/combos";
import { ShoppingBag, Check, Clock, Leaf, Flame, ChevronRight } from "lucide-react";

type ComboMode = "regular" | "veg";

export default function ComboOfferPage() {
  const router = useRouter();
  const { country } = useCountry();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { products } = useProducts();
  const currency = countryToCurrency(country);

  const [offerStatus, setOfferStatus] = useState(getOfferStatus());
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining());
  const [tier, setTier] = useState<WeightTier>("halfKg");
  const [mode, setMode] = useState<ComboMode>("regular");
  // selections: { [productId]: count }
  const [selections, setSelections] = useState<Record<string, number>>({});

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setOfferStatus(getOfferStatus());
      setTimeLeft(getTimeRemaining());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Redirect if upcoming
  useEffect(() => {
    if (offerStatus === "upcoming") {
      router.push("/");
    }
  }, [offerStatus, router]);

  // Reset selections when mode changes
  useEffect(() => {
    setSelections({});
  }, [mode]);

  // Product lookup map
  const productMap = useMemo(() => {
    const map: Record<string, Product> = {};
    products.forEach((p) => {
      map[p.id] = p;
    });
    return map;
  }, []);

  // Active categories based on mode
  const activeCategories = useMemo(() => {
    if (mode === "veg") {
      return comboCategories.filter((c) => c.isVeg);
    }
    return comboCategories;
  }, [mode]);

  // Total selected count
  const totalSelected = Object.values(selections).reduce((a, b) => a + b, 0);

  // Pricing
  const pricing = comboPricing[tier][currency];

  // --- Selection handlers ---

  const handleRegularSelect = (categoryKey: string, productId: string) => {
    setSelections((prev) => {
      const next = { ...prev };
      // Remove any existing selection from this category
      const cat = comboCategories.find((c) => c.key === categoryKey);
      if (cat) {
        cat.productIds.forEach((pid) => {
          delete next[pid];
        });
      }
      // Set new selection
      next[productId] = 1;
      return next;
    });
  };

  const handleVegToggle = (productId: string) => {
    setSelections((prev) => {
      const next = { ...prev };
      if (next[productId]) {
        delete next[productId];
      } else {
        // Only add if total < 5
        const currentTotal = Object.values(next).reduce((a, b) => a + b, 0);
        if (currentTotal < 5) {
          next[productId] = 1;
        }
      }
      return next;
    });
  };

  // --- Add to cart ---
  const handleAddToCart = () => {
    if (totalSelected !== 5) return;

    const selectedNames = Object.keys(selections)
      .filter((id) => selections[id] > 0)
      .map((id) => productMap[id]?.name || id);

    const comboProduct: Product = {
      id: `combo-${tier}-${Date.now()}`,
      name: `Combo Pack (${tierLabels[tier]}) — ${mode === "veg" ? "Veg" : "Regular"}`,
      category: "sweets",
      basePriceINR: comboPricing[tier].INR.offer,
      unit: "piece",
      isVeg: mode === "veg",
      description: selectedNames.join(", "),
      inStock: true,
    };

    addToCart(comboProduct, 1);
    showToast(`🎉 Combo Pack added to cart!`);
    setSelections({});
  };

  // --- Expired state ---
  if (offerStatus === "expired") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
          <Clock className="w-10 h-10 text-red-400" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-primary mb-3">Offer Has Ended</h1>
        <p className="text-text-dark/60 max-w-md mb-6">
          The {offerMeta.offerName} combo offer has expired. Stay tuned for future promotions!
        </p>
        <button
          onClick={() => router.push("/shop")}
          className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-bold transition-all cursor-pointer"
        >
          Browse Our Shop
        </button>
      </div>
    );
  }

  // --- Upcoming state (shouldn't render, redirects) ---
  if (offerStatus === "upcoming") {
    return null;
  }

  // --- Active state ---
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-accent/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
          <Flame className="w-4 h-4 text-accent" />
          {offerMeta.offerName}
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary">
          Build Your Combo Pack
        </h1>
        <p className="text-sm text-text-dark/60 mt-2 max-w-lg mx-auto">
          Pick 5 items from our curated selection. Choose your weight tier and save {offerMeta.discountLabel}!
        </p>

        {/* Countdown */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <Clock className="w-4 h-4 text-accent" />
          <span className="text-sm font-mono font-bold text-primary">
            {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s left
          </span>
        </div>
      </div>

      {/* Weight Tier Selector */}
      <div className="bg-white rounded-2xl border border-border-brand p-4 sm:p-6 mb-6 shadow-sm">
        <h2 className="text-xs font-bold text-text-dark/50 uppercase tracking-wider mb-3">
          Step 1 — Choose Weight
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {(["halfKg", "oneKg", "twoKg"] as WeightTier[]).map((t) => {
            const tp = comboPricing[t][currency];
            const isActive = tier === t;
            return (
              <button
                key={t}
                onClick={() => setTier(t)}
                className={`relative p-3 sm:p-4 rounded-xl border-2 transition-all cursor-pointer text-center ${
                  isActive
                    ? "border-accent bg-accent/5 shadow-md"
                    : "border-border-brand hover:border-accent/50 bg-white"
                }`}
              >
                {isActive && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-primary stroke-[3]" />
                  </span>
                )}
                <span className="block font-serif font-bold text-lg sm:text-xl text-primary">
                  {tierLabels[t]}
                </span>
                <span className="block text-lg sm:text-2xl font-bold text-accent font-mono mt-1">
                  {formatComboPrice(tp.offer, currency)}
                </span>
                <span className="block text-xs text-text-dark/40 line-through font-mono">
                  {formatComboPrice(tp.original, currency)}
                </span>
                <span className="inline-block mt-1.5 text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded-full uppercase">
                  {offerMeta.discountLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Combo Mode Toggle */}
      <div className="bg-white rounded-2xl border border-border-brand p-4 sm:p-6 mb-6 shadow-sm">
        <h2 className="text-xs font-bold text-text-dark/50 uppercase tracking-wider mb-3">
          Step 2 — Choose Combo Type
        </h2>
        <div className="flex gap-3">
          <button
            onClick={() => setMode("regular")}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 border-2 ${
              mode === "regular"
                ? "border-primary bg-primary text-white"
                : "border-border-brand text-text-dark/70 hover:border-primary/30"
            }`}
          >
            <Flame className="w-4 h-4" />
            Regular Combo
          </button>
          <button
            onClick={() => setMode("veg")}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 border-2 ${
              mode === "veg"
                ? "border-green-600 bg-green-600 text-white"
                : "border-border-brand text-text-dark/70 hover:border-green-600/30"
            }`}
          >
            <Leaf className="w-4 h-4" />
            Veg Combo
          </button>
        </div>
        {mode === "veg" && (
          <p className="text-xs text-text-dark/50 mt-2 text-center">
            Pick any 5 items freely across Sweets, Snacks, Veg Pickles & Spicy Powders
          </p>
        )}
        {mode === "regular" && (
          <p className="text-xs text-text-dark/50 mt-2 text-center">
            Pick exactly 1 item from each of the 5 categories
          </p>
        )}
      </div>

      {/* Selection Counter */}
      <div className="flex items-center justify-between bg-bg-cream/60 rounded-xl px-4 py-3 mb-6 border border-border-brand/50">
        <span className="text-sm font-semibold text-text-dark/70">
          Items Selected
        </span>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-colors ${
                  i < totalSelected ? "bg-accent" : "bg-border-brand"
                }`}
              />
            ))}
          </div>
          <span className={`text-sm font-bold font-mono ${totalSelected === 5 ? "text-green-600" : "text-primary"}`}>
            {totalSelected}/5
          </span>
        </div>
      </div>

      {/* Category Sections */}
      <div className="space-y-6 mb-8">
        {activeCategories.map((cat) => (
          <CategorySection
            key={cat.key}
            category={cat}
            productMap={productMap}
            selections={selections}
            mode={mode}
            totalSelected={totalSelected}
            onRegularSelect={handleRegularSelect}
            onVegToggle={handleVegToggle}
          />
        ))}
      </div>

      {/* Add to Cart — Sticky Bottom */}
      <div className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-border-brand py-4 px-4 -mx-4 sm:-mx-6 lg:-mx-8 sm:px-6 lg:px-8 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-text-dark/50 font-semibold">Combo Total</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold text-accent font-mono">
                {formatComboPrice(pricing.offer, currency)}
              </span>
              <span className="text-sm text-text-dark/40 line-through font-mono">
                {formatComboPrice(pricing.original, currency)}
              </span>
            </div>
          </div>
          <button
            disabled={totalSelected !== 5}
            onClick={handleAddToCart}
            className={`py-3 px-6 sm:px-8 rounded-xl font-bold transition-all flex items-center gap-2 text-sm sm:text-base cursor-pointer ${
              totalSelected === 5
                ? "bg-primary hover:bg-primary-hover text-white shadow-md hover:scale-[1.02]"
                : "bg-text-dark/15 text-text-dark/40 cursor-not-allowed"
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            Add Combo to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Category Section Component ────────────────────────────────────

interface CategorySectionProps {
  category: ComboCategory;
  productMap: Record<string, Product>;
  selections: Record<string, number>;
  mode: ComboMode;
  totalSelected: number;
  onRegularSelect: (categoryKey: string, productId: string) => void;
  onVegToggle: (productId: string) => void;
}

function CategorySection({
  category,
  productMap,
  selections,
  mode,
  totalSelected,
  onRegularSelect,
  onVegToggle,
}: CategorySectionProps) {
  const categoryProducts = category.productIds
    .map((id) => productMap[id])
    .filter(Boolean);

  // In regular mode, find the selected item for this category
  const selectedInCategory = category.productIds.find((id) => selections[id] > 0);

  const getProductImage = (product: Product) => {
    if (product.image) return product.image;
    if (product.category === "sweets") return "/images/categories/sweets_category.webp";
    if (product.category === "snacks") return "/images/categories/snacks_category.webp";
    if (product.category === "veg-pickles") return "/images/categories/veg_pickles_category.webp";
    if (product.category === "non-veg-pickles") return "/images/categories/nonveg_pickles_category.webp";
    if (product.category === "powders") return "/images/categories/powders_category.webp";
    return "/images/categories/sweets_category.webp";
  };

  return (
    <div className="bg-white rounded-2xl border border-border-brand p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-serif font-bold text-base sm:text-lg text-primary flex items-center gap-2">
          {category.isVeg ? (
            <span className="w-3 h-3 rounded-full bg-green-600 shrink-0" />
          ) : (
            <span className="w-3 h-3 rounded-full bg-red-600 shrink-0" />
          )}
          {category.label}
        </h3>
        {mode === "regular" && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            selectedInCategory ? "bg-green-100 text-green-700" : "bg-bg-cream text-text-dark/40"
          }`}>
            {selectedInCategory ? "1 selected ✓" : "Pick 1"}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
        {categoryProducts.map((product) => {
          const isSelected = !!selections[product.id];
          const isDisabledVeg = mode === "veg" && !isSelected && totalSelected >= 5;

          return (
            <button
              key={product.id}
              onClick={() => {
                if (mode === "regular") {
                  onRegularSelect(category.key, product.id);
                } else {
                  if (!isDisabledVeg) {
                    onVegToggle(product.id);
                  }
                }
              }}
              disabled={isDisabledVeg}
              className={`relative p-2 rounded-xl border-2 transition-all cursor-pointer text-center group ${
                isSelected
                  ? "border-accent bg-accent/5 shadow-sm"
                  : isDisabledVeg
                  ? "border-border-brand/40 bg-gray-50 opacity-50 cursor-not-allowed"
                  : "border-border-brand hover:border-accent/40 bg-white"
              }`}
            >
              {isSelected && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-accent rounded-full flex items-center justify-center z-10">
                  <Check className="w-3 h-3 text-primary stroke-[3]" />
                </span>
              )}
              <div className="aspect-square rounded-lg overflow-hidden mb-1.5">
                <img
                  src={getProductImage(product)}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-text-dark leading-tight line-clamp-2 block">
                {product.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
