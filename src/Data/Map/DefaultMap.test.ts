import { describe, expect, it } from "vitest";

import { constant } from "../../constant.js";
import { Unpack } from "../../Types/Unpack.js";
import { DefaultMap } from "./DefaultMap.js";
import { MissingKeyError } from "./MissingKeyError.js";

describe("DefaultMap.empty()", () => {
  it("should return an empty DefaultMap that uses the given default value", () => {
    const map = DefaultMap.empty<string, string>(constant("Default Value"));

    expect(Array.from(map)).toEqual([]);

    expect(map.get("a")).toBe("Default Value");
  });
});

describe("DefaultMap.fromEntries()", () => {
  it("should return a DefaultMap with entries from the given array", () => {
    const entries: [string, string][] = [
      ["a", "apple"],
      ["b", "banana"],
      ["c", "cherry"],
    ];

    const map = DefaultMap.fromEntries(entries, constant("Default Value"));
    expect(Array.from(map)).toEqual(entries);
  });

  it("should use the given default value for missing keys", () => {
    const entries: [string, string][] = [
      ["a", "apple"],
      ["b", "banana"],
      ["c", "cherry"],
    ];

    const defaultValue = "Default Value";

    const map = DefaultMap.fromEntries(entries, constant(defaultValue));

    expect(map.get("d")).toBe(defaultValue);
    expect(map.get("e")).toBe(defaultValue);
  });

  it("should deserialize keys using the provided deserializeKey function", () => {
    const entries: [{ id: number }, string][] = [
      [{ id: 1 }, "apple"],
      [{ id: 2 }, "banana"],
      [{ id: 3 }, "cherry"],
    ];
    const deserializeKey = (key: string) => JSON.parse(key) as Unpack<typeof entries>[0];

    const map = DefaultMap.fromEntries(entries, constant("Default Value"), {
      deserializeKey,
    });

    expect(map.get({ id: 1 })).toBe("apple");
    expect(map.get({ id: 2 })).toBe("banana");
    expect(map.get({ id: 3 })).toBe("cherry");
  });

  it("should serialize keys using the provided serializeKey function", () => {
    const entries: [{ id: number }, string][] = [
      [{ id: 1 }, "apple"],
      [{ id: 2 }, "banana"],
      [{ id: 3 }, "cherry"],
    ];
    const serializeKey = (key: { id: number }) => JSON.stringify(key);

    const map = DefaultMap.fromEntries(entries, constant("Default Value"), {
      serializeKey,
    });

    expect(map.get({ id: 1 })).toBe("apple");
    expect(map.get({ id: 2 })).toBe("banana");
    expect(map.get({ id: 3 })).toBe("cherry");
  });
});

describe("DefaultMap[Symbol.iterator]()", () => {
  it("should return an iterator over the entries of the DefaultMap", () => {
    const map = DefaultMap.fromEntries(
      [
        ["a", 2],
        ["b", 3],
        ["c", 4],
      ],
      () => 1,
    );

    expect(Array.from(map)).toEqual([
      ["a", 2],
      ["b", 3],
      ["c", 4],
    ]);
  });

  it("should return an iterator that can be looped over multiple times", () => {
    const map = DefaultMap.fromEntries(
      [
        ["a", 2],
        ["b", 3],
        ["c", 4],
      ],
      () => 1,
    );

    const entries1 = Array.from(map);
    const entries2 = Array.from(map);

    expect(entries1).toEqual(entries2);
  });
});

describe("DefaultMap#clear()", () => {
  it("should remove all entries from the DefaultMap", () => {
    const map = DefaultMap.fromEntries(
      [
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ],
      () => 0,
    );

    map.clear();

    expect(Array.from(map)).toEqual([]);
  });
});

describe("DefaultMap#delete()", () => {
  it("should delete the entry with the specified key from the DefaultMap", () => {
    const map = DefaultMap.fromEntries(
      [
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ],
      () => 0,
    );

    map.delete("b");

    expect(Array.from(map)).toEqual([
      ["a", 1],
      ["c", 3],
    ]);
  });

  it("should throw a MissingKeyError if the key does not exist in the DefaultMap", () => {
    const map = DefaultMap.fromEntries(
      [
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ],
      () => 0,
    );

    expect(() => { map.delete("d"); }).toThrowError(MissingKeyError);
  });
});

