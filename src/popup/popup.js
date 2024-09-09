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
    if (!result.hasOwnProperty(settingsIdentifier)) {
      browser.runtime.reload();
      return;
    }
    if (id == "on") {
      result.settings.on = checked;
    } else if (id === "blurOnIdle") {
      result.settings.blurOnIdle.isEnabled = checked;
    } else {
      result.settings.styles[id] = checked;
    }
    browser.storage.sync.set(result);
  });
}

// toggle open/close blur amount settings
const showBlurSettings = (ev) => {
  ev.currentTarget.classList.toggle("active");
  ev.currentTarget.parentNode.querySelector(".collapsible").classList.toggle("show");
}
const revealButtons = document.querySelectorAll(".reveal-btn");
revealButtons.forEach((revealBtn) => {
  revealBtn.addEventListener("click", showBlurSettings)
})

// track form save/submit for variable style settings
const forms = document.querySelectorAll("form.var-style");

forms.forEach((form) => {
  form.addEventListener("submit", saveFormSettings);
})
function saveFormSettings(ev) {
  ev.preventDefault();
  const [key, val] = Object.entries(Object.fromEntries(new FormData(ev.target)))[0];

  browser.storage.sync.get([settingsIdentifier]).then((result) => {
    if (!result.hasOwnProperty(settingsIdentifier)) return;
    if (key === "itBlur") {
      result.settings.blurOnIdle.idleTimeout = val;
    } else {
      result.settings.varStyles[key] = val + "px";
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
    } else if (id === "blurOnIdle") {
      checkbox.checked = result.settings?.blurOnIdle?.isEnabled;
    } else {
      checkbox.checked = result.settings.styles[id];
    }
  });

  // set variable input value
  forms.forEach((form) => {
    const numInput = form.querySelector(`input[type="number"]`)
    const varName = numInput.dataset.varName;
    if (varName === "itBlur") {
      numInput.value = parseInt(result.settings?.blurOnIdle?.idleTimeout || 15);
    } else {
      numInput.value = parseInt(result.settings.varStyles[varName]);
    }
  })
  
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