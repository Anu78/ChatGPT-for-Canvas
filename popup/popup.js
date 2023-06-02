document.addEventListener("DOMContentLoaded", function () {
  var toggleSwitch = document.getElementById("toggleSwitch");

  // Load the previous state of the switch from storage
  chrome.storage.sync.get("enabled", function (data) {
    toggleSwitch.checked = data.enabled;
  });

  // Handle switch change event
  toggleSwitch.addEventListener("change", function () {
    var enabled = toggleSwitch.checked;
    // Save the state of the switch to storage
    chrome.storage.sync.set({ enabled: enabled });

    // Send a message to the content script if it's available and hide elements
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var contentScriptPattern =
        "https://*.instructure.com/courses/*/quizzes/*"; // Replace with your desired regex pattern
      if (tabs[0].url.match(contentScriptPattern)) {
        chrome.tabs.sendMessage(tabs[0].id, { hideElements: !enabled });
      }
    });
  });
});
