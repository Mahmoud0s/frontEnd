let banner = document.querySelector(".banner");
let canvas = document.getElementById("dotsCanvas");
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
const ctx = canvas.getContext("2d");
const dots = [];
const arrayColors = ["#eee", "#545454", "#596d91", "#bb5a68", "#696541"];
for (let index = 0; index <30; index++) {
  dots.push({
    x: Math.floor(Math.random() * canvas.width),
    y: Math.floor(Math.random() * canvas.height),
    size: Math.random() * 3 + 5,
    color: arrayColors[Math.floor(Math.random() * 5)],
  });
}
const drawDots = () => {
  dots.forEach((dot) => {
    ctx.fillStyle = dot.color;
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
    ctx.fill();
  });
};
drawDots();
banner.addEventListener("mousemove", (event) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawDots();
  let mouse = {
    x: event.pageX - banner.getBoundingClientRect().left,
    y: event.pageY - banner.getBoundingClientRect().top,
  };
  dots.forEach((dot) => {
    let distance = Math.sqrt((mouse.x - dot.x) ** 2 + (mouse.y - dot.y) ** 2);
    if (distance < 300) {
      ctx.strokeStyle = dot.color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(dot.x, dot.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
    }
  });
});
banner.addEventListener("mouseout", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawDots();
});
window.addEventListener("resize", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = banner.offsetWidth;
  canvas.height = banner.offsetHeight;

  dots = [];
  for (let index = 0; index < 50; index++) {
    dots.push({
      x: Math.floor(Math.random() * canvas.width),
      y: Math.floor(Math.random() * canvas.height),
      size: Math.random() * 3 + 5,
      color: arrayColors[Math.floor(Math.random() * 5)],
    });
  }
  drawDots();
});

// Login Form Animation
const signInButton = document.querySelector(".banner button");
const loginContainer = document.getElementById("loginForm");

signInButton.addEventListener("click", () => {
  loginContainer.classList.add("active");
  setTimeout(() => {
    loginContainer.querySelector(".login-form").style.opacity = "1";
    loginContainer.querySelector(".login-form").style.transform =
      "translateY(0)";
  }, 500);
});

// Close login form when clicking outside
loginContainer.addEventListener("click", (e) => {
  if (e.target === loginContainer) {
    loginContainer.querySelector(".login-form").style.opacity = "0";
    loginContainer.querySelector(".login-form").style.transform =
      "translateY(-20px)";
    setTimeout(() => {
      loginContainer.classList.remove("active");
    }, 300);
  }
});



const form = document.forms[0];
const userName = form.querySelector("input[name='username']");
const password = form.querySelector("input[name='password']");
const checkBox = form.querySelector("#remeberMe");
const message = form.querySelector(".message");
const lodingForm=form.querySelector("#loading");


if (Cookies.get("userName") && localStorage.getItem("RMbox") === "true") {    
    userName.value = Cookies.get("userName");
    checkBox.checked = true;
}
if(Cookies.get("token") && localStorage.getItem("RMbox")=="true"){
    location.href=Cookies.get("role")=="user"?"home":"adminDashBoard"
}
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const credentials = {
        username: userName.value,
        password: password.value
    };
    // loding // show loading animation
    lodingForm.classList.toggle("hideMe");
        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(credentials),
            });
            
            const data = await response.json();
            setTimeout(()=>{
            // stop loading animation
            lodingForm.classList.toggle("hideMe")
            if (response.ok) {
              message.textContent=""
              // checkBox
              localStorage.setItem("RMbox", checkBox.checked ? "true" : "false");

              Cookies.set('userName',userName.value, {
                expires: 7, 
                secure: true,
                sameSite: 'strict'
              });
              Cookies.set('token',data.token, {
                expires: 7, 
                secure: true,
                sameSite: 'strict'
              });
              Cookies.set("role",data.role,{
                expires: 7, 
                secure: true,
                sameSite: 'strict'
              })
              
              window.location.href= data.role=="admin"? "/adminDashBoard" : "/home"
            } else {
              message.textContent = data.message || "Login failed";
              message.style.color = "red";
            }
          },2000)
          } catch (error) {
            message.textContent = "An error occurred. Please try again later.";
            message.style.color = "red";
          }
        })
        
