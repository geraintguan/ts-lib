import { BaseMap } from "./BaseMap.js";
import { HashMap } from "./HashMap.js";

export class DefaultMap<TKey, TValue> implements BaseMap<TKey, TValue> {
  public readonly typename = "DefaultMap";

  constructor(
    protected readonly internalMap: HashMap<TKey, TValue> = HashMap.empty(),
    protected readonly defaultValue: (
      key: TKey,
      self: DefaultMap<TKey, TValue>,
    ) => TValue,
    public readonly name?: string,
  ) {
  }

  static empty<TKey, TValue>(
    defaultValue: (key: TKey, self: DefaultMap<TKey, TValue>) => TValue,
    options: {
      deserializeKey?: BaseMap<TKey, TValue>["deserializeKey"];
      serializeKey?: BaseMap<TKey, TValue>["serializeKey"];
    } = {},
  ) {
    return DefaultMap.fromEntries([], defaultValue, options);
  }

  static fromEntries<TKey, TValue>(
    entries: [TKey, TValue][],
    defaultValue: (key: TKey, self: DefaultMap<TKey, TValue>) => TValue,
    {
      deserializeKey = JSON.parse,
      serializeKey = JSON.stringify,
    }: {
      deserializeKey?: BaseMap<TKey, TValue>["deserializeKey"];
      serializeKey?: BaseMap<TKey, TValue>["serializeKey"];
    } = {},
  ): DefaultMap<TKey, TValue> {
    return new DefaultMap(
      new HashMap(
        new Map(
          entries.map(([key, value]) => [serializeKey(key), value] as const),
        ),
        deserializeKey,
        serializeKey,
      ),
      defaultValue,
    );
  }

  clear(): void {
    this.internalMap.clear();
  }

  delete(key: TKey): void {
    this.internalMap.delete(key);
  }

  deleteIfExists(key: TKey): boolean {
    return this.internalMap.deleteIfExists(key);
  }

  deserializeKey(key: string): TKey {
    return this.internalMap.deserializeKey(key);
  }

  entries(): IterableIterator<[TKey, TValue]> {
    return this.internalMap.entries();
  }

  filter(
    fn: (
      value: TValue,
      key: TKey,
      index: number,
      original: DefaultMap<TKey, TValue>,
    ) => boolean,
  ): DefaultMap<TKey, TValue> {
    const entries: [TKey, TValue][] = [];

    let index = 0;
    for (const [key, value] of this.internalMap.entries()) {
      if (fn(value, key, index, this)) {
        entries.push([key, value]);
      }

      index++;
    }

    return DefaultMap.fromEntries(entries, this.defaultValue, {
      deserializeKey: this.internalMap.deserializeKey,
      serializeKey: this.internalMap.serializeKey,
    });
  }

  get(key: TKey): TValue {
    if (!this.has(key)) {
      const defaultValue = this.defaultValue(key, this);

      this.set(key, defaultValue);

      return defaultValue;
    }

    return this.internalMap.get(key);
  }

  getOr<TDefaultValue = TValue>(
    key: TKey,
    defaultValue: TDefaultValue,
  ): TDefaultValue | TValue {
    return this.internalMap.getOr(key, defaultValue);
  }

  has(key: TKey): boolean {
    return this.internalMap.has(key);
  }

  keys(): IterableIterator<TKey> {
    return this.internalMap.keys();
  }

  map(
    fn: (
      value: TValue,
      key: TKey,
      index: number,
      original: DefaultMap<TKey, TValue>,
    ) => [TKey, TValue],
  ): DefaultMap<TKey, TValue> {
    const entries: [TKey, TValue][] = [];

    let index = 0;
    for (const [key, value] of this.internalMap.entries()) {
      entries.push(fn(value, key, index, this));

      index++;
    }

    return DefaultMap.fromEntries<TKey, TValue>(entries, this.defaultValue, {
      deserializeKey: this.internalMap.deserializeKey,
      serializeKey: this.internalMap.serializeKey,
    });
  }

  mapKeys(
    fn: (
      key: TKey,
      value: TValue,
      index: number,
      original: DefaultMap<TKey, TValue>,
    ) => TKey,
  ): DefaultMap<TKey, TValue> {
    const entries: [TKey, TValue][] = [];

    let index = 0;
    for (const [key, value] of this.internalMap.entries()) {
      entries.push([fn(key, value, index, this), value]);

      index++;
    }

    return DefaultMap.fromEntries<TKey, TValue>(entries, this.defaultValue, {
      deserializeKey: this.internalMap.deserializeKey,
      serializeKey: this.internalMap.serializeKey,
    });
  }

  mapValues(
    fn: (
      value: TValue,
      key: TKey,
      index: number,
      original: DefaultMap<TKey, TValue>,
    ) => TValue,
  ): DefaultMap<TKey, TValue> {
    const entries: [TKey, TValue][] = [];

    let index = 0;
    for (const [key, value] of this.internalMap.entries()) {
      entries.push([key, fn(value, key, index, this)]);

      index++;
    }

    return DefaultMap.fromEntries<TKey, TValue>(entries, this.defaultValue, {
      deserializeKey: this.internalMap.deserializeKey,
      serializeKey: this.internalMap.serializeKey,
    });
  }

  serializedKeys(): IterableIterator<string> {
    return this.internalMap.serializedKeys();
  }

  serializeKey(key: TKey): string {
    return this.internalMap.serializeKey(key);
  }

  set(key: TKey, value: TValue): void {
    this.internalMap.set(key, value);
  }

  [Symbol.iterator](): Iterator<[TKey, TValue]> {
    return this.entries();
  }

  values(): IterableIterator<TValue> {
    return this.internalMap.values();
  }
}
