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
    } else if (id === "blurOnTime") {
      result.settings.styles.blurOnTime = checked;
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
  const [key, val] = Object.entries(
    Object.fromEntries(new FormData(ev.target))
  )[0];

  browser.storage.sync.get([settingsIdentifier]).then((result) => {
    if (!result.hasOwnProperty(settingsIdentifier)) {
      browser.runtime.reload();
      return;
    }
    if (key === "itBlur") {
      result.settings.blurOnIdle.idleTimeout = val;
    } else if (key === "startTime" || key === "endTime") {
      // Handle time inputs
      if (!result.settings.timeBasedBlur) {
        result.settings.timeBasedBlur = {
          startTime: "08:30",
          endTime: "16:30",
        };
      }
      result.settings.timeBasedBlur[key] = val;
    } else {
      result.settings.varStyles[key] = val + "px";
    }
    browser.storage.sync.set(result);
  });
}

// Load settings and update switches
browser.storage.sync.get([settingsIdentifier]).then((result) => {
  if (!result.hasOwnProperty(settingsIdentifier)) {
    browser.runtime.reload();
    return;
  }

  switches.forEach((checkbox) => {
    let id = checkbox.dataset.style;
    if (id == "on") {
      checkbox.checked = result.settings.on;
    } else if (id === "blurOnTime") {
      checkbox.checked = result.settings?.styles?.blurOnTime || false;
    } else {
      checkbox.checked = result.settings.styles[id];
    }
  });

  // set variable input value
  forms.forEach((form) => {
    const input = form.querySelector(
      `input[type="number"], input[type="time"]`
    );
    const varName = input.dataset.varName;
    if (varName === "itBlur") {
      input.value = parseInt(result.settings?.blurOnIdle?.idleTimeout || 15);
    } else if (varName === "startTime" || varName === "endTime") {
      input.value =
        result.settings?.timeBasedBlur?.[varName] ||
        (varName === "startTime" ? "08:00" : "17:00");
    } else {
      input.value = parseInt(result.settings.varStyles[varName]);
    }
  });
});
