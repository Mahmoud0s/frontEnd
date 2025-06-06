import { createBarCode } from "/script/component/barcode.js";
import {hideAllPopUps,popUpFun,updatePopUp,popUpFunImage,updateImage} from "/script/component/popup.js";

let imgId = location.href.match(/(\d)+/g)[1];
const img = document.images[1];
const imgInfo = document.getElementsByClassName("img-info")[0];
let ul = document.getElementsByTagName("ul")[0];
let barcodeText;
let statusDot = document.querySelector(".status-dot");
let statusText = document.querySelector(".status-text");

// Set initial status to waiting
statusDot.classList.add("waiting");
statusText.textContent = "Processing...";

// onclick on file
document
  .getElementById("file-input")
  .addEventListener("change", function (event) {
    const imagePreview = document.getElementById("image-preview");
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        imagePreview.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });


let idInput = updateForm.querySelector('input[name="ID"]');
idInput.value = location.href.split("/search/")[1];
idInput.disabled = true;
idInput.parentElement.style.display = "none";

// Button functionality
const downloadBtn = document.getElementById("downloadBtn");
const printBtn = document.getElementById("printBtn");
const updateBtn = document.getElementById("updateBtn");

// download button
downloadBtn.addEventListener("click", async () => {
  try {
    downloadBtn.disabled = true;
    downloadBtn.innerHTML =
      '<i class="fa-solid fa-spinner fa-spin"></i> Downloading...';

    // Create a canvas to handle cross-origin images
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set canvas dimensions to match the image
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Draw the image onto the canvas
    ctx.drawImage(img, 0, 0);

    // Convert to blob
    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/png")
    );

    // Create and trigger download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `document_${imgId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Cleanup
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error("Download error:", error);
    alert("Failed to download the image. Please try again.");
  } finally {
    downloadBtn.disabled = false;
    downloadBtn.innerHTML = '<i class="fa-solid fa-download"></i> Download';
  }
});
// print button
printBtn.addEventListener("click", (e) => {
  e.preventDefault()
  const imageSrc = document.images[2].src;
  sessionStorage.setItem('imageToPrint', document.images[2].src);
  sessionStorage.setItem('barcode', document.images[1].src);
  window.open('/print', '_blank');
  
});
 // upload button
updateBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (!Cookies.get("token") || Cookies.get("role") == "admin") {
    location.href = "/login";
  } else {
    updatePopUp.classList.toggle("showPopUp");
    popUpFunImage(updatePopUp);
  }
});

// !!!!!!!!!!!!!!!!! 
function info(obj) {
  for (const key in obj) {
    if (key == "file_path" || key == "filename" || key == "id") continue;
    let p = document.createElement("p");

    if (key == "uploaded_at") {
      const { date, time } = obj[key];
      p.innerHTML = `<strong>${key.replace(
        "_",
        " "
      )} : </strong> ${date}  ${time}`;
    } else if (key == "barcode") {
      // Create barcode in the dedicated container
      const barcodeContainer = document.querySelector(".barcode-container");
      const barcodeImg = document.createElement("img");
      barcodeImg.setAttribute("id", `barcode-${obj.id}`);
      barcodeContainer.appendChild(barcodeImg);
      barcodeText = obj[key];
      continue; // Skip adding to imgInfo
    } else {
      p.innerHTML = `<strong>${key.replace("_", " ")} : </strong> ${obj[key]}`;
    }
    imgInfo.appendChild(p);
  }
  createBarCode([obj]);

  // Update status to success once info is loaded
  statusDot.classList.remove("waiting");
  statusDot.classList.add("success");
  statusText.textContent = "Success!";
}

function history(obj) {
  if (obj.length == 0) ul.remove();
  for (let i = 0; i < obj.length; i++) {
    let li = document.createElement("li");
    li.innerHTML = `${obj[i]["editor_name"]} , date  : ${obj[i]["edit_timestamp"]["date"]} ${obj[i]["edit_timestamp"]["time"]} , ${obj[i]["editor_work_section"]} `;
    if (i == obj.length - 1) li.classList.add("loading");
    ul.appendChild(li);
  }
}
async function getData() {
  let res = await fetch(`http://localhost:5000/api/search/${imgId}`);
  let data = await res.json();

  if (res.status == 404) location.href = "/home";
  img.src = `http://localhost:5000${data.document.file_path}`;
  info(data.document);
  history(data.edit_history);
}

document.addEventListener("DOMContentLoaded", getData);
