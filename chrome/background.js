chrome.runtime.onInstalled.addListener(function(details) {
  // set storage variables
  chrome.storage.sync.set({
    on: true,
    messages: true,
    textInput:true,
    mediaPreview: true,
    mediaGallery: true,
    profilePic: false,
    name: false
  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'web.whatsapp.com'},
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});
