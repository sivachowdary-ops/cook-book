"use client";

import React, { useState } from "react";
import { MessageSquare, Mail, MapPin, Clock } from "lucide-react";

export default function Contact() {
  const [customMsg, setCustomMsg] = useState("");

  const handleWhatsAppChat = () => {
    const defaultMsg = customMsg.trim() 
      ? encodeURIComponent(customMsg) 
      : encodeURIComponent("Hello Cook Book! I have a question about your products.");
    window.open(`https://wa.me/919553977566?text=${defaultMsg}`, "_blank");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow space-y-12">
      {/* Page Title */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-bold text-accent uppercase tracking-widest block">Get In Touch</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary">Contact Us</h1>
        <div className="w-20 h-1 bg-accent mx-auto rounded-full" />
        <p className="text-xs sm:text-sm text-text-dark/60">
          Have questions about shipping, weights, or custom preparations? Chat with us directly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left column: Contact Info list */}
        <div className="md:col-span-5 bg-white border border-border-brand rounded-2xl p-6 shadow-xs space-y-6 ornate-border">
          <h3 className="font-serif font-bold text-lg text-primary border-b border-border-brand/40 pb-2">
            Contact Details
          </h3>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-text-dark block">WhatsApp Business</span>
                <a href="https://wa.me/919553977566" className="text-text-dark/70 hover:underline">
                  +91 95539 77566
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-text-dark block">Email Support</span>
                <a href="mailto:info@cookbookfoods.com" className="text-text-dark/70 hover:underline">
                  info@cookbookfoods.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-accent shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              <div className="text-xs">
                <span className="font-bold text-text-dark block">Instagram Handle</span>
                <a href="https://instagram.com/cookbook.taste" target="_blank" rel="noopener noreferrer" className="text-text-dark/70 hover:underline">
                  @cookbook.taste
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-text-dark block">Kitchen Address</span>
                <span className="text-text-dark/70 leading-relaxed block">
                  Hyderabad, Telangana, India
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-text-dark block">Business Hours</span>
                <span className="text-text-dark/70 block">
                  9:00 AM – 8:00 PM (IST)<br />
                  Monday – Saturday
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Custom Inquiry form deep-linking to WhatsApp */}
        <div className="md:col-span-7 bg-bg-cream/30 border border-border-brand rounded-2xl p-6 shadow-xs flex flex-col justify-between ornate-border">
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-primary">Quick WhatsApp Inquiry</h3>
            <p className="text-xs text-text-dark/65 leading-relaxed">
              Type your message below and click "Open WhatsApp Chat". We will receive your query instantly and reply as soon as possible.
            </p>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-text-dark/60 uppercase tracking-wider">
                Your Inquiry Message
              </label>
              <textarea
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder="e.g., Hello Cook Book, I want to know if you can ship 5kg of Ariselu and 3kg of Boneless Mutton Pickle to Texas, USA. How much would shipping cost?"
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-border-brand bg-white text-xs focus:outline-none focus:border-primary resize-none shadow-inner"
              />
            </div>
          </div>

          <button
            onClick={handleWhatsAppChat}
            className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-3 px-4 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-6"
            id="contact-whatsapp-btn"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 2.8 1.4 4.8 1.4 5.5 0 10-4.5 10-10s-4.5-10-10-10-10 4.5-10 10c0 2 .5 3.5 1.4 5l-.9 3.3 3.3-.9zM16.5 13.5c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.8.9-.1.2-.3.2-.5.1-.9-.4-1.7-.8-2.4-1.5-.5-.5-.9-1.1-1.1-1.4-.2-.3 0-.4.1-.5.1-.1.2-.3.3-.4.1-.1.1-.2.2-.3.1-.2 0-.3-.1-.4-.2-.5-.8-2-.9-2.3-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.5.1-.8.4-.3.3-1.1 1-1.1 2.5s1.1 2.9 1.2 3.1c.1.2 2.2 3.4 5.3 4.7.7.3 1.3.5 1.8.7.8.2 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.3.2-1.5-.1-.2-.3-.3-.6-.4z" />
            </svg>
            <span>Open WhatsApp Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
}
