export default {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    moduleNameMapper: {
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
        "^wouter$": "<rootDir>/node_modules/wouter/esm/index.js",
    },
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    transform: {
        "^.+\\.tsx?$": "ts-jest",
        "^.+\\.(t|j)sx?$": ["@swc/jest"],
    },
};
