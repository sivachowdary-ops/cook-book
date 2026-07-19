export type CountryCode = "IN" | "UK" | "US";

export interface ExchangeRates {
  gbp: number; // e.g., 125
  usd: number; // e.g., 95
}

export const DEFAULT_RATES: ExchangeRates = {
  gbp: 125,
  usd: 95,
};

/**
 * Apply the client's custom charm pricing algorithm:
 * - decimal <= 0.32 -> whole + 0.49
 * - decimal <= 0.74 -> whole + 0.99
 * - decimal > 0.74  -> (whole + 1) + 0.49
 */
export function applyCharmPricing(rawValue: number): number {
  const whole = Math.floor(rawValue);
  const decimal = rawValue - whole;

  if (decimal <= 0.32) {
    return whole + 0.49;
  } else if (decimal <= 0.74) {
    return whole + 0.99;
  } else {
    return whole + 1 + 0.49;
  }
}

/**
 * Converts price from INR to target country's currency.
 */
export function convertPrice(
  basePriceINR: number,
  country: CountryCode,
  rates: ExchangeRates = DEFAULT_RATES
): number {
  if (country === "IN") {
    return basePriceINR; // Keep full-rupee values for India
  }
  const rate = country === "UK" ? rates.gbp : rates.usd;
  const raw = basePriceINR / rate;
  return applyCharmPricing(raw);
}

/**
 * Formats a currency value with its appropriate symbol.
 */
export function formatPrice(value: number, country: CountryCode): string {
  if (country === "IN") {
    return `₹${Math.round(value)}`;
  }
  const symbol = country === "UK" ? "£" : "$";
  return `${symbol}${value.toFixed(2)}`;
}
