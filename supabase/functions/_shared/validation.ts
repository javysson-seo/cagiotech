import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

/**
 * Validation schemas for edge functions
 */

// Portuguese phone number: +351 or 9XXXXXXXX / 2XXXXXXXX
const phoneRegex = /^(\+351)?[29]\d{8}$/;

// Portuguese NIF
const nifRegex = /^\d{9}$/;

// Name validation (letters, spaces, hyphens, apostrophes, accents)
const nameRegex = /^[a-zA-ZÀ-ÿ\s'\-]+$/;

export const publicAthleteRegistrationSchema = z.object({
  name: z.string()
    .trim()
    .min(2, "Nome deve ter no mínimo 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .regex(nameRegex, "Nome contém caracteres inválidos"),
  
  email: z.string()
    .trim()
    .email("Email inválido")
    .max(255, "Email muito longo")
    .toLowerCase(),
  
  birth_date: z.string()
    .datetime({ message: "Data de nascimento inválida" })
    .refine(dateStr => {
      const date = new Date(dateStr);
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      return age >= 10 && age <= 120;
    }, { message: "Data de nascimento inválida (idade deve estar entre 10 e 120 anos)" }),
  
  phone: z.string()
    .regex(phoneRegex, "Telefone inválido")
    .optional()
    .or(z.literal('')),
  
  company_id: z.string().uuid("ID da empresa inválido"),
});

export const athleteCreationSchema = z.object({
  athleteData: z.object({
    name: z.string()
      .trim()
      .min(2, "Nome deve ter no mínimo 2 caracteres")
      .max(100, "Nome deve ter no máximo 100 caracteres")
      .regex(nameRegex, "Nome contém caracteres inválidos"),
    
    email: z.string()
      .trim()
      .email("Email inválido")
      .max(255, "Email muito longo")
      .toLowerCase(),
    
    birth_date: z.string()
      .datetime({ message: "Data de nascimento inválida" }),
    
    phone: z.string()
      .regex(phoneRegex, "Telefone inválido")
      .optional()
      .or(z.literal('')),
    
    company_id: z.string().uuid("ID da empresa inválido"),
    
    nif: z.string()
      .regex(nifRegex, "NIF inválido")
      .optional()
      .or(z.literal('')),
    
    address: z.string().max(500, "Endereço muito longo").optional(),
    medical_notes: z.string().max(2000, "Notas médicas muito longas").optional(),
    emergency_contact_name: z.string().max(100).optional(),
    emergency_contact_phone: z.string().regex(phoneRegex).optional().or(z.literal('')),
  }),
  athleteId: z.string().uuid().optional(),
});

export const staffCreationSchema = z.object({
  staffData: z.object({
    name: z.string()
      .trim()
      .min(2, "Nome deve ter no mínimo 2 caracteres")
      .max(100, "Nome deve ter no máximo 100 caracteres")
      .regex(nameRegex, "Nome contém caracteres inválidos"),
    
    email: z.string()
      .trim()
      .email("Email inválido")
      .max(255, "Email muito longo")
      .toLowerCase(),
    
    birth_date: z.string()
      .datetime({ message: "Data de nascimento inválida" }),
    
    phone: z.string()
      .regex(phoneRegex, "Telefone inválido")
      .optional()
      .or(z.literal('')),
    
    company_id: z.string().uuid("ID da empresa inválido"),
    
    nif: z.string()
      .regex(nifRegex, "NIF inválido")
      .optional()
      .or(z.literal('')),
    
    position: z.string().max(100).optional(),
    department: z.string().max(100).optional(),
  }),
});

export const verifyCodeSchema = z.object({
  email: z.string()
    .trim()
    .email("Email inválido")
    .max(255, "Email muito longo")
    .toLowerCase(),
  
  code: z.string()
    .length(6, "Código deve ter 6 dígitos")
    .regex(/^\d{6}$/, "Código deve conter apenas números"),
  
  password: z.string()
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .max(100, "Senha muito longa")
    .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "Senha deve conter pelo menos um número"),
});

export const passwordResetSchema = z.object({
  email: z.string()
    .trim()
    .email("Email inválido")
    .max(255, "Email muito longo")
    .toLowerCase(),
  
  code: z.string()
    .length(6, "Código deve ter 6 dígitos")
    .regex(/^\d{6}$/, "Código deve conter apenas números"),
  
  new_password: z.string()
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .max(100, "Senha muito longa")
    .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "Senha deve conter pelo menos um número"),
});
