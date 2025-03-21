let btn = document.getElementsByClassName("section-list")[0];
btn.addEventListener("click", () => {
    if(checkUser())
        location.href="/upload";
}
);
// update popup 
let message=document.querySelector("div.message");
const imagePreview = document.getElementById('image-preview');
let send=document.getElementById("Btn");

async function updateImage(e){
    e.preventDefault();
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];
    console.log(idInput.value);
    
    if (file) {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await fetch(`http://localhost:5000/api/documents/update/${idInput.value}`, {
                method: 'put',
                headers:{
                    'Authorization': Cookies.get('token')
                },
                body: formData,
                credentials: 'include'
            });
            if(response.status==403){
                location.href="/login"
            }
            const result = await response.json();
            console.log(result);
            if (response.ok) {
                message.textContent=result.message
                message.style.color="#1B9C85"
            } else {
                message.textContent=result.message
                message.style.color="#FF0060"
            }
        } catch (error) {
            message.textContent=result.message
            message.style.color="#FF0060"
        }
    } else {
        message.textContent="Please select a file to upload."
        message.style.color="#FF0060"
    }
}
send.addEventListener("click",updateImage)
// onclick on file
document.getElementById('file-input').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
});


let searchBox=document.getElementsByClassName("search-list")[0];
let input = searchBox.querySelector("input");
let updatePopUp = document.getElementById("update-user-popUp");
let idInput=document.querySelector("input[name='ID']");


searchBox.addEventListener("input", async () => {
    let content=searchBox.querySelector("div.content");
        // let res = await fetch(`/api/search/search?query=${input.value}`);
       getData(content,`http://localhost:5000/api/search/search?query=${input.value}`);
        // let data =await res.json();
        // content.textContent="";
        
        // if (data.length) {
        //     const keys = Object.keys(data[0]);
        //     const table = document.createElement("table");
    
        //     const thead = table.createTHead();
        //     const tbody = table.createTBody();
        //     const headerRow = thead.insertRow();
    
        //     keys.forEach(key => {
        //         const th = document.createElement("th");
        //         th.textContent = key;
        //         headerRow.appendChild(th);
        //     });
        //     const actionHeader = document.createElement("th");
        //     actionHeader.textContent = "Actions";
        //     headerRow.appendChild(actionHeader);
    
        //     let counter=0;

        //     data.forEach((rowData) => {
        //         const row = tbody.insertRow();
        //         keys.forEach((key,ind,arr) => {
        //             const cell = row.insertCell();
        //             if(key=="barcode"){
        //                 console.log(cell);
        //                 let img=document.createElement("img");
        //                 img.setAttribute("id",`barcode-${counter}`)
        //                 cell.appendChild(img)                      
        //                 counter=counter+1;
        //             }
        //             else{
        //                 cell.textContent = rowData[key];
        //             }
        //         });
        //         const actionCell = row.insertCell();
        //         const viewButton = document.createElement("button");
        //         viewButton.innerText = "view";
        //         viewButton.classList.add("edit");
        //         viewButton.addEventListener("click", async () => {
        //             location.href=`http://localhost:${location.port}${rowData.file_path}`;
        //             content.textContent=""
                    
        //         });
    
        //         actionCell.appendChild(viewButton);
        //     });
    
        //     content.appendChild(table);

        //     data.forEach((rowData,ind) => {
        //         JsBarcode(`#barcode-${ind}`,rowData.barcode,
        //         {
        //             format: "CODE128",
        //             lineColor: "#000",
        //             width: 2,
        //             height: 50,
        //             displayValue:true, 
        //             fontSize: 16,
        //         });
                
        //     });

        // }
        // else{            
        //     content.textContent=`${data.message}`
        // }

})

document.addEventListener("DOMContentLoaded", getWS);

