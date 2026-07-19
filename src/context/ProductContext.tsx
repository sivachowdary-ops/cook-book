"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Product, INITIAL_PRODUCTS } from "@/data/products";
import { supabase } from "@/lib/supabase";

interface ProductContextProps {
  products: Product[];
  loading: boolean;
  syncProducts: () => Promise<void>;
  saveProductPrice: (productId: string, newPrice: number) => Promise<void>;
  toggleStock: (productId: string, currentStock: boolean | undefined) => Promise<void>;
  addNewProduct: (newProduct: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  seedDefaultCatalog: () => Promise<void>;
}

const ProductContext = createContext<ProductContextProps | undefined>(undefined);

// Helper to convert Supabase DB row to Product interface
function mapDbToProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    basePriceINR: parseFloat(row.base_price_inr),
    unit: row.unit,
    isVeg: row.is_veg,
    description: row.description || "",
    image: row.image || undefined,
    inStock: row.in_stock !== false, // Default to true if undefined
  };
}

// Helper to convert Product interface to Supabase DB row
function mapProductToDb(product: Product) {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    base_price_inr: product.basePriceINR,
    unit: product.unit,
    is_veg: product.isVeg,
    description: product.description,
    image: product.image || null,
    in_stock: product.inStock !== false,
  };
}

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const syncProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        const mapped = data.map(mapDbToProduct);
        setProducts(mapped);
        localStorage.setItem("cook_book_products", JSON.stringify(mapped));
      } else {
        // Empty db table, fallback to initial products
        setProducts(INITIAL_PRODUCTS);
        localStorage.setItem("cook_book_products", JSON.stringify(INITIAL_PRODUCTS));
      }
    } catch (err) {
      console.warn("Failed to fetch products from Supabase, loading local fallback:", err);
      // Try to load from localStorage first, then fallback to seeds
      const cached = localStorage.getItem("cook_book_products");
      if (cached) {
        setProducts(JSON.parse(cached));
      } else {
        setProducts(INITIAL_PRODUCTS);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    syncProducts();
  }, [syncProducts]);

  // Actions
  const saveProductPrice = async (productId: string, newPrice: number) => {
    // 1. Update local state
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, basePriceINR: newPrice } : p))
    );

    // 2. Persist to Supabase
    try {
      const { error } = await supabase
        .from("products")
        .update({ base_price_inr: newPrice })
        .eq("id", productId);

      if (error) throw error;
    } catch (err) {
      console.error("Failed to update product price in Supabase:", err);
    }
  };

  const toggleStock = async (productId: string, currentStock: boolean | undefined) => {
    const nextStock = currentStock === undefined ? false : !currentStock;
    
    // 1. Update local state
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, inStock: nextStock } : p))
    );

    // 2. Persist to Supabase
    try {
      const { error } = await supabase
        .from("products")
        .update({ in_stock: nextStock })
        .eq("id", productId);

      if (error) throw error;
    } catch (err) {
      console.error("Failed to toggle product stock in Supabase:", err);
    }
  };

  const addNewProduct = async (newProduct: Product) => {
    // 1. Update local state
    setProducts((prev) => [newProduct, ...prev]);

    // 2. Persist to Supabase
    try {
      const { error } = await supabase
        .from("products")
        .insert([mapProductToDb(newProduct)]);

      if (error) throw error;
    } catch (err) {
      console.error("Failed to add product to Supabase:", err);
    }
  };

  const deleteProduct = async (productId: string) => {
    // 1. Update local state
    setProducts((prev) => prev.filter((p) => p.id !== productId));

    // 2. Persist to Supabase
    try {
      const { error } = await supabase.from("products").delete().eq("id", productId);
      if (error) throw error;
    } catch (err) {
      console.error("Failed to delete product from Supabase:", err);
    }
  };

  // Bulk seed default products sheet to Supabase
  const seedDefaultCatalog = async () => {
    try {
      const dbRows = INITIAL_PRODUCTS.map(mapProductToDb);
      const { error } = await supabase.from("products").upsert(dbRows);
      if (error) throw error;
      await syncProducts();
    } catch (err) {
      console.error("Failed to seed products database:", err);
      throw err;
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        syncProducts,
        saveProductPrice,
        toggleStock,
        addNewProduct,
        deleteProduct,
        seedDefaultCatalog,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
