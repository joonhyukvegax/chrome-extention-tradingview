// let collectedData = [];

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

const gatherData = () => {
  let gatherData = [];
  const inputDialog = document.querySelector(".content-tBgV1m0B");

  if (!inputDialog) {
    return alert("open Inputs Dialog");
  }
  let inputs = [];

  const cells = inputDialog.querySelectorAll(".cell-tBgV1m0B");
  let obj = {};
  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];

    const checkElem = cell.classList.contains("fill-tBgV1m0B");

    if (checkElem) {
      const labelElem = cell.querySelector(".label-ZOx_CVY3");
      const checkbox = cell.querySelector("input[type='checkbox']");
      if (labelElem && checkbox) {
        obj = {
          type: "input",
          label: labelElem.innerText.trim(),
          value: checkbox.checked ? "on" : "off",
        };

        inputs.push(obj);
      }
      continue;
    }

    const labelElem = cell.classList.contains("first-tBgV1m0B");
    if (labelElem) {
      const labelInnerElem = cell.querySelector(".inner-tBgV1m0B");
      if (labelInnerElem) {
        obj = {
          type: "input",
          label: labelInnerElem.innerText.trim(),
          value: "",
        };
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

  const table = document.querySelector(".ka-table");

  if (table) {
    const rows = table.querySelectorAll("tr");
    const tableData = [];

    rows.forEach((row) => {
      const rowData = [];
      const cells = row.querySelectorAll("th, td");

      cells.forEach((cell) => {
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

    const titleIndex = tableData[0].indexOf("Title");
    const allIndex = tableData[0].indexOf("All");
    if (titleIndex !== -1 && allIndex !== -1) {
      let dataRow = [];

      tableData.forEach((row) => {
        dataRow.push({
          type: "table",
          label: row[titleIndex],
          values: {
            all: row[allIndex],
          },
        });
      });

      gatherData.push([...inputs, ...dataRow]);
    }
  } else {
    console.log("Table not found");
  }
  return gatherData;
};

const downloadCSV = (collectedData) => {
  let csvContent = "data:text/csv;charset=utf-8,";
  const currentDate = new Date();
  const kstDate = new Date(currentDate.getTime() + 9 * 60 * 60 * 1000); // 한국 시간 (UTC+9)
  csvContent += formatDate(kstDate) + "\n";

  if (!collectedData || collectedData.length === 0) {
    return alert("No data to download");
  }

  // Collect all unique labels for the header
  let headers = [];
  collectedData[0].forEach((entry) => {
    headers.push(entry.label);
  });
  csvContent += headers.join(",") + "\n";

  collectedData.forEach((row) => {
    let rowData = [];
    row.forEach((entry) => {
      if (entry.type === "input") {
        rowData.push(entry.value);
      } else if (entry.type === "table") {
        rowData.push(entry.values.all);
      }
    });
    csvContent += rowData.join(",") + "\n";
  });

  const encodedTableUri = encodeURI(csvContent);
  const tableLink = document.createElement("a");
  tableLink.setAttribute("href", encodedTableUri);
  tableLink.setAttribute("download", "table_data.csv");
  document.body.appendChild(tableLink); // Firefox handling
  tableLink.click();
  document.body.removeChild(tableLink);
};

async function collectingAction() {
  const inputDialog = document.querySelector(".content-tBgV1m0B");

  if (!inputDialog) {
    return alert("open Inputs Dialog");
  }

  // const footerElement = document.querySelector(".footer-PhMf7PhQ");
  // const okButton = footerElement.querySelector(".button-D4RPB3ZC");

  // if (okButton) {
  //   okButton.click();

  //   const event = new MouseEvent("click", {
  //     view: window,
  //     bubbles: true,
  //     cancelable: true,
  //   });
  //   okButton.dispatchEvent(event);
  // } else {
  //   console.error("Ok button not found");
  // }
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

  const gatereData = gatherData();

  //

  // const strategyGroup = document.querySelector(".fixedContent-zf0MHBzY");

  // if (strategyGroup) {
  //   const buttons = strategyGroup.querySelectorAll("button");

  //   if (buttons.length > 0) {
  //     const lastButton = buttons[buttons.length - 1];
  //     lastButton.click();
  //   } else {
  //     alert("Save button not found");
  //   }
  // } else {
  //   alert("Strategy Tester Tab not found");
  // }

  downloadCSV(gatereData);
}

function getInputs() {
  let inputs = [];

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
          type: "number",
        };
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
            const selectValue = buttonTextElem
              ? buttonTextElem.innerText.trim()
              : "";
            obj.value = selectValue;
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

async function collectAndGenerateCSV(data) {
  const inputDialog = document.querySelector(".content-tBgV1m0B");
  const targetLabel = data.targetLabel;

  if (!inputDialog) {
    return alert("open Inputs Dialog");
  }

  gatherData();

  const cells = inputDialog.querySelectorAll(".cell-tBgV1m0B");

  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    const labelElem = cell.classList.contains("first-tBgV1m0B");
    const labelInnerElem = cell.querySelector(".inner-tBgV1m0B");

    if (labelElem && labelInnerElem.innerText.trim() === targetLabel) {
      const nextCell = cells[i + 1];

      if (nextCell) {
        const input = nextCell.querySelector("input");

        if (input) {
          input.focus();
          input.select();

          const buttons = nextCell
            .querySelector(".controlWrapper-DBTazUk2")
            .querySelectorAll("button");

          if (buttons.length > 0) {
            const increaseButton = buttons[0];
            const decreaseButton = buttons[1];

            const end = data.end;
            let current = parseInt(input.value);

            let collectData = [];

            const interval = setInterval(async () => {
              if (current < end) {
                increaseButton.click();
                current++;
                await delay(500);
                const increaseInput = gatherData();
                collectData.push(...increaseInput);
              } else if (current > end) {
                decreaseButton.click();
                current--;
                await delay(500);
                const decreaseInput = gatherData();
                collectData.push(...decreaseInput);
              } else {
                clearInterval(interval);
                downloadCSV(collectData);
              }
            }, 1000);
          } else {
            alert("Increase and Decrease buttons not found");
          }
        }
      }
      break;
    }
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "collectingAction") {
    collectingAction();
    sendResponse({ result: "Action completed" });
  }
  if (request.action === "getInputs") {
    const inputs = getInputs();
    sendResponse({ data: inputs });
  }
  if (request.action === "collectAndGenerateCSV") {
    collectAndGenerateCSV(request.data);
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
