let collectedData = [];

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
    const div = document.createElement("div");
    div.id = "input-flex-container";

    const label = document.createElement("label");
    label.textContent = `${item.label}`;

    div.appendChild(label);

    const inputWrapper = document.createElement("div");
    inputWrapper.id = "flex-container";

    // select, checkbox, number
    switch (item.type) {
      case "number":
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

        targetInput.addEventListener("input", (event) => {
          item.value = event.target.value;

          // 버튼 추가
          let button = div.querySelector("button");
          if (!button) {
            button = document.createElement("button");
            button.textContent = "getValues";
            div.appendChild(button);

            button.addEventListener("click", () => {
              const start = parseInt(input.value);
              const end = parseInt(targetInput.value);

              if (isNaN(start) || isNaN(end)) {
                alert("Please enter valid numbers");
                return;
              }
              const automationArr = {
                targetLabel: item.label,
                start,
                end,
              };
              // content.js에 메시지 전송
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

        div.appendChild(select);
        inputValuesContainer.appendChild(div);
        break;
      case "checkbox":
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = item.value === "on" ? true : false;

        checkbox.addEventListener("change", (event) => {
          item.value = event.target.checked;
        });

        div.appendChild(checkbox);
        inputValuesContainer.appendChild(div);
        break;
    }
  });
}
