const
  fs = require('fs'),
  path = require('path'),
  configFile = path.resolve('app', 'config.json')
  ;

function saveConfig(config) {
  fs.writeFile(configFile, JSON.stringify(config));
}
function readConfig() {
  return JSON.parse(fs.readFileSync(configFile));
}

module.exports = {
  get: readConfig,
  save: saveConfig
};
