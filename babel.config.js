module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        alias: {
          '@api': './src/api',
          '@assets': './src/assets',
          '@components': './src/components',
          '@constants': './src/constants', 
          '@hooks': './src/hooks',
          '@navigation': './src/navigation',
          '@screens': './src/screens',
          '@stores': './src/stores',
          '@theme': './src/theme',
          '@app-types': './src/types',
          '@utils': './src/utils',
          '@lib': './src/lib',
        },
      },
    ],
  ],
};