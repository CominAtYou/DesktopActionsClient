import { app, BrowserWindow } from 'electron';
import { handleSquirrelEvent } from './squirrelEvents';

if (require('electron-squirrel-startup')) app.quit();

if (app.isPackaged) {
    if (handleSquirrelEvent(app)) app.exit(0);
}

let win: BrowserWindow;

if (app.isPackaged && !process.argv.includes('--squirrel-firstrun')) {
    require('update-electron-app')();
}

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

const lock = app.requestSingleInstanceLock();

if (!lock) {
    app.quit();
} else {
    app.on('second-instance', () => {
        if (win) {
            win.show();
        }
    })
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
    app.setAppUserModelId(process.execPath)
});


app.on('window-all-closed', () => {
    if (process.platform === 'darwin') app.quit();
});


