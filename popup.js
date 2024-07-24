let collectedData = [];
let dialogRangeInputs = []; // extension popup values only use number type

document.addEventListener("DOMContentLoaded", () => {
  const randomCheckbox = document.getElementById("random");
  const randomCountInput = document.getElementById("randomCount");
  const getMultipleValuesButton = document.getElementById("getMultipleValues");

  const delayTimeInput = document.getElementById("delayTimeInput");
  let delayTimeValue = Number(delayTimeInput.value) || 1000;
  delayTimeInput.addEventListener("input", (event) => {
    delayTimeValue = Number(event.target.value);
    console.error("delayTimeValue: ", delayTimeValue);
  });

  // {"targetLabel":"Length","start":175,"end":177,step:1} 데이터 수집
  getMultipleValuesButton.addEventListener("click", () => {
    const randomCount = randomCheckbox.checked
      ? parseInt(randomCountInput.value)
      : null;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) {
        console.error("No active tabs found");
        return;
      }

      chrome.tabs.sendMessage(
        tabs[0].id,
        {
          action: "getMultipleValues",
          data: dialogRangeInputs,
          randomCount,
          delayTimeValue,
        },
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
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "getInputs" },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error(
              "getInputs: ",
              JSON.stringify(chrome.runtime.lastError)
            );
          } else {
            displayInputValues(response.data);
          }
        }
      );
    });
  });

  /**
   *
   * @param {*} data  {label: "Length", type: "number", value: "175",stepValue: float }
   *   [
    { "label": "Length", "value": "6", "type": "number", "stepValue": 1 },
    { "label": "Multiplier", "value": "1", "type": "number", "stepValue": 1 },
    {
      "label": "Source",
      "value": "close",
      "type": "select",
      "options": ["close"]
    },
    { "label": "Use Exponential MA", "value": "on", "type": "checkbox" },
    {
      "label": "Bands Style",
      "value": "Average True Range",
      "type": "select",
      "options": ["Average True Range"]
    },
    { "label": "ATR Length", "value": "10", "type": "number", "stepValue": 1 }
  ]
   */
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
            if (multiple_checkbox.checked) {
              updateDialogRangeInputs(
                item.label,
                input.value,
                targetInput.value,
                stepInput.value,
                item.stepValue
              );
            }
          });

          const targetInput = document.createElement("input");
          targetInput.type = "text";
          targetInput.value = item.value;
          targetInput.className = "range-input";
          targetInput.addEventListener("input", (event) => {
            item.value = event.target.value;
            if (multiple_checkbox.checked) {
              updateDialogRangeInputs(
                item.label,
                input.value,
                targetInput.value,
                stepInput.value,
                item.stepValue
              );
            }
          });

          const span = document.createElement("span");
          span.textContent = " - ";

          const stepInput = document.createElement("input");
          const stepValueTxt = document.createElement("span");

          if (item.stepValue) {
            stepInput.value = item.stepValue;
            stepValueTxt.textContent = `stepValue: ${item.stepValue}`;
          }

          stepInput.placeholder = "step";
          stepInput.className = "step-input";
          stepInput.addEventListener("input", (event) => {
            if (multiple_checkbox.checked) {
              updateDialogRangeInputs(
                item.label,
                input.value,
                targetInput.value,
                stepInput.value,
                item.stepValue
              );
            }
          });

          multiple_checkbox.onchange = function () {
            if (this.checked) {
              updateDialogRangeInputs(
                item.label,
                input.value,
                targetInput.value,
                stepInput.value,
                item.stepValue
              );
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
          inputWrapper.appendChild(stepInput);
          inputWrapper.appendChild(stepValueTxt);

          rowContainer.appendChild(inputWrapper);
          inputValuesContainer.appendChild(rowContainer);
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

  function updateDialogRangeInputs(label, start, end, step, stepValue) {
    if (isNaN(parseFloat(start)) || isNaN(parseFloat(end))) {
      return;
    }
    const index = dialogRangeInputs.findIndex((input) => input.label === label);
    if (index !== -1) {
      dialogRangeInputs[index].start = parseFloat(start);
      dialogRangeInputs[index].end = parseFloat(end);
      dialogRangeInputs[index].step = step ? parseFloat(step) : 1;
      dialogRangeInputs[index].stepValue = stepValue;
    } else {
      dialogRangeInputs.push({
        label: label,
        start: parseFloat(start),
        end: parseFloat(end),
        step: step ? parseFloat(step) : 1,
        stepValue: stepValue,
      });
    }
  }

  // 추가된 부분: 랜덤 체크박스와 갯수 입력 필드 이벤트 리스너
  randomCheckbox.addEventListener("change", function () {
    randomCountInput.disabled = !randomCheckbox.checked;
  });
});
