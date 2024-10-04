import { describe, expect, it } from "vitest";

import { HashMap } from "./HashMap.js";

describe("HashMap.empty()", () => {
  it("creates a new empty HashMap", () => {
    const map = HashMap.empty<number, string>();

    expect([...map]).toEqual([]);
  });

  it("uses the identity function as the hashing function", () => {
    const map = HashMap.empty<number, string>();

    map.set(1, "one");

    expect([...map]).toEqual([[1, "one"]]);
  });
});

describe("HashMap.emptyWithCustomHash()", () => {
  describe("using ISO string representation of Date objects as hash keys", () => {
    it("creates a new empty HashMap", () => {
      const map = HashMap.emptyWithCustomHash<Date, number, string>({
        onHash(key: Date) {
          return key.toISOString();
        },
      });

      expect([...map]).toEqual([]);
    });

    it("uses the identity function as the hashing function", () => {
      const map = HashMap.emptyWithCustomHash<Date, number, string>({
        onHash(key: Date) {
          return key.toISOString();
        },
      });

      map.set(new Date("2020-01-01"), 1);

      expect([...map]).toEqual([["2020-01-01T00:00:00.000Z", 1]]);
    });
  });
});

describe("HashMap.fromCustomEntries()", () => {
  describe("using ISO string representation of Date objects as hash keys", () => {
    it("creates a new HashMap with the given entries", () => {
      const map = HashMap.fromCustomEntries(
        [
          [new Date("2020-01-01"), 1],
          [new Date("2020-02-01"), 2],
          [new Date("2020-03-01"), 3],
        ],
        {
          onHash(key) {
            return key.toISOString();
          },
        },
      );

      expect([...map]).toEqual([
        ["2020-01-01T00:00:00.000Z", 1],
        ["2020-02-01T00:00:00.000Z", 2],
        ["2020-03-01T00:00:00.000Z", 3],
      ]);
    });

    it("uses the hash function to hash Date object keys as ISO strings", () => {
      const map = HashMap.fromCustomEntries(
        [
          [new Date("2020-01-01"), 1],
          [new Date("2020-02-01"), 2],
          [new Date("2020-03-01"), 3],
        ],
        {
          onHash(key) {
            return key.toISOString();
          },
        },
      );

      map.set(new Date("2020-04-01"), 4);

      expect([...map]).toEqual([
        ["2020-01-01T00:00:00.000Z", 1],
        ["2020-02-01T00:00:00.000Z", 2],
        ["2020-03-01T00:00:00.000Z", 3],
        ["2020-04-01T00:00:00.000Z", 4],
      ]);
    });
  });
});

describe("HashMap.fromEntries()", () => {
  it("creates a new HashMap with the given entries", () => {
    const map = HashMap.fromEntries<number, string>([
      [1, "one"],
      [2, "two"],
      [3, "three"],
    ]);

    expect([...map]).toEqual([
      [1, "one"],
      [2, "two"],
      [3, "three"],
    ]);
  });

  it("uses the identity function as the hashing function", () => {
    const map = HashMap.fromEntries<number, string>([
      [1, "one"],
      [2, "two"],
      [3, "three"],
    ]);

    map.set(4, "four");

    expect([...map]).toEqual([
      [1, "one"],
      [2, "two"],
      [3, "three"],
      [4, "four"],
    ]);
  });
});

describe("HashMap.clear()", () => {
  it("clears a map with entries", () => {
    const map = HashMap.fromEntries<number, string>([
      [1, "one"],
      [2, "two"],
      [3, "three"],
    ]);

    map.clear();

    expect([...map]).toEqual([]);
  });
});

describe("HashMap.delete()", () => {
  it("deletes the entry with the given key if it exists", () => {
    const map = HashMap.fromEntries<number, string>([
      [1, "one"],
      [2, "two"],
      [3, "three"],
    ]);

    map.delete(2);

    expect([...map]).toEqual([
      [1, "one"],
      [3, "three"],
    ]);
  });

  it("throws a HashMap.MissingKeyError if the key does not exist", () => {
    const map = HashMap.fromEntries<number, string>([
      [1, "one"],
      [2, "two"],
      [3, "three"],
    ]);

    expect(() => {
      map.delete(4);
    }).toThrowError(HashMap.MissingKeyError);
  });
});

describe("HashMap.deleteIfExists()", () => {
  it("deletes the entry with the given key if it exists and returns true", () => {
    const map = HashMap.fromEntries<number, string>([
      [1, "one"],
      [2, "two"],
      [3, "three"],
    ]);

    const result = map.deleteIfExists(2);

    expect(result).toBe(true);

    expect([...map]).toEqual([
      [1, "one"],
      [3, "three"],
    ]);
  });

  it("returns false if the key does not exist", () => {
    const map = HashMap.fromEntries<number, string>([
      [1, "one"],
      [2, "two"],
      [3, "three"],
    ]);

    const result = map.deleteIfExists(4);

    expect(result).toBe(false);

    expect([...map]).toEqual([
      [1, "one"],
      [2, "two"],
      [3, "three"],
    ]);
  });
});

describe("HashMap.entries()", () => {
  it("returns the entries of the map as key-value array of `[key, value]`", () => {
    const map = HashMap.fromEntries<number, string>([
      [1, "one"],
      [2, "two"],
      [3, "three"],
    ]);

    const entries = map.entries();

    expect([...entries]).toEqual([
      [1, "one"],
      [2, "two"],
      [3, "three"],
    ]);
  });
});

describe("HashMap.filter()", () => {
  it("returns a new map with entries where the value has a length greater than 3", () => {
    const map = HashMap.fromEntries<number, string>([
      [1, "one"],
      [2, "two"],
      [3, "three"],
      [4, "four"],
    ]);

    const filtered = map.filter((value) => value.length > 3);

    expect([...filtered]).toEqual([
      [3, "three"],
      [4, "four"],
    ]);

    expect([...map]).toEqual([
      [1, "one"],
      [2, "two"],
      [3, "three"],
      [4, "four"],
    ]);
  });

  it("returns a new map with entries where the key is greater than 2", () => {
    const map = HashMap.fromEntries<number, string>([
      [1, "one"],
      [2, "two"],
      [3, "three"],
      [4, "four"],
    ]);

    const filtered = map.filter((_, key) => key > 2);

    expect([...filtered]).toEqual([
      [3, "three"],
      [4, "four"],
    ]);

    expect([...map]).toEqual([
      [1, "one"],
      [2, "two"],
      [3, "three"],
      [4, "four"],
    ]);
  });

  it("passes the index of the entry being filtered as the third argument of the filter predicate", () => {
    const map = HashMap.fromEntries<number, string>([
      [1, "one"],
      [2, "two"],
      [3, "three"],
      [4, "four"],
    ]);

    let counter = 0;

    map.filter((_, __, index) => {
      expect(counter).toEqual(index);

      counter++;

      return true;
    });
  });

  it("passes the map being filtered as the fourth argument of the filter predicate", () => {
    const map = HashMap.fromEntries<number, string>([[1, "one"]]);

    map.filter((_, __, ___, original) => {
      expect(original).toBe(map);

      return true;
    });
  });
});
