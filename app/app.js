const
  configManager = require('./modules/configManager'),
  config = configManager.get(),
  electron = require('electron'),
  remote = electron.remote,
  mainProcess = remote.require('./main'),
  canvasRenderer = require('./modules/canvasRenderer'),
  detector = require('./modules/detector'),
  cv = require('opencv4nodejs'),
  fs = require('fs')
  ;

document.getElementById('selectDirectory').addEventListener('click', () => {
  mainProcess.selectDirectory((data) => {
    config.facesDir = data ? data[0] : config.facesDir;
    configManager.save(config);
    updateUI();
  });
});


document.getElementById('saveFaces').addEventListener('click', () => {
  detector.setSaveFlag();
});

function updateUI() {
  document.getElementById('facesDir').innerText = config.facesDir ? config.facesDir : config.facesDirNotSelected;
  document.getElementById('saveFaces').disabled = !config.facesDir;
}

detector.start(0, image => {
  canvasRenderer.renderImage(image, document.getElementById('img'));
}, fragments => {
  let counter = 1;
  let name = Date.now();
  fragments.forEach(fragment => {
    fs.writeFile(`${config.facesDir}/${name}_${counter}.jpg`, cv.imencode('.jpg', fragment));
    counter++;
  });
});

updateUI();
