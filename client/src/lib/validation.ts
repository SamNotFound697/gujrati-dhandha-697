import { z } from 'zod';

// Client-side validation utilities
export const emailSchema = z.string().email("Invalid email format").max(255);

export const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be less than 128 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
  );

export const usernameSchema = z.string()
  .min(3, "Username must be at least 3 characters")
  .max(50, "Username must be less than 50 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores");

export const fullNameSchema = z.string()
  .min(1, "Full name is required")
  .max(100, "Full name must be less than 100 characters")
  .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces");

// Sanitization utilities
export function sanitizeHtml(input: string): string {
  return input.replace(/[<>]/g, '');
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

// Credit card validation (for future payment integration)
export const creditCardSchema = z.object({
  number: z.string().regex(/^\d{13,19}$/, "Invalid credit card number"),
  expiryMonth: z.string().regex(/^(0[1-9]|1[0-2])$/, "Invalid expiry month"),
  expiryYear: z.string().regex(/^\d{4}$/, "Invalid expiry year"),
  cvv: z.string().regex(/^\d{3,4}$/, "Invalid CVV"),
});

// Address validation
export const addressSchema = z.object({
  street: z.string().min(1, "Street address is required").max(200),
  city: z.string().min(1, "City is required").max(100),
  state: z.string().min(1, "State is required").max(100),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code"),
  country: z.string().min(1, "Country is required").max(100),
});