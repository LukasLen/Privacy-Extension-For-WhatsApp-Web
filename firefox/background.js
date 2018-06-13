chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({on: true, first: true});
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
