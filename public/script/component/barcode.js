// create Barcode
function createBarCode(data) {
  data.forEach((rowData) => {
    try {
      JsBarcode(`#barcode-${rowData.id}`, encodeURIComponent(rowData.barcode), {
        format: "CODE128",
        text: rowData.barcode,
        lineColor: "#000",
        width: 1.5,
        height: 40,
        displayValue: true,
        fontSize: 10,
        margin: 5,
      });
    } catch (err) {
      console.error(`Error generating barcode for id ${rowData.id}:`, err);
    }
  });
}
export { createBarCode };
