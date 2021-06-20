import { app, BrowserWindow } from 'electron';
import { handleSquirrelEvent } from './squirrelEvents';
import updater = require('update-electron-app');

if (require('electron-squirrel-startup')) app.quit();

if (app.isPackaged && handleSquirrelEvent(app)) app.exit(0);

const lock = app.requestSingleInstanceLock();

if (!lock) app.quit(); // if a second instance of the app is opened, make it quit and focus the main window

updater({
    notifyUser: false
});

let win: BrowserWindow;

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 550,
        title: "Desktop Actions",
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            devTools: false
        },
        resizable: false
    });
    win.loadFile('index.html');
    win.hide();
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
    app.setAppUserModelId(app.isPackaged ? 'com.squirrel.DesktopActions.DesktopActions' : process.execPath);
});


app.on('window-all-closed', () => {
    if (process.platform === 'darwin') app.quit();
});

app.on('quit', () => {
  app.quit();
})

app.on('second-instance', () => {
    if (win) {
        win.show();
    }
});
