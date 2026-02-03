import { z } from "zod";

export const expenseSchema = z.object({
  amount: z.number().min(0.01, "El monto debe ser mayor a 0"),
  category: z.enum([
    "fuel",
    "maintenance",
    "food",
    "insurance",
    "parking",
    "phone",
    "tolls",
    "other",
  ]),
  subcategory: z.enum([
    "fuel_refill",
    "oil_change",
    "oil_refill",
    "repair",
    "spare_part",
    "tire",
    "brake",
    "battery",
    "cleaning",
    "accessory",
    "unknown",
  ]).optional(),
  description: z.string().optional(),
  date: z.string().min(1, "La fecha es requerida"),
});

export type Expense = z.infer<typeof expenseSchema> & {
  id: string;
  userId: string;
};

export type NewExpense = z.infer<typeof expenseSchema>;

export type ExpenseFilters = {
  category?: string;
  from?: string;
  to?: string;
};
