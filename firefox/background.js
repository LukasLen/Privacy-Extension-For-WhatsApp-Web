chrome.runtime.onInstalled.addListener(function() {
  // set storage variables
  chrome.storage.sync.set({
    on: true,
    currentPopupMessage: "",
    messages: true,
    messagesPreview: true,
    textInput:true,
    mediaPreview: true,
    mediaGallery: true,
    profilePic: false,
    name: false,
    noDelay: false
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
