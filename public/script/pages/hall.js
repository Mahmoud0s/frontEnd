import { sideBar } from "/script/component/sideBar.js";
import { getData } from "/script/component/table.js";
import {showReport , sendReport , getAllHalls } from "/script/component/reports.js"

// table 
try {
    getData(document.querySelector(".content"),`http://localhost:5000/api/halls/all`,"hall")

} catch (error) {
    console.error("An error occurred:", error);
}
getAllHalls()
let createUserForm = document.forms[0];
createUserForm.addEventListener("submit", sendReport);
document.addEventListener("DOMContentLoaded", sideBar);



