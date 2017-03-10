'use strict';

module.exports = {
  extends: 'smartcar',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  rules: {
    curly: 'off',
    'arrow-parens': ['error', 'as-needed', {'requireForBlockBody': false}]
  },
};
