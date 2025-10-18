/**
 * Security utilities for the application
 */

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  global: { requests: 100, windowMs: 60000 }, // 100 req/min
  login: { requests: 5, windowMs: 900000 }, // 5 req/15min
  api: { requests: 50, windowMs: 60000 }, // 50 req/min
  upload: { requests: 10, windowMs: 60000 }, // 10 req/min
};

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();

  check(key: string, config: { requests: number; windowMs: number }): boolean {
    const now = Date.now();
    const entry = this.limits.get(key);

    if (!entry || now > entry.resetTime) {
      this.limits.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
      });
      return true;
    }

    if (entry.count >= config.requests) {
      return false;
    }

    entry.count++;
    return true;
  }

  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.limits.entries()) {
      if (now > entry.resetTime) {
        this.limits.delete(key);
      }
    }
  }
}

export const rateLimiter = new RateLimiter();

// Cleanup rate limiter every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => rateLimiter.cleanup(), 300000);
}

export const checkRateLimit = (
  identifier: string,
  type: keyof typeof RATE_LIMIT_CONFIG = 'global'
): boolean => {
  const config = RATE_LIMIT_CONFIG[type];
  return rateLimiter.check(`${type}:${identifier}`, config);
};

/**
 * Sanitize user input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (Portuguese format)
 */
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(\+351)?[29]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate NIF (Portuguese tax ID)
 */
export const validateNIF = (nif: string): boolean => {
  if (!/^\d{9}$/.test(nif)) return false;
  
  const checkDigit = parseInt(nif.charAt(8));
  let sum = 0;
  
  for (let i = 0; i < 8; i++) {
    sum += parseInt(nif.charAt(i)) * (9 - i);
  }
  
  const mod = sum % 11;
  const expectedCheckDigit = mod === 0 || mod === 1 ? 0 : 11 - mod;
  
  return checkDigit === expectedCheckDigit;
};

/**
 * Validate file upload
 */
export const validateFileUpload = (
  file: File,
  options: {
    maxSizeBytes?: number;
    allowedTypes?: string[];
  } = {}
): { valid: boolean; error?: string } => {
  const { maxSizeBytes = 5 * 1024 * 1024, allowedTypes = [] } = options;

  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `Arquivo muito grande. Tamanho máximo: ${maxSizeBytes / 1024 / 1024}MB`,
    };
  }

  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Tipo de arquivo não permitido. Tipos aceitos: ${allowedTypes.join(', ')}`,
    };
  }

  return { valid: true };
};

/**
 * Generate secure random token
 */
export const generateSecureToken = (length: number = 32): string => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Hash data using SHA-256
 */
export const hashData = async (data: string): Promise<string> => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Security event logger
 */
export const logSecurityEvent = (
  event: string,
  details: Record<string, any>
) => {
  console.warn('[SECURITY EVENT]', event, {
    timestamp: new Date().toISOString(),
    ...details,
  });
  
  // In production, send to monitoring service
  if (import.meta.env.PROD) {
    // TODO: Integrate with Sentry or similar
  }
};
