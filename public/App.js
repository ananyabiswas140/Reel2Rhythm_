const input = document.querySelector('#inputId');
const upload_file = document.querySelector('.inner_file');
const convert_file = document.querySelector('.convert_file');
const download_file_box = document.querySelector('.download_file');
const file = document.querySelector('.file_input');
const convertButton = document.querySelector('#convert_button');
const downloadButton = document.querySelector('#download_button');

let audioBlobURL = null;

input.addEventListener('change', () => {
  if (input.files.length > 0) {
    upload_file.classList.add('hide');
    convert_file.classList.add('show');
    file.textContent = `Selected File: ${input.files[0].name}`;
  }
});

// Convert
convertButton.addEventListener('click', async () => {
  if (!input.files.length) return alert("Select a video!");
  if (input.files[0].size > 20 * 1024 * 1024) {
  alert("Max 20MB allowed on mobile");
  return;
}

  const formData = new FormData();
  formData.append("video", input.files[0]);

  convertButton.textContent = "Converting...";

  const response = await fetch("/convert", {
  method: "POST",
  body: formData
});


  const blob = await response.blob();
  audioBlobURL = URL.createObjectURL(blob);

  convert_file.classList.add('hide');
  download_file_box.classList.add('show');
  convertButton.textContent = "Convert";
});

// Download
downloadButton.addEventListener('click', () => {
  if (!audioBlobURL) return alert("Convert first!");

  const a = document.createElement("a");
  a.href = audioBlobURL;
  a.download = "converted.mp3";
  a.click();
});
