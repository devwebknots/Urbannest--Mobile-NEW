const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);

// Neyora maintenance SDK, installed from the sibling folder (demo)
const neyoraRoot = path.resolve(__dirname, '../neyora');
const toPattern = dir =>
  new RegExp(`^${path.join(neyoraRoot, dir).replace(/[\\/]/g, '[\\\\/]')}[\\\\/].*`);

const config = {
  watchFolders: [neyoraRoot],
  resolver: {
    extraNodeModules: {
      '@': path.resolve(__dirname, 'src'),
    },
    // Load react, navigation and redux only once, from this app
    nodeModulesPaths: [path.resolve(__dirname, 'node_modules')],
    blockList: [].concat(
      defaultConfig.resolver.blockList,
      ['node_modules', 'android', 'ios'].map(toPattern),
    ),
  },
};

module.exports = mergeConfig(defaultConfig, config);
