/**
 * Validation utilities and common validation patterns
 * Extracted from room validators, item validators, and other validation logic
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ValidationRule<T> {
  name: string;
  validate: (value: T) => ValidationResult;
}

/**
 * Base validator class for consistent validation patterns
 */
export class BaseValidator<T> {
  protected rules: ValidationRule<T>[] = [];

  addRule(rule: ValidationRule<T>): this {
    this.rules.push(rule);
    return this;
  }

  validate(value: T): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
    };

    for (const rule of this.rules) {
      const ruleResult = rule.validate(value);
      result.errors.push(...ruleResult.errors);
      result.warnings.push(...ruleResult.warnings);
      
      if (!ruleResult.isValid) {
        result.isValid = false;
      }
    }

    return result;
  }

  validateBatch(values: T[]): ValidationResult[] {
    return values.map(value => this.validate(value));
  }
}

/**
 * Common validation rules
 */
export const ValidationRules = {
  required: <T>(fieldName: string): ValidationRule<T> => ({
    name: `required-${fieldName}`,
    validate: (value: T) => ({
      isValid: value != null && value !== '',
      errors: value == null || value === '' ? [`${fieldName} is required`] : [],
      warnings: [],
    }),
  }),

  stringLength: (fieldName: string, min?: number, max?: number): ValidationRule<string> => ({
    name: `string-length-${fieldName}`,
    validate: (value: string) => {
      const errors: string[] = [];
      if (min !== undefined && value.length < min) {
        errors.push(`${fieldName} must be at least ${min} characters`);
      }
      if (max !== undefined && value.length > max) {
        errors.push(`${fieldName} must be no more than ${max} characters`);
      }
      return {
        isValid: errors.length === 0,
        errors,
        warnings: [],
      };
    },
  }),

  arrayNotEmpty: <T>(fieldName: string): ValidationRule<T[]> => ({
    name: `array-not-empty-${fieldName}`,
    validate: (value: T[]) => ({
      isValid: Array.isArray(value) && value.length > 0,
      errors: !Array.isArray(value) || value.length === 0 ? [`${fieldName} must not be empty`] : [],
      warnings: [],
    }),
  }),

  objectHasKeys: (fieldName: string, requiredKeys: string[]): ValidationRule<Record<string, any>> => ({
    name: `object-has-keys-${fieldName}`,
    validate: (value: Record<string, any>) => {
      const errors: string[] = [];
      const missingKeys = requiredKeys.filter(key => !(key in value));
      if (missingKeys.length > 0) {
        errors.push(`${fieldName} missing required keys: ${missingKeys.join(', ')}`);
      }
      return {
        isValid: errors.length === 0,
        errors,
        warnings: [],
      };
    },
  }),

  uniqueArray: <T>(fieldName: string, keyFn?: (item: T) => string): ValidationRule<T[]> => ({
    name: `unique-array-${fieldName}`,
    validate: (value: T[]) => {
      const seen = new Set<string>();
      const duplicates: string[] = [];
      
      for (const item of value) {
        const key = keyFn ? keyFn(item) : String(item);
        if (seen.has(key)) {
          duplicates.push(key);
        } else {
          seen.add(key);
        }
      }
      
      return {
        isValid: duplicates.length === 0,
        errors: duplicates.length > 0 ? [`${fieldName} contains duplicates: ${duplicates.join(', ')}`] : [],
        warnings: [],
      };
    },
  }),

  range: (fieldName: string, min: number, max: number): ValidationRule<number> => ({
    name: `range-${fieldName}`,
    validate: (value: number) => {
      const errors: string[] = [];
      if (value < min) {
        errors.push(`${fieldName} must be at least ${min}`);
      }
      if (value > max) {
        errors.push(`${fieldName} must be no more than ${max}`);
      }
      return {
        isValid: errors.length === 0,
        errors,
        warnings: [],
      };
    },
  }),

  regex: (fieldName: string, pattern: RegExp, message?: string): ValidationRule<string> => ({
    name: `regex-${fieldName}`,
    validate: (value: string) => ({
      isValid: pattern.test(value),
      errors: pattern.test(value) ? [] : [message || `${fieldName} format is invalid`],
      warnings: [],
    }),
  }),
};

/**
 * ID validation patterns commonly used in the game
 */
export const IdValidation = {
  isValidRoomId: (id: string): boolean => /^[a-z][a-z0-9_]*$/.test(id),
  isValidItemId: (id: string): boolean => /^[a-z][a-z0-9_]*$/.test(id),
  isValidNpcId: (id: string): boolean => /^[a-z][a-z0-9_]*$/.test(id),
  isValidZoneId: (id: string): boolean => /^[a-z][a-z0-9_]*$/.test(id),
  
  getRoomIdRule: (fieldName = 'roomId'): ValidationRule<string> => ({
    name: `room-id-${fieldName}`,
    validate: (value: string) => ({
      isValid: IdValidation.isValidRoomId(value),
      errors: IdValidation.isValidRoomId(value) ? [] : [`${fieldName} must be lowercase with underscores only`],
      warnings: [],
    }),
  }),
};

