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

function updateStyles(changes) {
  browser.storage.sync.get([settingsIdentifier]).then((result) => {
    if (result == null || !result.settings.on) {
      removeAllStyles();
      
      if (timers?.timerObj) {
        removeTimer();
      }

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
    
    // update blur on idle
    setBlurOnIdle(changes, result);

  });
}

// Update styles on setting change
browser.storage.onChanged.addListener((changes, area) => {
  if (area == "sync" && changes.settings != null) {
    updateStyles(changes);
  }
});

// Initial update once page loaded
updateStyles();

/**
 * timer
 *
 * Run idleCallback if user idle for idleTime,
 * then run activeCallback if any events happen
 * 
 * @param {Object} opts
 * @param {function} opts.idleCallback - fired when user is idle
 * @param {function} opts.activeCallback - fired when user is active
 * @param {number} opts.idleTime - time in milliseconds  
 * @param {[string]} [opts.events] - event listeners. Default to : ["pointermove", "pointerdown", "keydown"]
 * 
 */
const timer = (opts) => {
  options = opts || {};
  const idleCallback = options.idleCallback || function () { };
  const activeCallback = options.activeCallback || function () { };
  const idleTime = options.idleTime || 1000;
  const events = options.events || ["pointermove", "pointerdown", "keydown"];
  let isActive = true;
  let isEnabled = true;
  let timer;

  function addOrRemoveEvents(addOrRemove) {
    events.forEach((eventName) => {
      document[addOrRemove](eventName, triggerActive);
    });
  }

  function enable() {
    isEnabled = true;
    addOrRemoveEvents("addEventListener");
    triggerActive();
  }

  function triggerActive() {
    if (!isActive) {
      isActive = true;
      activeCallback();
    }
    clearTimeout(timer);
    timer = setTimeout(triggerIdle, idleTime);
  }
  
  function triggerIdle() {
    if (!isActive) return;
    isActive = false;
    idleCallback();
  }

  function disable() {
    isActive = true;
    isEnabled = false;
    clearTimeout(timer);
    addOrRemoveEvents('removeEventListener');
  }

  return {
    isEnabled: () => isEnabled,
    enable: enable,
    disable: disable,
    triggerActive: triggerActive,
    triggerIdle: triggerIdle
  };
}

const timers = {};

// blur page 
const blurBody = () => {
  document.body.style.filter = "blur(var(--wi-blur)) grayscale(1)";
  document.body.style.transition = "filter .3s linear";
}
// unblur page 
const unblurBody = () => {
  document.body.style.filter = "";
}

// disable and remove timer if exist
const removeTimer = () => {
  timers.timerObj.triggerActive();
  timers.timerObj.disable();
  delete timers.timerObj;
}

const setBlurOnIdle = (changes, result) => {

  const previousState = changes?.settings?.oldValue?.blurOnIdle;
  const currentState = changes?.settings?.newValue?.blurOnIdle ?? result.settings?.blurOnIdle;
  const isPreviousEnabled = previousState?.isEnabled;
  const isCurrentEnabled = currentState?.isEnabled;
  const isBlurOnIdleChanged = isPreviousEnabled !== isCurrentEnabled;
  const isIdleTimeoutChanged = previousState?.idleTimeout !== currentState?.idleTimeout;

  if (isCurrentEnabled && (isBlurOnIdleChanged || changes?.settings?.oldValue?.on === false)) {
    if (timers?.timerObj) {
      removeTimer();
    }
    // create new timer
    const newTimer = timer({
      idleCallback: blurBody,
      activeCallback: unblurBody,
      idleTime: parseInt(currentState?.idleTimeout * 1000 || 15000),
    });
    timers.timerObj = newTimer;
    timers.timerObj.enable();
  } else if (isCurrentEnabled && isBlurOnIdleChanged === false) {
    if (isIdleTimeoutChanged) {
      if (timers?.timerObj) {
        removeTimer();
      }
      // then create new timer
      const newTimer = timer({
        idleCallback: blurBody,
        activeCallback: unblurBody,
        idleTime: parseInt(currentState?.idleTimeout * 1000 || 15000),
      });
      timers.timerObj = newTimer;
      timers.timerObj.enable();
    }
  } else if (isCurrentEnabled === false && isBlurOnIdleChanged) {
    if (timers?.timerObj) {
      removeTimer();
    }
  }

}

