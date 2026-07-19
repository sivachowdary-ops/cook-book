"use client";

import React from "react";

export const FloatingWhatsApp: React.FC = () => {
  const whatsappNumber = "[BUSINESS_WHATSAPP]"; // Placeholder to be replaced by client
  const defaultMessage = encodeURIComponent(
    "Hello Cook Book! I would love to order some traditional sweets and snacks. Please guide me on the ordering process."
  );
  
  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${defaultMessage}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
      aria-label="Contact us on WhatsApp"
      id="floating-whatsapp-btn"
    >
      {/* Pulse ring animation */}
      <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75 animate-ping -z-10 group-hover:hidden"></span>
      
      <svg
        className="w-6.5 h-6.5 fill-current"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 2.8 1.4 4.8 1.4 5.5 0 10-4.5 10-10s-4.5-10-10-10-10 4.5-10 10c0 2 .5 3.5 1.4 5l-.9 3.3 3.3-.9zM16.5 13.5c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.8.9-.1.2-.3.2-.5.1-.9-.4-1.7-.8-2.4-1.5-.5-.5-.9-1.1-1.1-1.4-.2-.3 0-.4.1-.5.1-.1.2-.3.3-.4.1-.1.1-.2.2-.3.1-.2 0-.3-.1-.4-.2-.5-.8-2-.9-2.3-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.5.1-.8.4-.3.3-1.1 1-1.1 2.5s1.1 2.9 1.2 3.1c.1.2 2.2 3.4 5.3 4.7.7.3 1.3.5 1.8.7.8.2 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.3.2-1.5-.1-.2-.3-.3-.6-.4z" />
      </svg>
      
      {/* Tooltip on hover */}
      <span className="absolute right-16 bg-text-dark text-white text-xs px-3 py-1.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none font-medium">
        Order via WhatsApp
      </span>
    </a>
  );
};
