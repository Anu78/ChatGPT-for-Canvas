// only register functions after page is loaded
document.addEventListener("DOMContentLoaded", function () {
  var accessTokenInput = document.getElementById("accessTokenInput");
  var saveButton = document.getElementById("saveButton");
  var success_div = document.getElementsByClassName("success-message");

  // Load the access token from storage and populate the input field
  chrome.storage.local.get({ accessToken: "" }, function (data) {
    accessTokenInput.value = data.accessToken;
  });

  // Save the access token to storage when the save button is clicked
  saveButton.addEventListener("click", function () {
    event.preventDefault();
    var accessToken = accessTokenInput.value;
    // show popup to confirm API token set
    chrome.storage.local.set({ accessToken: accessToken }, function () {
      success_div[0].style.display = "block";
      setTimeout(function () {
        success_div[0].style.display = "none";
      }, 3000);
    });
  });
});
