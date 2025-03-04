
// Toggle class function
function popUpFun(el) {
    el.classList.toggle("showMe");
}

let btn = document.getElementsByClassName("section-list")[0];
let sendBtn = document.getElementById("SendBtn");
let popUpCloseBtn = document.getElementById("ColseBtn"); 
let createPopUp = document.getElementById("create-user-popUp");
let updatePopUp = document.getElementById("update-user-popUp");


// Event listeners for closing popups on double-click
createPopUp.addEventListener("dblclick", () => {
    createPopUp.classList.remove("showMe");
});
updatePopUp.addEventListener("dblclick", () => {
    updatePopUp.classList.remove("showMe");
});

// Event listeners for toggling popups
btn.addEventListener("click", () => { popUpFun(createPopUp); });
popUpCloseBtn.addEventListener("click", () => { popUpFun(createPopUp); });





// Function to populate update form
function popUpFunUpdate(rowData) {
    const updateForm = document.forms[1]; // Ensure this is the correct form index

    let idInput = updateForm.querySelector('input[name="ID"]');
    let userName = updateForm.querySelector('input[name="username"]');
    let workSection = updateForm.querySelector('input[name="work_section_id"]');
    let role = updateForm.querySelector('select[name="role"]');

    idInput.value = rowData.id;
    idInput.disabled = true;
    idInput.style.cursor = "not-allowed";

    userName.value = rowData.username;
    workSection.value = rowData.work_section_id; // Ensure the correct key name
    role.value = rowData.role;
}

// Add event listener to update form's submit button
const updateForm = document.forms[1];
const saveButton = updateForm.querySelector('input[type="submit"]');

saveButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const idInput = updateForm.querySelector('input[name="ID"]');
    const userName = updateForm.querySelector('input[name="username"]');
    const workSection = updateForm.querySelector('input[name="work_section_id"]');
    const role = updateForm.querySelector('select[name="role"]');
    const msg = updateForm.querySelector('div.message'); // Correct selector

    const updatedData = {
        username: userName.value,
        work_section_id: workSection.value,
        role: role.value
    };

    try {
        const response = await fetch(`/api/users/${idInput.value}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
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
let cancel = deletePopUp.querySelector("input[value='cancel']");
let confirm = deletePopUp.querySelector("input[value='confirm']");
let msgwarning = deletePopUp.querySelector("#msgwarning");


confirm.addEventListener("click", () => {
    deleteUserAction();
});

function confirmUser(rowData) {
    return new Promise((resolve) => {
        msgwarning.textContent = `Are you sure you want to delete this user: (id: ${rowData.id} , user: ${rowData.username})?`;
        popUpFun(deletePopUp);
        // Save the delete action to be performed after confirmation
        deleteUserAction = () => {
            popUpFun(deletePopUp);
            resolve(true);
        };
        cancel.addEventListener("click", () => {
            popUpFun(deletePopUp);
            resolve(false);
        }, { once: true }); // Ensures the event listener runs only once
    });
}

deletePopUp.addEventListener("dblclick", () => {
    deletePopUp.classList.remove("showMe");
});

async function deleteUser(userId, row) {
    try {
        const response = await fetch(`/api/users/${userId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
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

// Function to fetch and display all data
async function getAllData() {
    const content = document.querySelector(".add-user .content");
    const response = await fetch("/api/users");
    const data = await response.json();

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

        data.forEach(rowData => {
            const row = tbody.insertRow();
            keys.forEach(key => {
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
                    deleteUser(rowData.id, row);
                }
            });

            actionCell.appendChild(updateButton);
            actionCell.appendChild(deleteButton);
        });

        content.appendChild(table);
    }
}





// Function to create a user
async function createUser(e) {
    let userName = document.getElementsByTagName("input")[0];
    let password = document.getElementsByTagName("input")[1];
    let workSection = document.getElementsByTagName("input")[2];
    let role = document.getElementsByTagName("select")[0];
    let msg = document.getElementsByClassName("message")[0];
    e.preventDefault();
    const info = {
        username: userName.value,
        password: password.value,
        role: role.value,
        work_section_id: workSection.value,
    };
    try {
        const response = await fetch("/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
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
