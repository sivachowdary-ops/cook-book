"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CountryCode, ExchangeRates, DEFAULT_RATES } from "@/lib/pricing";
import { supabase } from "@/lib/supabase";

interface CountryContextProps {
  country: CountryCode;
  setCountry: (country: CountryCode) => void;
  rates: ExchangeRates;
  setRates: (rates: ExchangeRates) => void;
  syncRatesFromSupabase: () => Promise<void>;
}

const CountryContext = createContext<CountryContextProps | undefined>(undefined);

export const CountryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [country, setCountryState] = useState<CountryCode>("IN");
  const [rates, setRatesState] = useState<ExchangeRates>(DEFAULT_RATES);
  const [hydrated, setHydrated] = useState(false);

  const syncRatesFromSupabase = async () => {
    try {
      const { data, error } = await supabase.from("rates").select("*");
      if (error) {
        throw error;
      }
      if (data && data.length > 0) {
        const gbp = data.find((r) => r.currency === "GBP")?.rate || DEFAULT_RATES.gbp;
        const usd = data.find((r) => r.currency === "USD")?.rate || DEFAULT_RATES.usd;
        const fetchedRates = { gbp, usd };
        setRatesState(fetchedRates);
        localStorage.setItem("cook_book_rates", JSON.stringify(fetchedRates));
      }
    } catch (err) {
      console.warn("Could not load exchange rates from Supabase, using local defaults:", err);
    }
  };

  useEffect(() => {
    // 1. Hydrate country from localStorage
    const savedCountry = localStorage.getItem("cook_book_country") as CountryCode;
    if (savedCountry && ["IN", "UK", "US"].includes(savedCountry)) {
      setCountryState(savedCountry);
    }

    // 2. Hydrate exchange rates from localStorage first
    const savedRates = localStorage.getItem("cook_book_rates");
    if (savedRates) {
      try {
        setRatesState(JSON.parse(savedRates));
      } catch (e) {
        console.error("Error loading rates from localStorage", e);
      }
    }

    // 3. Query Supabase to get the latest fresh exchange rates
    syncRatesFromSupabase().finally(() => {
      setHydrated(true);
    });
  }, []);

  const setCountry = (newCountry: CountryCode) => {
    setCountryState(newCountry);
    localStorage.setItem("cook_book_country", newCountry);
  };

  const setRates = async (newRates: ExchangeRates) => {
    setRatesState(newRates);
    localStorage.setItem("cook_book_rates", JSON.stringify(newRates));

    // Persist to Supabase
    try {
      const { error } = await supabase.from("rates").upsert([
        { currency: "GBP", rate: newRates.gbp },
        { currency: "USD", rate: newRates.usd },
      ]);
      if (error) throw error;
    } catch (err) {
      console.error("Failed to save rates to Supabase:", err);
    }
  };

  return (
    <CountryContext.Provider value={{ country, setCountry, rates, setRates, syncRatesFromSupabase }}>
      {children}
    </CountryContext.Provider>
  );
};

export const useCountry = () => {
  const context = useContext(CountryContext);
  if (!context) {
    throw new Error("useCountry must be used within a CountryProvider");
  }
  return context;
};
