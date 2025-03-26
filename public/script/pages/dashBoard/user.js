import {getWSInfo , popUpFun}  from "/script/component/popup.js";
import {createTable}  from "/script/component/table.js";

const createPopUp = document.getElementById("create-popUp");

const addBtn = document.querySelector(".section-list");
addBtn.addEventListener("click", () => { popUpFun(createPopUp); });

//create
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
            createTable("user");
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



let createUserForm = document.forms[0];
createUserForm.addEventListener("submit", createUser);
document.addEventListener("DOMContentLoaded", createTable("user"));
document.addEventListener("DOMContentLoaded", getWSInfo);
