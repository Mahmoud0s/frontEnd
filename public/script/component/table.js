import {
  popUpFunUpdate,
  confirmFun,
  deleteFun,
  popUpFun,
  hideAllPopUps,
  updatePopUp,
  popUpFunImage,
} from "/script/component/popup.js";
import { createBarCode } from "/script/component/barcode.js";
import {
  showReport,
  changeProjectorStateFun,
} from "/script/component/reports.js";

async function createTable(page) {

  
  const content = document.querySelector(".add-user .content");
  let API;
  if (page == "user") API = "http://localhost:5000/api/users";
  else if (page == "workSection")
    API = "http://localhost:5000/api/work-sections";
  else API = "http://localhost:5000/api/halls/all";

  const response = await fetch(API, {
    headers: {
      "Content-Type": "application/json",
      Authorization: Cookies.get("token"),
    },
    credentials: "include",
  });
  const data = await response.json();

  if (data.length) {
    const keys = Object.keys(data[0]);
    const table = document.createElement("table");

    const thead = table.createTHead();
    const tbody = table.createTBody();
    const headerRow = thead.insertRow();

    // header
    keys.forEach((key) => {
      key = key.replaceAll("_", " ");
      if (key == "id") return;
      const th = document.createElement("th");
      th.textContent = key;
      headerRow.appendChild(th);
    });
    const actionHeader = document.createElement("th");
    actionHeader.textContent = "Actions";
    headerRow.appendChild(actionHeader);
    // body
    data.forEach((rowData) => {
      const row = tbody.insertRow();
      keys.forEach((key) => {
        if (key == "id") return;
        const cell = row.insertCell();
        // values
        cell.textContent =
          key == "created_at" || (key == "busy_until" && rowData[key] != null)
            ? `${rowData[key].date} ${rowData[key].time}`
            : (cell.textContent = rowData[key]);
      });

      const actionCell = row.insertCell();
      // update Button
      const updateButton = document.createElement("button");
      updateButton.innerText = "Update";
      updateButton.classList.add("edit");
      updateButton.addEventListener("click", () => {
        popUpFun(updatePopUp);
        popUpFunUpdate(rowData, page);
      });
      // delete Button
      const deleteButton = document.createElement("button");
      deleteButton.innerText = "Delete";
      deleteButton.classList.add("del");
      deleteButton.addEventListener("click", async () => {
        const confirmed = await confirmFun(rowData, page);
        if (confirmed) {
          deleteFun(rowData.id, row, page);
        }
      });

      actionCell.appendChild(updateButton);
      actionCell.appendChild(deleteButton);
    });

    content.appendChild(table);
  }
}


