import { inspect } from "node:util";

import { identity } from "../identity.js";
class HashMapMissingKeyError<TKey, TValue, TSerializedKey> extends Error {
  public readonly key: TKey;
  public readonly map: HashMap<TKey, TValue, TSerializedKey>;

  constructor(map: HashMap<TKey, TValue, TSerializedKey>, key: TKey) {
    super(`Could not find key ${inspect(key)} in HashMap ${map.name}`);

    this.map = map;
    this.key = key;
  }
}

/**
 * Options for creating a new {@link HashMap} instance.
 */
export interface HashMapOptions<TKey, THashedKey = TKey> {
  /**
   * Optional human readable name for the {@link HashMap} instance that is used
   * for debugging purposes.
   *
   * @remarks
   *
   * Defaults to `"unknown"` if not set.
   */
  name?: string;

  /**
   * Function called to hash a key before storing or using it to access a
   * value in the {@link HashMap}.
   */
  onHash: (key: TKey) => THashedKey;
}

/**
 * Function called to filter the entries in a {@link HashMap}.
 *
 * @remarks
 *
 * It is possible to mutate the original map as you filter the entries in the
 * {@link HashMap} though this is not recommended in most cases as it is easy to
 * introduce bugs in your code this way.
 *
 * @param value - The value of the entry in the {@link HashMap} being filtered.
 * @param key - The key of the entry in the {@link HashMap} being filtered.
 * @param index - The index of the entry in the {@link HashMap} being filtered.
 * @param original - The original {@link HashMap} instance being filtered.
 *
 * @returns `true` to include the entry in the new {@link HashMap} or `false`
 * to exclude it.
 */
export type HashMapFilterFn<TKey, TValue, THashedKey> = (
  value: TValue,
  key: THashedKey,
  index: number,
  original: HashMap<TKey, TValue, THashedKey>,
) => boolean;

/**
 * Implementation of a key-value map that allows you to customise the way keys
 * are stored by using a custom hashing function.
 *
 * @remarks
 * Unlike an ES6 `Map` which always uses
 * [SameValueZero](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#Same-value-zero_equality)
 * on the key stored as-is, {@link HashMap} allows you to customise the way keys
 * are stored by using a custom hashing function.
 *
 * By default this map uses {@link identity} as a hash function meaning that
 * keys are stored as-is, which is the same behaviour as an ES6 `Map`.
 */
export class HashMap<TKey, TValue, THashedKey = TKey> {
  /**
   * Error thrown when attempting to access a key in the {@link HashMap} that
   * does not exist.
   */
  public static MissingKeyError = HashMapMissingKeyError;

  constructor(
    /**
     * Function called to hash a key before storing or using it to access a
     * value in the {@link HashMap}.
     */
    public readonly hash: (key: TKey) => THashedKey,

    /**
     * Internal data structure that we use to store the entries in the
     * {@link HashMap}.
     */
    private readonly _map: Map<THashedKey, TValue> = new Map(),

    /**
     * Human readable name for the {@link HashMap} instance that is used for
     * debugging purposes.
     */
    public readonly name = "unknown",
  ) {}

  /**
   * Create a new empty {@link HashMap} instance.
   *
   * @remarks
   *
   * This function uses the {@link identity} function as the hashing function
   * meaning that keys will be stored without any changes.
   *
   * @example
   * ```typescript
   * const map = HashMap.empty<number, string>();
   *
   * [...map]; // => []
   *
   * map.set(1, "one");
   *
   * [...map]; // => [[1, "one"]]
   * ```
   *
   * @see {@link HashMap.emptyWithCustomHash}
   *
   * @param options - Options to use to create the new {@link HashMap} instance.
   *
   * @returns A new empty {@link HashMap} instance.
   */
  static empty<TKey, TValue>(
    options: Omit<HashMapOptions<TKey>, "onHash"> = {},
  ): HashMap<TKey, TValue, TKey> {
    return new HashMap<TKey, TValue, TKey>(identity, new Map(), options.name);
  }

  /**
   * Create a new empty {@link HashMap} instance with a custom hashing function.
   *
   * @param options - Options to use to create the new {@link HashMap} instance.
   *
   * @returns A new empty {@link HashMap} instance.
   */
  static emptyWithCustomHash<TKey, TValue, THashedKey>(
    options: HashMapOptions<TKey, THashedKey>,
  ): HashMap<TKey, TValue, THashedKey> {
    return new HashMap<TKey, TValue, THashedKey>(
      options.onHash,
      new Map(),
      options.name,
    );
  }

