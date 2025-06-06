async function sideBar(){
    const res=await fetch("http://localhost:5000/api/work-sections");
    const allData=await res.json();

    let files=document.getElementsByClassName("files")[0];

    allData.forEach(data=>{
        
        let folder=document.createElement("a")
        folder.classList.add("folder");
        let div=document.createElement("div");
        let icon=document.createElement("i");
        icon.classList.add("fa-regular", "fa-folder")
        let info=document.createElement("h3")
        info.classList.add("info");
        info.textContent=data.name;
        
        folder.href=`/search/work-section/${data.id}`
        div.appendChild(icon)
        folder.appendChild(div)
        folder.appendChild(info)

        if(data.id== location.href.split("work-section/")[1]){
            folder.classList.add("active");
            document.title=data.name
            const targetFolderIcon = folder.querySelector('i');
            targetFolderIcon.classList.replace('fa-folder', 'fa-folder-open');
        }

        files.appendChild(folder)
    })
    
}

export {sideBar} 