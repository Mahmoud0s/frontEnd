import {createTable}  from "/script/component/table.js";

// popup
function hideAllPopUps() {
    const allPopUp = document.querySelectorAll(".pop-up");
    allPopUp.forEach((popup) => { 
            popup.classList.remove("showPopUp");
    });
}

function popUpFun(el) {
    hideAllPopUps();
    el.classList.toggle("showPopUp");
}
function popUpFunImage(el) {
    el.querySelector('#file-input').value="";
    el.querySelector('#image-preview').src="";
    el.querySelector(".message").textContent="";
    
    hideAllPopUps();
    el.classList.toggle("showPopUp");
}
    // add event on all close button
document.querySelectorAll(".close_btn").forEach(ele => {
    ele.addEventListener("click",()=>{
        hideAllPopUps(ele.parentElement)
    })
    
});

// update 
let updateForm 
let saveButton ;
let updatePopUp ;
let msg ; 
if(document.querySelector("#updateForm"))
{
    updateForm = document.querySelector("#updateForm");
    saveButton = updateForm.querySelector('input[type="submit"]');
    updatePopUp = document.getElementById("update-popUp");
    msg = updateForm.querySelector('div.message'); 

}

    //change value of selected user
async function popUpFunUpdate(rowData,page) {
    const name = updateForm.querySelector('input[name="name"]');
    let idInput = updateForm.querySelector('input[name="ID"]');
    idInput.value = rowData.id;
    idInput.disabled = true;
    idInput.parentElement.style.display="none"
    name.value=rowData.name;
    if(page=="user"){
        let userName = updateForm.querySelector('input[name="username"]');
        let workSection = updateForm.querySelector('select[name="work_section_id"]');
        let role = updateForm.querySelector('select[name="role"]');
        userName.value = rowData.username;
        role.value = rowData.role;    
        // set worksection
        let res=await fetch("http://localhost:5000/api/work-sections")
        let data = await res.json(); 
        let foundWS=false;
        for(let i =0;i<data.length;i++){
            if(rowData.work_section==data[i].name){
                workSection.value=data[i].id;
                foundWS=true
                break;
            }
        }
        !foundWS?workSection.value=null:""
    }
    else if(page=="hall"){
        updateForm.querySelector("#projector_state").value = rowData.projector_state;
    }
    msg.textContent=""
}

async function saveFun(e){
       // dsahBoard
    e.preventDefault();
    const name = updateForm.querySelector('input[name="name"]');
    const idInput = updateForm.querySelector('input[name="ID"]');
    let page;
    // gonna change soon
    if(updateForm.children.length==7)
        page="user"
    else if(updateForm.children.length==5)
        page="hall"
    else
        page="workSection"
    
    let API;
    
    if (page=="user")
        API=`http://localhost:5000/api/users/${idInput.value}`;
    else if (page=="workSection")
        API=`http://localhost:5000/api/work-sections/${idInput.value}`;
    else
        API=`http://localhost:5000/api/halls/update/${idInput.value}`
    


    let updatedData={};
    if(page=="user"){
        const userName = updateForm.querySelector('input[name="username"]');
        const workSection = updateForm.querySelector('select[name="work_section_id"]');
        const role = updateForm.querySelector('select[name="role"]');

        
        updatedData = {
            name:name.value,
            username: userName.value,
            work_section_id: workSection.value,
            role: role.value
        };
    }else if(page=="workSection"){
        updatedData = {
            name: name.value,
        };
    }
    else{
        updatedData = {
            name:name.value,
            projector_state:updateForm.querySelector("#projector_state").value
        };


    }
    try {
        const response = await fetch(API, {
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
            createTable(page);
        } else {
            msg.textContent = result.message || result.errors[0].msg || 'An error occurred';
            msg.style.color = '#FF0060';
        }
    } catch (error) {
        console.error("Error updating :", error);
    }

}
// home / search
async function updateImage(e){
    e.preventDefault();
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];
    const idInput = updateForm.querySelector('input[name="ID"]') ;
    
    if (file) {
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            const response = await fetch(`http://localhost:5000/api/documents/update/${idInput.value}`, {
                method: 'put',
                headers:{
                    'Authorization': Cookies.get('token')
                },
                body: formData,
                credentials: 'include'
            });
            // // if admin
            // if(response.status==403){
            //     location.href="/login"
            // }
            
            const result = await response.json();
            console.log(result);
            if (response.ok) {
                msg.textContent=result.message
                msg.style.color="#1B9C85"
            } else {
                msg.textContent=result.message
                msg.style.color="#FF0060"
            }
        } catch (error) {
            msg.textContent=result.message
            msg.style.color="#FF0060"
        }
    } else {
        msg.textContent="Please select a file to upload."
        msg.style.color="#FF0060"
    }
}
if(document.querySelector("#updateForm"))
saveButton.addEventListener("click",updateForm.querySelector("#file-input")?updateImage:saveFun);

//delete 
let deleteAction; 
let deletePopUp = document.querySelector("#delete-popUp");
if(deletePopUp){
    let confirm = deletePopUp.querySelector("input[value='confirm']");
    confirm.addEventListener("click", () => {
        deleteAction();
        hideAllPopUps();
    });
}
    
// alart

function confirmFun(rowData,page) {
let msgwarning = deletePopUp.querySelector("#msgwarning");
    return new Promise((resolve) => {
        let msgContent;
        if (page=="user") 
            msgContent= `Are you sure you want to delete this user: (user: ${rowData.username})?` ;
        else if (page=="workSection")
            msgContent=`Are you sure you want to delete this work section: <h4>( work Section name: ${rowData.name} ) ? </h4>`
        else
            msgContent=`Are you sure you want to delete this hall: <h4>( hall name: ${rowData.name} ) ? </h4>`

        msgwarning.innerHTML =msgContent ;
        popUpFun(deletePopUp);

        deleteAction = () => {
            popUpFun(deletePopUp);
            resolve(true);
        };
    });
}


async function deleteFun(Id, row , page) {
    let API;
    if (page=="user")
        API=`http://localhost:5000/api/users/${Id}`;
    else if (page=="workSection")
        API=`http://localhost:5000/api/work-sections/${Id}`;
    else
        API=`http://localhost:5000/api/halls/delete/${Id}`
    
    try {
        const response = await fetch(API, {
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


// popUp work section info 
async function getWSInfo(){
    const createPopUp = document.getElementById("create-popUp");
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


export {hideAllPopUps , popUpFun ,popUpFunUpdate , confirmFun ,deleteFun ,getWSInfo , updateForm  ,updatePopUp,popUpFunImage}