  /**
   * Create a new {@link HashMap} instance from an array of key-value pairs with
   * a custom hashing function.
   *
   * @example Use ISO string representation of Date objects as hash keys
   * ```typescript
   * const map = HashMap.fromCustomEntries(
   * [
   *   [new Date("2020-01-01"), 1],
   *   [new Date("2020-02-01"), 2],
   *   [new Date("2020-03-01"), 3],
   * ],
   * {
   *   onHash(key) {
   *     return key.toISOString();
   *   },
   * });
   *
   * [...map];
   * // => [
   * //   ["2020-01-01T00:00:00.000Z", 1],
   * //   ["2020-02-01T00:00:00.000Z", 2],
   * //   ["2020-03-01T00:00:00.000Z", 3],
   * // ];
   * ```
   *
   * @param entries - Array of key-value pairs to create the {@link HashMap}
   * with.
   * @param options - Options to use to create the new {@link HashMap} instance.
   *
   * @returns A new {@link HashMap} instance with the given key-value pairs and
   * a given custom hashing function.
   */
  static fromCustomEntries<TKey, TValue, THashedKey>(
    entries: [TKey, TValue][],
    options: HashMapOptions<TKey, THashedKey>,
  ): HashMap<TKey, TValue, THashedKey> {
    return new HashMap<TKey, TValue, THashedKey>(
      options.onHash,
      new Map(entries.map(([k, v]) => [options.onHash(k), v] as const)),
      options.name,
    );
  }

  /**
   * Create a new {@link HashMap} instance from an array of key-value pairs with
   * the default
   *
   * @remarks
   *
   * This function uses the {@link identity} function as the hashing function
   * meaning that keys will be stored without any changes.
   *
   * @example
   * ```typescript
   * const map = HashMap.fromEntries<number, string>([
   *   [1, "one"],
   *   [2, "two"],
   *   [3, "three"],
   * ]);
   *
   * [...map];
   * // => [
   * //   [1, "one"],
   * //   [2, "two"],
   * //   [3, "three"],
   * // ];
   * ```
   *
   * @param entries
   * @param options - Options to use to create the new {@link HashMap} instance.
   *
   * @returns
   */
  static fromEntries<TKey, TValue>(
    entries: [TKey, TValue][],
    options: Omit<HashMapOptions<TKey>, "onHash"> = {},
  ): HashMap<TKey, TValue, TKey> {
    return new HashMap(
      identity,
      new Map(entries.map(([key, value]) => [key, value] as const)),
      options.name,
    );
  }

  /**
   * Clears all of the entries in this {@link HashMap}.
   *
   * @remarks
   *
   * This function **will mutate** the {@link HashMap} instance it is called on.
   *
   *   * @example
   * ```typescript
   * const map = HashMap.fromEntries<number, string>([
   *   [1, "one"],
   *   [2, "two"],
   *   [3, "three"],
   * ]);
   *
   * map.clear();
   *
   * [...map]; // => []
   * ```
   */
  clear(): void {
    this._map.clear();
  }

  /**
   * Delete an entry from this {@link HashMap} by its key.
   *
   * @example
   * ```typescript
   * const map = HashMap.fromEntries<number, string>([
   *   [1, "one"],
   *   [2, "two"],
   *   [3, "three"],
   * ]);
   *
   * map.delete(2);
   *
   * [...map];
   * // => [
   * //   [1, "one"],
   * //   [3, "three"],
   * // ]
   *
   * map.delete(4); // throws HashMap.MissingKeyError
   * ```
   *
   * @param key - The key of the entry to delete.
   *
   * @throws {@link HashMap.MissingKeyError} if the key does not exist in this
   * {@link HashMap}.
   */
  delete(key: TKey): void {
    if (!this.has(key)) {
      throw new HashMap.MissingKeyError(this, key);
    }

    this._map.delete(this.hash(key));
  }

  /**
   * Delete an entry from this {@link HashMap} by its key if it exists. Does
   * nothing if the key does not exist.
   *
   * @example
   * ```typescript
   * const map = HashMap.fromEntries<number, string>([
   *   [1, "one"],
   *   [2, "two"],
   *   [3, "three"],
   * ]);
   *
   * map.deleteIfExists(2); // => true
   * map.deleteIfExists(4); // => false
   *
   * [...map];
   * // => [
   * //   [1, "one"],
   * //   [3, "three"],
   * // ]
   * ```
   *
   * @param key - The key of the entry to delete.
   *
   * @returns `true` if the key existed and the entry was deleted, `false` if
   * the key did not exist.
   */
  deleteIfExists(key: TKey): boolean {
    if (!this.has(key)) {
      return false;
    }

    this.delete(key);

    return true;
  }

  /**
   * Returns the entries in this {@link HashMap} as an {@link IterableIterator}
   * which each entry as an array of `[key, value]`.
   *
   * @example
   * ```typescript
   * const map = HashMap.fromEntries<number, string>([
   *   [1, "one"],
   *   [2, "two"],
   *   [3, "three"],
   * ]);
   *
   * [...map.entries()];
   * // => [
   * //   [1, "one"],
   * //   [2, "two"],
   * //   [3, "three"],
   * // ]
   * ```
   *
   * @returns An {@link IterableIterator} of the entries in this
   * {@link HashMap}.
   */
  entries(): IterableIterator<[THashedKey, TValue]> {
    /**
     * You can't currently define an arrow function that is a generator
     * function.
     */
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;

    return (function* () {
      for (const [key, value] of _this._map.entries()) {
        yield [key, value];
      }
    })();
  }

