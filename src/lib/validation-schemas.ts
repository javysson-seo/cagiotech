import { z } from 'zod';

// Common validation patterns
const phoneRegex = /^\+?[0-9]{9,15}$/;
const positiveNumber = z.number().positive('Deve ser um número positivo');
const optionalEmail = z.string().email('Email inválido').max(255).optional().or(z.literal(''));

// Athlete validation schema
export const athleteSchema = z.object({
  name: z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100, 'Nome muito longo'),
  email: z.string().email('Email inválido').max(255),
  phone: z.string().regex(phoneRegex, 'Telefone inválido').optional().or(z.literal('')),
  birth_date: z.string().optional(),
  address: z.string().max(500, 'Endereço muito longo').optional(),
  city: z.string().max(100).optional(),
  postal_code: z.string().max(20).optional(),
  nif: z.string().max(20).optional(),
  citizen_card: z.string().max(20).optional(),
  emergency_contact_name: z.string().max(100).optional(),
  emergency_contact_phone: z.string().regex(phoneRegex, 'Telefone de emergência inválido').optional().or(z.literal('')),
  emergency_contact_relationship: z.string().max(50).optional(),
  monthly_fee: z.number().min(0, 'Valor não pode ser negativo').max(10000, 'Valor muito alto').optional(),
  payment_day: z.number().int().min(1).max(31).optional(),
  trainer: z.string().max(100).optional(),
  status: z.enum(['active', 'inactive', 'suspended']).optional(),
  membership_start: z.string().optional(),
  membership_end: z.string().optional(),
  medical_notes: z.string().max(2000, 'Notas médicas muito longas').optional(),
  health_conditions: z.string().max(1000).optional(),
  medication: z.string().max(500).optional(),
  goals: z.array(z.string().max(200)).optional(),
  tags: z.array(z.string().max(50)).optional(),
  notes: z.string().max(2000, 'Notas muito longas').optional(),
});

// Trainer validation schema
export const trainerSchema = z.object({
  name: z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100, 'Nome muito longo'),
  email: optionalEmail,
  phone: z.string().regex(phoneRegex, 'Telefone inválido').optional().or(z.literal('')),
  birth_date: z.string().optional(),
  specialties: z.array(z.string().max(100)).optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

// Staff validation schema
export const staffSchema = z.object({
  name: z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100, 'Nome muito longo'),
  email: optionalEmail,
  phone: z.string().regex(phoneRegex, 'Telefone inválido').optional().or(z.literal('')),
  birth_date: z.string().optional(),
  position: z.string().max(100).optional(),
  department: z.string().max(100).optional(),
  hire_date: z.string().optional(),
  salary: z.number().min(0, 'Salário não pode ser negativo').max(1000000).optional(),
});

// Financial transaction validation schema
export const financialTransactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  category: z.string().trim().min(2, 'Categoria obrigatória').max(100),
  amount: z.number().positive('Valor deve ser positivo').max(1000000, 'Valor muito alto'),
  transaction_date: z.string().min(1, 'Data obrigatória'),
  description: z.string().trim().min(2, 'Descrição obrigatória').max(500, 'Descrição muito longa'),
  payment_method: z.string().max(50).optional(),
  status: z.enum(['completed', 'pending', 'cancelled']).optional(),
  notes: z.string().max(1000).optional(),
});

// Class validation schema
export const classSchema = z.object({
  title: z.string().trim().min(2, 'Título obrigatório').max(200),
  description: z.string().max(1000).optional(),
  modality_id: z.string().uuid('Modalidade inválida'),
  room_id: z.string().uuid().optional(),
  trainer_id: z.string().uuid().optional(),
  date: z.string().min(1, 'Data obrigatória'),
  start_time: z.string().min(1, 'Hora de início obrigatória'),
  end_time: z.string().min(1, 'Hora de fim obrigatória'),
  max_capacity: z.number().int().positive('Capacidade deve ser positiva').max(500),
  status: z.enum(['scheduled', 'ongoing', 'completed', 'cancelled']).optional(),
  notes: z.string().max(1000).optional(),
});

// Subscription plan validation schema
export const subscriptionPlanSchema = z.object({
  name: z.string().trim().min(2, 'Nome obrigatório').max(100),
  description: z.string().max(500).optional(),
  price: z.number().positive('Preço deve ser positivo').max(10000),
  billing_period: z.enum(['monthly', 'quarterly', 'yearly']),
  currency: z.string().length(3, 'Código de moeda inválido').optional(),
  max_classes_per_week: z.number().int().positive().max(100).optional(),
  features: z.array(z.string().max(200)).optional(),
  is_active: z.boolean().optional(),
});

// Payment validation schema
export const paymentSchema = z.object({
  athlete_id: z.string().uuid('Atleta inválido'),
  amount: z.number().positive('Valor deve ser positivo').max(100000),
  due_date: z.string().min(1, 'Data de vencimento obrigatória'),
  paid_date: z.string().optional(),
  status: z.enum(['pending', 'paid', 'overdue', 'cancelled']),
  payment_method: z.string().max(50).optional(),
  plan_name: z.string().max(100).optional(),
  notes: z.string().max(1000).optional(),
});

// Modality validation schema
export const modalitySchema = z.object({
  name: z.string().trim().min(2, 'Nome obrigatório').max(100),
  description: z.string().max(500).optional(),
  duration_minutes: z.number().int().positive('Duração deve ser positiva').max(480).optional(),
  max_capacity: z.number().int().positive().max(500).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida').optional(),
  requires_booking: z.boolean().optional(),
  is_active: z.boolean().optional(),
});

// Room validation schema
export const roomSchema = z.object({
  name: z.string().trim().min(2, 'Nome obrigatório').max(100),
  description: z.string().max(500).optional(),
  capacity: z.number().int().positive('Capacidade deve ser positiva').max(1000),
  floor: z.string().max(50).optional(),
  amenities: z.array(z.string().max(100)).optional(),
  is_active: z.boolean().optional(),
});
