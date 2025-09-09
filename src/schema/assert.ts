import { ZodError } from 'zod';

/**
 * Type-safe assertion helper that provides clear error messages
 */
export function assert<T>(
  value: unknown,
  schema: { parse: (value: unknown) => T },
  context?: string,
): asserts value is T {
  try {
    schema.parse(value);
  } catch (error) {
    if (error instanceof ZodError) {
      const contextMsg = context ? ` (${context})` : '';
      const errorMsg = `Invalid data structure${contextMsg}: ${error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join(', ')}`;
      throw new Error(errorMsg);
    }
    throw error;
  }
}

/**
 * Safe parsing that returns success/error result instead of throwing
 */
export function safeParse<T>(
  value: unknown,
  schema: { safeParse: (value: unknown) => { success: boolean; data?: T; error?: ZodError } },
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(value);

  if (result.success) {
    return { success: true, data: result.data! };
  }

  return {
    success: false,
    error: result
      .error!.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join(', '),
  };
}

/**
 * Guard function for runtime type checking
 */
export function isValid<T>(
  value: unknown,
  schema: { safeParse: (value: unknown) => { success: boolean; data?: T } },
): value is T {
  return schema.safeParse(value).success;
}
