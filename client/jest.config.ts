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
        tsconfig: "tsconfig.jest.json",
        useESM: true,
        typescript: require.resolve("typescript"),
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
};
export default config;
