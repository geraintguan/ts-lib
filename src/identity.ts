/**
 * Returns the value it is called with.
 * 
 * @remarks
 * This function is useful when you want to explicitly pass a function as a
 * callback that always returns the value it is called with.
 * 
 * It is functionally equivalent to writing an anonymous function that returns
 * it's first argument, but can sometimes make your code more readable.
 * 
 * For example both of these expressions are functionally equivalent:
 * 
 * ```typescript
 * [1, 2, 3].map(v => v);
 * 
 * [1, 2, 3].map(identity);
 * ```
 * @param value - The value to return.
 *
 * @returns The value the function was called with.
 */
export function identity<T>(value: T): T {
  return value;
}
