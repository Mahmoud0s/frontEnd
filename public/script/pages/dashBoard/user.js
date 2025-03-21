
let btn = document.getElementsByClassName("section-list")[0];
let createPopUp = document.getElementById("create-user-popUp");
let updatePopUp = document.getElementById("update-user-popUp");

async function getIdWS(){
    let create_workSection = createPopUp.querySelector("select[name='work_section_id']");
    let update_workSection = updatePopUp.querySelector("select[name='work_section_id']");
    let res=await fetch("http://localhost:5000/api/work-sections")
    let data = await res.json(); 
    for(let i =0;i<data.length;i++){
        let opt=document.createElement("option");
        opt.value=data[i].id;
        opt.textContent=data[i].name
        create_workSection.appendChild(opt.cloneNode(true))
        update_workSection.appendChild(opt.cloneNode(true))
    }
    

}

btn.addEventListener("click", () => { popUpFun(createPopUp); });

function popUpFunUpdate(rowData) {
    const updateForm = document.forms[1];

    const name = updateForm.querySelector('input[name="name"]');
    let idInput = updateForm.querySelector('input[name="ID"]');
    let userName = updateForm.querySelector('input[name="username"]');
    let workSection = updateForm.querySelector('select[name="work_section_id"]');
    let role = updateForm.querySelector('select[name="role"]');

    idInput.value = rowData.id;
    idInput.disabled = true;
    idInput.parentElement.style.display="none"
    name.value=rowData.name;
    userName.value = rowData.username;
    role.value = rowData.role;
}


const updateForm = document.forms[1];
const saveButton = updateForm.querySelector('input[type="submit"]');
// update 
saveButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const name = updateForm.querySelector('input[name="name"]');
    const idInput = updateForm.querySelector('input[name="ID"]');
    const userName = updateForm.querySelector('input[name="username"]');
    const workSection = updateForm.querySelector('select[name="work_section_id"]');
    const role = updateForm.querySelector('select[name="role"]');
    const msg = updateForm.querySelector('div.message'); 

    const updatedData = {
        name:name.value,
        username: userName.value,
        work_section_id: workSection.value,
        role: role.value
    };

    try {
        const response = await fetch(`http://localhost:5000/api/users/${idInput.value}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'Authorization': Cookies.get('token')
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
        console.error("Error updating user:", error);
    }
});

let deletePopUp = document.getElementById("delete-user-popUp");
// let cancel = deletePopUp.querySelector("input[value='cancel']");
let confirm = deletePopUp.querySelector("input[value='confirm']");
let msgwarning = deletePopUp.querySelector("#msgwarning");


// delete user

confirm.addEventListener("click", () => {
    deleteUserAction();
});

function confirmUser(rowData) {
    return new Promise((resolve) => {
        console.log(rowData)
        msgwarning.textContent = `Are you sure you want to delete this user: (user: ${rowData.username})?`;
        popUpFun(deletePopUp);

        deleteUserAction = () => {
            popUpFun(deletePopUp);
            resolve(true);
        };
        // closeBtn.addEventListener("click", () => {
        //     popUpFun(deletePopUp);
        //     resolve(false);
        // }, { once: true }); 
    });
}

async function deleteUser(userId, row) {
    try {
        const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
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
        console.error("Error deleting user:", error);
    }
}


async function getAllData() {
    const content = document.querySelector(".add-user .content");
    const response = await fetch("http://localhost:5000/api/users",{
         method: "Get",
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

        keys.forEach(key => {
            if (key=="id") return;
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
                if (key=="id") return;
                const cell = row.insertCell();
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
                const confirmed = await confirmUser(rowData);
                if (confirmed) {
                    // start from here
                    deletePopUp.classList.toggle("showMe")                    
                    // popUpFun(deletePopUp)
                    deleteUser(rowData.id, row);
                }
            });

            actionCell.appendChild(updateButton);
            actionCell.appendChild(deleteButton);
        });

        content.appendChild(table);
    }
}


// create a user
async function createUser(e) {
    e.preventDefault();
    let name = createPopUp.querySelector("input[name='name']");
    let userName = createPopUp.querySelector("input[name='username']");
    let password = createPopUp.querySelector("input[name='password']");
    let workSection = createPopUp.querySelector("select[name='work_section_id']");
    let role = createPopUp.querySelector("select[name='role']");
    let msg = document.getElementsByClassName("message")[0];
    const info = {
        name :name.value,
        username: userName.value,
        password: password.value,
        role: role.value,
        work_section_id: workSection.value,
    };
    
    try {
        const response = await fetch("http://localhost:5000/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': Cookies.get('token'),
            },
            body: JSON.stringify(info),
            credentials: "include"
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
        console.error('Error submitting form:', error);
        msg.textContent = 'An error occurred while submitting the form';
        msg.style.color = 'red';
    }
}

let form = document.forms[0];
form.addEventListener("submit", createUser);
document.addEventListener("DOMContentLoaded", getAllData);
document.addEventListener("DOMContentLoaded", getIdWS);
