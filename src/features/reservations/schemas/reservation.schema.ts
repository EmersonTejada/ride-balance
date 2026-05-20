import { z } from "zod";

export const reservationSchema = z.object({
  clientName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  phone: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha debe tener formato YYYY-MM-DD"),
  from: z.string().optional(),
  to: z.string().optional(),
  notes: z.string().optional(),
});

export type ReservationFormData = z.infer<typeof reservationSchema>;