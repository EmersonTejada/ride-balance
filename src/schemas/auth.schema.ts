import * as z from "zod";

export const loginSchema = z.object({
  email: z
    .email("Debe ingresar un email valido")
    .transform((val) => val.toLowerCase().trim()),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export const signUpSchema = z
  .object({
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
