import {popUpFunUpdate , confirmFun ,deleteFun , popUpFun , hideAllPopUps,updatePopUp,popUpFunImage}  from "/script/component/popup.js";
import {createBarCode}  from "/script/component/barcode.js";
import { showReport , changeProjectorStateFun } from "/script/component/reports.js";

async function createTable(page) {
    const content = document.querySelector(".add-user .content");
    let API;
    if(page=="user")
        API="http://localhost:5000/api/users" 
    else if (page=="workSection")
        API="http://localhost:5000/api/work-sections"
    else
        API="http://localhost:5000/api/halls/all"
    
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
                cell.textContent = key=="created_at" || ( key=="busy_until" && rowData[key]!=null)? `${rowData[key].date} ${rowData[key].time }` : cell.textContent = rowData[key];
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
async function getData(content,api,page){
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
                  } else if (key === "uploaded_at" && rowData[key] || key=="created_at") {
                        
                      const { date, time } = rowData[key];
                      cell.textContent = `${date || ""} ${time || ""}`;
                  } else {
                      cell.textContent = rowData[key];
                  }

                  if(key=="busy_until" && rowData[key]!=null){                    
                    const { date, time } = rowData[key];
                    cell.textContent = `${date || ""} ${time || ""}`;
                    
                  }
                //   color
                  if(key=="availability_status"){
                    cell.style.backgroundColor =rowData[key]=="available"?"#1B9C85":"#FF0060"
                  }
              });
              const actionCell = row.insertCell();
            if(page=="hall"){
                const busy = document.createElement("button");
                busy.innerText = "busy";
                busy.classList.add("view");
                busy.addEventListener("click",async ()=>{
                    const credentials={"duration":120,}
                    try{                  
                        let res=await fetch(`http://localhost:5000/api/halls/busy/${rowData.id}`,{
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                'Authorization': Cookies.get('token')
                            },
                            body: JSON.stringify(credentials),
                            })
                            console.log(await res.json());
                            if(res.status==403)
                                location.href="/login"
                        }
                    catch(e){
                        console.log(e);
                        
                    }  
                    getData(content,`http://localhost:5000/api/halls/all`,"hall")
                })
                const avaliable =document.createElement("button");
                avaliable.innerText = "avaliable";
                avaliable.classList.add("view"); //style
                avaliable.addEventListener("click",async ()=>{
                    try{                  
                        let res=await fetch(`http://localhost:5000/api/halls/available/${rowData.id}`,{
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                'Authorization': Cookies.get('token')
                            },
                            })
                            console.log(await res.json());
                            if(res.status==403)
                                location.href="/login"
                        }
                    catch(e){
                        console.error(e)
                        
                    }
                    getData(content,`http://localhost:5000/api/halls/all`,"hall")
                })
                const reports = document.createElement("button");
                reports.innerText = "reports";
                reports.classList.add("view"); //style
                reports.addEventListener("click",async ()=>{showReport(rowData.id)})

                const changeProjectorState = document.createElement("button");
                changeProjectorState.innerText = "change projector state";
                changeProjectorState.classList.add("view"); //style
                changeProjectorState.addEventListener("click",async ()=>{
                    changeProjectorStateFun(rowData.id,rowData.projector_state)
                })

                
                actionCell.appendChild(changeProjectorState);
                actionCell.appendChild(reports);
                actionCell.appendChild(avaliable);
                actionCell.appendChild(busy);

                
            }
            else{
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
            }
          });

          content.appendChild(table);
          if(page=="hall"){}
          else
            createBarCode(data)
      } else {
        content.textContent=data.message || "no content to show";
      }
  } 

export {createTable ,getData} ;