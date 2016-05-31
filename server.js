import {app, BrowserWindow, globalShortcut as Shortcut} from 'electron';
import path from 'path';
import devTools from 'electron-debug';

devTools({showDevTools: true});

let win = null;

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  win = new BrowserWindow({width: 1280, height: 720});
  win.setMenu(null);
  win.loadURL(path.join('file://', __dirname, '/src/index.html'));

  win.on('closed', () => {
    win = null;
  });

  Shortcut.register('Control+Q', () => {
    win.close();
  });
});
