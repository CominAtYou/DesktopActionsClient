import { v4 } from "uuid"

if (window.localStorage.getItem('token') === null) {
    const token = v4().replace(/-/g, "");
    window.localStorage.setItem('token', token);
}
(document.getElementById('tokenInput') as HTMLInputElement).value = window.localStorage.getItem('token');
