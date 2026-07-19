"use client";

import React, { useState } from "react";
import { useCountry } from "@/context/CountryContext";
import { useCart } from "@/context/CartContext";
import { convertPrice, formatPrice } from "@/lib/pricing";
import { supabase } from "@/lib/supabase";

interface CheckoutFormProps {
  onSuccess: () => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSuccess }) => {
  const { country, rates } = useCountry();
  const { cart, totalWeight, totalPieceCount, clearCart } = useCart();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    county: "",
  });

  const INDIAN_STATES = [
    "Andhra Pradesh", "Telangana", "Karnataka", "Tamil Nadu", "Maharashtra",
    "Delhi", "Gujarat", "Rajasthan", "Uttar Pradesh", "West Bengal", "Kerala"
  ];

  const US_STATES = [
    { code: "AL", name: "Alabama" }, { code: "CA", name: "California" },
    { code: "FL", name: "Florida" }, { code: "GA", name: "Georgia" },
    { code: "IL", name: "Illinois" }, { code: "NY", name: "New York" },
    { code: "TX", name: "Texas" }, { code: "WA", name: "Washington" }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      let updatedVal = value;
      // Special logic for UK Post Town and Postcode
      if (country === "UK") {
        if (name === "city") updatedVal = value.toUpperCase(); // Post Town uppercase
        if (name === "zip") updatedVal = value.toUpperCase(); // Postcode uppercase
      }
      return { ...prev, [name]: updatedVal };
    });
    // Clear error
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const tempErrors: Record<string, string> = {};
    if (!formData.name.trim()) tempErrors.name = "Full Name is required";
    if (!formData.phone.trim()) tempErrors.phone = "Phone number is required";
    if (!formData.address1.trim()) tempErrors.address1 = "Address is required";
    if (!formData.city.trim()) tempErrors.city = "City/Town is required";

    // Validate phone based on country
    if (formData.phone.trim()) {
      const cleanPhone = formData.phone.replace(/\s+/g, "");
      if (country === "IN") {
        // expect 10 digits
        if (!/^\d{10}$/.test(cleanPhone)) {
          tempErrors.phone = "Enter a valid 10-digit mobile number (e.g. 9876543210)";
        }
      } else if (country === "UK") {
        // UK mobile starts with 07 / +44 7 and has 10 digits after prefix
        if (!/^(\+447\d{9}|07\d{9})$/.test(cleanPhone)) {
          tempErrors.phone = "Enter a valid UK mobile number starting with 07 or +44 7";
        }
      } else if (country === "US") {
        // NANP format
        const cleanUSPhone = cleanPhone.replace(/\D/g, "");
        if (cleanUSPhone.length !== 10) {
          tempErrors.phone = "Enter a valid 10-digit US phone number";
        }
      }
    }

    // Country-specific fields
    if (country === "IN") {
      if (!formData.state) tempErrors.state = "Select a State";
      if (!/^\d{6}$/.test(formData.zip)) tempErrors.zip = "PIN code must be 6 digits";
    } else if (country === "UK") {
      // UK Postcode regex
      const postcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i;
      if (!postcodeRegex.test(formData.zip.trim())) {
        tempErrors.zip = "Enter a valid UK Postcode (e.g., SW1A 1AA)";
      }
    } else if (country === "US") {
      if (!formData.state) tempErrors.state = "Select a State";
      // ZIP Code 5-digit or ZIP+4
      const zipRegex = /^\d{5}(-\d{4})?$/;
      if (!zipRegex.test(formData.zip)) {
        tempErrors.zip = "Enter a valid 5 or 9-digit ZIP code";
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Calculate itemized pricing
    let subtotalINR = 0;
    const itemsText = cart.map((item) => {
      const price = convertPrice(item.product.basePriceINR, country, rates);
      const totalItemPrice = price * item.quantity;
      subtotalINR += item.product.basePriceINR * item.quantity;

      const unitLabel = item.product.unit === "kg" ? "kg" : "pcs";
      const displayPrice = formatPrice(price, country);
      const displayTotalItem = formatPrice(totalItemPrice, country);
      return `- ${item.product.name} (${item.quantity}${unitLabel}) @ ${displayPrice}/${item.product.unit} = ${displayTotalItem}`;
    }).join("\n");

    const activeCurrencySubtotal = cart.reduce((acc, item) => {
      const price = convertPrice(item.product.basePriceINR, country, rates);
      return acc + (price * item.quantity);
    }, 0);

    const formattedSubtotal = formatPrice(activeCurrencySubtotal, country);

    // Format address string
    let fullAddress = "";
    if (country === "IN") {
      fullAddress = `${formData.address1}, ${formData.address2 ? formData.address2 + ", " : ""}${formData.city}, ${formData.state} - ${formData.zip}, India`;
    } else if (country === "UK") {
      fullAddress = `${formData.address1}, ${formData.address2 ? formData.address2 + ", " : ""}${formData.city}, ${formData.county ? formData.county + ", " : ""}${formData.zip}, United Kingdom`;
    } else {
      fullAddress = `${formData.address1}, ${formData.address2 ? formData.address2 + ", " : ""}${formData.city}, ${formData.state} ${formData.zip}, United States`;
    }

    // WhatsApp pre-filled message compilation
    const message = `*COOK BOOK ORDER CONFIRMATION*
----------------------------------
*Customer Details:*
Name: ${formData.name}
Phone: ${formData.phone}
Country: ${country === "IN" ? "🇮🇳 India" : country === "UK" ? "🇬🇧 United Kingdom" : "🇺🇸 United States"}

*Shipping Address:*
${fullAddress}

*Order Items:*
${itemsText}
----------------------------------
*Subtotal:* ${formattedSubtotal}

*Terms & Disclaimers:*
- Delivery charges are extra and will be confirmed after order acceptance.
- Expected delivery: 5–7 business days (domestic). International orders may take longer - final delivery timeline will be confirmed via WhatsApp.`;

    // Save to Supabase and Local Storage
    const orderId = Math.random().toString(36).substring(2, 9).toUpperCase();
    const newOrder = {
      id: orderId,
      customer_name: formData.name,
      customer_phone: formData.phone,
      country: country,
      address: fullAddress,
      items: cart.map(item => `${item.product.name} (${item.quantity} ${item.product.unit === "kg" ? "kg" : "pcs"})`),
      subtotal: formattedSubtotal,
    };

    const localOrder = {
      id: orderId,
      timestamp: new Date().toISOString(),
      customerName: formData.name,
      customerPhone: formData.phone,
      country: country,
      address: fullAddress,
      items: cart.map(item => `${item.product.name} (${item.quantity} ${item.product.unit === "kg" ? "kg" : "pcs"})`),
      subtotal: formattedSubtotal,
    };

    try {
      const existingOrders = JSON.parse(localStorage.getItem("cook_book_leads") || "[]");
      localStorage.setItem("cook_book_leads", JSON.stringify([localOrder, ...existingOrders]));
      
      // Async insert to Supabase leads table
      supabase.from("leads").insert([newOrder]).then(({ error }) => {
        if (error) console.error("Error saving lead to Supabase:", error);
      });
    } catch (err) {
      console.error("Failed to log order", err);
    }

    // Trigger Success Callback
    onSuccess();
    clearCart();

    // Redirect to WhatsApp
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/919553977566?text=${encodedMessage}`, "_blank");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-text-dark/70 uppercase tracking-wider mb-1">
          Full Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full px-4 py-2.5 rounded-lg border border-border-brand bg-bg-cream/20 text-sm focus:outline-none focus:border-primary"
          placeholder="Enter your name"
        />
        {errors.name && <p className="text-red-600 text-xs mt-1 font-medium">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-xs font-semibold text-text-dark/70 uppercase tracking-wider mb-1">
          {country === "IN" ? "WhatsApp Number" : "Mobile Number"}
        </label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className="w-full px-4 py-2.5 rounded-lg border border-border-brand bg-bg-cream/20 text-sm focus:outline-none focus:border-primary"
          placeholder={
            country === "IN"
              ? "+91 XXXXX XXXXX"
              : country === "UK"
              ? "+44 7XXX XXXXXX"
              : "+1 (XXX) XXX-XXXX"
          }
        />
        {errors.phone && <p className="text-red-600 text-xs mt-1 font-medium">{errors.phone}</p>}
      </div>

      <div>
        <label className="block text-xs font-semibold text-text-dark/70 uppercase tracking-wider mb-1">
          {country === "US" ? "Street Address" : "Address Line 1"}
        </label>
        <input
          type="text"
          name="address1"
          value={formData.address1}
          onChange={handleInputChange}
          className="w-full px-4 py-2.5 rounded-lg border border-border-brand bg-bg-cream/20 text-sm focus:outline-none focus:border-primary"
          placeholder="House/Flat No., Street Name"
        />
        {errors.address1 && <p className="text-red-600 text-xs mt-1 font-medium">{errors.address1}</p>}
      </div>

      <div>
        <label className="block text-xs font-semibold text-text-dark/70 uppercase tracking-wider mb-1">
          {country === "US" ? "Apartment/Unit (Optional)" : "Address Line 2 (Optional)"}
        </label>
        <input
          type="text"
          name="address2"
          value={formData.address2}
          onChange={handleInputChange}
          className="w-full px-4 py-2.5 rounded-lg border border-border-brand bg-bg-cream/20 text-sm focus:outline-none focus:border-primary"
          placeholder="Apartment, suite, unit, building, floor, etc."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-text-dark/70 uppercase tracking-wider mb-1">
            {country === "UK" ? "Post Town (City)" : "City"}
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 rounded-lg border border-border-brand bg-bg-cream/20 text-sm focus:outline-none focus:border-primary"
            placeholder={country === "UK" ? "e.g., LONDON" : "e.g., Hyderabad"}
          />
          {errors.city && <p className="text-red-600 text-xs mt-1 font-medium">{errors.city}</p>}
        </div>

        {country !== "UK" ? (
          <div>
            <label className="block text-xs font-semibold text-text-dark/70 uppercase tracking-wider mb-1">
              State
            </label>
            <select
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-lg border border-border-brand bg-bg-cream/20 text-sm focus:outline-none focus:border-primary"
            >
              <option value="">Select State</option>
              {country === "IN"
                ? INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))
                : US_STATES.map((st) => (
                    <option key={st.code} value={st.code}>
                      {st.name}
                    </option>
                  ))}
            </select>
            {errors.state && <p className="text-red-600 text-xs mt-1 font-medium">{errors.state}</p>}
          </div>
        ) : (
          <div>
            <label className="block text-xs font-semibold text-text-dark/70 uppercase tracking-wider mb-1">
              County (Optional)
            </label>
            <input
              type="text"
              name="county"
              value={formData.county}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-lg border border-border-brand bg-bg-cream/20 text-sm focus:outline-none focus:border-primary"
              placeholder="e.g., Greater London"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-text-dark/70 uppercase tracking-wider mb-1">
            {country === "IN" ? "PIN Code" : country === "UK" ? "Postcode" : "ZIP Code"}
          </label>
          <input
            type="text"
            name="zip"
            value={formData.zip}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 rounded-lg border border-border-brand bg-bg-cream/20 text-sm focus:outline-none focus:border-primary"
            placeholder={country === "IN" ? "6 digits" : country === "UK" ? "SW1A 1AA" : "5 digits"}
          />
          {errors.zip && <p className="text-red-600 text-xs mt-1 font-medium">{errors.zip}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-dark/70 uppercase tracking-wider mb-1">
            Country
          </label>
          <input
            type="text"
            readOnly
            value={country === "IN" ? "India" : country === "UK" ? "United Kingdom" : "United States"}
            className="w-full px-4 py-2.5 rounded-lg border border-border-brand bg-bg-cream/10 text-sm text-text-dark/50 cursor-not-allowed"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-3 px-4 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 mt-6 cursor-pointer hover:scale-[1.01]"
        id="submit-checkout-btn"
      >
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 2.8 1.4 4.8 1.4 5.5 0 10-4.5 10-10s-4.5-10-10-10-10 4.5-10 10c0 2 .5 3.5 1.4 5l-.9 3.3 3.3-.9zM16.5 13.5c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.8.9-.1.2-.3.2-.5.1-.9-.4-1.7-.8-2.4-1.5-.5-.5-.9-1.1-1.1-1.4-.2-.3 0-.4.1-.5.1-.1.2-.3.3-.4.1-.1.1-.2.2-.3.1-.2 0-.3-.1-.4-.2-.5-.8-2-.9-2.3-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.5.1-.8.4-.3.3-1.1 1-1.1 2.5s1.1 2.9 1.2 3.1c.1.2 2.2 3.4 5.3 4.7.7.3 1.3.5 1.8.7.8.2 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.3.2-1.5-.1-.2-.3-.3-.6-.4z" />
        </svg>
        <span>Send Order to WhatsApp</span>
      </button>
    </form>
  );
};
