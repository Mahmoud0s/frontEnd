let searchBox=document.getElementsByClassName("search-list")[0];

let input = searchBox.querySelector("input");
searchBox.addEventListener("input", async () => {
    let content=searchBox.querySelector("div.content");

        let res = await fetch(`http://localhost:5000/api/search/search?query=${input.value}`);
        let data =await res.json();
        content.textContent="";
        
        if (data.length) {
            const keys = Object.keys(data[0]);
            const table = document.createElement("table");
    
            const thead = table.createTHead();
            const tbody = table.createTBody();
            const headerRow = thead.insertRow();
    
            keys.forEach(key => {
                const th = document.createElement("th");
                th.textContent = key;
                headerRow.appendChild(th);
            });
            const actionHeader = document.createElement("th");
            actionHeader.textContent = "Actions";
            headerRow.appendChild(actionHeader);
    
            let counter=0;

            data.forEach((rowData) => {
                const row = tbody.insertRow();
                keys.forEach((key,ind,arr) => {
                    const cell = row.insertCell();
                    if(ind==2){
                        console.log(cell);
                        let img=document.createElement("img");
                        img.setAttribute("id",`barcode-${counter}`)
                        cell.appendChild(img)                      
                        counter=counter+1;
                    }
                    else{
                        cell.textContent = rowData[key];
                    }
                });
                const actionCell = row.insertCell();
                const viewButton = document.createElement("button");
                viewButton.innerText = "view";
                viewButton.classList.add("edit");
                viewButton.addEventListener("click", async () => {
                    location.href=`http://localhost:${location.port}${rowData.file_path}`
                    
                    let respose= await fetch(`http://localhost:${location.port}${rowData.file_path}`);
                    console.log(await respose.json());
                    
                });
    
                actionCell.appendChild(viewButton);
            });
    
            content.appendChild(table);

            data.forEach((rowData,ind) => {
                JsBarcode(`#barcode-${ind}`,rowData.barcode,
                {
                    format: "CODE128",
                    lineColor: "#000",
                    width: 2,
                    height: 50,
                    displayValue:true, 
                    fontSize: 16,
                });
                
            });

        }
        else{            
            content.textContent=`${data.message}`
        }

})






