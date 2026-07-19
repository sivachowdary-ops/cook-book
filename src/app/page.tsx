"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product } from "@/data/products";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { useCountry } from "@/context/CountryContext";
import { useProducts } from "@/context/ProductContext";
import { 
  Heart, 
  ChevronDown, 
  ChevronUp, 
  Truck, 
  Sparkles, 
  ShieldCheck, 
  HelpCircle,
  Play,
  ArrowRight
} from "lucide-react";

export default function Home() {
  const { country, setCountry } = useCountry();
  const { products } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Best Sellers (Subset of catalog)
  const bestSellerIds = [
    "sweet-dry-fruit-laddu",
    "sweet-ariselu",
    "snack-kaju-masala",
    "veg-aavakaya-pachadi",
  ];
  
  // Filter bestsellers and only show if they are marked inStock !== false
  const bestSellers = products
    .filter((p) => bestSellerIds.includes(p.id))
    .filter((p) => p.inStock !== false);

  // Category statistics
  const categories = [
    {
      id: "sweets",
      name: "Traditional Sweets",
      count: products.filter((p) => p.category === "sweets").length,
      imageBg: "from-yellow-50 to-amber-100",
      description: "Laddus, Ariselu, Halwas & more",
      image: "/images/categories/sweets_category.webp",
    },
    {
      id: "snacks",
      name: "Savory Snacks",
      count: products.filter((p) => p.category === "snacks").length,
      imageBg: "from-orange-50 to-amber-100",
      description: "Karappusa, Sakinalu, Chakkalu",
      image: "/images/categories/snacks_category.webp",
    },
    {
      id: "veg-pickles",
      name: "Veg Pickles",
      count: products.filter((p) => p.category === "veg-pickles").length,
      imageBg: "from-emerald-50 to-teal-100",
      description: "Aavakaya, Gongura, Garlic",
      image: "/images/categories/veg_pickles_category.webp",
    },
    {
      id: "non-veg-pickles",
      name: "Non-Veg Pickles",
      count: products.filter((p) => p.category === "non-veg-pickles").length,
      imageBg: "from-red-50 to-orange-100",
      description: "Spicy Chicken, Mutton & Prawns",
      image: "/images/categories/nonveg_pickles_category.webp",
    },
    {
      id: "powders",
      name: "Spice Powders",
      count: products.filter((p) => p.category === "powders").length,
      imageBg: "from-yellow-50 to-amber-100",
      description: "Kandi Podi, Karivepaku, Masala",
      image: "/images/categories/powders_category.webp",
    },
  ];

  // FAQ contents
  const faqs = [
    {
      question: "How do I place an order?",
      answer: "Browse our products, select your preferred pack sizes (in kg or pieces), and fill out the shipping address at checkout. Clicking 'Send Order' will generate a pre-formatted message and redirect you to WhatsApp. We will confirm delivery costs and finalize the order with you manually on WhatsApp.",
    },
    {
      question: "What is the minimum order requirement?",
      answer: "To ensure package stability and shipping efficiency, we require a minimum combined weight of 2kg for per-kilogram products (Sweets, Snacks, Pickles, Powders). Per-piece items like Sarvapindi do not count toward weight but have their own minimum order requirement of 10 pieces.",
    },
    {
      question: "Do you ship internationally to the UK and USA?",
      answer: "Yes, we ship to all major cities in India, the United Kingdom, and the United States. International shipments are securely packed and labeled to clear customs smoothly. Delivery timelines and customs details will be confirmed individually over WhatsApp.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "Since we do not route payments through an online gateway on the site, payment methods will be aligned manually on WhatsApp. We support UPI transfers, bank transfers, and advance manual links depending on your shipping country.",
    },
    {
      question: "Will I have to pay customs duties for UK/US orders?",
      answer: "Customs duties, taxes, and import regulations vary significantly by country and are the sole responsibility of the recipient. Cook Book products are prepared fresh and packed with care. [FSSAI_CERTIFICATION_STATEMENT - confirm with client before publishing]. Any local import hold or duties are confirmed at the time of courier booking.",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col w-full min-w-0">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-br from-primary via-primary-hover to-[#3A0A10] text-white overflow-hidden py-16 sm:py-24">
        {/* Background Decorative Mandala Pattern Overlay */}
        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
          <svg className="w-full max-w-2xl h-auto fill-current text-accent" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="0.5" fill="none" />
            <polygon points="50,5 95,50 50,95 5,50" stroke="currentColor" strokeWidth="0.25" fill="none" />
            <polygon points="50,15 85,50 50,85 15,50" stroke="currentColor" strokeWidth="0.25" fill="none" />
            <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="0.5" fill="none" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Homemade Traditional Taste</span>
          </div>
          
          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
            Taste the Magic of <br />
            <span className="text-accent">Andhra & Telangana</span>
          </h1>
          
          <p className="text-white/80 text-base sm:text-lg max-w-2xl leading-relaxed">
            Experience the heritage of rich, hand-crafted sweets, crunchy traditional savories, fiery non-veg pickles, and aromatic spice powders. Made fresh to order and shipped worldwide.
          </p>

          {/* Quick Country Switcher Indicator inside Hero */}
          <div className="pt-2 flex flex-wrap justify-start gap-3 text-sm">
            <span className="text-white/60 self-center">Deliver to:</span>
            <button 
              onClick={() => setCountry("IN")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                country === "IN" ? "bg-accent text-primary" : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              🇮🇳 India
            </button>
            <button 
              onClick={() => setCountry("UK")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                country === "UK" ? "bg-accent text-primary" : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              🇬🇧 United Kingdom
            </button>
            <button 
              onClick={() => setCountry("US")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                country === "US" ? "bg-accent text-primary" : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              🇺🇸 United States
            </button>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-start justify-start gap-4">
            <Link
              href="/shop"
              className="w-full sm:w-auto bg-accent hover:bg-accent-hover text-primary py-4 px-8 rounded-xl font-bold transition-all shadow-lg text-center hover:scale-[1.02] cursor-pointer"
            >
              Shop Our Catalog
            </Link>
            <Link
              href="/about"
              className="w-full sm:w-auto bg-transparent hover:bg-white/10 border border-white/30 text-white py-4 px-8 rounded-xl font-bold transition-all text-center cursor-pointer"
            >
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* 2. TRUST BADGES */}
      <section className="bg-white border-y border-border-brand py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center space-y-1 p-3">
              <div className="w-10 h-10 rounded-full bg-bg-cream flex items-center justify-center text-primary mb-1">
                <Heart className="w-5 h-5 text-accent" />
              </div>
              <span className="font-bold text-sm text-text-dark">Traditional Recipes</span>
              <span className="text-xs text-text-dark/50">Handed down generations</span>
            </div>

            <div className="flex flex-col items-center space-y-1 p-3">
              <div className="w-10 h-10 rounded-full bg-bg-cream flex items-center justify-center text-primary mb-1">
                <ShieldCheck className="w-5 h-5 text-accent" />
              </div>
              <span className="font-bold text-sm text-text-dark">Hygienic Prep</span>
              <span className="text-xs text-text-dark/50">Prepared fresh to order</span>
            </div>

            <div className="flex flex-col items-center space-y-1 p-3">
              <div className="w-10 h-10 rounded-full bg-bg-cream flex items-center justify-center text-primary mb-1">
                <Sparkles className="w-5 h-5 text-accent" />
              </div>
              <span className="font-bold text-sm text-text-dark">Authentic Spices</span>
              <span className="text-xs text-text-dark/50">Cold-ground native masalas</span>
            </div>

            <div className="flex flex-col items-center space-y-1 p-3">
              <div className="w-10 h-10 rounded-full bg-bg-cream flex items-center justify-center text-primary mb-1">
                <Truck className="w-5 h-5 text-accent" />
              </div>
              <span className="font-bold text-sm text-text-dark">Ships Internationally</span>
              <span className="text-xs text-text-dark/50">To India, USA, and UK</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORY TILES */}
      <section className="py-16 bg-bg-cream/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary">Browse By Category</h2>
            <div className="w-24 h-1 bg-accent mx-auto mt-3 rounded-full" />
            <p className="text-sm text-text-dark/60 mt-3">
              Explore our diverse specialties, from melt-in-the-mouth laddus to cured hot non-veg pickles.
            </p>
          </div>

          <div className="w-full flex overflow-x-auto gap-4 pb-4 md:grid md:grid-cols-5 md:overflow-visible md:pb-0 scroll-indicator">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.id}`}
                className="group flex flex-col items-center text-center shrink-0 w-24 sm:w-28 md:w-full bg-transparent md:bg-white md:rounded-2xl md:border md:border-border-brand md:overflow-hidden md:shadow-xs md:hover:shadow-lg md:p-0 transition-all duration-300 md:ornate-border"
              >
                {/* Category Cover */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full md:rounded-none md:w-full md:h-28 overflow-hidden relative border-2 border-accent/40 md:border-none md:border-b md:border-border-brand/40 shadow-md md:shadow-none">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                </div>
                <div className="mt-2 md:mt-0 md:p-4 flex flex-col justify-between items-center md:items-stretch w-full">
                  <div className="text-center md:text-left">
                    <h3 className="font-serif font-bold text-xs md:text-sm text-text-dark group-hover:text-primary transition-colors line-clamp-1">
                      {cat.name}
                    </h3>
                    <p className="hidden md:block text-[11px] text-text-dark/50 leading-tight mt-0.5">
                      {cat.description}
                    </p>
                  </div>
                  <span className="hidden md:flex text-[10px] font-bold text-primary/80 mt-3 items-center gap-1 group-hover:gap-1.5 transition-all">
                    {cat.count} Items <ArrowRight className="w-3 h-3 shrink-0" />
                  </span>
                  <span className="md:hidden text-[9px] text-primary/70 font-semibold font-mono">
                    {cat.count} items
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. BEST SELLERS */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <h2 className="font-serif text-3xl font-bold text-primary">Best Sellers</h2>
              <p className="text-sm text-text-dark/60 mt-2">
                Our customer favorites - hand-crafted traditional recipe hits.
              </p>
            </div>
            <Link
              href="/shop"
              className="text-primary hover:text-primary-hover font-bold text-sm flex items-center gap-1.5 mt-4 sm:mt-0 hover:underline"
            >
              <span>View All Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <ProductGrid products={bestSellers} onDetailClick={setSelectedProduct} />
        </div>
      </section>

      {/* 5. HOW TO ORDER (4-step visual flow) */}
      <section className="py-16 bg-bg-cream/40 border-y border-border-brand/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif text-3xl font-bold text-primary">How to Order</h2>
            <div className="w-20 h-1 bg-accent mx-auto mt-3 rounded-full" />
            <p className="text-sm text-text-dark/60 mt-3">
              We ship fresh directly from our home kitchen to your door. Follow this simple process:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="flex flex-col items-center text-center space-y-3 p-4 bg-white rounded-2xl border border-border-brand shadow-xs relative">
              <span className="absolute -top-4 -left-4 w-9 h-9 rounded-full bg-accent text-primary flex items-center justify-center font-serif font-bold border border-primary/20 shadow">1</span>
              <span className="font-bold text-sm text-text-dark">Browse Catalog</span>
              <p className="text-xs text-text-dark/60">
                Choose sweets, snacks, veg or non-veg pickles, or spice powders.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3 p-4 bg-white rounded-2xl border border-border-brand shadow-xs relative">
              <span className="absolute -top-4 -left-4 w-9 h-9 rounded-full bg-accent text-primary flex items-center justify-center font-serif font-bold border border-primary/20 shadow">2</span>
              <span className="font-bold text-sm text-text-dark">Set Weight (Min 2kg)</span>
              <p className="text-xs text-text-dark/60">
                Pick quantities (min 2kg combined for kg items; min 10 pieces for Sarvapindi).
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3 p-4 bg-white rounded-2xl border border-border-brand shadow-xs relative">
              <span className="absolute -top-4 -left-4 w-9 h-9 rounded-full bg-accent text-primary flex items-center justify-center font-serif font-bold border border-primary/20 shadow">3</span>
              <span className="font-bold text-sm text-text-dark">Checkout to WhatsApp</span>
              <p className="text-xs text-text-dark/60">
                Fill in details; clicking checkout redirects you to WhatsApp with your order draft.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3 p-4 bg-white rounded-2xl border border-border-brand shadow-xs relative">
              <span className="absolute -top-4 -left-4 w-9 h-9 rounded-full bg-accent text-primary flex items-center justify-center font-serif font-bold border border-primary/20 shadow">4</span>
              <span className="font-bold text-sm text-text-dark">Confirm & Receive</span>
              <p className="text-xs text-text-dark/60">
                We'll confirm delivery charges, share payment links, and dispatch your order.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FOUNDER SECTION */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            
            <div className="md:col-span-5 flex justify-center">
              <div className="w-full max-w-sm aspect-square rounded-3xl overflow-hidden border border-border-brand relative ornate-border shadow-md">
                <img
                  src="/images/cook_book_founder.webp"
                  alt="Anusha Reddy Nandyala"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>

            {/* Right: Founder Message */}
            <div className="md:col-span-7 space-y-6">
              <span className="text-xs font-bold text-accent uppercase tracking-widest block">Our Heritage</span>
              <h2 className="font-serif text-3xl font-bold text-primary">A Message from the Founder</h2>
              <div className="w-16 h-0.5 bg-primary" />
              
              <div className="space-y-4 text-sm text-text-dark/85 leading-relaxed">
                <p className="italic">
                  "Cook Book was born out of a desire to share authentic, homemade Telugu recipes with the global community. For years, we prepared these traditional sweets and savories for family festivals, and now we want to bring that same magic directly to your kitchen table."
                </p>
                <p>
                  Every single sweet is hand-bound with organic jaggery and pure cow ghee. Our pickles are prepared from fresh cuts, hand-dried and cured under direct sunlight with cold-pressed oils. We strictly reject preservative chemicals, colorings, and additives.
                </p>
              </div>

              <div>
                <h4 className="font-serif font-bold text-base text-primary">Anusha Reddy Nandyala</h4>
                <p className="text-xs text-text-dark/45 font-semibold">Founder, Cook Book</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS */}
      <section className="py-16 bg-bg-cream/20 border-t border-border-brand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif text-3xl font-bold text-primary">Customer Testimonials</h2>
            <div className="w-16 h-1 bg-accent mx-auto mt-3 rounded-full" />
            <p className="text-sm text-text-dark/60 mt-3">
              Hear what traditional food lovers are saying about the Cook Book experience:
            </p>
          </div>

          <div className="w-full flex overflow-x-auto gap-6 pb-4 md:grid md:grid-cols-3 md:overflow-visible md:pb-0 scroll-indicator">
            <div className="bg-white p-6 rounded-2xl border border-border-brand shadow-xs space-y-4 relative shrink-0 w-[280px] sm:w-[320px] md:w-full">
              <span className="text-4xl text-accent font-serif absolute top-2 right-4 opacity-30">“</span>
              <p className="text-xs text-text-dark/80 italic leading-relaxed">
                "The Bellam Laddu tasted exactly like the ones my grandmother used to make. Packaged perfectly in airtight containers, which kept them fresh until arrival!"
              </p>
              <div className="border-t border-border-brand/40 pt-3 flex items-center gap-2">
                <span className="text-xs font-bold text-primary">Anitha Reddy</span>
                <span className="text-[10px] text-text-dark/40 font-medium">· Hyderabad, India</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-border-brand shadow-xs space-y-4 relative shrink-0 w-[280px] sm:w-[320px] md:w-full">
              <span className="text-4xl text-accent font-serif absolute top-2 right-4 opacity-30">“</span>
              <p className="text-xs text-text-dark/80 italic leading-relaxed">
                "The Boneless Chicken Pickle is exceptional! The spices are perfectly balanced, and the meat is tender. Will definitely be ordering regularly."
              </p>
              <div className="border-t border-border-brand/40 pt-3 flex items-center gap-2">
                <span className="text-xs font-bold text-primary">Srinivas Rao</span>
                <span className="text-[10px] text-text-dark/40 font-medium">· London, UK</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-border-brand shadow-xs space-y-4 relative shrink-0 w-[280px] sm:w-[320px] md:w-full">
              <span className="text-4xl text-accent font-serif absolute top-2 right-4 opacity-30">“</span>
              <p className="text-xs text-text-dark/80 italic leading-relaxed">
                "Excellent Kandi Podi and savories. The aroma of cold-ground spices is noticeable as soon as you open the box. Highly recommended for authentic tastes."
              </p>
              <div className="border-t border-border-brand/40 pt-3 flex items-center gap-2">
                <span className="text-xs font-bold text-primary">Latha Krishnan</span>
                <span className="text-[10px] text-text-dark/40 font-medium">· Chicago, USA</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ ACCORDION SECTION */}
      <section className="py-16 bg-white border-t border-border-brand">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl font-bold text-primary">Frequently Asked Questions</h2>
            <div className="w-16 h-1 bg-accent mx-auto mt-3 rounded-full" />
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="border border-border-brand rounded-xl overflow-hidden bg-bg-cream/10"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left font-serif font-bold text-sm text-text-dark hover:bg-bg-cream/40 transition-colors"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-accent shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-accent shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs leading-relaxed text-text-dark/75 border-t border-border-brand/35 bg-white">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Clean separation */}
          <div className="mt-8 border-t border-border-brand/40" />
        </div>
      </section>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