async function getData(content, api, page, pageNum = 1 ) {
  content.textContent = "";
  
  let pageID=+location.href.split("work-section/")[1];

  if (page=="search") {
    pageNum=+pageNum || 1;
  }else if(page=="hall" && sessionStorage.getItem("hall")){
    pageNum=+sessionStorage.getItem("hall")||1;

  }else{
    pageNum=+sessionStorage.getItem(pageID) || 1;
  }

  try {

    let limit=10;
    let skip=(pageNum-1)*limit

    const response = await fetch(api);
    const allData = await response.json();

    let data=response.ok?allData.slice(skip,skip+limit):allData;
    
    if(page=="hall"){
      sessionStorage.setItem("hall",pageNum);
    }else if(page!="search"){
      sessionStorage.setItem(pageID,pageNum);
    }
    document.querySelector("#pageNumber").textContent=pageNum;
    document.querySelectorAll(".btn-box , .btn-box h2").forEach((el)=>{
        el.style.display=response.ok && allData.length!=0?"block":"none"
    })
    document.querySelector(".btn-box button:first-of-type").style.display=pageNum<=1?"none":"inline-block"; //back
    document.querySelector(".btn-box button:last-of-type").style.display=data.length<limit || !response.ok ?"none":"inline-block"; //next

    
    let unresolvedReports = [];
    if(page=="hall"){
            try {
                const reportsResponse = await fetch(
                  "http://localhost:5000/api/reports/unresolved/all"
                );
                if (reportsResponse.ok) {
                  unresolvedReports = await reportsResponse.json();
                }
              } catch (error) {
                console.error("Error fetching unresolved reports:", error);
              }

    }
    if (Array.isArray(data) && data.length > 0) {
      const table = document.createElement("table");
      const thead = document.createElement("thead");
      const tbody = document.createElement("tbody");

      // Create header row
      const headerRow = document.createElement("tr");
      Object.keys(data[0]).forEach((key) => {
        if (
          key !== "id" &&
          key !== "file_path" &&
          key !== "filename" &&
          key !== "uploaded_at"
        ) {
          const th = document.createElement("th");
          th.textContent =
            key === "created_at"
              ? "REPORTS"
              : key.replace(/_/g, " ").toUpperCase();
          headerRow.appendChild(th);
        }
      });
      const actionHeader = document.createElement("th");
      actionHeader.textContent = "ACTIONS";
      headerRow.appendChild(actionHeader);
      thead.appendChild(headerRow);
      table.appendChild(thead);

      // Create data rows
      data.forEach((rowData) => {
        const row = document.createElement("tr");

        Object.entries(rowData).forEach(([key, value]) => {
          if (
            key !== "id" &&
            key !== "file_path" &&
            key !== "filename" &&
            key !== "uploaded_at"
          ) {
            const cell = document.createElement("td");

            // Apply specific styling based on column type
            if (key === "name") {
              cell.className = "hall-name";
              cell.textContent = value;
            } else if (key === "projector_state") {
              cell.setAttribute("data-projector", value);
              cell.textContent = value.charAt(0).toUpperCase() + value.slice(1);
            } else if (key === "availability_status") {
              cell.setAttribute("data-status", value);
              cell.textContent = value.charAt(0).toUpperCase() + value.slice(1);
            } else if (key === "busy_until") {
              cell.textContent = value
                ? `Until ${value.date} ${value.time}`
                : "Not busy";
            } else if (key === "created_at") {
              cell.className = "reports-cell";
              // Check if this hall has any unresolved reports
              const hasUnresolvedReports = unresolvedReports.some(
                (report) => report.hall_id === rowData.id
              );
              if (hasUnresolvedReports) {
                cell.innerHTML =
                  '<i class="fa-solid fa-circle-exclamation" style="color: #FF0060; font-size: 20px;"></i>';
              }
              cell.style.textAlign = "center";
            } else if (key === "barcode") {
              let img = document.createElement("img");
              img.setAttribute("id", `barcode-${rowData.id}`);
              cell.appendChild(img);
            } else {
              cell.textContent = value;
            }
            row.appendChild(cell);
          }
        });

        const actionCell = document.createElement("td");
        actionCell.className = "actions";

              // if hall
        if (page == "hall") {
  
          const changeProjectorState = document.createElement("button");
          changeProjectorState.innerHTML =
            '<i class="fa-solid fa-projector"></i>Change Projector';
          changeProjectorState.classList.add("view");
          changeProjectorState.addEventListener("click", async () => {
            changeProjectorStateFun(rowData.id, rowData.projector_state);
          });

          const reports = document.createElement("button");
          reports.innerHTML =
            '<i class="fa-solid fa-clipboard-list"></i>Reports';
          reports.classList.add("view");
          reports.addEventListener("click", async () => {
            // checkUser();
            showReport(rowData.id);
          });

          const available = document.createElement("button");
          available.innerHTML =
            '<i class="fa-solid fa-check-circle"></i>Available';
          available.classList.add("edit");
          available.addEventListener("click", async () => {
            try {
              let res = await fetch(
                `http://localhost:5000/api/halls/available/${rowData.id}`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: Cookies.get("token"),
                  },
                }
              );
              if (res.status == 403 || res.status == 401)
                location.href = "/login";
              getData(content, `http://localhost:5000/api/halls/all`, "hall");
            } catch (e) {
              console.error(e);
            }
          });

          const busy = document.createElement("button");
          busy.innerHTML = '<i class="fa-solid fa-clock"></i>Mark Busy';
          busy.classList.add("del");
          busy.addEventListener("click", async () => {
            const credentials = { duration: 120 };
            try {
              let res = await fetch(
                `http://localhost:5000/api/halls/busy/${rowData.id}`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: Cookies.get("token"),
                  },
                  body: JSON.stringify(credentials),
                }
              );
              if (res.status == 403 || res.status == 401)
                location.href = "/login";
              getData(content, `http://localhost:5000/api/halls/all`, "hall");
            } catch (e) {
              console.error(e);
            }
          });

          actionCell.appendChild(changeProjectorState);
          actionCell.appendChild(reports);
          actionCell.appendChild(available);
          actionCell.appendChild(busy);
        } else {
          // View button
          const viewButton = document.createElement("button");
          viewButton.innerHTML = '<i class="fa-solid fa-eye"></i>View';
          viewButton.classList.add("view");
          viewButton.addEventListener("click", () => {
            document.querySelector(".btn-box button:last-child").style.display="none"

            if (document.getElementsByClassName("search-list")[0]) {
              let searchBox = document.getElementsByClassName("search-list")[0];
              searchBox.querySelector("input").value = "";
              content.textContent = "";
            }
            location.href = `http://localhost:${location.port}/search/${rowData.id}`;
          });

          // Update button
          const updateButton = document.createElement("button");
          updateButton.innerHTML = '<i class="fa-solid fa-edit"></i>Update';
          updateButton.classList.add("edit");
          updateButton.addEventListener("click", () => {
            let idInput = document.querySelector("input[name='ID']");
            if (checkUser()) {
              popUpFunImage(updatePopUp);
              if (idInput) idInput.value = rowData.id;
              idInput.parentElement.style.display = "none";
            }
          });

          actionCell.appendChild(viewButton);
          actionCell.appendChild(updateButton);
        }

        row.appendChild(actionCell);
        tbody.appendChild(row);
      });

      table.appendChild(tbody);
      content.appendChild(table);

      // Create barcodes if needed
      if (page !== "hall") {
        createBarCode(data);
      }
    } else {
      content.textContent = data.message || "No content to show";
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  
}

export { createTable, getData };
