(function() {

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.executeScript(null, {file: "js/draw.js"}, function(res) {console.log("exxx")})
});

})();
