document.addEventListener('DOMContentLoaded', function () {
    var accessTokenInput = document.getElementById('accessTokenInput');
    var saveButton = document.getElementById('saveButton');

    // Load the access token from storage and populate the input field
    chrome.storage.local.get({ accessToken: '' }, function (data) {
      accessTokenInput.value = data.accessToken;
    });

    // Save the access token to storage when the save button is clicked
    saveButton.addEventListener('click', function () {
      var accessToken = accessTokenInput.value;
      chrome.storage.local.set({ accessToken: accessToken }, function () {
        console.log('Access token saved');
      });
    });
  });