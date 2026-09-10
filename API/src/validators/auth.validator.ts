import { z } from "zod";

const cameroonPhoneRegex = /^(?:\+237|237)?[2-9]\d{8}$/;

export const registerSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/(?=.*[A-Za-z])(?=.*\d)/, "Le mot de passe doit contenir au moins une lettre et un chiffre"),
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  phone: z
    .string()
    .trim()
    .regex(cameroonPhoneRegex, "Numéro de téléphone camerounais invalide (ex. +2376xxxxxxxx)"),
});

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export const updateProfileSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères").optional(),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères").optional(),
  phone: z
    .string()
    .trim()
    .regex(cameroonPhoneRegex, "Numéro de téléphone camerounais invalide (ex. +2376xxxxxxxx)")
    .optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;