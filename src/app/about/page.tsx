"use client";

import React from "react";
import Link from "next/link";
import { Play, Sparkles, Heart, ShieldCheck, ArrowRight } from "lucide-react";

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow space-y-16">
      {/* 1. Header Hero */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-bold text-accent uppercase tracking-widest block">Our Heritage</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary">Taste the Magic Story</h1>
        <div className="w-20 h-1 bg-accent mx-auto rounded-full" />
        <p className="text-xs sm:text-sm text-text-dark/60 leading-relaxed">
          From a family kitchen in the Telugu heartlands to dinner tables across the UK and USA.
        </p>
      </div>

      {/* 2. Brand Story Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Story */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="font-serif text-2xl font-bold text-primary flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            Handcrafted Without Compromise
          </h2>
          <div className="space-y-4 text-sm text-text-dark/80 leading-relaxed">
            <p>
              Cook Book was built on simple foundations: traditional recipes, premium raw ingredients, and hygienic handcrafting. Traditional Andhra and Telangana delicacies have long been prepared using seasonal fresh yields, aged spices, and organic sweeteners.
            </p>
            <p>
              Unfortunately, modern commercial processing often relies on chemical preservatives, MSG, artificial food colorings, and low-grade blending oils to extend shelf life. At Cook Book, we reject these practices completely.
            </p>
            <p>
              Every single order of Ariselu is bound by organic palm jaggery. Our pickles are cured under the Indian sun in high-grade cold-pressed oils. We grind our spicy curry powders in tiny batches to preserve the volatile essential oils and rich native aroma.
            </p>
          </div>
        </div>

        {/* Right Graphic Logo */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-sm aspect-square rounded-3xl overflow-hidden border border-accent/25 ornate-border shadow-xl relative">
            <img
              src="/images/cook_book_logo.webp"
              alt="Cook Book Traditional Craft Logo"
              className="w-full h-full object-cover scale-105"
            />
          </div>
        </div>
      </div>

      {/* 3. Meet the Founder */}
      <div className="bg-bg-cream/40 rounded-3xl border border-border-brand p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ornate-border">
        {/* Founder Photo */}
        <div className="lg:col-span-4 flex justify-center">
          <div className="w-48 h-48 rounded-full border-2 border-accent/50 p-1 overflow-hidden shadow-md shrink-0">
            <img
              src="/images/cook_book_founder.webp"
              alt="Anusha Reddy Nandyala"
              className="w-full h-full object-cover object-top rounded-full"
            />
          </div>
        </div>

        {/* Founder Quote */}
        <div className="lg:col-span-8 space-y-4">
          <span className="text-xs font-bold text-primary uppercase tracking-widest block">Message from Founder</span>
          <h3 className="font-serif text-xl font-bold text-primary">A message from Anusha Reddy Nandyala</h3>
          <p className="text-sm italic text-text-dark/75 leading-relaxed">
            "Cook Book started as a labor of love in our home kitchen. We wanted to ensure that children and families living abroad in the UK and USA could still taste the authentic, spice-rich goodness of home. There is a deep, comforting magic in traditional Andhra food, and we are honored to share it with you."
          </p>
          <div className="pt-2">
            <h4 className="text-sm font-bold text-primary">Anusha Reddy Nandyala</h4>
            <p className="text-xs text-text-dark/40 font-medium">Founder & Head Cook, Cook Book</p>
          </div>
        </div>
      </div>

      {/* 4. Prep Video Showcase */}
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h3 className="font-serif text-2xl font-bold text-primary">Behind the Scenes</h3>
          <p className="text-xs text-text-dark/50">Watch our traditional kitchen curing and hygienic packaging in action.</p>
        </div>

        <div className="bg-bg-cream/30 p-4 border border-border-brand rounded-3xl shadow-xs relative ornate-border">
          <div className="bg-zinc-800 rounded-2xl aspect-video relative flex flex-col items-center justify-center group shadow-inner">
            <span className="absolute top-3 left-3 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded uppercase font-semibold">
              Curing & Packing Process
            </span>
            <div className="w-14 h-14 rounded-full bg-accent/90 group-hover:bg-accent text-primary flex items-center justify-center cursor-pointer shadow-lg group-hover:scale-105 transition-transform duration-300">
              <Play className="w-6 h-6 fill-current ml-1" />
            </div>
            <span className="text-xs text-white/50 text-center max-w-[200px] mt-4">
              [KITCHEN_PROCESS_VIDEO]
            </span>
          </div>
        </div>
      </div>

      {/* 5. CTA Footer banner */}
      <div className="bg-primary rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-xl border-b-4 border-accent">
        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
          <svg className="w-96 h-96 fill-current text-accent" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" fill="none" />
          </svg>
        </div>
        <div className="relative z-10 space-y-6 max-w-xl mx-auto">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-accent">Ready to taste the magic?</h3>
          <p className="text-sm text-white/80 leading-relaxed">
            Order fresh traditional sweets, crunchy janthikalu, sun-cured Gongura pickles, and high-iron Avisala powders. Shipping locally and globally.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/shop"
              className="bg-accent hover:bg-accent-hover text-primary py-3.5 px-8 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 hover:scale-[1.02] cursor-pointer"
            >
              <span>Explore Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