  /**
   * Returns a new {@link HashMap} with only the key-value pairs where the given
   * function returns `true`, filtering out those that the given function
   * returns `false` for.
   *
   * @remarks
   * This function does not mutate the original {@link HashMap} instance.
   *
   * @example Include entries where key is greater than 2
   * ```typescript
   * const map = HashMap.fromEntries<number, string>([
   *   [1, "one"],
   *   [2, "two"],
   *   [3, "three"],
   *   [4, "four"],
   * ]);
   *
   * const filtered = map.filter((value, key) => key > 2);
   *
   * [...filtered];
   * // => [
   * //   [3, "three"],
   * //   [4, "four"],
   * // ]
   * ```
   * @example Include entries where the value has a length greater than 3
   * ```typescript
   * const map = HashMap.fromEntries<number, string>([
   *   [1, "one"],
   *   [2, "two"],
   *   [3, "three"],
   *   [4, "four"],
   * ]);
   *
   * const filtered = map.filter((value) => value.length > 3);
   *
   * [...filtered];
   * // => [
   * //   [3, "three"],
   * //   [4, "four"],
   * // ]
   * ```
   *
   * @param fn - Function called for each key-value pair in the {@link HashMap}
   * that returns `true` to include the pair in the new {@link HashMap} or
   * `false` to exclude it.
   *
   * @returns A new {@link HashMap} with only the key-value pairs where the
   * given function returned `true` for.
   */
  filter(
    fn: HashMapFilterFn<TKey, TValue, THashedKey>,
  ): HashMap<TKey, TValue, THashedKey> {
    const entries: [THashedKey, TValue][] = [];

    for (const [key, value] of this.entries()) {
      if (fn(value, key, entries.length, this)) {
        entries.push([key, value]);
      }
    }

    return new HashMap(this.hash, new Map(entries), this.name);
  }

  get(key: TKey): TValue {
    const value = this._map.get(this.hashKey(key));

    if (!value) {
      throw new HashMapMissingKeyError(this, key);
    }

    return value;
  }

  getOr<TDefaultValue = TValue>(
    key: TKey,
    defaultValue: TDefaultValue,
  ): TDefaultValue | TValue {
    const value = this._map.get(this.hashKey(key));

    if (!value) {
      return defaultValue;
    }

    return value;
  }

  has(key: TKey): boolean {
    return this._map.has(this.hashKey(key));
  }

  hashKey(key: TKey): THashedKey {
    return this.hash(key);
  }

  keys(): IterableIterator<THashedKey> {
    /**
     * You can't currently define an arrow function that is a generator
     * function.
     */
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;

    return (function* () {
      for (const key of _this._map.keys()) {
        yield key;
      }
    })();
  }

  /**
   * Replace each key-value pair in this {@link HashMap} with the result of
   * calling the given callback function on each pair in the {@link HashMap}.
   *
   * @example Swap the keys and values in a HashMap
   * ```typescript
   * const map = HashMap.fromEntries([
   *  ["one", 1],
   *  ["two", 2],
   *  ["three", 3],
   * ]);
   *
   * const swapped = map.map(([key, value]) => [value, key]);
   * // => HashMap { 1 => "one", 2 => "two", 3 => "three" }
   * ```
   *
   * @param fn - Function to call on each key-value pair in the {@link HashMap}.
   *
   * @returns A new map with the results of calling the given function on each
   * key-value pair in the {@link HashMap}.
   */
  map(
    fn: (
      value: TValue,
      key: THashedKey,
      index: number,
      original: HashMap<TKey, TValue, THashedKey>,
    ) => [THashedKey, TValue],
  ): HashMap<TKey, TValue, THashedKey> {
    const entries: [THashedKey, TValue][] = [];

    for (const [key, value] of this.entries()) {
      entries.push(fn(value, key, entries.length, this));
    }

    return new HashMap(this.hash, new Map(entries), this.name);
  }

  mapKeys(
    fn: (
      key: THashedKey,
      value: TValue,
      index: number,
      original: HashMap<TKey, TValue, THashedKey>,
    ) => THashedKey,
  ): HashMap<TKey, TValue, THashedKey> {
    return this.map((value, key, index, original) => [
      fn(key, value, index, original),
      value,
    ]);
  }

  mapValues(
    fn: (
      value: TValue,
      key: THashedKey,
      index: number,
      original: HashMap<TKey, TValue, THashedKey>,
    ) => TValue,
  ): HashMap<TKey, TValue, THashedKey> {
    return this.map((value, key, index, original) => [
      key,
      fn(value, key, index, original),
    ]);
  }

  set(key: TKey, value: TValue): void {
    this._map.set(this.hashKey(key), value);
  }

  [Symbol.iterator](): Iterator<[THashedKey, TValue]> {
    return this.entries();
  }

  values(): IterableIterator<TValue> {
    return this._map.values();
  }
}
