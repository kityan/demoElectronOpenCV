const electron = require('electron');
const { app, BrowserWindow } = electron;

let win;
const createWindow = () => {
  win = new BrowserWindow({
    width: 1024,
    height: 600,
    toolbar: false,
    resizable: true
  });

  win.setResizable(true);
  win.loadURL('file://' + __dirname + '/app/index.html');

  win.on('closed', () => {
    win = null;
  });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});


exports.selectDirectory = function (cb) {
  cb(electron.dialog.showOpenDialog(win, {
    properties: ['openDirectory']
  }));
};
