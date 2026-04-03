export interface CurrencyRate {
  code: string;
  name: string;
  flag: string;
  countryCode: string;
  buy: string;
  sell: string;
}

export interface AppState {
  currencies: CurrencyRate[];
  lastUpdated: string;
  adminPassword: string;
  companyName: string;
  videoUrl?: string;
}

const STORAGE_KEY = "needhi_forex_v2";

const DEFAULT_STATE: AppState = {
  currencies: [
    { code: "USD", name: "US DOLLAR", flag: "🇺🇸", countryCode: "us", buy: "6149", sell: "9988" },
    { code: "EUR", name: "EURO", flag: "🇪🇺", countryCode: "eu", buy: "8565", sell: "" },
    { code: "AED", name: "UAE DIRHAM", flag: "🇦🇪", countryCode: "ae", buy: "7654", sell: "" },
    { code: "GBP", name: "POUND STERLING", flag: "🇬🇧", countryCode: "gb", buy: "1119", sell: "13195" },
  ],
  lastUpdated: new Date().toISOString(),
  adminPassword: "admin123",
  companyName: "AFC BANK",
};

export function loadState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && Array.isArray(parsed.currencies)) return parsed;
    }
  } catch {}
  return { ...DEFAULT_STATE, currencies: DEFAULT_STATE.currencies.map(c => ({ ...c })) };
}

export function saveState(state: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, lastUpdated: new Date().toISOString() }));
}

export function formatWithCommas(val: string): string {
  const parts = val.replace(/[^0-9.]/g, "").split(".");
  let intPart = parts[0];
  if (!intPart && parts.length === 1) return "—";
  intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (parts.length > 1) {
    return `${intPart}.${parts[1]}`;
  }
  return intPart;
}

export function formatWithSpaces(val: string): string {
  const parts = val.replace(/[^0-9.]/g, "").split(".");
  let intPart = parts[0];
  if (!intPart && parts.length === 1) return "—";
  intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  if (parts.length > 1) {
    return `${intPart}.${parts[1]}`;
  }
  return intPart;
}
