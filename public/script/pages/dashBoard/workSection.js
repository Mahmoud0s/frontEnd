import {popUpFun  ,updatePopUp,popUpFunUpdate}  from "/script/component/popup.js";
import {createTable}  from "/script/component/table.js";

const content = document.querySelector(".add-user .content");
const createPopUp = document.getElementById("create-popUp");

let addBtn = document.getElementsByClassName("section-list")[0];
addBtn.addEventListener("click", () => { popUpFun(createPopUp); });


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
            createTable();
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
document.addEventListener("DOMContentLoaded", createTable);
