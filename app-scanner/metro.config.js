const {getDefaultConfig} = require('expo/metro-config');
const {withTamagui} = require('@tamagui/metro-plugin');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push('sql');
config.resolver.unstable_enablePackageExports = false;

module.exports = withTamagui(config, {
    components: ['tamagui'],
    config: './tamagui.config.ts',
});
