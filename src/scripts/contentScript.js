/* Privacy Extension for WhatsApp(TM) Web                       */
/* Copyright (c) 2024 Lukas Lenhardt - lukaslen.com             */
/* Released under the MIT license, see LICENSE file for details */

// Remove this upon Chrome supporting the browser namespace
if (typeof browser == "undefined") {
  // Redefine browser namespace for Chrome for interoperability with Firefox
  globalThis.browser = chrome;
}

const styleIdentifier = "pfwa";
const settingsIdentifier = "settings";

function removeStyleById(id) {
  if(el=document.getElementById(id)){
    el.parentNode.removeChild(el);
  }
}

function removeAllStyles() {
  var el = document.getElementsByClassName(styleIdentifier);
  while (el.length > 0) {
    el[0].parentNode.removeChild(el[0]);
  }
}

function addStyleById(id) {
  if (document.getElementById(id)) return;

  var link = document.createElement('link');
  link.id = id;
  link.className = styleIdentifier;
  link.href = browser.runtime.getURL('css/'+id+'.css');
  link.type = "text/css";
  link.rel = "stylesheet";
  document.getElementsByTagName("head")[0].appendChild(link);
}

// variable style
function addVarStyle([varName, value]) {
  if (document.getElementById(varName)) removeStyleById(varName);

  const kebabize = (str) => str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, (s, ofs) => (ofs ? "-" : "") + s.toLowerCase());

  const innerText = `
  #whatsapp-web body {
    --${kebabize(varName)}: ${value};
  }
  `

  const varStyleEl = document.getElementById(varName);
  if (varStyleEl) {
    varStyleEl.innerText = innerText;
    return;
  };

  var styleEl = document.createElement('style');
  styleEl.id = varName;
  styleEl.className = "pfwa-variables";
  styleEl.innerText = innerText;
  document.getElementsByTagName("head")[0].appendChild(styleEl);
}

function updateStyles() {
  browser.storage.sync.get([settingsIdentifier]).then((result) => {
    if (result == null || !result.settings.on) {
      removeAllStyles();
      return;
    }
    
    var styles = Object.keys(result.settings.styles);
    styles.forEach((style) => {
      if (result.settings.styles[style]) {
        addStyleById(style);
      } else {
        removeStyleById(style);
      }
    });

    // update variable styles
    const varStyles = Object.entries(result.settings.varStyles);
    varStyles.forEach((varStyle) => {
      addVarStyle(varStyle);
    })
    
  });
}

// Update styles on setting change
browser.storage.onChanged.addListener((changes, area) => {
  if (area == "sync" && changes.settings != null) {
    updateStyles();
  }
});

// Initial update once page loaded
updateStyles();