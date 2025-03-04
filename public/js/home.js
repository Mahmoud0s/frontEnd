const sideMenu = document.querySelector('aside');
const menuBtn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('close-btn');
let updatePopUp = document.getElementById("update-user-popUp");
const darkMode = document.querySelector('.dark-mode');
let idInput=document.querySelector("input[name='ID']");
let send=document.getElementById("Btn");
let message=document.querySelector("div.message");
const imagePreview = document.getElementById('image-preview');


let btn = document.getElementsByClassName("section-list")[0];
btn.addEventListener("click", () => {location.href="/upload";});

darkMode.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode-variables');
    darkMode.querySelector('span:nth-child(1)').classList.toggle('active');
    darkMode.querySelector('span:nth-child(2)').classList.toggle('active');
})

menuBtn.addEventListener('click', () => {
    sideMenu.style.display = 'block';
});
closeBtn.addEventListener('click', () => {
    sideMenu.style.display = 'none';
});
updatePopUp.addEventListener("dblclick", () => {
    updatePopUp.classList.remove("showMe");
});
// Toggle class function
function popUpFun(el) {
    const fileInput = document.getElementById('file-input');
    fileInput.value="";
    imagePreview.src="";
    message.textContent="";
    el.classList.toggle("showMe");
}

const userNum=document.getElementById("userNum");
const WSNum=document.getElementById("workSectionNum");

// send button 
async function updateImage(e){
    e.preventDefault();
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await fetch(`http://localhost:5000/api/documents/update/${idInput.value}`, {
                method: 'put',
                body: formData,
                credentials: 'include'
            });

            const result = await response.json();
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
async function getWS(){
    const res=await fetch("/api/work-sections");
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

async function getAllData(){
    let main=document.body.getElementsByTagName("main")[0];
    let res = await fetch(`http://localhost:5000/api/search/work-section/${location.href.split("work-section/")[1]}`);
    let data =await res.json();

        let counter=0;
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
                // view Btn
                const viewButton = document.createElement("button");
                viewButton.innerText = "view";
                viewButton.classList.add("edit");
                viewButton.addEventListener("click", async () => {
                    location.href=`http://localhost:${location.port}${rowData.file_path}`
                    
                    let respose= await fetch(`http://localhost:${location.port}${rowData.file_path}`);
                    console.log(await respose.json());
                    
                });
                // updateBtn
                const UpdateButton = document.createElement("button");
                UpdateButton.innerText="update";
                UpdateButton.setAttribute("id","upload-button");

                UpdateButton.addEventListener('click', async function() {
                    popUpFun(updatePopUp);
                    idInput.value=rowData.id;
                });

                actionCell.appendChild(viewButton);
                actionCell.appendChild(UpdateButton);

            });
    
            main.appendChild(table);

            data.forEach((rowData,ind) => {
                JsBarcode(`#barcode-${ind}`,rowData.barcode,
                {
                    format: "CODE128",
                    lineColor: "#000",
                    width: 2,
                    height: 50,
                    displayValue:true, 
                    fontSize: 11,
                });

                
            });
        }
        else{            
            main.querySelector(".content").textContent="no content to show"
        }
    
}

document.addEventListener("DOMContentLoaded", getAllData);
document.addEventListener("DOMContentLoaded", getWS);


