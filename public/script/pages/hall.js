import { getData } from "/script/component/table.js";
import {showReport , sendReport , getAllHalls } from "/script/component/reports.js"

// table 
try {
    getData(document.querySelector(".content"),`http://localhost:5000/api/halls/all`,"hall")

} catch (error) {
    console.error("An error occurred:", error);
}
getAllHalls()

//buttons
let buttonBox=document.querySelector(".btn-box");
let back=buttonBox.querySelector("button:first-of-type")
let next=buttonBox.querySelector("button:last-of-type")
let hallNum=+ sessionStorage.getItem("hall") || 1;
back.addEventListener("click",(e)=>{
    e.preventDefault();
        hallNum = Math.max(1, hallNum - 1);
        sessionStorage.setItem("hall", hallNum);
        getData(document.querySelector(".content"),`http://localhost:5000/api/halls/all`,"hall",hallNum)
})
next.addEventListener("click",(e)=>{
    e.preventDefault();
        hallNum += 1;
        sessionStorage.setItem("hall", hallNum);
        getData(document.querySelector(".content"),`http://localhost:5000/api/halls/all`,"hall",hallNum)
})

let createUserForm = document.forms[0];
createUserForm.addEventListener("submit", sendReport);



