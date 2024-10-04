/**
 * Utility type that returns the element type of an array type.
 * 
 * @example Get type of element in an array type
 * ```typescript
 * type Elements = (string | number)[];
 * 
 * type Element = Unpack<Elements> // (string | number)
 * ```
 */
export type Unpack<T> = T extends (infer U)[] ? U : T;