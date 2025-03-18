document.getElementById('file-input').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imagePreview = document.getElementById('image-preview');
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
});

document.getElementById('upload-button').addEventListener('click', async function() {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:5000/api/documents/upload', {
                method: 'POST',
                headers:{
                    'Authorization': Cookies.get('token')
                },
                body: formData,
                credentials: 'include'
            });

            const result = await response.json();
            if (response.ok) {
                alert('File uploaded successfully: ' + result.message);
                console.log(result);
            } else {
                alert('File upload failed: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while uploading the file.');
        }
    } else {
        alert('Please select a file to upload.');
    }
});
console.log("una");

function checkUser(){
    localStorage.getItem("user") == "true" ? "" : location.href="http://localhost:5000/login"
}


document.addEventListener("DOMContentLoaded", checkUser);