/**
 * Game-specific validation helpers
 */
export const GameValidation = {
  validateExits: (exits: Record<string, string>): ValidationResult => {
    const result: ValidationResult = { isValid: true, errors: [], warnings: [] };
    const validDirections = ['north', 'south', 'east', 'west', 'northeast', 'northwest', 'southeast', 'southwest', 'up', 'down'];
    
    for (const [direction, target] of Object.entries(exits)) {
      if (!validDirections.includes(direction)) {
        result.errors.push(`Invalid direction: ${direction}`);
        result.isValid = false;
      }
      
      if (!IdValidation.isValidRoomId(target)) {
        result.errors.push(`Invalid room ID for ${direction}: ${target}`);
        result.isValid = false;
      }
    }
    
    return result;
  },

  validateInventory: (inventory: string[]): ValidationResult => {
    const result: ValidationResult = { isValid: true, errors: [], warnings: [] };
    
    // Check for duplicates
    const duplicates = inventory.filter((item, index) => inventory.indexOf(item) !== index);
    if (duplicates.length > 0) {
      result.errors.push(`Duplicate items in inventory: ${duplicates.join(', ')}`);
      result.isValid = false;
    }
    
    // Validate item IDs
    for (const itemId of inventory) {
      if (!IdValidation.isValidItemId(itemId)) {
        result.errors.push(`Invalid item ID: ${itemId}`);
        result.isValid = false;
      }
    }
    
    return result;
  },

  validateCoordinates: (coords: { x: number; y: number; z?: number }): ValidationResult => {
    const result: ValidationResult = { isValid: true, errors: [], warnings: [] };
    
    if (!Number.isInteger(coords.x) || !Number.isInteger(coords.y)) {
      result.errors.push('Coordinates must be integers');
      result.isValid = false;
    }
    
    if (coords.z !== undefined && !Number.isInteger(coords.z)) {
      result.errors.push('Z coordinate must be an integer');
      result.isValid = false;
    }
    
    return result;
  },
};

/**
 * Validation result aggregator for complex objects
 */
export class ValidationAggregator {
  private results: { field: string; result: ValidationResult }[] = [];

  add(field: string, result: ValidationResult): this {
    this.results.push({ field, result });
    return this;
  }

  addFieldValidation<T>(field: string, value: T, rules: ValidationRule<T>[]): this {
    const validator = new BaseValidator<T>();
    rules.forEach(rule => validator.addRule(rule));
    const result = validator.validate(value);
    return this.add(field, result);
  }

  getAggregatedResult(): ValidationResult {
    const allErrors: string[] = [];
    const allWarnings: string[] = [];
    let isValid = true;

    for (const { field, result } of this.results) {
      allErrors.push(...result.errors.map(error => `${field}: ${error}`));
      allWarnings.push(...result.warnings.map(warning => `${field}: ${warning}`));
      
      if (!result.isValid) {
        isValid = false;
      }
    }

    return {
      isValid,
      errors: allErrors,
      warnings: allWarnings,
    };
  }

  getFieldResults(): { field: string; result: ValidationResult }[] {
    return [...this.results];
  }

  clear(): this {
    this.results = [];
    return this;
  }
}

/**
 * Utility for validating object schemas
 */
export function validateObjectSchema<T extends Record<string, any>>(
  obj: T,
  schema: Record<keyof T, ValidationRule<any>[]>
): ValidationResult {
  const aggregator = new ValidationAggregator();
  
  for (const [field, rules] of Object.entries(schema) as Array<[keyof T, ValidationRule<any>[]]>) {
    const value = obj[field];
    aggregator.addFieldValidation(String(field), value, rules);
  }
  
  return aggregator.getAggregatedResult();
}

/**
 * Type-safe validation builder
 */
export class ValidationBuilder<T> {
  private rules: ValidationRule<T>[] = [];

  required(fieldName: string): this {
    this.rules.push(ValidationRules.required(fieldName));
    return this;
  }

  custom(name: string, validateFn: (value: T) => boolean | string): this {
    this.rules.push({
      name,
      validate: (value: T) => {
        const result = validateFn(value);
        if (typeof result === 'boolean') {
          return {
            isValid: result,
            errors: result ? [] : [`Validation failed for ${name}`],
            warnings: [],
          };
        } else {
          return {
            isValid: false,
            errors: [result],
            warnings: [],
          };
        }
      },
    });
    return this;
  }

  build(): BaseValidator<T> {
    const validator = new BaseValidator<T>();
    this.rules.forEach(rule => validator.addRule(rule));
    return validator;
  }
}
