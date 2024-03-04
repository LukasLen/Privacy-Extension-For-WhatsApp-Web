/* Privacy Extension for WhatsApp(TM) Web                       */
/* Copyright (c) 2024 Lukas Lenhardt - lukaslen.com             */
/* Released under the MIT license, see LICENSE file for details */

// Remove this upon Chrome supporting the browser namespace
if (typeof browser == "undefined") {
  // Redefine browser namespace for Chrome for interoperability with Firefox
  globalThis.browser = chrome;
}

const styleIdentifier = "pfwa";
const settingsIdentifier = "settings";

let version = browser.runtime.getManifest().version;
document.getElementById('version').innerText = version;

document.querySelectorAll('[data-locale]').forEach(e => {
  e.innerText = browser.i18n.getMessage(e.dataset.locale);
});
document.querySelectorAll('[data-localetitle]').forEach(e => {
  e.title = browser.i18n.getMessage(e.dataset.localetitle);
});

let switches = document.querySelectorAll("input[type='checkbox']");

// Track switch changes and save settings
switches.forEach((checkbox) => {
  checkbox.addEventListener('change', saveSettings);
});
function saveSettings() {
  let id = this.dataset.style;
  let checked = this.checked;

  browser.storage.sync.get([settingsIdentifier]).then((result) => {
    if (!result.hasOwnProperty(settingsIdentifier)) return;
    if (id == "on") {
      result.settings.on = checked;
    } else {
      result.settings.styles[id] = checked;
    }
    browser.storage.sync.set(result);
  });
}

// Load settings and update switches
browser.storage.sync.get([settingsIdentifier]).then((result) => {
  if (!result.hasOwnProperty(settingsIdentifier)) return;

  switches.forEach((checkbox) => {
    let id = checkbox.dataset.style;
    if (id == "on") {
      checkbox.checked = result.settings.on;
    } else {
      checkbox.checked = result.settings.styles[id];
    }
  });
});


/*
// legacy code, keeping it for future reference
// message loading not implemented currently

//load message
xmlhttp=new XMLHttpRequest();
xmlhttp.onreadystatechange=function(){
  if (xmlhttp.readyState==4 && xmlhttp.status==200){
    let response = JSON.parse(xmlhttp.responseText);
    if(response["*"] && response["*"]["min"] <= version && response["*"]["max"] >= version)
      response = response["*"]["msg"];
    else
      response = response[version] ? response[version] : '';

    if(response != "" && data.currentPopupMessage != response){
      mainContent.style.display = "none";
      popupMessage.innerText = response;
      popupMessage.innerHTML += "<br><a href=\"#\" id=\"popupMessageButton\">Close message</a>";

      let popupMessageButton = document.getElementById('popupMessageButton');
      popupMessageButton.addEventListener('click', function() {
        chrome.storage.sync.set({currentPopupMessage: response});
        popupMessage.innerHTML = "";
        mainContent.style.display = "initial";
      });
    }
  }
}
xmlhttp.open("GET", "https://lukaslen.com/message/pfwa.json", true);
xmlhttp.send();
*/