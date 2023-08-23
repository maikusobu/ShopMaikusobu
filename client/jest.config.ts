/// <reference types="vite/client" />
import type { Config } from "@jest/types";
const config: Config.InitialOptions = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        diagnostics: {
          ignoreCodes: [1343],
        },
        astTransformers: {
          before: [
            {
              path: "ts-jest-mock-import-meta",
              options: {
                metaObjectReplacement: {
                  // env: {
                  //   ...import.meta.env,
                  // },
                },
              },
            },
          ],
        },
      },
    ],
  },
  moduleNameMapper: {
    "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/src/test/__mocks__/fileMock.js",
  },
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.jest.json",
      useESM: true,
      typescript: require.resolve("typescript"),
    },
  },
};
export default config;
