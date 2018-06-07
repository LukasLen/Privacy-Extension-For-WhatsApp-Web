var sheet = document.getElementById("pfwa");
if(sheet!=null){
  sheet.disabled = true;
  sheet.parentNode.removeChild(sheet);
}
