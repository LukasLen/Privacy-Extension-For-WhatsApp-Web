// Checkboxes
let button = document.getElementById('switch');
let messages = document.getElementById('messages');
let textInput = document.getElementById('textInput');
let profilePic = document.getElementById('profilePic');
let name = document.getElementById('name');

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
chrome.storage.sync.get(['on', 'messages', 'textInput', 'profilePic', 'name'], function(data) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if(!data.on) button.innerHTML=button_enable;
    messages.checked=data.messages;
    textInput.checked=data.textInput;
    profilePic.checked=data.profilePic;
    name.checked=data.name;
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
