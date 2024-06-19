let collectedData = [];
let dialogRangeInputs = []; // extention popup vaules only use number type

// {"targetLabel":"Length","start":175,"end":177,offset:1} 데이터 수집
document.getElementById("getMultipleValues").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) {
      console.error("No active tabs found");
      return;
    }
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "getMultipleValues", data: dialogRangeInputs },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        } else {
          console.log(response.result);
        }
      }
    );
  });
});

// "Add Button" 버튼 클릭 시 content script에 메시지 전송
document.getElementById("collectingAction").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) {
      console.error("No active tabs found");
      return;
    }
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "collectingAction" },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        } else {
          console.log(response.result);
        }
      }
    );
  });
});

// "Get Inputs" 버튼 클릭 시 수집된 데이터를 content script에 메시지로 요청
document.getElementById("getInput").addEventListener("click", () => {
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
    const rowContainer = document.createElement("div");
    rowContainer.className = "input-flex-container";

    const labelWrapper = document.createElement("div");
    labelWrapper.className = "label-wrapper";

    const label = document.createElement("label");
    label.textContent = `${item.label} :`;
    label.value = item.label;

    const inputWrapper = document.createElement("div");
    inputWrapper.id = "flex-container";

    // select, checkbox, number
    switch (item.type) {
      case "number":
        inputWrapper.className = "input-number-wrapper";
        const multiple_checkbox = document.createElement("input");
        multiple_checkbox.type = "checkbox";
        multiple_checkbox.className = "multiple_checkbox";

        const input = document.createElement("input");
        input.type = "text";
        input.value = item.value;
        input.className = "range-input";
        input.addEventListener("input", (event) => {
          item.value = event.target.value;
        });

        const targetInput = document.createElement("input");
        targetInput.type = "text";
        targetInput.value = item.value;
        input.className = "range-input";

        const span = document.createElement("span");
        span.textContent = " - ";

        const offsetInput = document.createElement("input");
        offsetInput.placeholder = "offset";
        offsetInput.className = "offset-input";

        multiple_checkbox.onchange = function () {
          if (this.checked) {
            const start = input.value;
            const end = targetInput.value;
            const offset = offsetInput.value ? offsetInput.value : 1;
            dialogRangeInputs.push({
              label: item.label,
              start: parseInt(start),
              end: parseInt(end),
              offset: parseInt(offset),
            });
          } else {
            dialogRangeInputs = dialogRangeInputs.filter(
              (input) => input.label !== item.label
            );
          }
        };

        labelWrapper.appendChild(multiple_checkbox);
        labelWrapper.appendChild(label);
        inputWrapper.appendChild(labelWrapper);
        inputWrapper.appendChild(input);
        inputWrapper.appendChild(span);
        inputWrapper.appendChild(targetInput);

        inputWrapper.appendChild(offsetInput);

        // div.appendChild(label);
        rowContainer.appendChild(inputWrapper);

        inputValuesContainer.appendChild(rowContainer);

        targetInput.addEventListener("input", (event) => {
          item.value = event.target.value;

          // 버튼 추가
          let button = rowContainer.querySelector("button");
          if (!button) {
            button = document.createElement("button");
            button.className = "action-button";
            button.textContent = `Get ${item.label} Range`;
            rowContainer.appendChild(button);

            button.addEventListener("click", () => {
              const start = parseInt(input.value);
              const end = parseInt(targetInput.value);
              const offset = parseInt(offsetInput.value);

              if (isNaN(start) || isNaN(end)) {
                alert("Please enter valid numbers");
                return;
              }

              const automationArr = {
                targetLabel: item.label,
                start,
                end,
                offset,
              };

              chrome.tabs.query(
                { active: true, currentWindow: true },
                (tabs) => {
                  if (tabs.length === 0) {
                    console.error("No active tabs found");
                    return;
                  }
                  chrome.tabs.sendMessage(
                    tabs[0].id,
                    { action: "collectAndGenerateCSV", data: automationArr },
                    (response) => {
                      if (chrome.runtime.lastError) {
                        console.error(chrome.runtime.lastError);
                      } else {
                        console.log(response.result);
                      }
                    }
                  );
                }
              );
            });
          }
        });

        break;
      case "select":
        const select = document.createElement("select");
        select.value = item.value;

        item.options.forEach((option) => {
          const optionElement = document.createElement("option");
          optionElement.value = option;
          optionElement.textContent = option;
          select.appendChild(optionElement);
        });

        labelWrapper.appendChild(label);
        rowContainer.appendChild(labelWrapper);
        rowContainer.appendChild(select);
        inputValuesContainer.appendChild(rowContainer);
        break;
      case "checkbox":
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = item.value === "on" ? true : false;

        checkbox.addEventListener("change", (event) => {
          item.value = event.target.checked;
        });
        labelWrapper.appendChild(label);
        rowContainer.appendChild(labelWrapper);
        rowContainer.appendChild(checkbox);
        inputValuesContainer.appendChild(rowContainer);
        break;
    }
  });
}
