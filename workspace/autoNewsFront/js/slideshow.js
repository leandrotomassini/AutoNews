let slideshow = document.querySelector("#slideshow");

let currentImage = 0;

function nextImage() {
  currentImage++;
  if (currentImage > slideshow.children.length - 1) {
    currentImage = 0;
  }

  slideshow.children[currentImage].style.zIndex = 1;
  slideshow.children[currentImage - 1].style.zIndex = 0;
}

setInterval(nextImage, 5000);