document.getElementById("pdf-upload").addEventListener("change", function (event) {
  const file = event.target.files[0];

  if (file && file.type === "application/pdf") {
    const fileURL = URL.createObjectURL(file);
    const iframe = document.getElementById("pdf-preview");
    iframe.src = fileURL;

    document.getElementById("pdf-preview-container").style.display = "block";
  } else {
    alert("Please select a valid PDF file.");
  }
});
