document.getElementById("addButton").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "addButton" }, (response) => {
      console.log(response);
    });
  });
});
