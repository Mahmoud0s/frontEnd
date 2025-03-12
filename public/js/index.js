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
    localStorage.clear()
})