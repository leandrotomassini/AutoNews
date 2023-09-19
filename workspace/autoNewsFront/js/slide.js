// Este es solo un ejemplo de cómo puedes iniciar la animación, ajusta según tus necesidades
const imageSliderInner = document.querySelector(".image-slider-inner");

function startAnimation() {
    imageSliderInner.style.animationPlayState = "running";
}

// Iniciar la animación después de que la página se haya cargado completamente
window.addEventListener("load", startAnimation);
