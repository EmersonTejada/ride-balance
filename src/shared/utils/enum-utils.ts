/**
 * Enum mappers for normalizing values between frontend (lowercase) and backend (PascalCase).
 */

// Platform mapping
export const PLATFORMS = ["yummy", "ridery", "particular"] as const;

export type FrontendPlatform = (typeof PLATFORMS)[number];
export type BackendPlatform = "Yummy" | "Ridery" | "Particular";

export const toBackendPlatform = (platform: string): string => {
  const normalized = platform.toLowerCase();
  if (normalized === "yummy") return "Yummy";
  if (normalized === "ridery") return "Ridery";
  if (normalized === "particular") return "Particular";
  // Default: PascalCase
  return platform.charAt(0).toUpperCase() + platform.slice(1);
};

export const toFrontendPlatform = (platform: string): string => {
  return platform.toLowerCase();
};

// Expense category mapping
export const EXPENSE_CATEGORIES = [
  "fuel",
  "maintenance",
  "parking",
  "toll",
  "food",
  "phone",
  "other",
] as const;

export type FrontendExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export const toBackendCategory = (category: string): string => {
  return category.charAt(0).toUpperCase() + category.slice(1);
};

export const toFrontendCategory = (category: string): string => {
  return category.toLowerCase();
};

// Expense subcategory mapping
export const EXPENSE_SUBCATEGORIES = [
  "gasolina",
  "diesel",
  "electrico",
  "aceite",
  "llantas",
  "bateria",
  "filtros",
  "frenos",
  "carwash",
  "estacionamiento",
  "peaje",
  "caseta",
  "almuerzo",
  "cena",
  "snack",
  "sim",
  "datos",
  "otro",
] as const;

export type FrontendExpenseSubcategory = (typeof EXPENSE_SUBCATEGORIES)[number];

export const toBackendSubcategory = (subcategory: string): string => {
  return subcategory.toLowerCase();
};

export const toFrontendSubcategory = (subcategory: string): string => {
  return subcategory.toLowerCase();
};