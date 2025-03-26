import {popUpFunUpdate , confirmFun ,deleteFun , popUpFun , hideAllPopUps,updatePopUp,popUpFunImage}  from "/script/component/popup.js";
import {createBarCode}  from "/script/component/barcode.js";

async function createTable(page) {
    const content = document.querySelector(".add-user .content");
    const API = page=="user" ? "http://localhost:5000/api/users" : "http://localhost:5000/api/work-sections" ;
    
    const response = await fetch(API,{
        headers: {
                    "Content-Type": "application/json",
                    'Authorization': Cookies.get('token')
            },
        credentials: "include"
    });
    const data = await response.json();

    if (data.length) {
        const keys = Object.keys(data[0]);
        const table = document.createElement("table");

        const thead = table.createTHead();
        const tbody = table.createTBody();
        const headerRow = thead.insertRow();

        // header
        keys.forEach(key => {
            key=key.replaceAll("_"," ")
            if (key=="id") return;
            const th = document.createElement("th");
            th.textContent = key;
            headerRow.appendChild(th);
        });
        const actionHeader = document.createElement("th");
        actionHeader.textContent = "Actions";
        headerRow.appendChild(actionHeader);
        // body
        data.forEach(rowData => {
            const row = tbody.insertRow();
            keys.forEach(key => {
                if (key=="id") return;
                const cell = row.insertCell();
                // values
                cell.textContent = key=="created_at"? `${rowData[key].date} ${rowData[key].time }` : cell.textContent = rowData[key];
            });

            const actionCell = row.insertCell();
                // update Button
                 const updateButton = document.createElement("button");
                updateButton.innerText = "Update";
                updateButton.classList.add("edit");
                updateButton.addEventListener("click", () => {
                    popUpFun(updatePopUp);
                    popUpFunUpdate(rowData,page);
                });
                // delete Button
                const deleteButton = document.createElement("button");
                deleteButton.innerText = "Delete";
                deleteButton.classList.add("del");
                deleteButton.addEventListener("click", async () => {
                    const confirmed =  await confirmFun(rowData,page) ;
                    if (confirmed) {
                        deleteFun(rowData.id,row,page)
                    }
                });

            actionCell.appendChild(updateButton);
            actionCell.appendChild(deleteButton);
        });

        content.appendChild(table);
    }
}
//home /search
async function getData(content,api){
    content.textContent="";
      let res = await fetch(api);
      let data = await res.json();
    
      if (data.length) {
          const keys = Object.keys(data[0]);

          // Create a table
          const table = document.createElement("table");
          const thead = table.createTHead();
          const tbody = table.createTBody();
          const headerRow = thead.insertRow();

          // header
          keys.forEach(key => {
              if (key === "file_path" || key == "id" || key == "filename") return;

              const th = document.createElement("th"); 
              th.textContent = key.replace("_"," ");
              headerRow.appendChild(th);
          });

          const actionHeader = document.createElement("th");
          actionHeader.textContent = "Actions";
          headerRow.appendChild(actionHeader);
          // body
          data.forEach((rowData) => {   
              const row = tbody.insertRow();
              keys.forEach((key) => {
                  if (key === "file_path" || key == "id" || key == "filename") return;
                  const cell = row.insertCell();
                  if (key === "barcode") {
                      let img = document.createElement("img");
                      img.setAttribute("id", `barcode-${rowData.id}`);
                      cell.appendChild(img);
                  } else if (key === "uploaded_at" && rowData[key]) {
                      const { date, time } = rowData[key];
                      cell.textContent = `${date || ""} ${time || ""}`;
                  } else {
                      cell.textContent = rowData[key];
                  }
              });
            
              const actionCell = row.insertCell();

              // View button
              const viewButton = document.createElement("button");
              viewButton.innerText = "View";
              viewButton.classList.add("view");
              viewButton.addEventListener("click", () => {
                //if there search box(home page)
                if(document.getElementsByClassName("search-list")[0]){
                    let searchBox=document.getElementsByClassName("search-list")[0];
                    searchBox.querySelector("input").value=""
                    content.textContent=""
                }
                  location.href = `http://localhost:${location.port}/search/${rowData.id}`;
              });

              // Update button
              const updateButton = document.createElement("button");
              updateButton.innerText = "Update";
              updateButton.addEventListener("click",()=>{
                let idInput=document.querySelector("input[name='ID']");
                //if guest or admin redirect to login
                    if(checkUser()){ 
                        popUpFunImage(updatePopUp); 
                        if (idInput) idInput.value = rowData.id; 
                        idInput.parentElement.style.display="none"     
                    }
              });

              actionCell.appendChild(viewButton);
              actionCell.appendChild(updateButton);
          });

          content.appendChild(table);
          createBarCode(data)
      } else {
        content.textContent=data.message || "no content to show";
      }
  } 

export {createTable ,getData} ;