import { generateShortId, sha256 } from "../../../../src/url/shortener-service";

describe("generateShortId", () => {
  test("should generate a 7 character string", () => {
    const url = "https://www.google.com";
    const shortId = generateShortId(url);
    expect(shortId.length).toBe(7);
  });

  test("should generate a unique string for each URL", () => {
    const url1 = "https://www.twitter.com";
    const url2 = "https://www.google.com";
    const shortId1 = generateShortId(url1);
    const shortId2 = generateShortId(url2);
    expect(shortId1).not.toBe(shortId2);
  });
});

describe("sha256", () => {
  test("should return a 64-character string", () => {
    const content = "https://www.google.com";
    const salt = "17aaefaa715aa4059bf3ee1dae17b9b0";
    const hash = sha256(content, salt);
    expect(hash.length).toBe(64);
  });

  test("should return the same hash for the same content and salt", () => {
    const content = "https://www.google.com";
    const salt = "d7b4159189063db3298de7536adc9199";
    const hash1 = sha256(content, salt);
    const hash2 = sha256(content, salt);
    expect(hash1).toBe(hash2);
  });

  test("should return different hashes for different content or salt", () => {
    const content1 = "https://www.google.com";
    const content2 = "https://www.twitter.com";
    const salt1 = "e6fd31f0d9a3a9ab36f39213e17b5d66";
    const salt2 = "ccefd9b57053c186a7ddc696e4aaaa94";
    const hash1 = sha256(content1, salt1);
    const hash2 = sha256(content1, salt2);
    const hash3 = sha256(content2, salt1);
    expect(hash1).not.toBe(hash2);
    expect(hash1).not.toBe(hash3);
  });
});
