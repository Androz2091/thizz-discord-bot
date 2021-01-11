module.exports = {
    env: {
        es2021: true,
        node: true
    },
    extends: [
        'google'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module'
    },
    plugins: [
        '@typescript-eslint'
    ],
    rules: {
        'require-jsdoc': 0,
        indent: ['error', 4],
        'quote-props': ['error', 'as-needed'],
        'comma-dangle': ['error', 'never'],
        'space-before-function-paren': ['error', 'always'],
        'max-len': 0,
        'object-curly-spacing': ['error', 'always']
    }
};
