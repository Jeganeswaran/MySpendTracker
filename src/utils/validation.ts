/**
 * MySpendTracker — Validation
 * ---------------------------
 * Pure validators returning error messages or null.
 */

import { VALIDATION } from '@constants/config';

// ─────────────────────────────────────────────
// 1. RESULT TYPE
// ─────────────────────────────────────────────

export type ValidationResult = string | null;

// ─────────────────────────────────────────────
// 2. FIELD VALIDATORS
// ─────────────────────────────────────────────

export function validateAmount(value: number | string): ValidationResult {
  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (!value || Number.isNaN(num)) return 'Amount is required';
  if (num <= 0) return 'Amount must be greater than 0';
  if (num < VALIDATION.minAmount)
    return `Minimum amount is ${VALIDATION.minAmount}`;
  if (num > VALIDATION.maxAmount) return 'Amount is too large';

  return null;
}

export function validateTitle(value: string): ValidationResult {
  if (!value || value.trim().length === 0) return 'Title is required';
  if (value.trim().length > 60) return 'Title must be under 60 characters';
  return null;
}

export function validateNote(value: string): ValidationResult {
  if (value && value.length > VALIDATION.maxNoteLength) {
    return `Note must be under ${VALIDATION.maxNoteLength} characters`;
  }
  return null;
}

export function validateEmail(value: string): ValidationResult {
  if (!value) return 'Email is required';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(value)) return 'Invalid email address';
  return null;
}

export function validatePassword(value: string): ValidationResult {
  if (!value) return 'Password is required';
  if (value.length < VALIDATION.minPasswordLength) {
    return `Password must be at least ${VALIDATION.minPasswordLength} characters`;
  }
  if (!/[A-Z]/.test(value)) return 'Password must contain an uppercase letter';
  if (!/[0-9]/.test(value)) return 'Password must contain a number';
  return null;
}

export function validateRequired(
  value: string,
  fieldName = 'This field',
): ValidationResult {
  if (!value || value.trim().length === 0) return `${fieldName} is required`;
  return null;
}

export function validateDate(value: string): ValidationResult {
  if (!value) return 'Date is required';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return 'Invalid date';
  return null;
}

// ─────────────────────────────────────────────
// 3. FORM VALIDATOR
// ─────────────────────────────────────────────

export type ValidationSchema<T> = {
  [K in keyof T]?: (value: T[K]) => ValidationResult;
};

export type ValidationErrors<T> = Partial<Record<keyof T, string>>;

/**
 * Validate an entire form object against a schema.
 * @example
 *   const errors = validateForm({ amount: -5, title: '' }, {
 *     amount: validateAmount,
 *     title: validateTitle,
 *   });
 *   // → { amount: 'Amount must be greater than 0', title: 'Title is required' }
 */
export function validateForm<T extends Record<string, unknown>>(
  values: T,
  schema: ValidationSchema<T>,
): ValidationErrors<T> {
  const errors: ValidationErrors<T> = {};

  for (const key in schema) {
    const validator = schema[key];
    if (validator) {
      const error = validator(values[key]);
      if (error) errors[key] = error;
    }
  }

  return errors;
}

export function hasErrors<T>(errors: ValidationErrors<T>): boolean {
  return Object.keys(errors).length > 0;
}
