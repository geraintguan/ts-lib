import { describe, expect, it } from "vitest";

import { HashMap } from "./HashMap.js";
import { MissingKeyError } from "./MissingKeyError.js";

describe("HashMap.empty()", () => {
  it("should return an empty HashMap", () => {
    expect(Array.from(HashMap.empty().entries())).toEqual([]);
  });
});

describe("HashMap.fromEntries()", () => {
  describe("with string keys", () => {
    it("should return an HashMap with the given entries", () => {
      const entries: [string, number][] = [
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ];

      const map = HashMap.fromEntries(entries);

      expect(Array.from(map.entries())).toEqual(entries);
    });
  });

  describe("with number keys", () => {
    it("should return an HashMap with the given entries", () => {
      const entries: [string, number][] = [
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ];

      const map = HashMap.fromEntries(entries);

      expect(Array.from(map.entries())).toEqual(entries);
    });
  });

  describe("with object keys", () => {
    it("should return an HashMap with the given entries", () => {
      const entries: [{ left: string; right: number }, number][] = [
        [{ left: "a", right: 1 }, 1],
        [{ left: "b", right: 2 }, 2],
        [{ left: "c", right: 3 }, 3],
      ];

      const map = HashMap.fromEntries(entries);

      expect(Array.from(map.entries())).toEqual(entries);
    });
  });

  describe("with Date keys", () => {
    it("should return an HashMap with the given entries", () => {
      const entries: [Date, number][] = [
        [new Date("2021-01-01"), 1],
        [new Date("2021-01-02"), 2],
        [new Date("2021-01-03"), 3],
      ];

      const map = HashMap.fromEntries(entries);

      expect(Array.from(map.entries())).toEqual(
        entries.map(([key, value]) => [key.toISOString(), value]),
      );
    });
  });
});

