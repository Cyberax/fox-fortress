// This is the low-security side of the extension that works in the context of the webpage.
// It doesn't have full access to the browser's API

// Get the settings for the target account
const name = document.getElementById('account-name').innerText;
const role = document.getElementById('role-name').innerText;
const url = document.querySelector('a').href;

// Send the settings to the high-security side of the extension
browser.runtime.sendMessage({"url": url, "name": name, "role": role});

//window.close();
