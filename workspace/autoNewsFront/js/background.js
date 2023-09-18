const videoElement = document.getElementById("backgroundVideo");
const videos = [
    "assets/videos/1.mp4",
    "assets/videos/2.mp4",
    "assets/videos/3.mp4"
];

// Función para cargar y reproducir videos aleatoriamente
function playRandomVideo() {
    const randomIndex = Math.floor(Math.random() * videos.length);
    videoElement.src = videos[randomIndex];
    videoElement.play();
}

// Iniciar la reproducción de un video aleatorio
playRandomVideo();

// Cambiar a un video aleatorio cada 1 minuto
setInterval(playRandomVideo, 60000);