/**
 * Global Validation Utilities
 */

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

/**
 * Validates whether the given string is a valid email format.
 */
export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  return EMAIL_REGEX.test(email.trim());
};

export interface PasswordValidationResult {
  readonly isValid: boolean;
  readonly message?: string;
}

/**
 * Validates password strength (min 6 characters, contains letter & number).
 */
export const isValidPassword = (password: string, minLength = 6): PasswordValidationResult => {
  if (!password || typeof password !== 'string') {
    return { isValid: false, message: 'Password is required' };
  }

  if (password.length < minLength) {
    return {
      isValid: false,
      message: `Password must be at least ${minLength} characters long`,
    };
  }

  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (!hasLetter || !hasNumber) {
    return {
      isValid: false,
      message: 'Password must contain at least one letter and one number',
    };
  }

  return { isValid: true };
};

/**
 * Validates that string is not empty or whitespace-only.
 */
export const isNotEmpty = (value: string | null | undefined): boolean => {
  return typeof value === 'string' && value.trim().length > 0;
};
