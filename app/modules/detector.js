const
  cv = require('opencv4nodejs'),
  classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2)
  ;

const grabFrames = (port, delay, onFrame) => {
  const cap = new cv.VideoCapture(port);
  setInterval(() => {
    let frame = cap.read();
    if (frame.empty) {
      cap.reset();
      frame = cap.read();
    }
    onFrame(frame);
  }, 0);
};


const drawRect = (image, rect, color, opts = { thickness: 2 }) =>
  image.drawRectangle(
    rect,
    color,
    opts.thickness,
    cv.LINE_8
  );


const drawBlueRect = (image, rect, opts = { thickness: 2 }) =>
  drawRect(image, rect, new cv.Vec(255, 0, 0), opts);

const detectFaces = (img) => {
  const options = {
    minSize: new cv.Size(50, 50),
    scaleFactor: 1.2,
    minNeighbors: 2
  };
  return classifier.detectMultiScale(img.bgrToGray(), options).objects;
};

let saveFlag = false;

exports.setSaveFlag = () => { saveFlag = true; };

exports.start = (src, renderCallback, fragmentsCallback) => grabFrames(src, 1, (frame) => {

  const faceRects = detectFaces(frame);
  if (faceRects && faceRects.length) {
    if (saveFlag && fragmentsCallback) {
      const fragments = [];
      faceRects.forEach(faceRect => {
        fragments.push(frame.getRegion(faceRect));
      });
      fragmentsCallback(fragments);
      saveFlag = false;
    }
    faceRects.forEach(faceRect => drawBlueRect(frame, faceRect));
  }
  if (renderCallback) { renderCallback(frame); }

});
