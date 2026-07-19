"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, ShieldAlert, ShoppingBag, Send, FileCheck } from "lucide-react";

export default function HowToOrder() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const steps = [
    {
      title: "1. Select Delicacies",
      description: "Browse our sweets, snacks, pickles, and powders. Click on cards to read ingredients and specifications. Select weight sizes (in steps of 0.5kg) or piece quantities and add to cart.",
      icon: <ShoppingBag className="w-6 h-6 text-accent" />,
    },
    {
      title: "2. Check Minimum Order",
      description: "Per-kg items require a combined minimum cart weight of 2kg to pack and ship. Per-piece items like Sarvapindi do not count toward weight but require a minimum quantity of 10 pieces.",
      icon: <ShieldAlert className="w-6 h-6 text-accent" />,
    },
    {
      title: "3. Complete Checkout Form",
      description: "Input your full delivery details. We render country-specific validation forms for India, the UK, and the USA to capture postcodes, zip codes, and state structures accurately.",
      icon: <FileCheck className="w-6 h-6 text-accent" />,
    },
    {
      title: "4. Redirect to WhatsApp",
      description: "Submit the checkout form to compile a pre-formatted order summary. It deep-links directly to WhatsApp. We confirm shipping charges, coordinate payment, and send confirmation details.",
      icon: <Send className="w-6 h-6 text-accent" />,
    },
  ];

  const faqs = [
    {
      q: "Why is there a 2kg minimum weight requirement?",
      a: "Our food products are prepared fresh and packed securely in airtight, export-quality boxes to prevent leaks and damage during transit. Shipping packages under 2kg is highly inefficient and costly for both domestic and international shipping.",
    },
    {
      q: "Which countries do you deliver to?",
      a: "We currently deliver nationwide within India (PAN India shipping) and ship internationally to the United Kingdom (UK) and the United States (USA).",
    },
    {
      q: "How are international customs handled?",
      a: "US and UK customs generally permit commercially sealed, labeled, and prepared food items. Cook Book products are prepared fresh and packed with care. [FSSAI_CERTIFICATION_STATEMENT — confirm with client before publishing]. Any import taxes, local customs duties, or inspection charges are the sole responsibility of the customer and are collected directly by the courier agency if applicable.",
    },
    {
      q: "How long does shipping take?",
      a: "Domestic deliveries within India typically arrive within 5–7 business days after order confirmation. International shipments to the US and UK take longer and are subject to local customs processing times. We will share estimated courier transit timelines with you on WhatsApp.",
    },
    {
      q: "Since there is no payment gateway, how do I pay?",
      a: "Once you submit your order form, it opens a conversation with us on WhatsApp. We review your cart, compute the weight and packaging costs, add active courier charges, and share manual payment details (UPI transfer, QR codes, or bank wire details) to collect payment before dispatching your package.",
    },
    {
      q: "Can I edit or cancel my order after submitting it?",
      a: "Yes! Since checkout redirects you to WhatsApp for manual confirmation, you can chat with us directly to add, remove, or modify items, adjust weights, or cancel the order before sending payment.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow space-y-12">
      {/* Page Title */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-bold text-accent uppercase tracking-widest block">Ordering Guide</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary">How to Order & FAQ</h1>
        <div className="w-20 h-1 bg-accent mx-auto rounded-full" />
        <p className="text-xs sm:text-sm text-text-dark/60">
          Everything you need to know about our weight restrictions, WhatsApp checkout, and international customs.
        </p>
      </div>

      {/* Visual Step-by-Step Flow */}
      <div className="space-y-6">
        <h2 className="font-serif text-2xl font-bold text-primary text-center">4-Step Ordering Flow</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-border-brand p-6 shadow-xs flex gap-4 relative ornate-border"
            >
              <div className="w-12 h-12 rounded-xl bg-bg-cream flex items-center justify-center shrink-0 border border-border-brand">
                {step.icon}
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-sm text-primary">{step.title}</h3>
                <p className="text-xs text-text-dark/70 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-6">
        <h2 className="font-serif text-2xl font-bold text-primary text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="border border-border-brand rounded-xl overflow-hidden bg-bg-cream/10">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left font-serif font-bold text-sm text-text-dark hover:bg-bg-cream/35 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-accent shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-accent shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs leading-relaxed text-text-dark/75 border-t border-border-brand/40 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 border-t border-border-brand/40" />

      {/* Shop Link Button */}
      <div className="text-center pt-4">
        <Link
          href="/shop"
          className="inline-flex bg-primary hover:bg-primary-hover text-white py-3.5 px-8 rounded-xl font-bold transition-all shadow-md hover:scale-[1.02]"
        >
          Go to Shop Catalog
        </Link>
      </div>
    </div>
  );
}
