/* Privacy Extension for WhatsApp(TM) Web                       */
/* Copyright (c) 2024 Lukas Lenhardt - lukaslen.com             */
/* Released under the MIT license, see LICENSE file for details */

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(["settings"]).then((result) => {
    if (!result.hasOwnProperty("settings")) {
      chrome.storage.sync.set({
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
        },
      });
    }
  });
});

chrome.commands.onCommand.addListener((command) => {
  if(command == "toggle"){
    chrome.storage.sync.get(['settings']).then((result) => {
      if (result != null) {
        result.settings.on = !result.settings.on;
        chrome.storage.sync.set(result);
      }
    });
  }
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area == "sync" && changes.settings != null) {
    chrome.action.setIcon({
      path: "images/status" + (changes.settings.newValue.on == true ? "On" : "Off") + ".png"
    });
  }
});
