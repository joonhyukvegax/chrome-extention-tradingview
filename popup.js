document.getElementById('addButton').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) {
      console.error("No active tabs found");
      return;
    }
    chrome.tabs.sendMessage(tabs[0].id, { action: 'addButton' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else {
        console.log(response.result);
      }
    });
  });
});