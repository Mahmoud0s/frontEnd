
const form = document.forms[0];
const userName = form.querySelector("input[name='username']");
const password = form.querySelector("input[name='password']");
const checkBox = form.querySelector("#remeberMe");
const message = form.querySelector(".message");
const lodingForm=form.querySelector("#loading");

if (Cookies.get("userName")) {    
    userName.value = Cookies.get("userName");
    password.value = Cookies.get("password");
    checkBox.checked = true;
}
localStorage.setItem("RMbox",checkBox.checked);

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
            // stop loading animation
            lodingForm.classList.toggle("hideMe");
            if (response.ok) {
                message.textContent=""
                // checkBox
                if (checkBox.checked) {
                    localStorage.setItem("RMbox",true)
                }
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
        } catch (error) {
            message.textContent = "An error occurred. Please try again later.";
            message.style.color = "red";
        }
})
    