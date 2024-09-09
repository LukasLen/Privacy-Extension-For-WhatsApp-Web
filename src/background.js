/* Privacy Extension for WhatsApp(TM) Web                       */
/* Copyright (c) 2024 Lukas Lenhardt - lukaslen.com             */
/* Released under the MIT license, see LICENSE file for details */

// Remove this upon Chrome supporting the browser namespace
if (typeof browser == "undefined") {
  // Redefine browser namespace for Chrome for interoperability with Firefox
  globalThis.browser = chrome;
}

const settingsIdentifier = "settings";
const defaultSettings = {
  settings: {
    on: true,
    currentPopupMessage: "",
    styles: {
      mediaGallery: true,
      mediaPreview: true,
      messages: true,
      messagesPreview: true,
      name: false,
      noDelay: false,
      profilePic: false,
      textInput: true,
      unblurActive: false
    },
    varStyles: {
      mdgBlur: "20px",
      mdpBlur: "20px",
      msBlur: "8px",
      mspBlur: "8px",
      nmBlur: "5px",
      ppSmBlur: "3px",
      ppBlur: "8px",
      ppLgBlur: "12px",
      wiBlur: "14px",
    },
    blurOnIdle: {
      isEnabled: false,
      idleTimeout: 15,
    }
  }
};
const requiredPermissions = { 
  origins: ["https://web.whatsapp.com/*"],
  permissions: ["storage"]
}

// On install
browser.runtime.onInstalled.addListener(() => {
  // Request host permissions
  browser.permissions.contains(requiredPermissions).then((hasPermissions) => {
    if (hasPermissions) return;
    browser.permissions.request(requiredPermissions);
  });

  // Set default settings upon install
  browser.storage.sync.get([settingsIdentifier]).then((result) => {
    if (result.hasOwnProperty(settingsIdentifier)) {
      var defaultKeys = Object.keys(defaultSettings.settings).sort();
      var currentKeys = Object.keys(result.settings).sort();
      if(JSON.stringify(defaultKeys) === JSON.stringify(currentKeys)) return;
    }
    browser.storage.sync.set(defaultSettings);
  });
});

// Handle toggle command
browser.commands.onCommand.addListener((command) => {
  if (command != "toggle") return;

  browser.storage.sync.get([settingsIdentifier]).then((result) => {
    if (!result.hasOwnProperty(settingsIdentifier)) {
      browser.runtime.reload();
      return;
    }

    result.settings.on = !result.settings.on;
    browser.storage.sync.set(result);
  });
});

// Update icon on setting change
browser.storage.onChanged.addListener((changes, area) => {
  if (area != "sync" || changes.settings == null) return;

  browser.action.setIcon({
    path: "images/status" + (changes.settings.newValue.on == true ? "On" : "Off") + ".png"
  });
});
