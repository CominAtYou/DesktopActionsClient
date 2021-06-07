// @ts-check
const { version } = require('./values.js')
const electronInstaller = require('electron-winstaller');

async function install() {
    const start = new Date().getTime() / 1000;
    try {
        await electronInstaller.createWindowsInstaller({
            appDirectory: './bin/DesktopActions-win32-x64',
            outputDirectory: './bin/installers',
            authors: "CominAtYou",
            exe: "DesktopActions.exe",
            name: "DesktopActions",
            title: "Desktop Actions",
            loadingGif: './bin/DesktopActions-win32-x64/resources/app/assets/setupIcon.gif',
            noMsi: true,
            version: version,
            iconUrl: "https://cdn.cominatyou.com/appicon.ico",
            description: "Desktop Actions",
            setupIcon: './bin/DesktopActions-win32-x64/resources/app/assets/appicon.ico',
            setupExe: "DesktopActionsSetup.exe",
        });
        console.log(`Installer created! Took ${Math.round(new Date().getTime() / 1000 - start)}s`);
    }
    catch(e) {
        console.error(`Installer creation failed in ${Math.round(new Date().getTime() / 1000 - start)}s: ${e.message}`);
        process.exit(1);
    }
}

install();
