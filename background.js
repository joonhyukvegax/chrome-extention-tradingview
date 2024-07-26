chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    // case "collectingAction":
    //   collectingAction();
    //   sendResponse({ result: "Action completed" });
    //   break;
    // case "getInputs":
    //   (async () => {
    //     const inputs = await getInputs();
    //     sendResponse({ data: inputs });
    //   })();
    //   return true;
    // case "getMultipleValues":
    //   multipleCollectAndGenerateCSV(
    //     request.data,
    //     request.randomCount,
    //     request.delayTimeValue
    //   );
    //   sendResponse({ result: "getMultipleValues" });
    //   break;
    case "saveHistory":
      chrome.storage.local.get(["param_search_history"], (result) => {
        let history = result.param_search_history || [];
        history.push(request.historyEntry);
        chrome.storage.local.set({ param_search_history: history }, () => {
          sendResponse({ result: "History saved" });
        });
      });
      return true;
    case "loadHistory":
      chrome.storage.local.get(["param_search_history"], (result) => {
        sendResponse({ history: result.param_search_history || [] });
      });
      return true;
    case "continueSearch":
      continueSearch(request.entry);
      sendResponse({ result: "continueSearch completed" });
      return true;
    case "saveState":
      chrome.storage.local.set({ state: request.state }, () => {
        sendResponse({ result: "State saved" });
      });
      return true;
    case "loadState":
      chrome.storage.local.get(["state"], (result) => {
        sendResponse({ state: result.state });
      });
      return true;
    default:
      console.error("Unknown action");
  }
});
