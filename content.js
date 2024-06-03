function addButton() {
  // 'content-tBgV1m0B' 클래스를 가진 요소를 찾습니다.
  const targetElement = document.querySelector(".content-tBgV1m0B");

  if (targetElement) {
    const button = document.createElement("button");
    button.innerText = "Test";
    button.style.marginTop = "10px";
    button.addEventListener("click", () => {
      let data = [];

      const cells = targetElement.querySelectorAll(".cell-tBgV1m0B");

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

            data.push(obj);
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
                obj.value = buttonTextElem
                  ? buttonTextElem.innerText.trim()
                  : "";
              }
            }
            data.push(obj);
          }
        }
      }

      // 데이터를 CSV 형식으로 변환
      let csvContent = "data:text/csv;charset=utf-8,";
      data.forEach((row) => {
        csvContent += `${row.label},${row.value}\n`;
      });

      // CSV 파일 다운로드
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "input_values.csv");
      document.body.appendChild(link); // Firefox는 필요합니다.
      link.click();
      document.body.removeChild(link);

      const footerElement = document.querySelector(".footer-PhMf7PhQ");

      const okButton = footerElement.querySelector(".button-D4RPB3ZC");

      if (okButton) {
        okButton.click();
        // 강제 클릭 이벤트 발생
        const event = new MouseEvent("click", {
          view: window,
          bubbles: true,
          cancelable: true,
        });
        okButton.dispatchEvent(event);
        // alert("Data saved",okButton.innerText);
      } else {
        console.log("Ok button not found");
      }
      const strategyTab = document.getElementById("id_report-tabs_tablist");

      if (strategyTab) {
        const summaryTab = strategyTab.querySelector("#Performance\\ Summary");
        if (summaryTab) {
          setTimeout(() => {
            summaryTab.click();
          }, 1000);
        } else {
          console.log("Summary tab not found");
        }
      } else {
        console.log("Strategy tab list not found");
      }

      // // 다운로드 있는 부분
      // const strategyGroup = document.querySelector(".fixedContent-zf0MHBzY");

      // if (strategyGroup) {
      //   const buttons = strategyGroup.querySelectorAll("button");
      //   // 버튼이 존재하는지 확인한 후 클릭합니다.
      //   if (buttons.length > 0) {
      //     const lastButton = buttons[buttons.length - 1];
      //     lastButton.click();
      //   } else {
      //     alert("Save button not found");
      //   }
      // } else {
      //   alert("Strategy group not found");
      // }

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
              .replace(/\n/g, " ");
            console.error(combinedText);
            rowData.push(combinedText);
          });

          tableData.push(rowData);
        });

        // console.error(JSON.stringify(tableData));
        // console.error(JSON.parse(tableData));
        // 데이터를 CSV 형식으로 변환
        let csvTableContent = "data:text/csv;charset=utf-8,";
        tableData.forEach((row) => {
          csvTableContent += row.join(",") + "\n";
        });

        // CSV 파일 다운로드
        const encodedTableUri = encodeURI(csvTableContent);
        const tableLink = document.createElement("a");
        tableLink.setAttribute("href", encodedTableUri);
        tableLink.setAttribute("download", "table_data.csv");
        document.body.appendChild(tableLink); // Firefox는 필요합니다.
        tableLink.click();
        document.body.removeChild(tableLink);

        // 데이터를 JSON 형식으로 변환
        const jsonData = JSON.stringify(tableData, null, 2);
        const jsonBlob = new Blob([jsonData], { type: "application/json" });
        const jsonUrl = URL.createObjectURL(jsonBlob);
        const jsonLink = document.createElement("a");
        jsonLink.href = jsonUrl;
        jsonLink.download = "table_data.json";
        document.body.appendChild(jsonLink); // Firefox는 필요합니다.
        jsonLink.click();
        document.body.removeChild(jsonLink);
      } else {
        console.log("Table not found");
      }
    });
    targetElement.appendChild(button);
  } else {
    alert("open Inputs Dialog");
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "addButton") {
    addButton();
    sendResponse({ result: "Button added" });
  }
});
