const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = function override(config, env) {
  let options = {
    languages: ['json','javascript', 'racket', 'julia', 'python', 'scheme', 'racket'],
    }
  config.plugins.push(new MonacoWebpackPlugin({
  }));
  return config;
}