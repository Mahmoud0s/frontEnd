import { getData } from "/script/component/table.js";
// image
const imagePreview = document.getElementById('image-preview');
document.getElementById('file-input').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
});

// searchBox
let searchBox=document.getElementsByClassName("search-list")[0];
let input = searchBox.querySelector("input");

let content=searchBox.querySelector("div.content");
searchBox.addEventListener("input" ,()=> { getData(content,`http://localhost:5000/api/search/search?query=${input.value}`,"search")})

//buttons

let buttonBox=document.querySelector(".btn-box");
let back=buttonBox.querySelector("button:first-of-type")
let next=buttonBox.querySelector("button:last-of-type")
let pageNum=1;

back.addEventListener("click",(e)=>{
    e.preventDefault();
        pageNum = Math.max(1, pageNum - 1)
        getData(content,`http://localhost:5000/api/search/search?query=${input.value}`,"search",pageNum)
})
next.addEventListener("click",(e)=>{
    e.preventDefault();
        pageNum +=1;
        getData(content,`http://localhost:5000/api/search/search?query=${input.value}`,"search",pageNum)
})



