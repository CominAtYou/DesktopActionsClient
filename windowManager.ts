import { remote } from "electron";
document.getElementById('close').addEventListener('click', (e) => {
    e.preventDefault();
    remote.getCurrentWindow().hide();
});
