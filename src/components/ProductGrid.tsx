"use client";

import React from "react";
import { Product } from "@/data/products";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  onDetailClick: (product: Product) => void;
  loading?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onDetailClick,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 animate-pulse">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-64 bg-bg-cream/35 rounded-2xl border border-border-brand/40" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onDetailClick={onDetailClick}
        />
      ))}
    </div>
  );
};
