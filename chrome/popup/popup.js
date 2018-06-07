let button = document.getElementById('switch');

chrome.storage.sync.get('first', function(data) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if(data.first==true){
      chrome.tabs.executeScript(
        tabs[0].id,
        {file: 'popup/styleOn.js'});
      chrome.storage.sync.set({first: false});
    }
  });
});

chrome.storage.sync.get('on', function(data) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if(data.on==false){
      button.innerHTML="Turn On";
    }
  });
});

button.onclick = function(element) {
  chrome.storage.sync.get('on', function(data) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if(data.on==true){
        chrome.storage.sync.set({on: false});
        button.innerHTML="Turn On";
        chrome.tabs.executeScript(
          tabs[0].id,
          {file: 'popup/styleOff.js'});
      }else{
        chrome.storage.sync.set({on: true});
        button.innerHTML="Turn Off";
        chrome.tabs.executeScript(
          tabs[0].id,
          {file: 'popup/styleOn.js'});
      }
    });
  });
};
