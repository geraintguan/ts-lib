import { HashMap } from "./HashMap.js";

export class DefaultMap<
  TKey,
  TValue,
  THashedKey = TKey,
  TDefaultValue = TValue,
> {
  constructor(
    public readonly onHash: (key: TKey) => THashedKey,
    public readonly defaultValue:
      | { type: "generator"; value: (key: TKey) => TDefaultValue }
      | { type: "value"; value: TDefaultValue },
    public readonly name = "unknown",
    private readonly _map: HashMap<TKey, TValue, THashedKey>,
  ) {
    this._map = HashMap.emptyWithCustomHash({ name, onHash });
  }

  get(key: TKey): TDefaultValue | TValue {
    return this._map.getOr(
      key,
      this.defaultValue.type === "generator"
        ? this.defaultValue.value(key)
        : this.defaultValue.value,
    );
  }
}
