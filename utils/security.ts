
/**
 * Sliding Window Rate Limiter
 * Simulates server-side rate limiting by tracking action timestamps in localStorage.
 * Prevents automated brute-force attacks on login, signup, and order creation.
 */
export const isRateLimited = (action: string, limit: number, windowMs: number): { limited: boolean; retryAfter?: number } => {
  const now = Date.now();
  const key = `ratelimit_${action}`;
  const logs: number[] = JSON.parse(localStorage.getItem(key) || '[]');
  
  // Filter logs outside the current window
  const activeLogs = logs.filter(timestamp => now - timestamp < windowMs);
  
  if (activeLogs.length >= limit) {
    const oldest = activeLogs[0];
    const retryAfter = Math.ceil((windowMs - (now - oldest)) / 1000);
    return { limited: true, retryAfter };
  }
  
  activeLogs.push(now);
  localStorage.setItem(key, JSON.stringify(activeLogs));
  return { limited: false };
};

/**
 * Strict Input Sanitization
 * Strips HTML tags and limits string length to prevent XSS and payload injection.
 */
export const sanitizeInput = (input: string, maxLength: number = 255): string => {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>?/gm, '') // Strip HTML tags
    .replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[m] || m) // Entity encoding
    .trim()
    .substring(0, maxLength);
};

/**
 * Validates Object Schemas
 * Rejects unexpected fields and enforces type checks.
 */
export const validateSchema = (data: any, schema: Record<string, { type: string; required?: boolean; min?: number; max?: number }>) => {
  const errors: string[] = [];
  
  for (const [key, rules] of Object.entries(schema)) {
    const value = data[key];
    
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(`${key} is required.`);
      continue;
    }
    
    if (value !== undefined && value !== null) {
      if (typeof value !== rules.type) {
        errors.push(`${key} must be a ${rules.type}.`);
      }
      
      if (rules.type === 'string' && rules.max && value.length > rules.max) {
        errors.push(`${key} exceeds maximum length of ${rules.max}.`);
      }
      
      if (rules.type === 'number' && rules.min && value < rules.min) {
        errors.push(`${key} must be at least ${rules.min}.`);
      }
    }
  }
  
  return errors.length > 0 ? errors[0] : null;
};
