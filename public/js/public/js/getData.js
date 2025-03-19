async function getData(pos,api){
    pos.textContent="";
      let res = await fetch(api);
      let data = await res.json();
      let counter = 0;
      if(res.status==404){
        location.href="/home"
      } 
    
      if (data.length) {
          const keys = Object.keys(data[0]);

          // Create a table
          const table = document.createElement("table");
          const thead = table.createTHead();
          const tbody = table.createTBody();
          const headerRow = thead.insertRow();

          // Populate table headers
          keys.forEach(key => {
              if (key === "file_path" || key == "id" || key == "filename") return;

              const th = document.createElement("th"); 
              th.textContent = key.replace("_"," ");
              headerRow.appendChild(th);
          });

  
          const actionHeader = document.createElement("th");
          actionHeader.textContent = "Actions";
          headerRow.appendChild(actionHeader);

          data.forEach((rowData) => {
              const row = tbody.insertRow();

              keys.forEach((key) => {
                  if (key === "file_path" || key == "id" || key == "filename") return;

                  const cell = row.insertCell();

                  if (key === "barcode") {
                      let img = document.createElement("img");
                      img.setAttribute("id", `barcode-${counter}`);
                      cell.appendChild(img);
                      counter++;
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
              viewButton.classList.add("edit");
              viewButton.addEventListener("click", () => {
                  location.href = `http://localhost:${location.port}/search/${rowData.id}`;
              });

              // Update button
              const updateButton = document.createElement("button");
              updateButton.innerText = "Update";
              updateButton.setAttribute("id", "upload-button");
              updateButton.addEventListener("click", function () {
                    if(checkUser()){
                        popUpFun(updatePopUp); 
                        if (idInput) idInput.value = rowData.id; 
                    }
              });

              actionCell.appendChild(viewButton);
              actionCell.appendChild(updateButton);
          });

          pos.appendChild(table);

          data.forEach((rowData, ind) => {
              try {
                  JsBarcode(`#barcode-${ind}`, rowData.barcode, {
                      format: "CODE128",
                      lineColor: "#000",
                      width: 2,
                      height: 50,
                      displayValue: true,
                      fontSize: 11,
                  });
              } catch (err) {
                  console.error(`Error generating barcode for index ${ind}:`, err);
              }
          });
      } else {
        pos.textContent=data.message || "no content to show";
      }
  } 

async function getWS(){
    const res=await fetch("http://localhost:5000/api/work-sections");
    const allData=await res.json();

    let files=document.getElementsByClassName("files")[0];

    allData.forEach(data=>{
        
        
        let folder=document.createElement("a")
        folder.classList.add("folder");
        let div=document.createElement("div");
        let icon=document.createElement("i");
        icon.classList.add("fa-regular", "fa-folder")
        let info=document.createElement("h3")
        info.classList.add("info");
        info.textContent=data.name;
        
        folder.href=`/search/work-section/${data.id}`
        div.appendChild(icon)
        folder.appendChild(div)
        folder.appendChild(info)

        if(data.id== location.href.split("work-section/")[1]){
            folder.classList.add("active");
            const targetFolderIcon = folder.querySelector('i');
            targetFolderIcon.classList.replace('fa-folder', 'fa-folder-open');
        }

        files.appendChild(folder)
    })
    
}