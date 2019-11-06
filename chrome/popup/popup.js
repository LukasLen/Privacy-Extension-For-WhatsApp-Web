// Checkboxes
let button = document.getElementById('switch');
let messages = document.getElementById('messages');
let messagesPreview = document.getElementById('messagesPreview');
let mediaPreview = document.getElementById('mediaPreview');
let mediaGallery = document.getElementById('mediaGallery');
let textInput = document.getElementById('textInput');
let profilePic = document.getElementById('profilePic');
let name = document.getElementById('name');
let noDelay = document.getElementById('noDelay');

// Message functionality
let mainContent = document.getElementById('mainContent');
let popupMessage = document.getElementById('popupMessage');

// Get and set current version
document.getElementById('version').innerText = chrome.runtime.getManifest().version;

// Add or remove stylesheets
function refreshScript(){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(tabs[0].id, {file: '/load.js'});
  });
}

// Set current state in popup
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
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      messages.checked=data.messages;
      messagesPreview.checked=data.messagesPreview;
      mediaPreview.checked=data.mediaPreview;
      mediaGallery.checked=data.mediaGallery;
      textInput.checked=data.textInput;
      profilePic.checked=data.profilePic;
      name.checked=data.name;
      noDelay.checked=data.noDelay;
      button.checked=data.on;

      //load message
      xmlhttp=new XMLHttpRequest();
      xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState==4 && xmlhttp.status==200){
          if(xmlhttp.responseText != "" && data.currentPopupMessage != xmlhttp.responseText){
            mainContent.style.display = "none";
            popupMessage.innerText = xmlhttp.responseText;
            popupMessage.innerHTML += "<br><a href=\"#\" id=\"popupMessageButton\">Close message</a>";

            let popupMessageButton = document.getElementById('popupMessageButton');
            popupMessageButton.addEventListener('click', function() {
              chrome.storage.sync.set({currentPopupMessage: xmlhttp.responseText});
              popupMessage.innerHTML = "";
              mainContent.style.display = "initial";
            });
          }
        }
      }
      xmlhttp.open("GET", "https://lukaslen.com/message/pfwa.txt", true);
      xmlhttp.send();
    });
});

button.addEventListener('change', function() {
  chrome.storage.sync.set({on: this.checked});
  refreshScript();
});
// Update settings values
messages.addEventListener('change', function() {
  chrome.storage.sync.set({messages: this.checked});
  refreshScript();
});
messagesPreview.addEventListener('change', function() {
  chrome.storage.sync.set({messagesPreview: this.checked});
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
