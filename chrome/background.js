chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({on: true, first: true});
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'web.whatsapp.com'},
      })
      ],
          actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});
