const { getConfig } = require('@expo/config');
const { resolve } = require('path');

const projectRoot = resolve(__dirname);
const { exp, dynamicConfigPath, staticConfigPath } = getConfig(projectRoot);

if (exp) {
  console.log('Expo configuration is valid.');
} else {
  console.error('Expo configuration is invalid.');
  if (dynamicConfigPath) {
    console.error(`Dynamic config path: ${dynamicConfigPath}`);
  }
  if (staticConfigPath) {
    console.error(`Static config path: ${staticConfigPath}`);
  }
}