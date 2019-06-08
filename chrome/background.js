chrome.runtime.onInstalled.addListener(function(details) {
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
      'noDelay'
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
