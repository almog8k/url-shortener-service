module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  modulePathIgnorePatterns: [".dist"],
  testMatch: ["<rootDir>/tests/integration/**/*.test.ts"],
  rootDir: "../../../.",
};
