import {hideAllPopUps , popUpFun }  from "/script/component/popup.js";
let report_content= document.getElementById("report_content");

async function showReport(id) {
    report_content.innerHTML = ""; 

    try {
        const response = await fetch(`http://localhost:5000/api/reports/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
    
        if (!data || data.length === 0) {
            console.error("No data available.");
            report_content.innerHTML = "No data available";
            return;
        }
    
        const keys = Object.keys(data[0]); 
    
        data.forEach(rowData => {
            let content = document.createElement("div");
            content.classList.add("report_container");
    
            let ul = document.createElement("ul");
            let thereProblem = false; 
    
            keys.forEach(key => {
                if (key === "id" || key === "hall_name") return; 
                
                let li = document.createElement("li");
    
                if (key === "solved") {
                    if (rowData[key] === 0) {
                        li.innerHTML = `${key} : false`;
                        thereProblem = true;
                    } else {
                        li.innerHTML = `${key} : true`;
                    }
                } else {
                    li.innerHTML = `${key} : ${rowData[key]} `;
                }
    
                ul.appendChild(li);
            });
    
            content.appendChild(ul); 
    
            // Add "solved" button if there's a problem
            if (thereProblem) {
                let solvedBtn = document.createElement("button");
                solvedBtn.textContent = "solved";
                solvedBtn.addEventListener("click", async (e) => {
                    try {
                        const res = await fetch(`http://localhost:5000/api/reports/solve/${rowData.id}`, {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                                'Authorization': Cookies.get('token')
                            },
                        });
                        console.log(await res.json());
                        if(res.status=="403")
                            location.href="/login"
                    } catch (err) {
                        console.error("Error:", err);
                    }
                });
    
                content.appendChild(solvedBtn);
            }
    
            report_content.appendChild(content); 
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        report_content.innerHTML = "An error occurred while fetching the report.";
    }

}
// report Btn
if(document.querySelector("#reportBtn")){
    const createPopUp = document.getElementById("create-popUp");
    document.querySelector("#reportBtn").addEventListener("click",(e)=>{
        e.preventDefault()
        popUpFun(createPopUp)
        
    })
}

async function getAllHalls(){
    const createPopUp = document.getElementById("create-popUp");
    const hallID =createPopUp.querySelector("select[name='reportID']")
    let response= await fetch("http://localhost:5000/api/halls/all");
    let data =  await response.json();

    data.forEach(rowData=>{
        let opt=document.createElement("option")
        opt.textContent=rowData["name"];
        opt.value=rowData["id"]
        hallID.appendChild(opt)
    })

}
// send btn
async function sendReport(e) {
    e.preventDefault()
    const createPopUp = document.getElementById("create-popUp");
    const hallID =createPopUp.querySelector("select[name='reportID']")
    const description = createPopUp.querySelector("textarea")
    const msg=createPopUp.querySelector(".message")
    
    let credentials={
        "hall_id":hallID.value,
        "description":description.value
    }
    try{
        const response=await fetch("http://localhost:5000/api/reports/add",{
            method: "post",
            headers: {
                "Content-Type": "application/json",
                'Authorization': Cookies.get('token')
            },
            body: JSON.stringify(credentials)
        })
        const data = await response.json();
        description.value=""
        msg.textContent=data.message
        msg.style.color="#1B9C85"
        
    }catch(e){
        console.error(e)
    }
        
}

// chnage projector state

async function changeProjectorStateFun(id,currState) {
    try{
        console.log(id, currState);
        let credentials={}
        credentials.state = currState=="working"? "not working" : "working"
        const response=await fetch(`http://localhost:5000/api/reports/projector/${id}`,{
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                'Authorization': Cookies.get('token')
            },
            body: JSON.stringify(credentials)
        })
        if(response.status==401 || response.status==403)
            location.href="/login"
        const data = await response.json();
        console.log(data);
        
        if(response.ok){
            location.reload()
        }
        
    }catch(e){
        console.error(e)
    }
        
}

export { showReport , sendReport , getAllHalls ,changeProjectorStateFun};