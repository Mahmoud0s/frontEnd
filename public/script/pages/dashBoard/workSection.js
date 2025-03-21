let sendBtn = document.getElementById("SendBtn");
let createPopUp = document.getElementById("create-WS-popUp");
let updatePopUp = document.getElementById("update-WS-popUp");
const content = document.querySelector(".add-user .content");


let btn = document.getElementsByClassName("section-list")[0];
btn.addEventListener("click", () => { popUpFun(createPopUp); });


function popUpFunUpdate(rowData) {
    const updateForm = document.forms[1]; 

    let idInput = updateForm.querySelector('input[name="ID"]');
    let workSectionName = updateForm.querySelector('input[name="workSectionName"]');

    idInput.value = rowData.id;
    idInput.disabled = true;
    idInput.style.cursor = "not-allowed";
    idInput.parentElement.style.display="none"
    workSectionName.value = rowData.name;
}


const updateForm = document.forms[1];
const saveButton = updateForm.querySelector('input[type="submit"]');

saveButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const idInput = updateForm.querySelector('input[name="ID"]');
    const workSectionName = updateForm.querySelector('input[name="workSectionName"]');
    const msg = updateForm.querySelector('div.message'); 
    
    const updatedData = {
        name: workSectionName.value,
    };

    try {
        const response = await fetch(`http://localhost:5000/api/work-sections/${idInput.value}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'Authorization': Cookies.get('token'),

            },
            body: JSON.stringify(updatedData)
        });

        const result = await response.json();

        if (response.ok) {
            msg.textContent = result.message;
            msg.style.color = '#1B9C85';

            const content = document.querySelector(".add-user .content");
            content.innerHTML = "";
            getAllData();
        } else {
            msg.textContent = result.message || result.errors[0].msg || 'An error occurred';
            msg.style.color = '#FF0060';
        }
    } catch (error) {
        console.error("Error updating work section:", error);
    }
});

let deletePopUp = document.getElementById("delete-WS-popUp");
// let cancel = deletePopUp.querySelector("input[value='cancel']");
let confirm = deletePopUp.querySelector("input[value='confirm']");
let msgwarning = deletePopUp.querySelector("#msgwarning");


confirm.addEventListener("click", () => {
    deleteWSAction();
});

function confirmWS(rowData) {
    return new Promise((resolve) => {
        msgwarning.innerHTML = `Are you sure you want to delete this work section: 
        <h4>( work Section name: ${rowData.name} ) ? </h4>`;
        popUpFun(deletePopUp);

        deleteWSAction = () => {
            popUpFun(deletePopUp);
            resolve(true);
        };
        // closeBtn.addEventListener("click", () => {
        //     popUpFun(deletePopUp);
        //     resolve(false);
        // }, { once: true }); 
    });
}



async function deleteWS(userId, row) {
    try {
        const response = await fetch(`http://localhost:5000/api/work-sections/${userId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                'Authorization': Cookies.get('token')
            }
        });

        const result = await response.json();

        if (response.ok) {
            row.remove(); 
        } else {
            alert(result.message || 'An error occurred');
        }
    } catch (error) {
        console.error("Error deleting work section:", error);
    }
}


async function getAllData() {
    const content = document.querySelector(".add-user .content");
    const response = await fetch("http://localhost:5000/api/work-sections");
    const data = await response.json();
    
    if (data.length) {
        const keys = Object.keys(data[0]);

        const table = document.createElement("table");

        const thead = table.createTHead();
        const tbody = table.createTBody();
        const headerRow = thead.insertRow();

        keys.forEach(key => {
            if (key=="id") return
            const th = document.createElement("th");
            th.textContent = key;
            headerRow.appendChild(th);
        });
        const actionHeader = document.createElement("th");
        actionHeader.textContent = "Actions";
        headerRow.appendChild(actionHeader);

        data.forEach(rowData => {
            const row = tbody.insertRow();
            keys.forEach(key => {
            if (key=="id") return

                const cell = row.insertCell();
                
                if(key=="created_at")
                    cell.textContent = `${rowData[key].date} ${rowData[key].time }`;
                else
                    cell.textContent = rowData[key];
            });

            const actionCell = row.insertCell();

            const updateButton = document.createElement("button");
            updateButton.innerText = "Update";
            updateButton.classList.add("edit");
            updateButton.addEventListener("click", () => {
                popUpFun(updatePopUp);
                popUpFunUpdate(rowData);
            });

            const deleteButton = document.createElement("button");
            deleteButton.innerText = "Delete";
            deleteButton.classList.add("del");
            deleteButton.addEventListener("click", async () => {
                const confirmed = await confirmWS(rowData);
                if (confirmed) {
                    deleteWS(rowData.id, row);
                }
            });

            actionCell.appendChild(updateButton);
            actionCell.appendChild(deleteButton);
        });

        content.appendChild(table);
    }
}




const createWorkSection=document.forms[0];

async function createNewWork(e) {
    let workSectionName = createWorkSection.querySelector("[name='workSectionName']");    
    let msg = createWorkSection.querySelector(".message");
    
    e.preventDefault();
    const info = {
        name: workSectionName.value,
    };
    try {
        const response = await fetch("http://localhost:5000/api/work-sections", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': Cookies.get('token')

            },
            body: JSON.stringify(info),
            credentials: "include"
        });

        const result = await response.json();

        if (response.ok) {
            msg.textContent = result.message;
            msg.style.color = '#1B9C85';
            content.textContent = "";
            getAllData();
        } else {
            msg.textContent = result.message || result.errors[0].msg || 'An error occurred';
            msg.style.color = '#FF0060';
        }

    } catch (error) {
        console.error('Error submitting form:', error);
        msg.textContent = 'An error occurred while submitting the form';
        msg.style.color = 'red';
    }
}

let form = document.forms[0];
form.addEventListener("submit", createNewWork);
document.addEventListener("DOMContentLoaded", getAllData);
