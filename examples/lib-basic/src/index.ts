/**
 * A simple utility library example
 */

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface CreateUserOptions {
  name: string;
  email: string;
}

/**
 * Creates a new user with auto-generated ID
 */
export function createUser(options: CreateUserOptions): User {
  return {
    id: Math.floor(Math.random() * 10000),
    name: options.name,
    email: options.email
  };
}

/**
 * Validates an email address
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Formats a user's display name
 */
export function formatUserName(user: User): string {
  return `${user.name} (${user.email})`;
}

/**
 * Utility functions for working with arrays
 */
export const arrayUtils = {
  /**
   * Removes duplicates from an array
   */
  unique<T>(array: T[]): T[] {
    return [...new Set(array)];
  },

  /**
   * Groups array items by a key function
   */
  groupBy<T, K extends string | number>(
    array: T[],
    keyFn: (item: T) => K
  ): Record<K, T[]> {
    return array.reduce((groups, item) => {
      const key = keyFn(item);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {} as Record<K, T[]>);
  },

  /**
   * Chunks an array into smaller arrays of specified size
   */
  chunk<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
};

// Default export
export default {
  createUser,
  validateEmail,
  formatUserName,
  arrayUtils
};