let collectedData = [];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day}:${hours}:${minutes}:${seconds}`;
};

const downloadCSV = () => {
  // loading을 위한 임의의 지연 함수
  const inputDialog = document.querySelector(".content-tBgV1m0B");

  if (!inputDialog) {
    return alert("open Inputs Dialog");
  }

  let inputs = [];

  const cells = inputDialog.querySelectorAll(".cell-tBgV1m0B");

  // Input 데이터 추출 로직
  let obj = {};
  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];

    // 체크박스 형식으로 라벨을 뒤에 가지고 있음
    const checkElem = cell.classList.contains("fill-tBgV1m0B");

    if (checkElem) {
      const labelElem = cell.querySelector(".label-ZOx_CVY3");
      const checkbox = cell.querySelector("input[type='checkbox']");
      if (labelElem && checkbox) {
        obj = {
          label: labelElem.innerText.trim(),
          value: checkbox.checked ? "on" : "off",
        };

        inputs.push(obj);
      }
      continue; // 이미 처리했으므로 다음 셀로 이동
    }

    // first-tBgV1m0B 라벨을 가지고 있는 테그
    const labelElem = cell.classList.contains("first-tBgV1m0B");
    if (labelElem) {
      const labelInnerElem = cell.querySelector(".inner-tBgV1m0B");
      if (labelInnerElem) {
        obj = {
          label: labelInnerElem.innerText.trim(),
          value: "",
        };
        // 다음 셀에서 값을 추출
        const nextCell = cells[i + 1];
        if (nextCell) {
          const input = nextCell.querySelector("input");
          const button = nextCell.querySelector('span[role="button"]');
          if (input) {
            obj.value = input.value;
          } else if (button) {
            const buttonTextElem = button.querySelector(
              ".button-children-tFul0OhX span"
            );
            obj.value = buttonTextElem ? buttonTextElem.innerText.trim() : "";
          }
        }
        inputs.push(obj);
      }
    }
  }

  // 데이터를 CSV 형식으로 변환
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Inputs";
  csvContent += "\n\n";

  const currentDate = new Date();
  const kstDate = new Date(currentDate.getTime() + 9 * 60 * 60 * 1000); // 한국 시간 (UTC+9)

  csvContent += formatDate(kstDate) + "\n";

  csvContent += "\n\n";
  inputs.forEach((row) => {
    csvContent += `${row.label},${row.value}\n`;
  });

  collectedData = inputs;

  chrome.runtime.sendMessage(
    { action: "sendInputValues", data: inputs },
    (response) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else {
        console.log(response.result);
      }
    }
  );

  csvContent += "\n\n";
  // table 데이터 추출
  const table = document.querySelector(".ka-table");

  if (table) {
    const rows = table.querySelectorAll("tr");
    const tableData = [];

    rows.forEach((row) => {
      const rowData = [];
      const cells = row.querySelectorAll("th, td");

      cells.forEach((cell) => {
        // 모든 자식 요소의 텍스트를 하나로 결합
        const combinedText = Array.from(cell.children)
          .map((child) => child.innerText.trim())
          .join(" ")
          .replace(/\u00A0/g, "")
          .replace(/\n/g, " ")
          .replace(/#/g, " ");

        rowData.push(combinedText);
      });

      tableData.push(rowData);
    });

    csvContent += "Performance Summary";

    csvContent += "\n\n";

    tableData.forEach((row) => {
      csvContent += row.join(",") + "\n";
    });

    // CSV 파일 다운로드
    const encodedTableUri = encodeURI(csvContent);
    const tableLink = document.createElement("a");
    tableLink.setAttribute("href", encodedTableUri);
    tableLink.setAttribute("download", "table_data.csv");
    document.body.appendChild(tableLink); // Firefox handling
    tableLink.click();
    document.body.removeChild(tableLink);
  } else {
    console.log("Table not found");
  }
};

async function addButton() {
  // input dialog 확인
  const inputDialog = document.querySelector(".content-tBgV1m0B");

  if (!inputDialog) {
    return alert("open Inputs Dialog");
  }

  const footerElement = document.querySelector(".footer-PhMf7PhQ");

  const okButton = footerElement.querySelector(".button-D4RPB3ZC");

  if (okButton) {
    okButton.click();

    const event = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    okButton.dispatchEvent(event);
  } else {
    console.error("Ok button not found");
  }
  const strategyTab = document.getElementById("id_report-tabs_tablist");

  if (strategyTab) {
    const summaryTab = strategyTab.querySelector("#Performance\\ Summary");
    if (summaryTab) {
      await delay(1000);

      summaryTab.click();
    } else {
      console.error("Summary tab not found");
    }
  } else {
    console.error("Strategy tab list not found");
  }

  await delay(500);

  // 다운로드 있는 부분 마지막 요소 클릭
  const strategyGroup = document.querySelector(".fixedContent-zf0MHBzY");

  if (strategyGroup) {
    const buttons = strategyGroup.querySelectorAll("button");

    if (buttons.length > 0) {
      const lastButton = buttons[buttons.length - 1];
      lastButton.click();
    } else {
      alert("Save button not found");
    }
  } else {
    alert("Strategy Tester Tab not found");
  }

  // table 데이터 추출
  downloadCSV();
  // const table = document.querySelector(".ka-table");

  // if (table) {
  //   const rows = table.querySelectorAll("tr");
  //   const tableData = [];

  //   rows.forEach((row) => {
  //     const rowData = [];
  //     const cells = row.querySelectorAll("th, td");

  //     cells.forEach((cell) => {
  //       // 모든 자식 요소의 텍스트를 하나로 결합
  //       const combinedText = Array.from(cell.children)
  //         .map((child) => child.innerText.trim())
  //         .join(" ")
  //         .replace(/\u00A0/g, "")
  //         .replace(/\n/g, " ")
  //         .replace(/#/g, " ");

  //       rowData.push(combinedText);
  //     });

  //     tableData.push(rowData);
  //   });

  //   csvContent += "Performance Summary";

  //   csvContent += "\n\n";

  //   tableData.forEach((row) => {
  //     csvContent += row.join(",") + "\n";
  //   });

  //   // CSV 파일 다운로드
  //   const encodedTableUri = encodeURI(csvContent);
  //   const tableLink = document.createElement("a");
  //   tableLink.setAttribute("href", encodedTableUri);
  //   tableLink.setAttribute("download", "table_data.csv");
  //   document.body.appendChild(tableLink); // Firefox handling
  //   tableLink.click();
  //   document.body.removeChild(tableLink);
  // } else {
  //   console.log("Table not found");
  // }
}

// popup.js에 전달할 값을 만드는 함수
function getInputs() {
  let inputs = [];

  // input dialog 확인
  const inputDialog = document.querySelector(".content-tBgV1m0B");

  if (!inputDialog) {
    return alert("open Inputs Dialog");
  }

  const cells = document.querySelectorAll(".cell-tBgV1m0B");

  let obj = {};
  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];

    const checkElem = cell.classList.contains("fill-tBgV1m0B");

    if (checkElem) {
      const labelElem = cell.querySelector(".label-ZOx_CVY3");
      const checkbox = cell.querySelector("input[type='checkbox']");
      if (labelElem && checkbox) {
        obj = {
          label: labelElem.innerText.trim(),
          value: checkbox.checked ? "on" : "off",
          type: "checkbox",
        };

        inputs.push(obj);
      }
      continue;
    }

    const labelElem = cell.classList.contains("first-tBgV1m0B");
    if (labelElem) {
      const labelInnerElem = cell.querySelector(".inner-tBgV1m0B");
      if (labelInnerElem) {
        const label = labelInnerElem.innerText.trim();
        obj = {
          label,
          value: "",
          type: "number", // select, checkbox, number
        };
        const nextCell = cells[i + 1];
        if (nextCell) {
          //
          const input = nextCell.querySelector("input");

          const button = nextCell.querySelector('span[role="button"]');
          if (input) {
            obj.value = input.value;
          } else if (button) {
            // select 형식의 UI
            const buttonTextElem = button.querySelector(
              ".button-children-tFul0OhX span"
            );
            const selectValue = buttonTextElem
              ? buttonTextElem.innerText.trim()
              : "";
            obj.value = selectValue;
            // TODO: select option 추출을 해야하면 따로 액션이 필요함 (select 클릭후 dom에서 가져와야함 click)
            obj.options = [selectValue];
            obj.type = "select";
          }
        }
        inputs.push(obj);
      }
    }
  }

  return inputs;
}
async function updateInput(data) {
  // input dialog 확인
  const inputDialog = document.querySelector(".content-tBgV1m0B");

  const targetLabel = data.targetLabel;

  if (!inputDialog) {
    return alert("open Inputs Dialog");
  }

  const cells = inputDialog.querySelectorAll(".cell-tBgV1m0B");

  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];

    const labelElem = cell.classList.contains("first-tBgV1m0B");

    const labelInnerElem = cell.querySelector(".inner-tBgV1m0B");

    if (labelElem && labelInnerElem.innerText.trim() === targetLabel) {
      const nextCell = cells[i + 1];

      if (nextCell) {
        const input = nextCell.querySelector("input");
        // const button = nextCell.querySelector('span[role="button"]');

        if (input) {
          input.focus();
          input.select();

          // delay(200);
          const buttons = nextCell
            .querySelector(".controlWrapper-DBTazUk2")
            .querySelectorAll("button");
          const increaseButton = buttons[0];
          const decreaseButton = buttons[1];

          const end = data.end;
          let current = parseInt(input.value);

          // end 값에 도달할 때까지 클릭
          const interval = setInterval(() => {
            if (current < end) {
              increaseButton.click();
              current++;
              delay(500);
              downloadCSV();
            } else if (current > end) {
              decreaseButton.click();
              current--;
              delay(500);
              downloadCSV();
            } else {
              clearInterval(interval); // 목표값에 도달하면 반복을 중지
            }
          }, 1000); // 클릭 간격을 100ms로 설정

          let curValue = parseInt(input.value);
          curValue += 1;
          input.value = curValue;

          alert(input.value);
        }
      }

      break;
    }
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "addButton") {
    addButton();
    sendResponse({ result: "Button added" });
  }
  if (request.action === "getInputs") {
    const inputs = getInputs();
    sendResponse({ data: inputs });
  }
  if (request.action === "updateInput") {
    updateInput(request.data);
    sendResponse({ result: "Input updated" });
  }
});

function triggerClick(element) {
  element.focus();
  if (element) {
    const event = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    element.dispatchEvent(event);
  } else {
    console.error(`Element with selector "${selector}" not found`);
  }
}
