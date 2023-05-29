chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.hideElements) {
      // Hide elements injected into the page
      hideElements();
    } else {
      // Show elements injected into the page
      showElements();
    }
  });

  function hideElements() {
    // Logic to hide the injected elements
    // Replace with your implementation
    console.log("hideElements")
  }

  function showElements() {
    // Logic to show the injected elements
    // Replace with your implementation
    console.log("showElements")
  }

