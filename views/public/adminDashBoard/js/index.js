const sideMenu = document.querySelector('aside');
const menuBtn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('close-btn');
const logoutBtn= document.getElementById("logout");
const darkMode = document.querySelector('.dark-mode');

if(localStorage.getItem("dark") == "true"){
    document.body.classList.toggle('dark-mode-variables');
    darkMode.querySelector('span:nth-child(1)').classList.toggle('active');
    darkMode.querySelector('span:nth-child(2)').classList.toggle('active');
}

logoutBtn.addEventListener("click",()=>{
    localStorage.clear()
})
menuBtn.addEventListener('click', () => {
    sideMenu.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    sideMenu.style.display = 'none';
});

darkMode.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode-variables');
    darkMode.querySelector('span:nth-child(1)').classList.toggle('active');
    darkMode.querySelector('span:nth-child(2)').classList.toggle('active');
    localStorage.setItem("dark", localStorage.getItem("dark") == "true" ? "false" : "true");
})
const userNum=document.getElementById("userNum");
const WSNum=document.getElementById("workSectionNum");
const docNum=document.getElementById("docNum");
const regUsrNum=document.getElementById("regUsrNum");
const AdminNum=document.getElementById("AdminNum");



function popUpFun(el) {
    el.classList.toggle("showMe");
}

let closePopUpBtn=document.querySelectorAll(".close_btn");
closePopUpBtn.forEach(ele => {
    ele.addEventListener("click",()=>{
        popUpFun(ele.parentElement)
    })
    
});


async function getData(){
    let res= await fetch("/api/analytics/general");
    let data=await res.json()
    console.log(data);
    userNum.textContent=data.total_users;
    WSNum.textContent=data.total_work_sections;
    docNum.textContent=data.total_documents;
    AdminNum.textContent=data.admin_users;
    regUsrNum.textContent=data.regular_users;
    
}

getData()