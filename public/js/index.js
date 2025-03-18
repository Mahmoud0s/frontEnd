const sideMenu = document.querySelector('aside');
const menuBtn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('close-btn');
const logoutBtn= document.getElementById("logout");
const logedin=Cookies.get("logedin");
const darkMode = document.querySelector('.dark-mode');

const usernameLogo =document.querySelector("#user-name");

usernameLogo.textContent=Cookies.get("username") || "unkown";

if(localStorage.getItem("dark") == "true"){
    document.body.classList.toggle('dark-mode-variables');
    darkMode.querySelector('span:nth-child(1)').classList.toggle('active');
    darkMode.querySelector('span:nth-child(2)').classList.toggle('active');
}
if(logedin=="true"){   
    document.querySelector("#login").style.display="none"
}else{
    document.querySelectorAll(".profile, #logout").forEach(function(element) {
        element.style.display = "none";
    });
}
function popUpFun(el) {
    el.classList.toggle("showMe");
}
function checkUser(){
    if(Cookies.get("logedin")=="false")
        location.href="/login"
    else
        return true
}


let closePopUpBtn=document.querySelectorAll(".close_btn");
closePopUpBtn.forEach(ele => {
    ele.addEventListener("click",()=>{
        popUpFun(ele.parentElement)
    })
    
});
menuBtn.addEventListener('click', (e) => {
    e.preventDefault()
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

logoutBtn.addEventListener("click",()=>{
    Cookies.set("token","");
    Cookies.set("username","unkown");
    Cookies.set("logedin",false)
})