chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({on: true, first: true});
});
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.url && changeInfo.status==='complete' && tab.url.match('web.whatsapp.com')) {
        chrome.pageAction.show(tabId);
    } else {
        chrome.pageAction.hide(tabId);
    }
});
