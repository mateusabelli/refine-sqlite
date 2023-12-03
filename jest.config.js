module.exports = {
    preset: "ts-jest",
    rootDir: "./",
    displayName: "refine-sqlite",
    setupFilesAfterEnv: ["<rootDir>/test/jest.setup.ts"],
    testEnvironment: "node",
};