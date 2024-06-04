let collectedData = [];

// "Add Button" 버튼 클릭 시 content script에 메시지 전송
document.getElementById("addButton").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) {
      console.error("No active tabs found");
      return;
    }
    chrome.tabs.sendMessage(tabs[0].id, { action: "addButton" }, (response) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else {
        console.log(response.result);
      }
    });
  });
});

// "Get Inputs" 버튼 클릭 시 수집된 데이터를 content script에 메시지로 요청
document.getElementById("sendDataButton").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) {
      console.error("No active tabs found");
      return;
    }
    chrome.tabs.sendMessage(tabs[0].id, { action: "getInputs" }, (response) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else {
        displayInputValues(response.data);
      }
    });
  });
});

// 입력 값을 표시하는 함수
function displayInputValues(data) {
  collectedData = data; // 수집된 데이터를 저장
  const inputValuesContainer = document.getElementById("inputValues");
  inputValuesContainer.innerHTML = ""; // 기존 내용 지우기

  data.forEach((item) => {
    const div = document.createElement("div");

    div.id = "input-flex-container";

    const label = document.createElement("label");
    label.textContent = `${item.label}`;
    const inputWrapper = document.createElement("div");
    inputWrapper.id = "flext-container";

    const input = document.createElement("input");
    input.type = "text";
    input.value = item.value;
    input.addEventListener("input", (event) => {
      item.value = event.target.value;
    });
    const targetInput = document.createElement("input");
    targetInput.type = "text";
    targetInput.value = item.value;

    const span = document.createElement("span");
    span.textContent = " - ";
    inputWrapper.appendChild(input);
    inputWrapper.appendChild(span);
    inputWrapper.appendChild(targetInput);

    div.appendChild(label);
    div.appendChild(inputWrapper);

    inputValuesContainer.appendChild(div);
  });
}
