/* Privacy Extension for WhatsApp(TM) Web                       */
/* Copyright (c) 2024 Lukas Lenhardt - lukaslen.com             */
/* Released under the MIT license, see LICENSE file for details */

function removeStyleById(id) {
  if(el=document.getElementById(id)){
    el.parentNode.removeChild(el);
  }
}

function addStyleById(id) {
  console.log(id);
  if(!document.getElementById(id)){
    var link = document.createElement('link');
    link.id = id;
    link.className = 'pfwa';
    link.href = chrome.runtime.getURL('css/'+id+'.css');
    link.type = "text/css";
    link.rel = "stylesheet";
    document.getElementsByTagName("head")[0].appendChild(link);
  }
}

function updateStyles(settings) {
  chrome.storage.sync.get(["settings"]).then((result) => {
    if (result != null && result.settings.on) {
      var styles = Object.keys(result.settings.styles);
      styles.forEach((style) => {
        if (result.settings.styles[style]) {
          addStyleById(style);
        } else {
          removeStyleById(style);
        }
      });
    } else {
      var el = document.getElementsByClassName('pfwa');
      while (el.length > 0) {
        el[0].parentNode.removeChild(el[0]);
      }
    }
  });
}

chrome.storage.onChanged.addListener((changes, area) => {
  if (area == "sync" && changes.settings != null) {
    updateStyles();
  }
});