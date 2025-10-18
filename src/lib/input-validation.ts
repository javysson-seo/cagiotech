import { z } from 'zod';

/**
 * Enhanced input validation schemas with security in mind
 */

// Common validators
export const emailSchema = z
  .string()
  .trim()
  .email({ message: 'Email inválido' })
  .max(255, { message: 'Email muito longo' })
  .toLowerCase();

export const phoneSchema = z
  .string()
  .trim()
  .regex(/^(\+351)?[29]\d{8}$/, { message: 'Número de telefone inválido' })
  .transform(val => val.replace(/\s/g, ''));

export const nifSchema = z
  .string()
  .trim()
  .regex(/^\d{9}$/, { message: 'NIF deve ter 9 dígitos' })
  .refine((nif) => {
    const checkDigit = parseInt(nif.charAt(8));
    let sum = 0;
    for (let i = 0; i < 8; i++) {
      sum += parseInt(nif.charAt(i)) * (9 - i);
    }
    const mod = sum % 11;
    const expectedCheckDigit = mod === 0 || mod === 1 ? 0 : 11 - mod;
    return checkDigit === expectedCheckDigit;
  }, { message: 'NIF inválido' });

export const passwordSchema = z
  .string()
  .min(8, { message: 'Password deve ter no mínimo 8 caracteres' })
  .max(128, { message: 'Password muito longa' })
  .regex(/[A-Z]/, { message: 'Password deve conter pelo menos uma letra maiúscula' })
  .regex(/[a-z]/, { message: 'Password deve conter pelo menos uma letra minúscula' })
  .regex(/[0-9]/, { message: 'Password deve conter pelo menos um número' })
  .regex(/[^A-Za-z0-9]/, { message: 'Password deve conter pelo menos um caractere especial' });

export const nameSchema = z
  .string()
  .trim()
  .min(2, { message: 'Nome muito curto' })
  .max(100, { message: 'Nome muito longo' })
  .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, { message: 'Nome contém caracteres inválidos' });

export const addressSchema = z
  .string()
  .trim()
  .max(500, { message: 'Endereço muito longo' });

export const postalCodeSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{3}$/, { message: 'Código postal inválido (formato: 0000-000)' });

// Athlete validation schema
export const athleteSchema = z.object({
  name: nameSchema,
  email: emailSchema.optional(),
  phone: phoneSchema.optional(),
  birth_date: z.string().optional(),
  address: addressSchema.optional(),
  nif: nifSchema.optional(),
  emergency_contact_name: nameSchema.optional(),
  emergency_contact_phone: phoneSchema.optional(),
  medical_notes: z.string().max(2000).optional(),
  notes: z.string().max(2000).optional(),
  goals: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

// User registration schema
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  name: nameSchema,
  company_name: z.string().trim().min(2).max(100).optional(),
  terms: z.boolean().refine(val => val === true, {
    message: 'Deve aceitar os termos de serviço',
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'As passwords não coincidem',
  path: ['confirmPassword'],
});

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: 'Password obrigatória' }),
});

// Financial transaction schema
export const transactionSchema = z.object({
  description: z.string().trim().min(1).max(500),
  amount: z.number().positive({ message: 'Valor deve ser positivo' }).finite(),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1),
  transaction_date: z.string(),
  payment_method: z.string().optional(),
  notes: z.string().max(1000).optional(),
});

// Class schema
export const classSchema = z.object({
  title: z.string().trim().min(1).max(200),
  date: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  max_capacity: z.number().int().positive().max(1000),
  description: z.string().max(2000).optional(),
  notes: z.string().max(1000).optional(),
}).refine(data => {
  // Validate that end_time is after start_time
  const [startHour, startMin] = data.start_time.split(':').map(Number);
  const [endHour, endMin] = data.end_time.split(':').map(Number);
  return (endHour * 60 + endMin) > (startHour * 60 + startMin);
}, {
  message: 'Horário de fim deve ser após horário de início',
  path: ['end_time'],
});

// Product schema
export const productSchema = z.object({
  name: z.string().trim().min(1).max(200),
  description: z.string().max(2000).optional(),
  price: z.number().positive().finite(),
  stock: z.number().int().nonnegative(),
  sku: z.string().trim().max(100).optional(),
  category: z.string().trim().max(100).optional(),
  min_stock: z.number().int().nonnegative().optional(),
});

// Event schema
export const eventSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().max(2000).optional(),
  event_date: z.string(),
  end_date: z.string().optional(),
  location: z.string().max(500).optional(),
  max_participants: z.number().int().positive().optional(),
  price: z.number().nonnegative().finite(),
});

/**
 * Sanitize HTML to prevent XSS
 */
export const sanitizeHtml = (dirty: string): string => {
  const div = document.createElement('div');
  div.textContent = dirty;
  return div.innerHTML;
};

/**
 * Validate and sanitize user input
 */
export const validateAndSanitize = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } => {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach(err => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { success: false, errors };
    }
    return { success: false, errors: { _general: 'Erro de validação' } };
  }
};
