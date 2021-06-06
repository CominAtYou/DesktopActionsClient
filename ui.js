const portBox = document.getElementById('portInput');
portBox.addEventListener('change', () => {
   if (portBox.value === "e") portBox.value = "";
   else if (parseInt(portBox.value) > 65535) portBox.value = new String(65535);
   else if (parseInt(portBox.value) < 1) portBox.value = new String(1);
   else {
      window.localStorage.setItem('port', portBox.value)
   }
});

const checkbox = document.getElementById('notifCheckbox');

checkbox.addEventListener('click', () => {
   if (checkbox.checked) {
      window.localStorage.setItem('notificationsEnabled', true);
   }
   else {
      window.localStorage.setItem('notificationsEnabled', false)
   }
})

if (window.localStorage.getItem('notificationsEnabled') === 'true') {
   checkbox.checked = true;
}

const tokenBox = document.getElementById('tokenInput');

tokenBox.addEventListener('change', () => {
   if (tokenBox.value.length > 32 && tokenBox.value.length < 8) return;
   localStorage.setItem('token', tokenBox.value);
});


// initial setup
if (window.localStorage.getItem('notificationsEnabled') === null) {
   window.localStorage.setItem('notificationsEnabled', true)
   checkbox.checked = true;
}
if (window.localStorage.getItem('port') === null) {
   window.localStorage.setItem('port', Math.floor(Math.random() * (10000 - 1000) + 1000));
}
portBox.value = window.localStorage.getItem('port');

