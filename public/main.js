const checkBox = document.getElementById("remeberMe");
const userName = document.getElementsByTagName("input")[0];
const password = document.getElementsByTagName("input")[1];
const loginBtn = document.getElementById("loginBtn");
const message = document.getElementsByClassName("message")[0];
const loginForm = document.forms[0];
const lodingForm=loginForm.querySelector("#loading");

if (localStorage.getItem("userName")) {    
    userName.value = localStorage.getItem("userName");
    password.value = localStorage.getItem("password");
    checkBox.checked = true;
}

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const credentials = {
        username: userName.value,
        password: password.value
    };
    lodingForm.classList.toggle("hideMe");
    setTimeout(async ()=>{
        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(credentials),
                credentials: "include"
            });
            
            const data = await response.json();
            lodingForm.classList.toggle("hideMe");
            if (response.ok) {
                message.textContent=""
                
                if (checkBox.checked) {
                    localStorage.setItem("userName", userName.value);
                    localStorage.setItem("password", password.value);
                } else {
                    localStorage.removeItem("userName");
                    localStorage.removeItem("password");
                }
                // Cookies.set('username',userName.value, {
                //     expires: 7, // Expires in 7 days
                //     secure: true,
                //     sameSite: 'strict'
                // });
                localStorage.setItem("user",true)
                if(data.role=="admin"){
                    window.location.href = "/adminDashBoard";
                }else{
                    window.location.href = "/home";
                }
            } else {
                message.textContent = data.message || "Login failed";
                message.style.color = "red";
            }
        } catch (error) {
            console.error("Login error:", error);
            message.textContent = "An error occurred. Please try again.";
            message.style.color = "red";
        }
    }, 3000);
})
    