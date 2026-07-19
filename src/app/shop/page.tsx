"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "@/data/products";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { useProducts } from "@/context/ProductContext";
import { Search, Filter, ShieldAlert } from "lucide-react";

const ShopContent: React.FC = () => {
  const searchParams = useSearchParams();
  const { products, loading } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [vegFilter, setVegFilter] = useState<"all" | "veg" | "non-veg">("all");

  // Load category from query param if available
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  const categoriesList = [
    { id: "all", name: "All Categories" },
    { id: "sweets", name: "Sweets" },
    { id: "snacks", name: "Snacks" },
    { id: "veg-pickles", name: "Veg Pickles" },
    { id: "non-veg-pickles", name: "Non-Veg Pickles" },
    { id: "powders", name: "Spicy Powders" },
  ];

  // Filtering Logic
  const filteredProducts = products.filter((product) => {
    // 1. Category Filter
    if (selectedCategory !== "all" && product.category !== selectedCategory) {
      return false;
    }

    // 2. Veg/Non-Veg Filter
    if (vegFilter === "veg" && !product.isVeg) return false;
    if (vegFilter === "non-veg" && product.isVeg) return false;

    // 3. Search Query Filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(query);
      const matchDesc = product.description.toLowerCase().includes(query);
      return matchName || matchDesc;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow flex flex-col">
      {/* Header Banner */}
      <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary">Our Traditional Catalog</h1>
        <div className="w-20 h-1 bg-accent mx-auto rounded-full" />
        <p className="text-xs sm:text-sm text-text-dark/60">
          Made fresh to order with traditional recipes from Andhra & Telangana. Select items to see details or add to cart.
        </p>
      </div>

      {/* Filter and Search Bar Section */}
      <div className="bg-white rounded-2xl border border-border-brand p-5 shadow-xs mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          
          {/* Search Input */}
          <div className="relative w-full md:max-w-sm">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search delicacies (e.g. Laddu, Gongura)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-brand bg-bg-cream/15 text-sm focus:outline-none focus:border-primary"
            />
            <Search className="w-4.5 h-4.5 text-text-dark/45 absolute left-3.5 top-3.5" />
          </div>

          {/* Veg / Non-Veg Toggle Tabs */}
          <div className="flex items-center gap-1 bg-bg-cream/40 p-1 border border-border-brand rounded-xl w-full md:w-auto justify-center">
            <button
              onClick={() => setVegFilter("all")}
              className={`px-2.5 py-1.5 sm:px-4 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                vegFilter === "all"
                  ? "bg-primary text-white shadow-xs"
                  : "text-text-dark/60 hover:text-primary"
              }`}
            >
              All Foods
            </button>
            <button
              onClick={() => setVegFilter("veg")}
              className={`px-2.5 py-1.5 sm:px-4 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                vegFilter === "veg"
                  ? "bg-green-700 text-white shadow-xs"
                  : "text-text-dark/60 hover:text-green-700"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Veg Only
            </button>
            <button
              onClick={() => setVegFilter("non-veg")}
              className={`px-2.5 py-1.5 sm:px-4 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                vegFilter === "non-veg"
                  ? "bg-red-700 text-white shadow-xs"
                  : "text-text-dark/60 hover:text-red-700"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-500" />
              Non-Veg
            </button>
          </div>

        </div>

        {/* Category Horizontal Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none w-full">
          {categoriesList.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap border transition-all cursor-pointer shrink-0 ${
                selectedCategory === cat.id
                  ? "bg-primary border-primary text-white shadow-xs"
                  : "bg-white border-border-brand text-text-dark/70 hover:border-accent hover:text-primary"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <ProductGrid products={[]} onDetailClick={setSelectedProduct} loading={true} />
      ) : filteredProducts.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-20 bg-white rounded-3xl border border-border-brand">
          <Filter className="w-12 h-12 text-text-dark/30 mb-4" />
          <h3 className="font-serif font-bold text-lg text-text-dark">No delicacies found</h3>
          <p className="text-sm text-text-dark/50 max-w-xs mt-1">
            Try adjusting your search query, selecting another category, or toggling the Veg/Non-Veg filter.
          </p>
        </div>
      ) : (
        <ProductGrid products={filteredProducts} onDetailClick={setSelectedProduct} />
      )}

      {/* Min weight warning alert sticky at bottom */}
      <div className="mt-12 bg-bg-cream/40 border border-accent/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-text-dark/75 leading-relaxed">
          <ShieldAlert className="w-5 h-5 text-accent shrink-0" />
          <span>
            Reminder: Cook Book ships fresh. Combined cart weight for per-kg items must reach a minimum of <strong>2kg</strong> to complete order checkouts.
          </span>
        </div>
        <div className="text-[10px] bg-accent/20 border border-accent/30 text-primary font-bold px-3 py-1 rounded-full uppercase tracking-wider shrink-0">
          Global Air Delivery
        </div>
      </div>

      {/* Details Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

export default function Shop() {
  return (
    <Suspense fallback={
      <div className="min-h-[50vh] flex items-center justify-center text-primary font-bold text-sm">
        Loading Delicacies...
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
