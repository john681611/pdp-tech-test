
module.exports = {

    extends: 'eslint:recommended',

    env: {
        'browser': true,
        'es6': true,
        'node': true,
        'commonjs': true,
        'mocha': true
    },
    globals: {
        chai: true,
        expect: true,
        sinon: true,
        browser: true,
        Zone: true,
        $: true
    },

    parserOptions: {
        ecmaVersion: 2017,
        sourceType: 'module',
        ecmaFeatures: {
            ecmaVersion: true
        }
    },

    rules: {
        'array-bracket-spacing': ['error', 'never'],
        'arrow-spacing': ['error'],
        'block-spacing': ['error', 'never'],
        'camelcase': ['error', { 'properties': 'always' }],
        'class-methods-use-this': ['error'],
        'comma-dangle': ['error', 'never'],
        'comma-style': ['error', 'last'],
        'comma-spacing': ['error'],
        'complexity': ['error', { 'max': 8 }],
        'consistent-return': ['error'],
        'curly': ['error', 'all'],
        'dot-notation': ['error', { 'allowKeywords': true }],
        'eqeqeq': ['error', 'smart'],
        'func-style': ['error', 'declaration', { 'allowArrowFunctions': true }],
        'guard-for-in': ['error'],
        'getter-return': ['error'],
        'indent': ['error', 4, { 'SwitchCase': 1 }], //eslint-disable-line no-magic-numbers
        'lines-between-class-members': ['error', 'always'],
        'max-statements-per-line': ['error', { 'max': 1 }],
        'max-depth': ['error', 3], //eslint-disable-line no-magic-numbers
        'no-use-before-define': ['error', 'nofunc'],
        'no-mixed-spaces-and-tabs': ['error'],
        'no-bitwise': ['error'],
        'new-cap': ['error'],
        'no-caller': ['error'],
        'no-trailing-spaces': ['error', { 'skipBlankLines': false }],
        'no-unused-vars': ['error', { 'vars': 'all', 'args': 'after-used' }],
        'no-undef': ['error'],
        'no-redeclare': ['error', { 'builtinGlobals': true }],
        'no-return-await': ['error'],
        'no-template-curly-in-string': ['error'],
        'no-invalid-this': ['error'],
        'no-alert': ['error'],
        'no-extra-parens': ['error'],
        'no-else-return': ['error', { 'allowElseIf': false }],
        'no-empty-function': ['error'],
        'no-magic-numbers': ['error', { 'ignore': [-1, 0, 1, 200, 404, 500], 'ignoreArrayIndexes': true }],
        'no-self-compare': ['error'],
        'no-useless-concat': ['error'],
        'no-multiple-empty-lines': ['error'],
        'no-lonely-if': ['error'],
        'prefer-const': ['error'],
        'quotes': ['error', 'single'],
        'require-await': ['error'],
        'semi': ['error', 'always'],
        'strict': ['error', 'function']
    }

};
