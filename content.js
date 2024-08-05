function fisherYatesShuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

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

// 아직 작동하지 않음
async function waitForSpinner(timeout = 5000) {
  return new Promise((resolve) => {
    const spinnerSelector = ".tv-spinner--shown";
    let spinner = document.querySelector(spinnerSelector);

    if (!spinner) {
      return resolve();
    }

    const observer = new MutationObserver(() => {
      spinner = document.querySelector(spinnerSelector);
      if (!spinner) {
        observer.disconnect();
        clearInterval(intervalId);
        resolve();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    const intervalId = setInterval(() => {
      spinner = document.querySelector(spinnerSelector);
      if (!spinner) {
        clearInterval(intervalId);
        observer.disconnect();
        resolve();
      }
    }, 1);

    setTimeout(() => {
      clearInterval(intervalId);
      observer.disconnect();
      resolve();
    }, timeout);
  });
}

// 로컬 스토리지에 데이터 저장
function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// 로컬 스토리지에서 데이터 복구
function loadFromLocalStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

// 로컬 스토리지에서 데이터 삭제
function clearFromLocalStorage(key) {
  localStorage.removeItem(key);
}

function clearFromLocalStorageById(key, id) {
  const history = loadFromLocalStorage(key) || [];
  const updatedHistory = history.filter((h) => h._id !== id);
  saveToLocalStorage("param_search_history", updatedHistory);
}

/**
 * 주어진 날짜 문자열과 "Month Year" 형식의 텍스트가 같은 년도와 월을 가지는지 확인하는 함수
 * @param {string} dateString - "YYYY-MM-DD" 형식의 날짜 문자열
 * @param {string} monthYearText - "Month Year" 형식의 텍스트
 * @returns {boolean} - 일치하면 true, 그렇지 않으면 false
 */
function isMatchingMonthYear(dateString, monthYearText) {
  // 날짜 문자열을 Date 객체로 변환
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.toLocaleString("default", { month: "long" });

  // Month Year 텍스트를 분리
  const [textMonth, textYear] = monthYearText.split(" ");

  // 년도와 월 비교
  return year === parseInt(textYear, 10) && month === textMonth;
}

/**
 * Gather data from TV strategy Performance Summary table
 * @returns {gatherDataType} - Array of objects containing the data
 * @typedef {Object} eachCellType
 * @property {"input"|"table"} type - The type of the cell, either input or table
 * @property {string} label - The label of the cell
 * @property {string} value - The value of the cell (for input type)
 * @property {Object} [values] - The values of the cell (for table type)
 *
 * @typedef {eachCellType[]} eachRowType
 * @typedef {eachRowType[]} gatherDataType
 *
 * @example
 * [
 *   [
 *     { type: "input", label: "Tp", value: "41" },
 *     { type: "input", label: "Sl", value: "13" },
 *     { type: "input", label: "Max Intraday Filled Orders", value: "7" },
 *     { type: "table", label: "Title", values: { all: "All" } },
 *     { type: "table", label: "Net Profit", values: { all: "−453.68 USD −0.05%" } },
 *     // ... more cells
 *   ],
 *   // ... more rows
 * ]
 */
// const gatherData = () => {
//   let gatherData = [];
//   const inputDialog = document.querySelector(".content-tBgV1m0B");

//   if (!inputDialog) {
//     return alert("open Inputs Dialog");
//   }
//   let inputs = [];

//   const cells = inputDialog.querySelectorAll(".cell-tBgV1m0B");
//   let obj = {};
//   for (let i = 0; i < cells.length; i++) {
//     const cell = cells[i];

//     const checkElem = cell.classList.contains("fill-tBgV1m0B");

//     if (checkElem) {
//       const labelElem = cell.querySelector(".label-ZOx_CVY3");
//       const checkbox = cell.querySelector("input[type='checkbox']");
//       if (labelElem && checkbox) {
//         obj = {
//           type: "input",
//           label: labelElem.innerText.trim(),
//           value: checkbox.checked ? "on" : "off",
//         };

//         inputs.push(obj);
//       }
//       continue;
//     }

//     const labelElem = cell.classList.contains("first-tBgV1m0B");
//     if (labelElem) {
//       const labelInnerElem = cell.querySelector(".inner-tBgV1m0B");
//       if (labelInnerElem) {
//         obj = {
//           type: "input",
//           label: labelInnerElem.innerText.trim(),
//           value: "",
//         };
//         const nextCell = cells[i + 1];
//         if (nextCell) {
//           const input = nextCell.querySelector("input");
//           const button = nextCell.querySelector('span[role="button"]');
//           if (input) {
//             obj.value = input.value;
//           } else if (button) {
//             const buttonTextElem = button.querySelector(
//               ".button-children-tFul0OhX span"
//             );
//             obj.value = buttonTextElem ? buttonTextElem.innerText.trim() : "";
//           }
//         }
//         inputs.push(obj);
//       }
//     }
//   }

//   const table = document.querySelector(".ka-table");

//   if (table) {
//     const rows = table.querySelectorAll("tr");
//     const tableData = [];

//     rows.forEach((row) => {
//       const rowData = [];
//       const cells = row.querySelectorAll("th, td");

//       cells.forEach((cell) => {
//         const combinedText = Array.from(cell.children)
//           .map((child) => child.innerText.trim())
//           .join(" ")
//           .replace(/\u00A0/g, "")
//           .replace(/\n/g, " ")
//           .replace(/#/g, " ");

//         rowData.push(combinedText);
//       });

//       tableData.push(rowData);
//     });

//     const titleIndex = tableData[0].indexOf("Title");
//     const allIndex = tableData[0].indexOf("All");
//     if (titleIndex !== -1 && allIndex !== -1) {
//       let dataRow = [];

//       tableData.forEach((row) => {
//         dataRow.push({
//           type: "table",
//           label: row[titleIndex],
//           values: {
//             all: row[allIndex],
//           },
//         });
//       });

//       gatherData.push([...inputs, ...dataRow]);
//     }
//   } else {
//     console.log("Table not found");
//   }
//   return gatherData;
// };

const waitForElement = (selector, timeout = 5000) => {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
    }

    const observer = new MutationObserver((mutations, obs) => {
      const element = document.querySelector(selector);
      if (element) {
        obs.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Timeout waiting for element: ${selector}`));
    }, timeout);
  });
};

const gatherData = async () => {
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

  await waitForElement(".ka-table", 10000); // 테이블이 로드될 때까지 대기

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
    console.log(tableData);
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

      gatherData.push(...inputs, ...dataRow);
    }
    console.log(gatherData);
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
  console.log("collectedData", collectedData);

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
        let cleanedValue = entry.values.all.replace(/,/g, "");
        if (/[^0-9.]/.test(cleanedValue)) {
          // If value contains characters other than digits and dot, enclose in quotes
          cleanedValue = `"${entry.values.all}"`;
        }
        rowData.push(cleanedValue);
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
/**
 * Download the Excel file from the TV strategy tester
 */
const downloadTVExell = () => {
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
};

const triggerClick = (element) => {
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
};

/**
 * Clicks the "OK" button in the TV dialog
 */
const clickTVDialogOkButton = () => {
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
};

async function getCurrentSummary() {
  const inputDialog = document.querySelector(".content-tBgV1m0B");

  if (!inputDialog) {
    return alert("open Inputs Dialog");
  }

  // clickTVDialogOkButton();

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

  // downloadTVExell();

  downloadCSV(gatereData);
}

/**
 * button Name : strategy Inputs
 * @returns {Array<{label: string, value: string, type: "checkbox"|"number"|"select", options?: string[]}>} - Array of objects containing the input data
 */
async function getInputs() {
  // strategy tab click
  const strategyTab = document.getElementById("id_report-tabs_tablist");

  if (strategyTab) {
    const summaryTab = strategyTab.querySelector("#Performance\\ Summary");
    if (summaryTab) {
      summaryTab.click();
    } else {
      console.error("Summary tab not found");
    }
  } else {
    console.error("Strategy tab list not found");
  }

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
            input.focus();
            input.select();

            const buttons = nextCell
              .querySelector(".controlWrapper-DBTazUk2")
              .querySelectorAll("button");

            if (buttons.length > 0) {
              const increaseButton = buttons[0];
              const decreaseButton = buttons[1];
              const stepValue = await getInputStep(
                input,
                increaseButton,
                decreaseButton
              );
              obj.stepValue = stepValue;
            }
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

/**
 * @deprecated
 * @param {*} arr
 * @returns
 */
function generateCombinations(arr) {
  const results = [];

  function helper(prefix, index) {
    if (index === arr.length) {
      results.push(prefix);
      return;
    }

    for (let i = arr[index].start; i <= arr[index].end; i++) {
      helper(prefix.concat(i), index + 1);
    }
  }

  helper([], 0);
  return results;
}

/**
 * Generate combinations with a given step.
 * @param {Array<{start: number, end: number, step: number}>} arr - Array of ranges with start, end, and step values.
 * @returns {Array<number[]>} - All possible combinations.
 */
function generateStepCombinations(arr) {
  const results = [];

  function getDecimalPlaces(num) {
    const decimalPart = num.toString().split(".")[1];
    return decimalPart ? decimalPart.length : 0;
  }

  function helper(prefix, index) {
    if (index === arr.length) {
      results.push(prefix);
      return;
    }

    const range = arr[index];

    // start, end, step의 소숫점 자릿수를 계산하여 가장 큰 자릿수를 사용
    const decimalPlaces = Math.max(
      getDecimalPlaces(range.start),
      getDecimalPlaces(range.end),
      getDecimalPlaces(range.step)
    );

    const multiplier = Math.pow(10, decimalPlaces);

    const start = Math.round(range.start * multiplier);
    const end = Math.round(range.end * multiplier);
    const step = Math.round(range.step * multiplier);

    if (start <= end) {
      for (let i = start; i <= end; i += step) {
        helper(
          prefix.concat(Number((i / multiplier).toFixed(decimalPlaces))),
          index + 1
        ); // 원래 값으로 복원하고 toFixed 적용
      }
    } else {
      for (let i = start; i >= end; i -= step) {
        helper(
          prefix.concat(Number((i / multiplier).toFixed(decimalPlaces))),
          index + 1
        ); // 원래 값으로 복원하고 toFixed 적용
      }
    }
  }

  helper([], 0);

  return results;
}

async function adjustValue(input, targetValue, increaseButton, decreaseButton) {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      const curValue = parseFloat(input.value);

      if (curValue > targetValue) {
        decreaseButton.click();
      } else if (curValue < targetValue) {
        increaseButton.click();
      } else {
        clearInterval(interval);
        resolve();
      }
    }, 200);
  });
}

// get multiple values handle
async function multipleCollectAndGenerateCSV(
  inputs,
  randomCount = null,
  delayTimeValue
) {
  const inputLabels = inputs.map((input) => input.label);
  let combinations = generateStepCombinations(inputs);
  if (randomCount && randomCount > 0) {
    combinations = fisherYatesShuffle(combinations).slice(0, randomCount);
  }

  const currentID = Date.now();
  const type = "param_search";

  const savedHistory = loadFromLocalStorage("param_search_history") || [];

  const newSavedHistory = [
    ...savedHistory,
    {
      _id: currentID,
      type,
      createdAt: formatDate(new Date()),
      inputLabels,
      combinations,
      setting: {
        inputs,
        randomCount,
        delayTimeValue,
      },
      collectData: [],
    },
  ];

  saveToLocalStorage("param_search_history", newSavedHistory);

  let collectData = [];

  for (const combination of combinations) {
    const labelCombination = combination.map((value, index) => {
      return {
        label: inputLabels[index],
        value: value,
      };
    });

    const inputDialog = document.querySelector(".content-tBgV1m0B");

    if (!inputDialog) {
      alert("open Inputs Dialog");
      return;
    }

    for (const data of labelCombination) {
      const targetLabel = data.label;
      const targetValue = data.value;
      const cells = inputDialog.querySelectorAll(".cell-tBgV1m0B");

      if (cells.length === 0) {
        console.error("No cells found");
        return;
      }

      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const labelElem = cell.classList.contains("first-tBgV1m0B");
        const labelInnerElem = cell.querySelector(".inner-tBgV1m0B");

        if (labelElem && labelInnerElem.innerText.trim() === targetLabel) {
          const cellValue = cells[i + 1];
          if (cellValue) {
            const input = cellValue.querySelector("input");
            if (input) {
              input.focus();
              input.select();

              const buttons = cellValue
                .querySelector(".controlWrapper-DBTazUk2")
                .querySelectorAll("button");

              if (buttons.length > 0) {
                const increaseButton = buttons[0];
                const decreaseButton = buttons[1];

                await adjustValue(
                  input,
                  targetValue,
                  increaseButton,
                  decreaseButton
                );
              } else {
                alert("Increase and Decrease buttons not found");
              }
            }
          }
        }
      }
    }

    // await waitForSpinner(delayTimeValue ? delayTimeValue : 5000);

    const currentData = await gatherData();
    collectData.push(...currentData);

    console.log(collectData);

    const updatedHistory = (
      loadFromLocalStorage("param_search_history") || []
    ).map((history) => {
      if (history._id === currentID) {
        const updatedCombinations = history.combinations.filter(
          (comb) => JSON.stringify(comb) !== JSON.stringify(combination)
        );
        return {
          ...history,
          combinations: updatedCombinations,
          collectData: [...history.collectData, ...currentData],
        };
      }
      return history;
    });

    saveToLocalStorage("param_search_history", updatedHistory);
  }
  downloadCSV(collectData);
}
// async function multipleCollectAndGenerateCSV(
//   inputs,
//   randomCount = null,
//   delayTimeValue
// ) {
//   // TODO: 인풋의 combination을 생성 할때 input stepValue를 고려해서 불가능한 값의 배열이 될 수 있음
//   const inputLabels = inputs.map((input) => input.label);
//   let combinations = generateStepCombinations(inputs);
//   // 랜덤 갯수만큼 조합을 선택
//   if (randomCount && randomCount > 0) {
//     combinations = fisherYatesShuffle(combinations).slice(0, randomCount);
//   }

//   const currentID = Date.now();
//   const type = "param_search"; // "param_search" or "back_testing"

//   // 라벨과 콤비네이션을 로컬스토리지에 저장 (히스토리 방식으로 저장)

//   const savedHistory = loadFromLocalStorage("param_search_history") || [];

//   const newSavedHistory = [
//     ...savedHistory,
//     {
//       _id: currentID,
//       type,
//       createdAt: formatDate(new Date()),
//       inputLabels,
//       combinations,
//       setting: {
//         inputs,
//         randomCount,
//         delayTimeValue,
//       },
//       collectData: [], // 새로 추가된 데이터를 저장할 필드
//     },
//   ];

//   saveToLocalStorage("param_search_history", newSavedHistory);

//   let collectData = [];

//   for (const combination of combinations) {
//     const labelCombination = combination.map((value, index) => {
//       return {
//         label: inputLabels[index],
//         value: value,
//       };
//     });

//     const inputDialog = document.querySelector(".content-tBgV1m0B");

//     if (!inputDialog) {
//       alert("open Inputs Dialog");
//       return;
//     }

//     for (const data of labelCombination) {
//       const targetLabel = data.label;
//       const targetValue = data.value;
//       const cells = inputDialog.querySelectorAll(".cell-tBgV1m0B");

//       if (cells.length === 0) {
//         console.error("No cells found");
//         return;
//       }

//       for (let i = 0; i < cells.length; i++) {
//         const cell = cells[i];
//         const labelElem = cell.classList.contains("first-tBgV1m0B");
//         const labelInnerElem = cell.querySelector(".inner-tBgV1m0B");

//         if (labelElem && labelInnerElem.innerText.trim() === targetLabel) {
//           const cellValue = cells[i + 1];
//           if (cellValue) {
//             const input = cellValue.querySelector("input");
//             if (input) {
//               input.focus();
//               input.select();

//               const buttons = cellValue
//                 .querySelector(".controlWrapper-DBTazUk2")
//                 .querySelectorAll("button");

//               if (buttons.length > 0) {
//                 const increaseButton = buttons[0];
//                 const decreaseButton = buttons[1];

//                 await adjustValue(
//                   input,
//                   targetValue,
//                   increaseButton,
//                   decreaseButton
//                 );
//               } else {
//                 alert("Increase and Decrease buttons not found");
//               }
//             }
//           }
//         }
//       }
//     }

//     await waitForSpinner(delayTimeValue ? delayTimeValue : 5000);

//     const currentData = gatherData();
//     collectData.push(...currentData);

//     // 업데이트된 히스토리로 교체
//     const updatedHistory = (
//       loadFromLocalStorage("param_search_history") || []
//     ).map((history) => {
//       if (history._id === currentID) {
//         const updatedCombinations = history.combinations.filter(
//           (comb) => JSON.stringify(comb) !== JSON.stringify(combination)
//         );
//         return {
//           ...history,
//           combinations: updatedCombinations,
//           collectData: [...history.collectData, ...currentData],
//         };
//       }
//       return history;
//     });

//     saveToLocalStorage("param_search_history", updatedHistory);
//   }
//   downloadCSV(collectData);
// }

async function getBackTestingAction(
  dateRanges,
  inputs,
  randomCount = null,
  delayTimeValue
) {
  // TODO: 인풋의 combination을 생성 할때 input stepValue를 고려해서 불가능한 값의 배열이 될 수 있음
  const inputLabels = inputs.map((input) => input.label);
  let combinations = generateStepCombinations(inputs);
  // 랜덤 갯수만큼 조합을 선택
  if (randomCount && randomCount > 0) {
    combinations = fisherYatesShuffle(combinations).slice(0, randomCount);
  }

  const currentID = Date.now();
  const type = "back_testing"; // "param_search" or "back_testing"

  // 라벨과 콤비네이션을 로컬스토리지에 저장 (히스토리 방식으로 저장)

  const savedHistory = loadFromLocalStorage("param_search_history") || [];

  const newSavedHistory = [
    ...savedHistory,
    {
      _id: currentID,
      type,
      createdAt: formatDate(new Date()),
      inputLabels,
      dateRanges,
      combinations,
      setting: {
        inputs,
        randomCount,
        delayTimeValue,
      },
      collectData: [], // 새로 추가된 데이터를 저장할 필드
    },
  ];
  saveToLocalStorage("param_search_history", newSavedHistory);
  let collectData = [];
}

async function calculateStepValue(input, increaseButton, decreaseButton) {
  return new Promise((resolve) => {
    let initialValue = parseFloat(input.value);

    // Click the increase button once and calculate the step value
    increaseButton.click();
    setTimeout(() => {
      let increasedValue = parseFloat(input.value);

      // Reset to initial value by clicking the decrease button
      decreaseButton.click();
      setTimeout(() => {
        let decreasedValue = parseFloat(input.value);

        // Calculate step value
        let stepValue = parseFloat((increasedValue - initialValue).toFixed(10));

        // Ensure it resets to the initial value
        if (decreasedValue !== initialValue) {
          alert("Value did not reset correctly, check the implementation.");
        }

        resolve(stepValue);
      }, 200);
    }, 200);
  });
}

async function getInputStep(input, increaseButton, decreaseButton) {
  const stepValue = await calculateStepValue(
    input,
    increaseButton,
    decreaseButton
  );

  return stepValue;
}

async function continueCollectAndGenerateCSV(history) {
  // TODO: 인풋의 combination을 생성 할때 input stepValue를 고려해서 불가능한 값의 배열이 될 수 있음
  const inputLabels = history.inputLabels;
  let combinations = history.combinations;
  const currentID = history;
  let collectData = history.collectData;
  const delayTimeValue = history.setting.delayTimeValue;

  for (const combination of combinations) {
    const labelCombination = combination.map((value, index) => {
      return {
        label: inputLabels[index],
        value: value,
      };
    });

    const inputDialog = document.querySelector(".content-tBgV1m0B");

    if (!inputDialog) {
      alert("open Inputs Dialog");
      return;
    }

    for (const data of labelCombination) {
      const targetLabel = data.label;
      const targetValue = data.value;
      const cells = inputDialog.querySelectorAll(".cell-tBgV1m0B");

      if (cells.length === 0) {
        console.error("No cells found");
        return;
      }

      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const labelElem = cell.classList.contains("first-tBgV1m0B");
        const labelInnerElem = cell.querySelector(".inner-tBgV1m0B");

        if (labelElem && labelInnerElem.innerText.trim() === targetLabel) {
          const cellValue = cells[i + 1];
          if (cellValue) {
            const input = cellValue.querySelector("input");
            if (input) {
              input.focus();
              input.select();

              const buttons = cellValue
                .querySelector(".controlWrapper-DBTazUk2")
                .querySelectorAll("button");

              if (buttons.length > 0) {
                const increaseButton = buttons[0];
                const decreaseButton = buttons[1];

                await adjustValue(
                  input,
                  targetValue,
                  increaseButton,
                  decreaseButton
                );
              } else {
                alert("Increase and Decrease buttons not found");
              }
            }
          }
        }
      }
    }

    await waitForSpinner(delayTimeValue ? delayTimeValue : 5000);

    const currentData = await gatherData();
    collectData.push(...currentData);

    // 업데이트된 히스토리로 교체
    const updatedHistory = (
      loadFromLocalStorage("param_search_history") || []
    ).map((history) => {
      if (history._id === currentID) {
        const updatedCombinations = history.combinations.filter(
          (comb) => JSON.stringify(comb) !== JSON.stringify(combination)
        );
        return {
          ...history,
          combinations: updatedCombinations,
          collectData: [...history.collectData, ...currentData],
        };
      }
      return history;
    });

    saveToLocalStorage("param_search_history", updatedHistory);
  }
  downloadCSV(collectData);
}

function clickTargetDateInDateDialog(calendar, targetDate) {
  const days = calendar.querySelectorAll(".day-N6r5jhbE");
  days.forEach((day) => {
    const dayData = day.getAttribute("data-day");
    if (dayData === targetDate) {
      day.click();
    }
  });
}

/**
 *
 * @param {*} dateRanges : [ { startDate: "2024-01-01", endDate: "2024-02-29" },{ startDate: "2024-01-01", endDate: "2024-02-29" } ]
 */
async function dateSettings(dateRanges) {
  alert(JSON.stringify(dateRanges));
  const startEndCalendarWrppers = document.querySelectorAll(
    ".container-WDZ0PRNh"
  );
  const startCalendarButton = startEndCalendarWrppers[0].querySelector(
    ".inner-slot-W53jtLjw"
  );
  const endCalendarButton = startEndCalendarWrppers[1].querySelector(
    ".inner-slot-W53jtLjw"
  );
  for (const dateRange of dateRanges) {
    // 시작 날짜 설정
    if (startCalendarButton) {
      startCalendarButton.click();

      await delay(500);
      const dateRangeDialog = document.querySelector(".calendar-N6r5jhbE");
      const calendar = dateRangeDialog.querySelector(".weeks-N6r5jhbE");

      if (dateRangeDialog) {
        // Start date에 맞는 달력 페이지로 이동
        await navigateToMonthYear(dateRange.startDate, dateRangeDialog, () =>
          clickTargetDateInDateDialog(calendar, dateRange.startDate)
        );
        await delay(1000);

        if (endCalendarButton) {
          endCalendarButton.click();

          endCalendarButton.click();

          await delay(1000);
          const dateRangeDialog = document.querySelector(".calendar-N6r5jhbE");
          const calendar = dateRangeDialog.querySelector(".weeks-N6r5jhbE");

          if (dateRangeDialog) {
            // Start date에 맞는 달력 페이지로 이동
            await navigateToMonthYear(dateRange.endDate, dateRangeDialog, () =>
              clickTargetDateInDateDialog(calendar, dateRange.endDate)
            );
          }
          await delay(1000);
          ClickGenerateReport();
          await delay(1000);
        } else {
          console.error("Date Range Button not found");
        }
      }
    } else {
      console.error("Date Range Button not found");
    }
  }
}

async function ClickGenerateReport() {
  document.querySelector(".generateReportBtn-zf0MHBzY").click();
}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case "getCurrentSummary":
      getCurrentSummary();
      sendResponse({ result: "Action completed" });
      break;
    case "getInputs":
      (async () => {
        const inputs = await getInputs();
        sendResponse({ data: inputs });
      })();
      return true;
    case "getMultipleValues":
      multipleCollectAndGenerateCSV(
        request.data,
        request.randomCount,
        request.delayTimeValue
      );
      sendResponse({ result: "getMultipleValues" });
      break;
    // deep backtesting
    case "getBackTestingAction":
      getBackTestingAction(
        request.dateRanges,
        request.data,
        request.randomCount,
        request.delayTimeValue
      );
      sendResponse({ result: "getBackTestingAction" });
      break;
    case "dateSettings":
      dateSettings(request.dateRanges);
      sendResponse({ result: "dateSettings" });
      break;
    // History Tab
    case "getHistory":
      sendResponse({
        history: loadFromLocalStorage("param_search_history") || [],
      });
      return true;
    case "continueParamSearch": {
      continueCollectAndGenerateCSV(request.history);
      sendResponse({ result: "continueSearch completed" });
      return true;
    }
    case "clearHistory": {
      clearFromLocalStorage("param_search_history");
      sendResponse({ result: "removeHistory completed" });
      break;
    }
    case "clearHistoryById": {
      clearFromLocalStorageById("param_search_history", request.id);
      sendResponse({ result: "removeHistory completed" });
      break;
    }
    default:
      console.error("Unknown action");
  }
});

async function navigateToMonthYear(targetDate, dateRangeDialog, callback) {
  const previousMonthButton = dateRangeDialog.querySelector(
    '[aria-label*="Previous month"]'
  );
  const nextMonthButton = dateRangeDialog.querySelector(
    '[aria-label*="Next month"]'
  );

  async function checkAndNavigate() {
    const monthYearText = dateRangeDialog.querySelector(
      ".ellipsisContainer-bYDQcOkp"
    ).innerText;

    // 값이 맞으면 콜백 실행
    const isMatching = isMatchingMonthYear(targetDate, monthYearText);
    if (isMatching) {
      callback();
    } else {
      // 월을 분리  january -> 01
      function getMonthNumber(monthName) {
        const date = new Date(`${monthName} 1, 2000`);
        const month = date.getMonth() + 1;
        return month.toString().padStart(2, "0");
      }

      const targetDateObj = new Date(targetDate);
      const [textMonth, textYear] = monthYearText.split(" ");
      const currentDateObj = new Date(
        `${textYear}-${getMonthNumber(textMonth)}-01`
      );

      if (targetDateObj < currentDateObj) {
        if (previousMonthButton) {
          previousMonthButton.click();
          await delay(300);
          checkAndNavigate();
        }
      }
      if (targetDateObj > currentDateObj) {
        if (nextMonthButton) {
          nextMonthButton.click();
          await delay(300);
          checkAndNavigate();
        }
      }
      callback();
    }
  }
  checkAndNavigate();
}
