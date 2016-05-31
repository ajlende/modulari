import {app, BrowserWindow, shell} from 'electron';
import {EventEmitter} from 'events';
import path from 'path';

import AppMenu from './app-menu';
import AppWindow from './app-window';

class Application extends EventEmitter {

  /**
   * Load components and create the main window.
   *
   * @param {Object} manifest
   * @param {Object} options
   */
  constructor() {
    super();

    // Quit the app when all the windows are closed, except for darwin
    app.on('window-all-closed', function () {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    // Create and set the default menu
    this.menu = this.createMenu();
    this.menu.makeDefault();

    // Create and show the main window
    this.mainWindow = new AppWindow();
    this.mainWindow.loadURL(`file://${path.resolve(__dirname, '..', '..', 'html', 'default.html')}`);
  }

  /**
   * Create an app menu and set listeners.
   *
   * @return {AppMenu}
   */
  createMenu() {
    const menu = new AppMenu();

    // Handle application events
    menu.on('application:quit', ::app.quit);

    menu.on('application:show-settings', function () {

    });

    menu.on('application:open-url', function (menuItem) {
      shell.openExternal(menuItem.url);
    });

    // Handle window events
    menu.on('window:reload', function () {
      BrowserWindow.getFocusedWindow().reload();
    });

    menu.on('window:toggle-full-screen', function () {
      const focusedWindow = BrowserWindow.getFocusedWindow();
      focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
    });

    menu.on('window:toggle-dev-tools', function () {
      BrowserWindow.getFocusedWindow().toggleDevTools();
    });

    return menu;
  }

}

export default Application;
