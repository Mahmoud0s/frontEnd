const sideMenu = document.querySelector('aside');
const menuBtn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('close-btn');

const darkMode = document.querySelector('.dark-mode');

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
})

const userNum=document.getElementById("userNum");
const WSNum=document.getElementById("workSectionNum");


async function getData(){

    let res= await fetch("/api/users");
    let data=await res.json()

    userNum.textContent=data.length;
    res =await fetch("/api/work-sections");
    data=await res.json();
    WSNum.textContent=data.length;

}

getData()