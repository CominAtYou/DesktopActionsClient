import express = require('express');
import cp = require('child_process');
import { compare } from 'compare-versions';
import os = require('os');
import { requiredAppVersion, version } from './values';
import { remote, nativeImage } from 'electron';
let paused = false;
const port = window.localStorage.getItem('port');
const expApp = express();

expApp.use(express.json());

if (os.platform() === "win32") {
    var commands = {
        lock: "rundll32.exe user32.dll,LockWorkStation",
        sleep: "rundll32.exe powrprof.dll,SetSuspendState 0,1,0",
        shutdown: "shutdown -s /hybrid -t 0 -f"
    };
}

expApp.get('/onlineCheck', (req, res) => {
    if (req.header("Authorization") === `Token ${window.localStorage.getItem('token')}`) {
        try {
            var isCompatible = compare(req.header('appVersion'), requiredAppVersion, '>=');
        }
        catch {
            res.status(400);
            res.send();
            return;
        }
        if (!isCompatible) {
            res.status(200);
            res.send(JSON.stringify({ code: 200, status: "versionTooOld" }));
        } else {
            if (os.platform() === "win32") {
                cp.exec(`powershell -Command try { if (Get-Process logonui -ErrorAction stop) { Write-Output "true" } } catch { Write-Output "false" }`, (error, stdout) => {
                    let out = stdout.replace("\r\n", "");
                    if (error !== null) {
                        res.status(200);
                        res.send(JSON.stringify({ code: 200, status: "OK", paused: paused }));
                    }
                    else if (out === "true") {
                        res.status(200);
                        res.send(JSON.stringify({ code: 200, status: "locked", paused: paused }));
                    } else {
                        res.status(200);
                        res.send(JSON.stringify({ code: 200, status: "OK", paused: paused }));
                    }
                });
            }
            else {
                res.status(200);
                res.send(res.send(JSON.stringify({ code: 200, status: "OK", paused: paused })));
            }
        }
    } else {
        res.status(401);
        res.send(JSON.stringify({ code: 401, message: "Unauthorized" }));
    }
});

expApp.post('/', (req, res) => {
    if (req.header("Authorization") === `Token ${window.localStorage.getItem('token')}`) {
        try { // nuke all of this eventually lol
            var isCompatible = compare(req.body.version || req.header('appVersion'), requiredAppVersion, '>=');
        }
        catch {
            res.status(400);
            res.send();
            return;
        }
        if (!isCompatible) {
            res.status(200);
            res.send(JSON.stringify({ code: 200, status: "versionTooOld" }));
        }
        else if (paused) {
            if (os.platform() === "win32") {
                cp.exec(`powershell -Command try { if (Get-Process logonui -ErrorAction stop) { Write-Output "true" } } catch { Write-Output "false" }`, (error, stdout) => {
                    let out = stdout.replace("\r\n", "");
                    if (error !== null) {
                        res.status(200);
                        res.send(JSON.stringify({ code: 200, status: "OK", paused: true }));
                    }
                    else if (out === "true") {
                        res.status(200);
                        res.send(JSON.stringify({ code: 200, status: "locked", paused: true }));
                    } else {
                        res.status(200);
                        res.send(JSON.stringify({ code: 200, status: "OK", paused: true }));
                    }
                });
            }
            else {
                res.status(200);
                res.send(JSON.stringify({ code: 200, status: "OK", paused: true }));
            }
        }
        else if (req.body.action === "shutdown") {
            res.status(200);
            res.send(JSON.stringify({ code: 200, status: "OK", paused: paused }));
            const shutdownTimeout = setTimeout(() => cp.exec(commands.shutdown), 10000);
            if (window.localStorage.getItem('notificationsEnabled') === "true") {
                const shutdownNotif = new Notification("Shutdown Remotely Requested", {
                    body: "Your PC will shut down in 10 seconds. Click to cancel.",
                    icon: './assets/power-icon.png'
                })
                shutdownNotif.onclick = () => {
                    clearTimeout(shutdownTimeout);
                };
            }
        }
        else if (req.body.action === "lock") {
            cp.exec(`powershell -Command try { if (Get-Process logonui -ErrorAction stop) { Write-Output "true" } } catch { Write-Output "false" }`, (error, stdout) => {
                let out = stdout.replace("\r\n", "");
                if (error !== null) {
                    cp.exec(commands.lock);
                    res.status(200);
                    res.send(JSON.stringify({ code: 200, status: "OK", paused: paused }));
                }
                else if (out === "true") {
                    res.status(200);
                    res.send(JSON.stringify({ code: 200, status: "locked", paused: paused }));
                } else {
                    cp.exec(commands.lock);
                    res.status(200);
                    res.send(JSON.stringify({ code: 200, status: "OK", paused: paused }));
                }
            });
        }
        else if (req.body.action === "sleep") {
            const sleepTimeout = setTimeout(() => {
                cp.exec(commands.sleep);
            }, 10000);
            res.status(200);
            res.send(JSON.stringify({ code: 200, status: "OK", paused: paused }));
            if (window.localStorage.getItem('notificationsEnabled') === "true") {
                const sleepNotification = new Notification("Sleep Remotely Requested", {
                    body: "Your PC will sleep in 10 seconds. Click to cancel.",
                    icon: './assets/sleep.png'
                });
                sleepNotification.onclick = () => {
                    clearTimeout(sleepTimeout);
                };
            }
        }
        else {
            res.status(400);
            res.send(JSON.stringify({ code: 400, message: "Bad Request" }));
        }
    }
    else {
        res.status(401);
        res.send(JSON.stringify({ code: 401, message: "Unauthorized" }));
    }
});

const tray = new remote.Tray(nativeImage.createFromDataURL('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAAQUlEQVQ4y2NgGCbgv8f/x/+JAAgNj/7/J00DMocoJ1FTw/8jKK46QlgDNn8Q0oDBHtVASAOhtIMhRn0N2JLGEAcAhfpU3HppicwAAAAASUVORK5CYII='));
const contextMenu = remote.Menu.buildFromTemplate([
    {label: `Version ${version}`, type: "normal",},
    {label: "Pause", type: "checkbox", checked: false, click: () => {
        paused = !paused;
    }},
    {label: "Quit", type: "normal", click: () => {
        remote.app.quit();
    }}
]);
tray.setToolTip('Desktop Actions');
tray.setContextMenu(contextMenu);
tray.addListener('click', () => {
    remote.getCurrentWindow().show();
})
expApp.listen(port);