describe("DefaultMap#deleteIfExists()", () => {
  it("should delete the entry with the specified key from the DefaultMap when it exists and return true", () => {
    const map = DefaultMap.fromEntries(
      [
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ],
      () => 0,
    );

    expect(map.deleteIfExists("b")).toBe(true);

    expect(Array.from(map)).toEqual([
      ["a", 1],
      ["c", 3],
    ]);
  });

  it("should return false if the key does not exist in the DefaultMap", () => {
    const map = DefaultMap.fromEntries(
      [
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ],
      () => 0,
    );

    expect(map.deleteIfExists("d")).toBe(false);

    expect(Array.from(map)).toEqual([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);
  });
});

describe("DefaultMap#deserializeKey()", () => {
  it("should deserialize the given string key into the corresponding key type", () => {
    const map = DefaultMap.fromEntries(
      [
        [{ id: 1 }, 1],
        [{ id: 2 }, 2],
        [{ id: 3 }, 3],
      ],
      () => 0,
    );

    expect(map.deserializeKey(JSON.stringify({ id: 4 }))).toEqual({ id: 4 });
  });
});

describe("DefaultMap#entries()", () => {
  it("should return an iterable iterator over the entries of the DefaultMap", () => {
    const map = DefaultMap.fromEntries(
      [
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ],
      () => 0,
    );

    expect(Array.from(map.entries())).toEqual([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);
  });
});

describe("DefaultMap#filter()", () => {
  it("should return a new DefaultMap with entries that pass the filter function", () => {
    const map = DefaultMap.fromEntries(
      [
        ["a", 1],
        ["b", 2],
        ["c", 3],
        ["d", 0],
      ],
      () => 0,
    );

    const filteredMap = map.filter((value) => value > 1);

    expect(Array.from(filteredMap)).toEqual([
      ["b", 2],
      ["c", 3],
    ]);
  });
});

describe("DefaultMap#get()", () => {
  it("should return the value associated with the specified key if it exists in the DefaultMap", () => {
    const map = DefaultMap.fromEntries(
      [
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ],
      () => 0,
    );

    expect(map.get("b")).toBe(2);
  });

  it("should return the default value if the specified key does not exist in the DefaultMap", () => {
    const map = DefaultMap.fromEntries(
      [
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ],
      () => 0,
    );

    expect(map.get("d")).toBe(0);
  });

  it("should set a new entry with the default value if the specified key does not exist in the DefaultMap", () => {
    const map = DefaultMap.fromEntries(
      [
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ],
      () => 0,
    );

    map.get("d");

    expect(Array.from(map)).toEqual([
      ["a", 1],
      ["b", 2],
      ["c", 3],
      ["d", 0],
    ]);
  });
});

describe("DefaultMap#getOr()", () => {
  it("should return the value associated with the specified key if it exists in the DefaultMap", () => {
    const map = DefaultMap.fromEntries(
      [
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ],
      () => 0,
    );
    expect(map.getOr("a", "Default Value")).toBe(1);
    expect(map.getOr("b", "Default Value")).toBe(2);
    expect(map.getOr("c", "Default Value")).toBe(3);
  });

  it("should return the default value if the specified key does not exist in the DefaultMap", () => {
    const map = DefaultMap.fromEntries(
      [
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ],
      () => 0,
    );

    expect(map.getOr("d", "Default Value")).toBe("Default Value");
  });
});

describe("DefaultMap#has()", () => {
  it("should return true if the specified key exists in the DefaultMap", () => {
    const map = DefaultMap.fromEntries(
      [
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ],
      () => 0,
    );

    expect(map.has("b")).toBe(true);
  });

  it("should return false if the specified key does not exist in the DefaultMap", () => {
    const map = DefaultMap.fromEntries(
      [
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ],
      () => 0,
    );
    expect(map.has("d")).toBe(false);
  });
});

describe("DefaultMap#keys()", () => {
  it("should return an iterable iterator over the keys of the DefaultMap", () => {
    const map = DefaultMap.fromEntries(
      [
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ],
      () => 0,
    );
    expect(Array.from(map.keys())).toEqual(["a", "b", "c"]);
  });
});

describe("DefaultMap#map()", () => {
  it("should return a new DefaultMap with transformed entries", () => {
    const map = DefaultMap.fromEntries(
      [
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ],
      () => 0,
    );

    const transformedMap = map.map((value, key) => [
      key.toUpperCase(),
      value * 2,
    ]);

    expect(Array.from(transformedMap)).toEqual([
      ["A", 2],
      ["B", 4],
      ["C", 6],
    ]);
  });
});

describe("DefaultMap#mapKeys()", () => {
  it("should return a new DefaultMap with transformed keys", () => {
    const map = DefaultMap.fromEntries(
      [
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ],
      () => 0,
    );
    const transformedMap = map.mapKeys((key) => key.toUpperCase());
    expect(Array.from(transformedMap)).toEqual([
      ["A", 1],
      ["B", 2],
      ["C", 3],
    ]);
  });
});

describe("DefaultMap#mapValues()", () => {
  it("should return a new DefaultMap with transformed values", () => {
    const map = DefaultMap.fromEntries(
      [
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ],
      () => 0,
    );
    const transformedMap = map.mapValues((value) => value * 2);
    expect(Array.from(transformedMap)).toEqual([
      ["a", 2],
      ["b", 4],
      ["c", 6],
    ]);
  });
});

describe("DefaultMap#serializeKey()", () => {
  it("should serialize the given key into a string", () => {
    const map = DefaultMap.fromEntries(
      [
        [{ id: 1 }, 1],
        [{ id: 2 }, 2],
        [{ id: 3 }, 3],
      ],
      () => 0,
    );

    expect(map.serializeKey({ id: 4 })).toBe(JSON.stringify({ id: 4 }));
  });
});

describe("DefaultMap#serializedKeys()", () => {
  it("should return an iterable iterator over the serialized keys of the DefaultMap", () => {
    const map = DefaultMap.fromEntries(
      [
        [{ id: 1 }, 1],
        [{ id: 2 }, 2],
        [{ id: 3 }, 3],
      ],
      () => 0,
    );

    expect(Array.from(map.serializedKeys())).toEqual([
      JSON.stringify({ id: 1 }),
      JSON.stringify({ id: 2 }),
      JSON.stringify({ id: 3 }),
    ]);
  });
});

describe("DefaultMap#values()", () => {
  it("should return an iterable iterator over the values of the DefaultMap", () => {
    const map = DefaultMap.fromEntries(
      [
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ],
      () => 0,
    );
    expect(Array.from(map.values())).toEqual([1, 2, 3]);
  });
});
