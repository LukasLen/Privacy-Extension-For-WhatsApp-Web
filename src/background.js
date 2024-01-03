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

chrome.commands.onCommand.addListener(function(command) {
  if(command == 'toggle'){
    chrome.storage.sync.get(['on'], function(data) {
      chrome.storage.sync.set({on: !data.on});

      chrome.tabs.query({url: "https://web.whatsapp.com/"}, function(tabs) {
        if (tabs.length !== 0)
          tabs.forEach(function(tab){chrome.scripting.executeScript({
            target: {tabId: tab.id},
            files: ['/load.js']
          })
        });
      });
    });
  }
});

//set icon depending on extension status
function toggleIcon(status){
  chrome.action.setIcon({path:'images/status' + (status == true ? 'On' : 'Off') + '.png'});
}

chrome.storage.onChanged.addListener(function(changes, area) {
    if (area == "sync" && "on" in changes) {
      toggleIcon(changes.on.newValue);
    }
});

chrome.storage.sync.get(['on'], function(data) {
  toggleIcon(data.on);
});
