const imageSrc = sessionStorage.getItem('imageToPrint');
const imagebarcode = sessionStorage.getItem('barcode');

if (imageSrc) {
  const img = document.images[0];
  const barcode_img = document.getElementById("barcode");

  img.onload = () => {
    setTimeout(() => {
      window.print();
      setTimeout(() => {window.close();}, 100);
    }, 100);
  };

  img.src = imageSrc;
  barcode_img.src=imagebarcode;
}
