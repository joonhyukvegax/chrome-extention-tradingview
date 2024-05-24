function addButton() {
  // 'content-tBgV1m0B' 클래스를 가진 요소를 찾습니다.
  const targetElement = document.querySelector(".content-tBgV1m0B");

  if (targetElement) {
    const button = document.createElement("button");
    button.innerText = "Test";
    button.style.marginTop = "10px";
    button.addEventListener("click", () => {
      const inputs = targetElement.querySelectorAll("input", "select");
      let csvContent = "data:text/csv;charset=utf-8,";
      let data = [];

      inputs.forEach((input) => {
        const value = input.value;
        const label = input
          .closest(".cell-tBgV1m0B")
          .previousElementSibling.querySelector(".inner-tBgV1m0B").innerText;
        // message += `${label}: ${value}\n`;
        data.push({ label, value });
      });

      data.forEach((row) => {
        csvContent += row.label + "," + row.value + "\n";
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "input_values.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      const okButton = document.querySelector(
        'button[data-name="submit-button"]'
      );
      if (okButton) {
        okButton.click();
      }
      const strategyGroup = document.querySelector(".strategyGroup-zf0MHBzY");

      const strategyTesterTab = strategyGroup.querySelector(
        'button[id="Performance Summary"]'
      );
      if (strategyTesterTab) {
        strategyTesterTab.click();

        const strategyButtons = document.querySelectorAll(
          ".apply-common-tooltip"
        );
        if (strategyButtons.length > 0) {
          const lastButton = strategyButtons[strategyButtons.length - 1];
          lastButton.click();
        } else {
          console.log("Strategy button not found");
        }
      }
    });

    targetElement.appendChild(button);
  } else {
    console.log("Target element not found");
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "addButton") {
    addButton();
    sendResponse({ result: "Button added" });
  }
});
