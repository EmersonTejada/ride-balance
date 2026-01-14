import * as z from "zod";

export const loginSchema = z.object({
  email: z
    .email("Debe ingresar un email valido")
    .transform((val) => val.toLowerCase().trim()),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(1, "El nombre es requerido")
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(50, "El nombre no puede tener más de 50 caracteres")
      .transform((val) => val.trim()),
    email: z
      .email("Debe ingresar un email valido")
      .transform((val) => val.toLowerCase().trim()),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });
