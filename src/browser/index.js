import {app} from 'electron';
import devTools from 'electron-debug';

import Application from './application';

// Set up dev tool shortcuts
devTools({showDevTools: true});

// Log uncaught exceptions
process.on('uncaughtException', error => console.error(error.stack));

(function main() {
  app.on('ready', function () {
    global.application = new Application();
  });
})();
