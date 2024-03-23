module.exports = {
  ...require('eslint-config-custom/eslint-nest'),
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
};
