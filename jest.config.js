const { compilerOptions } = require('./tsconfig.json')
const { pathsToModuleNameMapper } = require('ts-jest/utils')

module.exports = {
  clearMocks: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>' }),
  preset: 'ts-jest',
  testEnvironment: "node",
  moduleDirectories: ['node_modules'],
  transform: {
    '.+\\.ts$': 'ts-jest',
  },
};
