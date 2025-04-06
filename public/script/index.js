// menu

const sideMenu = document.querySelector('aside');
const menuBtn = document.getElementById('menu-btn');
const closeMenuBtn = document.getElementById('close-btn');

menuBtn.addEventListener('click', (e) => {
    e.preventDefault()
    sideMenu.style.display = 'block';
});

closeMenuBtn.addEventListener('click', () => {
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

const usernameLogo =document.querySelector("#user-name");
usernameLogo.textContent=Cookies.get("userName") || "Guest";

if(Cookies.get("token")){   
    document.querySelector("#login").style.display="none"
}else{
    document.querySelectorAll(".profile, #logout").forEach(function(element) {
        element.style.display = "none";
    });
}

const logoutBtn= document.getElementById("logout");
logoutBtn.addEventListener("click",()=>{
    Cookies.remove("token");
    Cookies.remove("userName");
    Cookies.remove("role");
})
if(document.getElementsByClassName("section-list")[0]){
    let addBtn = document.getElementsByClassName("section-list")[0];
    addBtn.addEventListener("click", () => {
        if(checkUser() && Cookies.get("role")!="admin")
            location.href="/upload";
        else
        location.href="/login";
        }
    );
}

