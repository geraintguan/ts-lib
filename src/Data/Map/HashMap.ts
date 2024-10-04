import { BaseMap } from "./BaseMap.js";
import { MissingKeyError } from "./MissingKeyError.js";

/**
 * Implementation of a key-value map that automatically serializes and
 * deserializes keys using customisable callback functions.
 * 
 * @remarks
 * Unlike an ES6 `Map` which uses
 * [SameValueZero](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#Same-value-zero_equality)
 * for key equality, this map uses string representations of keys with a
 * customisable serialization and deserialization functions that can be user
 * defined.
 * 
 * By default this map uses `JSON.stringify` for serialization and `JSON.parse`
 * for deserialization.
 * 
 * @example Using a custom serializer & deserializer
 * ```typescript
 * class Id {
 *   constructor(public readonly id: string) {}
 *   
 *   toString() { return this.id; }
 * }
 * 
 * const map = HashMap.empty<Id, number>({
 *   serializeKey: (key) => key.toString(),
 *   deserializeKey: (key) => new Id(key),
 * });
 * 
 * const id = new Id("foo");
 * 
 * map.set(foo, 1);
 * map.get(foo) // => 1
 * 
 * Array.from(map.keys()) // => [Id { id: "foo" }]
 * ```
 */
export class HashMap<TKey, TValue> implements BaseMap<TKey, TValue> {
  public readonly typename = "HashMap";

  constructor(
    protected readonly internalMap: Map<string, TValue> = new Map(),
    public readonly deserializeKey: (key: string) => TKey = JSON.parse,
    public readonly serializeKey: (key: TKey) => string = JSON.stringify,
  ) {}

  static empty<TKey, TValue>({
    deserializeKey = JSON.parse,
    serializeKey = JSON.stringify,
  }: {
    deserializeKey?: BaseMap<TKey, TValue>["deserializeKey"];
    serializeKey?: BaseMap<TKey, TValue>["serializeKey"];
  } = {}): HashMap<TKey, TValue> {
    return new HashMap<TKey, TValue>(new Map(), deserializeKey, serializeKey);
  }

  static fromEntries<TKey, TValue>(
    entries: [TKey, TValue][],
    {
      deserializeKey = JSON.parse,
      serializeKey = JSON.stringify,
    }: {
      deserializeKey?: BaseMap<TKey, TValue>["deserializeKey"];
      serializeKey?: BaseMap<TKey, TValue>["serializeKey"];
    } = {},
  ): HashMap<TKey, TValue> {
    return new HashMap(
      new Map(
        entries.map(([key, value]) => [serializeKey(key), value] as const),
      ),
      deserializeKey,
      serializeKey,
    );
  }

  clear(): void {
    this.internalMap.clear();
  }

  delete(key: TKey): void {
    if (!this.has(key)) {
      throw new MissingKeyError(this, key);
    }

    this.internalMap.delete(this.serializeKey(key));
  }

  deleteIfExists(key: TKey): boolean {
    if (!this.has(key)) {
      return false;
    }

    this.delete(key);

    return true;
  }

  entries(): IterableIterator<[TKey, TValue]> {
    /**
     * You can't currently define an arrow function that is a generator
     * function.
     */
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;

    return (function* () {
      for (const [key, value] of _this.internalMap.entries()) {
        yield [_this.deserializeKey(key), value];
      }
    })();
  }

  filter(
    fn: (
      value: TValue,
      key: TKey,
      index: number,
      original: HashMap<TKey, TValue>,
    ) => boolean,
  ): HashMap<TKey, TValue> {
    const entries: [TKey, TValue][] = [];

    for (const [key, value] of this.entries()) {
      if (fn(value, key, entries.length, this)) {
        entries.push([key, value]);
      }
    }

    return HashMap.fromEntries(entries, {
      deserializeKey: this.deserializeKey,
      serializeKey: this.serializeKey,
    });
  }

  get(key: TKey): TValue {
    const value = this.internalMap.get(this.serializeKey(key));

    if (!value) {
      throw new MissingKeyError(this, key);
    }

    return value;
  }

  getOr<TDefaultValue = TValue>(
    key: TKey,
    defaultValue: TDefaultValue,
  ): TDefaultValue | TValue {
    const value = this.internalMap.get(this.serializeKey(key));

    if (!value) {
      return defaultValue;
    }

    return value;
  }

  has(key: TKey): boolean {
    return this.internalMap.has(this.serializeKey(key));
  }

  keys(): IterableIterator<TKey> {
    /**
     * You can't currently define an arrow function that is a generator
     * function.
     */
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;

    return (function* () {
      for (const key of _this.internalMap.keys()) {
        yield _this.deserializeKey(key);
      }
    })();
  }

  map(
    fn: (
      value: TValue,
      key: TKey,
      index: number,
      original: HashMap<TKey, TValue>,
    ) => [TKey, TValue],
  ): HashMap<TKey, TValue> {
    const entries: [TKey, TValue][] = [];

    for (const [key, value] of this.entries()) {
      entries.push(fn(value, key, entries.length, this));
    }

    return HashMap.fromEntries<TKey, TValue>(entries, {
      deserializeKey: this.deserializeKey,
      serializeKey: this.serializeKey,
    });
  }

  mapKeys(
    fn: (
      key: TKey,
      value: TValue,
      index: number,
      original: HashMap<TKey, TValue>,
    ) => TKey,
  ): HashMap<TKey, TValue> {
    return this.map((value, key, index, original) => [
      fn(key, value, index, original),
      value,
    ]);
  }

  mapValues(
    fn: (
      value: TValue,
      key: TKey,
      index: number,
      original: HashMap<TKey, TValue>,
    ) => TValue,
  ): HashMap<TKey, TValue> {
    return this.map((value, key, index, original) => [
      key,
      fn(value, key, index, original),
    ]);
  }

  serializedKeys(): IterableIterator<string> {
    return this.internalMap.keys();
  }

  set(key: TKey, value: TValue): void {
    this.internalMap.set(this.serializeKey(key), value);
  }

  [Symbol.iterator](): Iterator<[TKey, TValue]> {
    return this.entries();
  }

  values(): IterableIterator<TValue> {
    return this.internalMap.values();
  }
}
