// menu

const sideMenu = document.querySelector('aside');
const menuBtn = document.getElementById('menu-btn');
const closeMenuBtn = document.getElementById('close-btn');

menuBtn.addEventListener('click', (e) => {
    e.preventDefault();
    sideMenu.style.display = 'block';
});
closeMenuBtn.addEventListener('click', (e) => {
    e.preventDefault();
    sideMenu.style.display = 'none';
});

// dark mood

const darkMode = document.querySelector('.dark-mode');
if(localStorage.getItem("dark") == "true"){
    document.body.classList.toggle('dark-mode-variables');
    darkMode.querySelector('span:nth-child(1)').classList.toggle('active');
    darkMode.querySelector('span:nth-child(2)').classList.toggle('active');
}

darkMode.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode-variables');
    darkMode.querySelector('span:nth-child(1)').classList.toggle('active');
    darkMode.querySelector('span:nth-child(2)').classList.toggle('active');
    localStorage.setItem("dark", localStorage.getItem("dark") == "true" ? "false" : "true");
})

//check user

function checkUser(){
    if(!Cookies.get("token"))
        location.href="/login"
    else
        return true
}

const userName =document.querySelector("#user-name");
userName.textContent=Cookies.get("userName") || "Guest";

if(!Cookies.get("token") || Cookies.get("role")=="user"){
    location.href="/login";
    document.querySelectorAll(".profile, #logout").forEach(function(el) {
            el.style.display = "none";
        });
    }

const logoutBtn= document.getElementById("logout");
logoutBtn.addEventListener("click",()=>{
        Cookies.remove("token")
        Cookies.remove("userName")
        Cookies.remove("role")
        location.reload();
    })


// Analytics
const userNum=document.querySelector("#userNum");
const WSNum=document.querySelector("#workSectionNum");
const docNum=document.querySelector("#docNum");
const regUsrNum=document.querySelector("#regUsrNum");
const AdminNum=document.querySelector("#AdminNum");

async function showAnalytics(){
    let res= await fetch("http://localhost:5000/api/analytics/general",{
        headers: {
                    "Content-Type": "application/json",
                    'Authorization': Cookies.get('token')
            },
    });
    if(res.status==401 || res.status==403){
        location.href="/login";
        return;
    }else{
        let data=await res.json()
        userNum.textContent=data.total_users;
        WSNum.textContent=data.total_work_sections;
        docNum.textContent=data.total_documents;
        AdminNum.textContent=data.admin_users;
        regUsrNum.textContent=data.regular_users;
    }
    
}

showAnalytics()
