import { describe, expect, it } from "vitest";

import { identity } from "./identity.js";

describe("identity", () => {
  it("should return a function that always returns the given value", () => {
    const value = 42;
    expect(identity(value)).toBe(value);
  });

  it("should return a function that always returns the given object", () => {
    const obj = { age: 30, name: "John" };
    expect(identity(obj)).toBe(obj);
  });

  it("should return a function that always returns the given array", () => {
    const arr = [1, 2, 3];
    expect(identity(arr)).toBe(arr);
  });

  it("should return a function that always returns the given string", () => {
    const str = "Hello, world!";
    expect(identity(str)).toBe(str);
  });

  it("should return a function that always returns the given boolean", () => {
    const bool = true;
    expect(identity(bool)).toBe(bool);
  });
});
