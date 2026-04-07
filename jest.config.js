module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/libs"],
    testMatch: ["**/*.spec.ts"],
    moduleFileExtensions: ["ts", "js", "json"],
    collectCoverageFrom: ["libs/**/*.ts", "!libs/**/*.spec.ts", "!libs/**/index.ts"],
    coveragePathIgnorePatterns: ["/node_modules/", "/test-results/"],
    extensionsToTreatAsEsm: [".ts"],
    transform: {
        "^.+\\.ts$": ["ts-jest", {
            useESM: true,
            tsconfig: {
                esModuleInterop: true,
                allowSyntheticDefaultImports: true
            }
        }]
    },
    transformIgnorePatterns: [
        "node_modules/(?!@faker-js)"
    ],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/$1",
        "^@utils/(.*)$": "<rootDir>/libs/utils/$1",
        "^@keywords/(.*)$": "<rootDir>/libs/keywords/$1",
        "^@pages/(.*)$": "<rootDir>/libs/pages/$1",
        "^@constants/(.*)$": "<rootDir>/libs/constants/$1",
        "^@workflows/(.*)$": "<rootDir>/libs/workflows/$1",
        "^@core(.*)$": "<rootDir>/libs/core$1",
        "^@libs/(.*)$": "<rootDir>/libs/$1"
    }
};
