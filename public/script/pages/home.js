import { sideBar } from "/script/component/sideBar.js";
import { getData } from "/script/component/table.js";

const imagePreview = document.getElementById('image-preview');

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

async function getWsInfo(){
    const wsId=location.href.split("work-section/")[1];
    const wsName=document.getElementById("wsName")
    const docCount=document.getElementById("docCount")
    const userCount=document.getElementById("userCount")

    const response=await fetch(`http://localhost:5000/api/analytics/work-section/${wsId}`);
        
    if(response.status==401){
        location.href="/login";
        return;
    }
    if(response.status==404){
        location.href="/home";
        return;
    }
    const data = await response.json();

    wsName.textContent=data.work_section_name;
    docCount.textContent=data.document_count;
    userCount.textContent=data.user_count;
}

// table 
try {
    const section = location.href.split("work-section/")[1];
    if (!section)
        console.error("Invalid URL structure for fetching data.");
    else
    getData(document.querySelector(".content"),`http://localhost:5000/api/search/work-section/${section}`)

} catch (error) {
    console.error("An error occurred:", error);
}

document.addEventListener("DOMContentLoaded", sideBar);
document.addEventListener("DOMContentLoaded", getWsInfo);


