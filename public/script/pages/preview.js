
import {createBarCode} from "/script/component/barcode.js"
let imgId=location.href.match(/(\d)+/g)[1];
const img=document.images[0];
const imgInfo=document.getElementsByClassName("img-info")[0];
let ul=document.getElementsByTagName("ul")[0];
let barcodeText;

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