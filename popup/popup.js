document.addEventListener('DOMContentLoaded', function () {
    var toggleSwitch = document.getElementById('toggleSwitch');

    // Load the previous state of the switch from storage
    chrome.storage.sync.get('enabled', function (data) {
      toggleSwitch.checked = data.enabled;
    });

    // Handle switch change event
    toggleSwitch.addEventListener('change', function () {
      var enabled = toggleSwitch.checked;
      // Save the state of the switch to storage
      chrome.storage.sync.set({ enabled: enabled });

      // Send a message to the content script to hide elements
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { hideElements: !enabled });
      });
    });
  });