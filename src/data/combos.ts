/*** Combo Offer — Data Model & Pricing ***/

// ─── Curated product ID lists (one per combo category) ─────────────

export const comboSweets = [
  "sweet-nuvvula-ariselu",
  "sweet-boondi-laddu",
  "sweet-rava-laddu",
  "sweet-gavvalu",
  "sweet-chitti-kaja",
] as const;

export const comboSnacks = [
  "snack-karabundi",
  "snack-chakodi",
  "snack-peanut-masala",
  "snack-biscuits",
  "snack-chakkalu",
] as const;

export const comboVegPickles = [
  "veg-aavakaya-pachadi",
  "veg-gongura-pachadi",
  "veg-coliflower-karam",
  "veg-allam-pachadi",
  "veg-lemon-pickle",
] as const;

export const comboNonVegPickles = [
  "nonveg-chicken-pickle",
  "nonveg-gongura-boti-pickle",
  "nonveg-fish-pickle",
  "nonveg-prawns-pickle",
  "nonveg-gongura-mutton-pickle",
] as const;

export const comboSpicyPowders = [
  "powder-palli-podi",
  "powder-karivepaku-podi",
  "powder-kandi-podi",
  "powder-nuvvula-podi",
  "powder-avisala-podi",
] as const;

// ─── Category metadata ─────────────────────────────────────────────

export interface ComboCategory {
  key: string;
  label: string;
  productIds: readonly string[];
  isVeg: boolean;
}

export const comboCategories: ComboCategory[] = [
  { key: "sweets", label: "Sweets", productIds: comboSweets, isVeg: true },
  { key: "snacks", label: "Snacks", productIds: comboSnacks, isVeg: true },
  { key: "veg-pickles", label: "Veg Pickles", productIds: comboVegPickles, isVeg: true },
  { key: "non-veg-pickles", label: "Non-Veg Pickles", productIds: comboNonVegPickles, isVeg: false },
  { key: "spicy-powders", label: "Spicy Powders", productIds: comboSpicyPowders, isVeg: true },
];

// ─── Fixed multi-currency pricing (bespoke, NOT auto-converted) ────

export type WeightTier = "halfKg" | "oneKg" | "twoKg";
export type CurrencyCode = "INR" | "GBP" | "USD";

export interface TierPrice {
  original: number;
  offer: number;
}

export const comboPricing: Record<WeightTier, Record<CurrencyCode, TierPrice>> = {
  halfKg: {
    INR: { original: 1625, offer: 1299 },
    GBP: { original: 14.23, offer: 11.38 },
    USD: { original: 17.98, offer: 14.38 },
  },
  oneKg: {
    INR: { original: 3250, offer: 2599 },
    GBP: { original: 28.45, offer: 22.76 },
    USD: { original: 35.95, offer: 28.76 },
  },
  twoKg: {
    INR: { original: 6500, offer: 5199 },
    GBP: { original: 56.90, offer: 45.52 },
    USD: { original: 71.90, offer: 57.52 },
  },
};

export const tierLabels: Record<WeightTier, string> = {
  halfKg: "½ kg",
  oneKg: "1 kg",
  twoKg: "2 kg",
};

// ─── Offer metadata ────────────────────────────────────────────────

export const offerMeta = {
  offerName: "Launch Offer",
  discountLabel: "20% OFF",
  startDate: "2026-08-01T00:00:00+05:30",
  endDate: "2026-08-09T23:59:59+05:30",
};

// ─── Offer status helper (IST-anchored) ────────────────────────────

export type OfferStatus = "upcoming" | "active" | "expired";

export function getOfferStatus(): OfferStatus {
  const now = Date.now();
  const start = new Date(offerMeta.startDate).getTime();
  const end = new Date(offerMeta.endDate).getTime();

  if (now < start) return "upcoming";
  if (now > end) return "expired";
  return "active";
}

export function getTimeRemaining(): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
} {
  const end = new Date(offerMeta.endDate).getTime();
  const totalMs = Math.max(0, end - Date.now());

  const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((totalMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((totalMs / (1000 * 60)) % 60);
  const seconds = Math.floor((totalMs / 1000) % 60);

  return { days, hours, minutes, seconds, totalMs };
}

// ─── Price formatting for combo (uses fixed prices, not convertPrice) ─

export function formatComboPrice(value: number, currency: CurrencyCode): string {
  if (currency === "INR") return `₹${Math.round(value)}`;
  const symbol = currency === "GBP" ? "£" : "$";
  return `${symbol}${value.toFixed(2)}`;
}

// Map country code to currency code
export function countryToCurrency(country: "IN" | "UK" | "US"): CurrencyCode {
  if (country === "IN") return "INR";
  if (country === "UK") return "GBP";
  return "USD";
}