describe("HashMap[Symbol.iterator]()", () => {
  it("should return an iterator that iterates over all key-value pairs in the HashMap", () => {
    const map = HashMap.fromEntries([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);

    expect(Array.from(map)).toEqual([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);
  });

  it("should return an iterator that can be looped over multiple times", () => {
    const map = HashMap.fromEntries([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);

    const entries1 = Array.from(map);
    const entries2 = Array.from(map);

    expect(entries1).toEqual(entries2);
  });

  it("should return an iterator that can be used with the 'for...of' loop", () => {
    const map = HashMap.fromEntries([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);

    const entries = [];
    for (const [key, value] of map) {
      entries.push([key, value]);
    }

    expect(entries).toEqual([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);
  });
});

describe("HashMap#clear()", () => {
  it("should remove all elements from the HashMap", () => {
    const map = HashMap.fromEntries([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);

    map.clear();

    expect(Array.from(map.entries())).toEqual([]);
  });
});

describe("HashMap#delete()", () => {
  it("should delete the element with the specified key from the HashMap and return true", () => {
    const map = HashMap.fromEntries([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);

    expect(() => { map.delete("b"); }).not.toThrowError(MissingKeyError);

    expect(Array.from(map.entries())).toEqual([
      ["a", 1],
      ["c", 3],
    ]);
  });

  it("should throw a MissingKeyError if the element with the specified key does not exist in the HashMap", () => {
    const map = HashMap.fromEntries([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);

    expect(() => { map.delete("d"); }).toThrowError(MissingKeyError);

    expect(Array.from(map.entries())).toEqual([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);
  });
});

describe("HashMap#deleteIfExists()", () => {
  it("should delete the element with the specified key from the HashMap and return true if the key exists", () => {
    const map = HashMap.fromEntries([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);

    const result = map.deleteIfExists("b");

    expect(result).toBe(true);

    expect(Array.from(map.entries())).toEqual([
      ["a", 1],
      ["c", 3],
    ]);
  });

  it("should not delete any element from the HashMap and return false if the key does not exist", () => {
    const map = HashMap.fromEntries([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);

    const result = map.deleteIfExists("d");

    expect(result).toBe(false);

    expect(Array.from(map.entries())).toEqual([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);
  });
});

describe("HashMap#entries()", () => {
  it("should return an iterable iterator with all key-value pairs in the HashMap", () => {
    const map = HashMap.fromEntries([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);

    const entries = Array.from(map.entries());

    expect(entries).toEqual([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);
  });

  it("should return an empty iterable iterator for an empty HashMap", () => {
    const map = HashMap.empty();

    const entries = Array.from(map.entries());

    expect(entries).toEqual([]);
  });

  it("should return an iterable iterator that can be looped over multiple times", () => {
    const map = HashMap.fromEntries([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);

    const entries1 = Array.from(map.entries());
    const entries2 = Array.from(map.entries());

    expect(entries1).toEqual(entries2);
  });
});

describe("HashMap#filter()", () => {
  it("should return a new HashMap with the key-value pairs that pass the filter function", () => {
    const map = HashMap.fromEntries([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);

    const filteredMap = map.filter((value, key) => key !== "b");

    expect(Array.from(filteredMap.entries())).toEqual([
      ["a", 1],
      ["c", 3],
    ]);
  });
});

describe("HashMap#get()", () => {
  it("should return the value associated with the specified key", () => {
    const map = HashMap.fromEntries([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);
    expect(map.get("a")).toBe(1);
    expect(map.get("b")).toBe(2);
    expect(map.get("c")).toBe(3);
  });

  it("should throw a MissingKeyError if the specified key does not exist in the HashMap", () => {
    const map = HashMap.fromEntries([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);
    expect(() => map.get("d")).toThrowError(MissingKeyError);
  });
});

describe("HashMap#getOr()", () => {
  it("should return the value associated with the specified key if it exists", () => {
    const map = HashMap.fromEntries([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);
    expect(map.getOr("a", 0)).toBe(1);
    expect(map.getOr("b", 0)).toBe(2);
    expect(map.getOr("c", 0)).toBe(3);
  });

  it("should return the default value if the specified key does not exist in the HashMap", () => {
    const map = HashMap.fromEntries([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);
    expect(map.getOr("d", 0)).toBe(0);
    expect(map.getOr("e", "default")).toBe("default");
    expect(map.getOr("f", null)).toBeNull();
  });
});

describe("HashMap#keys()", () => {
  it("should return an iterable iterator with all keys in the HashMap", () => {
    const map = HashMap.fromEntries([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);

    const keys = Array.from(map.keys());

    expect(keys).toEqual(["a", "b", "c"]);
  });

  it("should return an empty iterable iterator for an empty HashMap", () => {
    const map = HashMap.empty();

    const keys = Array.from(map.keys());

    expect(keys).toEqual([]);
  });
  it("should return an iterable iterator that can be looped over multiple times", () => {
    const map = HashMap.fromEntries([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);

    const keys1 = Array.from(map.keys());
    const keys2 = Array.from(map.keys());

    expect(keys1).toEqual(keys2);
  });
});

describe("HashMap#map()", () => {
  it("should return a new HashMap with the keys and values mapped", () => {
    const map = HashMap.fromEntries([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);
    const newMap = map.map((value, key) => [`${key}${value.toString()}`, value * 2]);
    expect(Array.from(newMap.entries())).toEqual([
      ["a1", 2],
      ["b2", 4],
      ["c3", 6],
    ]);
  });
});

describe("HashMap#mapKeys()", () => {
  it("should return a new HashMap with the keys mapped", () => {
    const map = HashMap.fromEntries([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);

    const newMap = map.mapKeys((key) => key.toUpperCase());

    expect(Array.from(newMap.entries())).toEqual([
      ["A", 1],
      ["B", 2],
      ["C", 3],
    ]);
  });
});

describe("HashMap#mapValues()", () => {
  it("should return a new HashMap with the values mapped", () => {
    const map = HashMap.fromEntries([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);

    const newMap = map.mapValues((value) => value * 2);

    expect(Array.from(newMap.entries())).toEqual([
      ["a", 2],
      ["b", 4],
      ["c", 6],
    ]);
  });
});

describe("HashMap#set()", () => {
  it("should add a new key-value pair to the HashMap", () => {
    const map = HashMap.empty();

    map.set("a", 1);

    expect(Array.from(map.entries())).toEqual([["a", 1]]);
  });

  it("should overwrite the value of an existing key in the HashMap", () => {
    const map = HashMap.fromEntries([["a", 1]]);

    map.set("a", 2);

    expect(Array.from(map.entries())).toEqual([["a", 2]]);
  });
});

describe("HashMap#values()", () => {
  it("should return an iterable iterator with all values in the HashMap", () => {
    const map = HashMap.fromEntries([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);

    const values = Array.from(map.values());

    expect(values).toEqual([1, 2, 3]);
  });
  it("should return an empty iterable iterator for an empty HashMap", () => {
    const map = HashMap.empty();

    const values = Array.from(map.values());

    expect(values).toEqual([]);
  });

  it("should return an iterable iterator that can be looped over multiple times", () => {
    const map = HashMap.fromEntries([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);

    const values1 = Array.from(map.values());
    const values2 = Array.from(map.values());

    expect(values1).toEqual(values2);
  });
});
