/**
 * Error sanitization utilities for edge functions
 * Maps internal database/system errors to user-friendly messages
 * Prevents exposing schema information to clients
 */

interface SanitizedError {
  message: string;
  code: string;
}

// Postgres error code mappings
const POSTGRES_ERROR_MAP: Record<string, SanitizedError> = {
  // Integrity Constraint Violations
  '23505': { message: 'Este registo já existe', code: 'DUPLICATE_ENTRY' },
  '23503': { message: 'Referência inválida', code: 'INVALID_REFERENCE' },
  '23502': { message: 'Campo obrigatório em falta', code: 'MISSING_REQUIRED' },
  '23514': { message: 'Valor inválido', code: 'CHECK_VIOLATION' },
  '23000': { message: 'Erro de integridade de dados', code: 'INTEGRITY_VIOLATION' },
  
  // Authentication/Authorization
  '42501': { message: 'Sem permissão para esta operação', code: 'PERMISSION_DENIED' },
  '28000': { message: 'Autenticação inválida', code: 'AUTH_FAILED' },
  '28P01': { message: 'Credenciais inválidas', code: 'INVALID_CREDENTIALS' },
  
  // Resource Issues
  '42P01': { message: 'Erro interno do servidor', code: 'INTERNAL_ERROR' },
  '42703': { message: 'Erro interno do servidor', code: 'INTERNAL_ERROR' },
  '42883': { message: 'Erro interno do servidor', code: 'INTERNAL_ERROR' },
  
  // Rate Limiting / Resource
  '53300': { message: 'Servidor ocupado. Tente novamente', code: 'SERVER_BUSY' },
  '57014': { message: 'Operação cancelada', code: 'CANCELLED' },
};

// Common error message patterns to sanitize
const ERROR_PATTERNS: Array<{ pattern: RegExp; sanitized: SanitizedError }> = [
  { pattern: /duplicate key/i, sanitized: { message: 'Este registo já existe', code: 'DUPLICATE_ENTRY' } },
  { pattern: /already been registered/i, sanitized: { message: 'Este email já está registrado', code: 'EMAIL_EXISTS' } },
  { pattern: /email_exists/i, sanitized: { message: 'Este email já está registrado', code: 'EMAIL_EXISTS' } },
  { pattern: /foreign key/i, sanitized: { message: 'Referência inválida', code: 'INVALID_REFERENCE' } },
  { pattern: /not null/i, sanitized: { message: 'Campo obrigatório em falta', code: 'MISSING_REQUIRED' } },
  { pattern: /permission denied/i, sanitized: { message: 'Sem permissão para esta operação', code: 'PERMISSION_DENIED' } },
  { pattern: /unauthorized/i, sanitized: { message: 'Não autorizado', code: 'UNAUTHORIZED' } },
  { pattern: /rate limit/i, sanitized: { message: 'Muitas tentativas. Tente mais tarde', code: 'RATE_LIMITED' } },
  { pattern: /timeout/i, sanitized: { message: 'Operação expirou. Tente novamente', code: 'TIMEOUT' } },
  { pattern: /connection/i, sanitized: { message: 'Erro de conexão. Tente novamente', code: 'CONNECTION_ERROR' } },
  { pattern: /invalid.*token/i, sanitized: { message: 'Sessão inválida. Faça login novamente', code: 'INVALID_TOKEN' } },
  { pattern: /jwt/i, sanitized: { message: 'Sessão expirada. Faça login novamente', code: 'SESSION_EXPIRED' } },
];

/**
 * Sanitizes error messages to prevent exposing internal details
 * @param error The original error (Error object or any)
 * @param logPrefix Prefix for server-side logging
 * @returns Sanitized error object safe for client response
 */
export function sanitizeError(
  error: unknown,
  logPrefix: string = 'Error'
): SanitizedError {
  // Log full error server-side for debugging
  console.error(`${logPrefix}:`, error);
  
  const defaultError: SanitizedError = { 
    message: 'Erro interno. Tente novamente', 
    code: 'INTERNAL_ERROR' 
  };
  
  if (!error) {
    return defaultError;
  }
  
  // Extract error message and code
  let errorMessage = '';
  let errorCode = '';
  
  if (error instanceof Error) {
    errorMessage = error.message;
    // Supabase/Postgres errors often have a code property
    errorCode = (error as any).code || '';
  } else if (typeof error === 'object' && error !== null) {
    errorMessage = (error as any).message || (error as any).error || String(error);
    errorCode = (error as any).code || '';
  } else {
    errorMessage = String(error);
  }
  
  // Check Postgres error codes first
  if (errorCode && POSTGRES_ERROR_MAP[errorCode]) {
    return POSTGRES_ERROR_MAP[errorCode];
  }
  
  // Check error message patterns
  for (const { pattern, sanitized } of ERROR_PATTERNS) {
    if (pattern.test(errorMessage)) {
      return sanitized;
    }
  }
  
  // If we can't identify the error, return generic message
  return defaultError;
}

/**
 * Creates a standardized error response for edge functions
 */
export function createErrorResponse(
  error: unknown,
  headers: Record<string, string>,
  logPrefix: string = 'Error',
  statusCode: number = 400
): Response {
  const sanitized = sanitizeError(error, logPrefix);
  
  return new Response(
    JSON.stringify({
      success: false,
      error: sanitized.message,
      code: sanitized.code,
    }),
    {
      status: statusCode,
      headers: { ...headers, 'Content-Type': 'application/json' },
    }
  );
}

/**
 * Generate a cryptographically secure verification code
 * @param length Code length (default: 6)
 * @returns Secure random numeric code
 */
export function generateSecureCode(length: number = 6): string {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  const code = (100000 + (array[0] % 900000)).toString();
  return code.padStart(length, '0');
}
