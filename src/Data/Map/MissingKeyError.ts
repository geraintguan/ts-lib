import { BaseMap } from "./BaseMap.js";

export class MissingKeyError<TKey, TValue> extends Error {
  public readonly key: TKey;
  public readonly map: BaseMap<TKey, TValue>;

  constructor(map: BaseMap<TKey, TValue>, key: TKey) {
    super(`Could not find key '${map.serializeKey(key)}' (serialized) in ${map.typename} ${map.name ?? "unknown"}`);

    this.map = map;
    this.key = key;
  }
}
