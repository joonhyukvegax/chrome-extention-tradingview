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
          alert('label');
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
                const buttonTextElem = button.querySelector(".button-children-tFul0OhX span");
                obj.value = buttonTextElem ? buttonTextElem.innerText.trim() : "";
              }
            }
            data.push(obj);
          }
        }
      }

      // 데이터를 CSV 형식으로 변환
      let csvContent = "data:text/csv;charset=utf-8,";
      data.forEach(row => {
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
      
      const okButton = document.querySelector('button[data-name="submit-button"]');
      if (okButton) {
        okButton.click();
      }

      const strategyGroup = document.querySelector(".strategyGroup-zf0MHBzY");
      if (strategyGroup) {
        const targetButton = strategyGroup.querySelector(
          '.apply-common-tooltip.light-button-bYDQcOkp.no-content-bYDQcOkp.with-start-icon-bYDQcOkp.variant-ghost-bYDQcOkp.color-gray-bYDQcOkp.size-small-bYDQcOkp.typography-regular16px-bYDQcOkp.disable-active-state-styles-bYDQcOkp'
        );
        if (targetButton) {
          targetButton.click();
        } else {
          console.log("Target button not found");
        }
      } else {
        console.log("Strategy group not found");
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