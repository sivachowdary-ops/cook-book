"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useCountry } from "@/context/CountryContext";
import { convertPrice, formatPrice } from "@/lib/pricing";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowLeft } from "lucide-react";
import { CheckoutForm } from "./CheckoutForm";
import { useToast } from "@/context/ToastContext";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    totalWeight,
    totalPieceCount,
    weightError,
    pieceError,
    isValidOrder,
  } = useCart();
  const { country, rates } = useCountry();
  const { showToast } = useToast();
  const [step, setStep] = useState<"cart" | "checkout">("cart");

  if (!isOpen) return null;

  const totalCost = cart.reduce((acc, item) => {
    const price = convertPrice(item.product.basePriceINR, country, rates);
    return acc + price * item.quantity;
  }, 0);

  const handleIncrement = (productId: string, currentQty: number, unit: "kg" | "piece") => {
    const stepVal = unit === "kg" ? 0.5 : 1;
    updateQuantity(productId, currentQty + stepVal);
  };

  const handleDecrement = (productId: string, currentQty: number, unit: "kg" | "piece") => {
    const stepVal = unit === "kg" ? 0.5 : 1;
    const minVal = unit === "piece" ? 10 : 0.5; // Do not decrement below the absolute minimum easily, or let them decrement and remove
    if (currentQty - stepVal < 0.1) {
      removeFromCart(productId);
      showToast("Item removed from cart");
    } else {
      updateQuantity(productId, currentQty - stepVal);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" id="cart-drawer-container">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-full max-w-md bg-white flex flex-col shadow-2xl border-l border-border-brand animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-border-brand bg-bg-cream/20 flex items-center justify-between">
            {step === "checkout" ? (
              <button
                onClick={() => setStep("cart")}
                className="flex items-center gap-2 text-primary font-semibold text-sm hover:text-primary-hover"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Cart
              </button>
            ) : (
              <h2 className="text-lg font-serif font-bold text-primary flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-accent" />
                Your Shopping Cart
              </h2>
            )}
            <button
              onClick={onClose}
              className="text-text-dark/40 hover:text-text-dark p-1 rounded-full hover:bg-bg-cream/40"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Contents */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-bg-cream flex items-center justify-center text-text-dark/30">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-lg text-text-dark">Cart is empty</h3>
                  <p className="text-sm text-text-dark/50 mt-1">
                    Explore our delicacies and add items to get started!
                  </p>
                </div>
              </div>
            ) : step === "cart" ? (
              /* Items list view */
              <div className="space-y-4">
                {cart.map((item) => {
                  const convertedUnitPrice = convertPrice(item.product.basePriceINR, country, rates);
                  const isKg = item.product.unit === "kg";
                  return (
                    <div
                      key={item.product.id}
                      className="flex gap-4 p-3 border border-border-brand rounded-xl bg-bg-cream/10"
                    >
                      {/* Left: Product Icon Placeholder */}
                      <div className="w-16 h-16 rounded-lg bg-bg-cream flex items-center justify-center shrink-0 border border-border-brand">
                        <span className="text-xl font-serif text-primary font-bold">
                          {item.product.name.charAt(0)}
                        </span>
                      </div>

                      {/* Right details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-sm font-semibold text-text-dark line-clamp-1">
                              {item.product.name}
                            </h4>
                            <span className="text-xs text-text-dark/40 font-mono">
                              {formatPrice(convertedUnitPrice, country)} / {item.product.unit}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              removeFromCart(item.product.id);
                              showToast("Item removed");
                            }}
                            className="text-text-dark/30 hover:text-red-600 p-0.5 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Quantity picker */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-border-brand rounded-lg bg-white overflow-hidden shadow-xs">
                            <button
                              onClick={() => handleDecrement(item.product.id, item.quantity, item.product.unit)}
                              className="px-2.5 py-1 hover:bg-bg-cream/40 text-text-dark/70 transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-3 py-0.5 text-xs font-mono font-bold text-text-dark bg-bg-cream/10 min-w-8 text-center">
                              {item.quantity}
                              {isKg ? " kg" : ""}
                            </span>
                            <button
                              onClick={() => handleIncrement(item.product.id, item.quantity, item.product.unit)}
                              className="px-2.5 py-1 hover:bg-bg-cream/40 text-text-dark/70 transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          
                          <span className="text-sm font-bold text-primary font-mono">
                            {formatPrice(convertedUnitPrice * item.quantity, country)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Checkout Form View */
              <div className="py-2">
                <div className="bg-bg-cream/40 rounded-xl p-3 border border-border-brand/60 mb-4">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Order summary</h4>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex justify-between text-xs text-text-dark/80">
                        <span>{item.product.name} ({item.quantity}{item.product.unit === "kg" ? "kg" : "pcs"})</span>
                        <span className="font-mono">{formatPrice(convertPrice(item.product.basePriceINR, country, rates) * item.quantity, country)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border-brand mt-2 pt-2 flex justify-between text-sm font-bold text-primary">
                    <span>Total Subtotal</span>
                    <span className="font-mono">{formatPrice(totalCost, country)}</span>
                  </div>
                </div>
                <CheckoutForm onSuccess={() => {
                  setStep("cart");
                  onClose();
                  showToast("Order initiated! Redirecting to WhatsApp...");
                }} />
              </div>
            )}
          </div>

          {/* Footer details (only show when items are in cart) */}
          {cart.length > 0 && (
            <div className="px-6 py-6 border-t border-border-brand bg-bg-cream/10 space-y-4">
              
              {/* Error messages & weight warnings */}
              {step === "cart" && (weightError || pieceError) && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 space-y-1">
                  {weightError && <p className="font-medium">⚠️ {weightError}</p>}
                  {pieceError && <p className="font-medium">⚠️ {pieceError}</p>}
                  <p className="text-[10px] text-red-600">
                    Add more items to meet the minimum order restrictions before proceeding.
                  </p>
                </div>
              )}

              {/* Weight Details summary */}
              {step === "cart" && (
                <div className="space-y-1.5 text-xs text-text-dark/60 pb-2 border-b border-border-brand/40">
                  {totalWeight > 0 && (
                    <div className="flex justify-between">
                      <span>Total Weight:</span>
                      <span className="font-mono font-bold text-text-dark">{totalWeight.toFixed(1)} kg</span>
                    </div>
                  )}
                  {totalPieceCount > 0 && (
                    <div className="flex justify-between">
                      <span>Sarvapindi Count:</span>
                      <span className="font-mono font-bold text-text-dark">{totalPieceCount} pieces</span>
                    </div>
                  )}
                </div>
              )}

              {/* Subtotal */}
              <div className="flex justify-between items-baseline pt-1">
                <span className="text-sm font-semibold text-text-dark/70">Subtotal:</span>
                <span className="text-2xl font-mono font-bold text-primary">
                  {formatPrice(totalCost, country)}
                </span>
              </div>

              {/* Delivery charges and timelines (Mandatory notices) */}
              <div className="bg-bg-cream/40 rounded-xl p-3 border border-border-brand/40 text-[11px] leading-relaxed text-text-dark/60 space-y-2">
                <p>
                  * <span className="font-semibold text-primary">Delivery charges are extra</span> and will be confirmed after your order is accepted.
                </p>
                <p>
                  * Expected delivery: <span className="font-semibold text-primary">5–7 business days</span> after order confirmation (domestic). International orders may take longer — final delivery timeline will be confirmed via WhatsApp.
                </p>
              </div>

              {/* Action Buttons */}
              {step === "cart" && (
                <button
                  disabled={!isValidOrder}
                  onClick={() => setStep("checkout")}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                    isValidOrder
                      ? "bg-primary hover:bg-primary-hover text-white hover:scale-[1.01]"
                      : "bg-text-dark/15 text-text-dark/40 cursor-not-allowed"
                  }`}
                  id="proceed-checkout-btn"
                >
                  Proceed to Checkout
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
