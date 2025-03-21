let updatePopUp = document.getElementById("update-user-popUp");
let idInput=document.querySelector("input[name='ID']");
let send=document.getElementById("Btn");
let message=document.querySelector("div.message");
const imagePreview = document.getElementById('image-preview');

let btn = document.getElementsByClassName("section-list")[0];
btn.addEventListener("click", () => {checkUser() ? location.href="/upload" :" ";});

// Toggle class function
function popUpFun(el) {
    const fileInput = document.getElementById('file-input');
    fileInput.value="";
    imagePreview.src="";
    message.textContent="";
    el.classList.toggle("showMe");
}

// send button 
async function updateImage(e){
    e.preventDefault();
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];
    console.log(idInput.value);
    
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
            
            const result = await response.json();
            console.log(result);
            if (response.ok) {
                message.textContent=result.message
                message.style.color="#1B9C85"
            } else {
                message.textContent=result.message
                message.style.color="#FF0060"
            }
        } catch (error) {
            message.textContent=result.message
            message.style.color="#FF0060"
        }
    } else {
        message.textContent="Please select a file to upload."
        message.style.color="#FF0060"
    }
}
send.addEventListener("click",updateImage)

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
async function getAllData() {
    try {
        let main = document.body.getElementsByTagName("main")[0];
        let div=document.createElement("div");
        main.appendChild(div);
        const section = location.href.split("work-section/")[1];
        if (!section) {
            console.error("Invalid URL structure for fetching data.");
            return;
        }
        getData(div,`http://localhost:5000/api/search/work-section/${section}`)
        getWsInfo()
    } catch (error) {
        console.error("An error occurred:", error);
    }
}




document.addEventListener("DOMContentLoaded", getAllData);
document.addEventListener("DOMContentLoaded", getWS);


