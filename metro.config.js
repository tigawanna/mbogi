const { getDefaultConfig } = require('expo/metro-config');
const { withRozenite } = require('@rozenite/metro');
// const { withRozeniteExpoAtlasPlugin } = require('@rozenite/expo-atlas-plugin');

const config = getDefaultConfig(__dirname);

// module.exports = withRozenite(withRozeniteExpoAtlasPlugin(config), {
//   // Your Rozenite configuration
// });

module.exports = withRozenite(config);
