      const {app, BrowserWindow} = require('electron')

      if (handleSquirrelEvent(app)) {
          // squirrel event handled and app will exit in 1000ms, so don't do anything else
          return;
      }
      const url = require('url')
      const path = require('path')

      let win

      function createWindow() {
         win = new BrowserWindow({width: 1220, height: 800})
         win.loadURL(url.format({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file:',
            slashes: true
         }))
        // win.openDevTools()
         win.on('closed', () => {
         // Dereference the window object, usually you would store windows
         // in an array if your app supports multi windows, this is the time
         // when you should delete the corresponding element.
         win = null
       })
      }

      app.on('ready', createWindow)
      app.on('window-all-closed', () => {
        // On macOS it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
          app.quit()
        }
      })

      app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (win === null) {
          createWindow()
        }
      })


      function handleSquirrelEvent(application) {
          if (process.argv.length === 1) {
              return false;
          }

          const ChildProcess = require('child_process');
          const path = require('path');

          const appFolder = path.resolve(process.execPath, '..');
          const rootAtomFolder = path.resolve(appFolder, '..');
          const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
          const exeName = path.basename(process.execPath);

          const spawn = function(command, args) {
              let spawnedProcess, error;

              try {
                  spawnedProcess = ChildProcess.spawn(command, args, {
                      detached: true
                  });
              } catch (error) {}

              return spawnedProcess;
          };

          const spawnUpdate = function(args) {
              return spawn(updateDotExe, args);
          };

          const squirrelEvent = process.argv[1];
          switch (squirrelEvent) {
              case '--squirrel-install':
              case '--squirrel-updated':

                  spawnUpdate(['--createShortcut', exeName]);

                  setTimeout(application.quit, 1000);
                  return true;

              case '--squirrel-uninstall':

                  spawnUpdate(['--removeShortcut', exeName]);

                  setTimeout(application.quit, 1000);
                  return true;

              case '--squirrel-obsolete':

                  application.quit();
                  return true;
          }
      };
