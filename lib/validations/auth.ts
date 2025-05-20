import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email({ message: "Veuillez saisir une adresse e-mail valide" }),
  password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
})

export const registerSchema = z
  .object({
    name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
    email: z.string().email({ message: "Veuillez saisir une adresse e-mail valide" }),
    phone: z.string().min(8, { message: "Le numéro de téléphone doit être valide" }),
    password: z.string()
      .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
      .regex(/[A-Z]/, { message: "Le mot de passe doit contenir au moins une lettre majuscule" })
      .regex(/[0-9]/, { message: "Le mot de passe doit contenir au moins un chiffre" }),
    password_confirmation: z.string(),
    role: z.string().optional(),
    business_name: z.string().optional(),
    industry: z.string().optional(),
    logo: z.any().optional(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Les mots de passe ne correspondent pas",
    path: ["password_confirmation"],
  })

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Veuillez saisir une adresse e-mail valide" }),
})

export const resetPasswordSchema = z
  .object({
    password: z.string()
      .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
      .regex(/[A-Z]/, { message: "Le mot de passe doit contenir au moins une lettre majuscule" })
      .regex(/[0-9]/, { message: "Le mot de passe doit contenir au moins un chiffre" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  })
