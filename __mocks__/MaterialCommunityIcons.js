const React = require('react');
const { Text } = require('react-native');

module.exports = function MockMaterialCommunityIcon({ name }) {
  return React.createElement(Text, null, name);
};
