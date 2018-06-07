(function(){
  chrome.storage.sync.get('on', function(data) {
    if(data.on==true){
      if(document.getElementById("pfwa")==null){
        var link = document.createElement("link");
        link.id="pfwa";
        link.href = chrome.extension.getURL("injectCss.css");
        link.type = "text/css";
        link.rel = "stylesheet";
        document.getElementsByTagName("head")[0].appendChild(link);
      }
    }
  });
})();
