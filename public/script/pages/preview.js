
import {createBarCode} from "/script/component/barcode.js"
import {hideAllPopUps , popUpFun , updatePopUp , popUpFunImage , updateImage }  from "/script/component/popup.js";
let imgId=location.href.match(/(\d)+/g)[1];
const img=document.images[1];
const imgInfo=document.getElementsByClassName("img-info")[0];
let ul=document.getElementsByTagName("ul")[0];
let barcodeText;

// onclick on file
document.getElementById('file-input').addEventListener('change', function(event) {
    const imagePreview = document.getElementById('image-preview');
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
});

const saveButton = updateForm.querySelector('input[type="submit"]');
saveButton.addEventListener("click", async(e)=>{
     await updateImage(e)
    setTimeout(()=>{
        location.reload()
    },1000)
})
let idInput = updateForm.querySelector('input[name="ID"]');
    idInput.value = location.href.split("/search/")[1];
    idInput.disabled = true;
    idInput.parentElement.style.display="none"

// upload button
const updateBtn=document.getElementById("updateBtn");
updateBtn.addEventListener("click",(e)=>{
    e.preventDefault()
    if(!Cookies.get("token") || Cookies.get("role")=="admin") 
        location.href="/login" ;
    else{
        updatePopUp.classList.toggle("showPopUp")
        popUpFunImage(updatePopUp)
    }
    
})

function info(obj){
    for (const key in obj) {
        
        if(key=="file_path" || key =="filename" || key=="id" )
            continue;
        let p=document.createElement("p");

        if(key=="uploaded_at"){
            const { date, time } = obj[key];
            p.innerHTML=`<strong>${key.replace("_"," ")} : </strong> ${date}  ${time}`;
            
        }
        else if(key =="barcode"){
            p.innerHTML=`<strong>${key} : </strong> <img id="barcode-${obj.id}">`;
            p.style.cssText=`
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                `
            barcodeText=obj[key];
        }
        else
            p.innerHTML=`<strong>${key.replace("_"," ")} : </strong> ${obj[key]}`;
        imgInfo.appendChild(p)
    }
    createBarCode([obj])
}
function history(obj){
    
    if(obj.length==0)
       ul.remove()
    for(let i=0; i< obj.length;i++){
        let li=document.createElement("li");
            li.innerHTML=`${obj[i]["editor_name"]} , date  : ${obj[i]["edit_timestamp"]["date"]} ${obj[i]["edit_timestamp"]["time"]} , ${obj[i]["editor_work_section"]} `
            if(i==obj.length-1)
                li.classList.add("loading")
            ul.appendChild(li)
    }

}
async function getData(){
    let res= await fetch(`http://localhost:5000/api/search/${imgId}`);
    let data =await res.json();
    
    if (res.status==404) 
        location.href="/home"
    img.src=`http://localhost:5000${data.document.file_path}`;
    info(data.document);
    history(data.edit_history)
}



document.addEventListener("DOMContentLoaded", getData)