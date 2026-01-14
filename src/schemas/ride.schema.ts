import * as z from "zod";

export const rideSchema = z.object({
  amount: z
    .number()
    .min(0.01, "El monto debe ser mayor a 0"),
  platform: z.enum(["yummy", "ridery", "particular"], {
    message: "Plataforma inválida",
  }),
});