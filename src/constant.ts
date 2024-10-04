
/**
 * Returns a function that when called always returns the given value.
 * 
 * @example
 * ```typescript
 * const nine = constant(9);
 * 
 * nine() // => 9
 * nine() // => 9
 * nine() // => 9
 * ```
 * 
 * @param value - The value that should be returned.
 * 
 * @returns A function that when called will always return the given value. 
 */
export function constant<T>(value: T): () => T {
  return () => value;
}