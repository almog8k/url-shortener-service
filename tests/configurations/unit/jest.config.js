module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  modulePathIgnorePatterns: [".dist"],
  testMatch: ["<rootDir>/tests/unit/**/*.test.ts"],
  rootDir: "../../../.",
};
