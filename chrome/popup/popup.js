// Checkboxes
let button = document.getElementById('switch');
let messages = document.getElementById('messages');
let mediaPreview = document.getElementById('mediaPreview');
let mediaGallery = document.getElementById('mediaGallery');
let textInput = document.getElementById('textInput');
let profilePic = document.getElementById('profilePic');
let name = document.getElementById('name');
let noDelay = document.getElementById('noDelay');

// Button text
let button_enable = 'Enable';
let button_disable = 'Disable';

// Add or remove stylesheets
function refreshScript(){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(tabs[0].id, {file: '/load.js'});
  });
}

// Set current state in popup
chrome.storage.sync.get(['on', 'messages', 'mediaPreview', 'mediaGallery', 'textInput', 'profilePic', 'name', 'noDelay'], function(data) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if(!data.on) button.innerHTML=button_enable;
    messages.checked=data.messages;
    mediaPreview.checked=data.mediaPreview;
    mediaGallery.checked=data.mediaGallery;
    textInput.checked=data.textInput;
    profilePic.checked=data.profilePic;
    name.checked=data.name;
    noDelay.checked=data.noDelay;
  });
});

// Toogle button text and variable
button.addEventListener('click', function() {
  chrome.storage.sync.get('on', function(data) {
    if(data.on){
      chrome.storage.sync.set({on: false});
      button.innerHTML=button_enable;
    }else{
      chrome.storage.sync.set({on: true});
      button.innerHTML=button_disable;
    }
    refreshScript();
  });
});

// Update settings values
messages.addEventListener('change', function() {
  chrome.storage.sync.set({messages: this.checked});
  refreshScript();
});
mediaPreview.addEventListener('change', function() {
  chrome.storage.sync.set({mediaPreview: this.checked});
  refreshScript();
});
mediaGallery.addEventListener('change', function() {
  chrome.storage.sync.set({mediaGallery: this.checked});
  refreshScript();
});
textInput.addEventListener('change', function() {
  chrome.storage.sync.set({textInput: this.checked});
  refreshScript();
});
profilePic.addEventListener('change', function() {
  chrome.storage.sync.set({profilePic: this.checked});
  refreshScript();
});
name.addEventListener('change', function() {
  chrome.storage.sync.set({name: this.checked});
  refreshScript();
});
noDelay.addEventListener('change', function() {
  chrome.storage.sync.set({noDelay: this.checked});
  refreshScript();
});
