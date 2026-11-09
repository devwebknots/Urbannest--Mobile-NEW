module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
        },
      },
    ],
  ],
  overrides: [
    {
      // Neyora SDK files: their '@/' means Neyora's own src
      test: /[\\/]neyora[\\/]/,
      plugins: [
        [
          'module-resolver',
          {
            root: ['../neyora/src'],
            extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
            alias: {
              '@': '../neyora/src',
            },
          },
        ],
      ],
    },
  ],
};
