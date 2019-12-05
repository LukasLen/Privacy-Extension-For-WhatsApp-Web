chrome.runtime.onInstalled.addListener(function() {
  // set storage variables
  chrome.storage.sync.get([
      'on',
      'currentPopupMessage',
      'messages',
      'messagesPreview',
      'mediaPreview',
      'mediaGallery',
      'textInput',
      'profilePic',
      'name',
      'noDelay',
      'unblurActive'
    ], function(data) {
      data.on == null && chrome.storage.sync.set({on: true});
      data.currentPopupMessage == null && chrome.storage.sync.set({currentPopupMessage: ""});
      data.messages == null && chrome.storage.sync.set({messages: true});
      data.messagesPreview == null && chrome.storage.sync.set({messagesPreview: true});
      data.textInput == null && chrome.storage.sync.set({textInput: true});
      data.mediaPreview == null && chrome.storage.sync.set({mediaPreview: true});
      data.mediaGallery == null && chrome.storage.sync.set({mediaGallery: true});
      data.profilePic == null && chrome.storage.sync.set({profilePic: false});
      data.name == null && chrome.storage.sync.set({name: false});
      data.noDelay == null && chrome.storage.sync.set({noDelay: false});
      data.unblurActive == null && chrome.storage.sync.set({unblurActive: false});
  });
});
function initializePageAction(tab) {
  if (tab.url.includes("web.whatsapp.com")) {
    browser.pageAction.show(tab.id);
  }
}
browser.tabs.onUpdated.addListener((id, changeInfo, tab) => {
  initializePageAction(tab);
});

//on load
var gettingAllTabs = browser.tabs.query({});
gettingAllTabs.then((tabs) => {
  for (let tab of tabs) {
    initializePageAction(tab);
  }
});
