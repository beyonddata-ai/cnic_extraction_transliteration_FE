function onOpenCvReady() {
  document.getElementById("status").innerHTML = "OpenCV.js is ready.";
}

<script
  async
  src='opencv.js'
  onload='onOpenCvReady();'
  type='text/javascript'></script>;
