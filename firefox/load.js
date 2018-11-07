chrome.storage.sync.get(['on', 'messages', 'textInput', 'profilePic', 'name'], function(data) {

  function removeStyleById(id){
    // check if the stylesheet is there before removing
    if(el=document.getElementById(id)){
      el.parentNode.removeChild(el);
    }
  }

  function addStyle(id){
    // only add stylesheets if they weren't added yet
    if(!document.getElementById(id)){
      var link = document.createElement('link');
      link.id = id;
      link.className = 'pfwa';
      link.href = chrome.extension.getURL('css/'+id+'.css');
      link.type = "text/css";
      link.rel = "stylesheet";
      document.getElementsByTagName("head")[0].appendChild(link);
    }
  }

  if(data.on){
    // add stylesheets if selected otherwise remove it
    if(data.messages) addStyle('messages'); else removeStyleById('messages');
    if(data.textInput) addStyle('textInput'); else removeStyleById('textInput');
    if(data.profilePic) addStyle('profilePic'); else removeStyleById('profilePic');
    if(data.name) addStyle('name'); else removeStyleById('name');
  }else if(document.getElementsByClassName('pfwa').length>0){
    // remove all stylesheets
    var el = document.getElementsByClassName('pfwa');
    while(el.length > 0){
      el[0].parentNode.removeChild(el[0]);
    }
  }
});
