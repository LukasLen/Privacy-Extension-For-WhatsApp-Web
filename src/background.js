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
const defaultSettings =
  {
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
      }
    }
  };

// Set default settings upon install
browser.runtime.onInstalled.addListener(() => {
  browser.storage.sync.get([settingsIdentifier]).then((result) => {
    if (result.hasOwnProperty(settingsIdentifier)) return;
    browser.storage.sync.set(defaultSettings);
  });
});

// Handle toggle command
browser.commands.onCommand.addListener((command) => {
  if (command != "toggle") return;

  browser.storage.sync.get([settingsIdentifier]).then((result) => {
    if (!result.hasOwnProperty(settingsIdentifier)) return;

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
