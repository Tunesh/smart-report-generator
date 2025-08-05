const fileInput = document.getElementById("fileUpload");
const openCameraBtn = document.getElementById("openCamera");
const pasteTextBtn = document.getElementById("pasteText");
const cameraSection = document.getElementById("cameraSection");
const video = document.getElementById("video");
const captureBtn = document.getElementById("captureBtn");
const closeCameraBtn = document.getElementById("closeCamera");
const previewImage = document.getElementById("previewImage");
const textArea = document.getElementById("textArea");
const extractTextBtn = document.getElementById("extractTextBtn");
const downloadBtn = document.getElementById("downloadReport");

let capturedImage = null;
let mediaStream = null;

// Upload Image
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const url = URL.createObjectURL(file);
    previewImage.src = url;
    previewImage.classList.remove("hidden");
    extractTextBtn.classList.remove("hidden");
    textArea.classList.remove("hidden");
  }
});

// Open Camera
openCameraBtn.addEventListener("click", async () => {
  cameraSection.classList.remove("hidden");
  mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = mediaStream;
});

// Capture Image
captureBtn.addEventListener("click", () => {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);
  capturedImage = canvas.toDataURL("image/png");
  previewImage.src = capturedImage;
  previewImage.classList.remove("hidden");
  extractTextBtn.classList.remove("hidden");
  textArea.classList.remove("hidden");
  closeCamera();
});

// Close Camera
closeCameraBtn.addEventListener("click", closeCamera);
function closeCamera() {
  cameraSection.classList.add("hidden");
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop());
  }
}

// Paste Text
pasteTextBtn.addEventListener("click", () => {
  textArea.value = "";
  textArea.classList.remove("hidden");
  downloadBtn.classList.remove("hidden");
  previewImage.classList.add("hidden");
  extractTextBtn.classList.add("hidden");
});

// Extract Text using OCR
extractTextBtn.addEventListener("click", async () => {
  const imageSrc = capturedImage || previewImage.src;
  textArea.value = "Extracting text...";
  const result = await Tesseract.recognize(imageSrc, "eng");
  textArea.value = result.data.text;
  downloadBtn.classList.remove("hidden");
});

// Download Report
downloadBtn.addEventListener("click", () => {
  const blob = new Blob([textArea.value], { type: "text/plain;charset=utf-8" });
  saveAs(blob, "report.txt");
});
