export interface BaseMap<TKey, TValue> extends Iterable<[TKey, TValue]> {
  /**
   * Clears all elements from this map.
   */
  clear(): void;

  /**
   * Delete an entry with the given key from this map. If the key does not exist
   * in the map, this should throw a {@link MissingKeyError}.
   *
   * @throws {MissingKeyError} If the key does not exist in the map.
   *
   * @param key - Key of the value to delete.
   */
  delete(key: TKey): void;

  /**
   * Delete an entry with the given key from this map if it exists, otherwise
   * does nothing.
   *
   * @param key - Key of the value to delete.
   *
   * @returns `true` if the key existed and the associated entry was deleted,
   * `false` otherwise.
   */
  deleteIfExists(key: TKey): boolean;

  /**
   * Function that deserializes a key from it's string representation.
   *
   * This should effectively be the inverse operation of {@link serializeKey}.
   *
   * @returns The key deserialized from a string.
   */
  deserializeKey: (key: string) => TKey;

  /**
   * Returns an {@link IterableIterator} that allows iterating over the each
   * entry as a key-value pair.
   *
   * @returns Iterator over entries as a key-value pair.
   */
  entries(): IterableIterator<[TKey, TValue]>;

  /**
   * Get a value from the map by it's key.
   *
   * If the key does not exist in the map, this should throw a
   * {@link MissingKeyError}.
   *
   * @throws {MissingKeyError} If the key does not exist in the map.
   *
   * @param key - Key of the value to get.
   *
   * @returns The value associated with the given key if one exists.
   */
  get(key: TKey): TValue;

  /**
   * Get a value from the map by it's key or return the given default value if
   * the key does not exist in the map. The default value does not have to be
   * the same type as the values in the map.
   *
   * @param key - Key of the value to get.
   *
   * @param defaultValue - Default value to return if the key does not exist in
   * the map.
   *
   * @returns The value associated with the given key if one exists, otherwise
   * the default value.
   */
  getOr<TDefaultValue = TValue>(
    key: TKey,
    defaultValue: TDefaultValue,
  ): TValue | TDefaultValue;

  /**
   * Returns the existence of an entry with the given key in this map.
   *
   * @param key - Key of entry to check for existence.
   *
   * @returns `true` if an entry with the given key exists in the map, otherwise
   * `false`.
   */
  has(key: TKey): boolean;

  /**
   * Returns an {@link IterableIterator} that allows iterating over the keys in
   * this map. Keys are deserialized before being returned.
   *
   * @returns Iterator over keys in the map.
   */
  keys(): IterableIterator<TKey>;

  /**
   * Returns the serialized keys in this map.
   *
   * @returns Iterator over serialized keys in the map.
   */
  serializedKeys(): IterableIterator<string>;

  /**
   * Function that serializes any incoming keys into a string which is then
   * used a key to refer to a specific value in the map.
   *
   * This should effectively be the inverse operation of {@link deserializeKey}.
   *
   * @returns The key serialized into a string.
   */
  serializeKey: (key: TKey) => string;

  /**
   * Set a value in the map with the given key.
   *
   * @param key - Key of the value to set.
   *
   * @param value - Value to set in the map.
   */
  set(key: TKey, value: TValue): void;

  /**
   * Returns an {@link IterableIterator} that allows iterating over the values
   * in the map.
   *
   * @returns Iterator over values in the map.
   */
  values(): IterableIterator<TValue>;
}
