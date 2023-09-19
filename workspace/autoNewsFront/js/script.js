let speech = new SpeechSynthesisUtterance();
let voices = [];
let voiceSelect = document.querySelector("select");
let noticias = [];
let currentNoticiaIndex = 0;
let currentImageIndex = 0;
const imageSliderInner = document.querySelector(".image-slider-inner");
const reproducirBtn = document.querySelector("button");

window.speechSynthesis.onvoiceschanged = () => {
  voices = window.speechSynthesis.getVoices();
  speech.voice = voices[249];

  voices.forEach((voice, i) => (voiceSelect.options[i] = new Option(voice.name, i)));
};

voiceSelect.addEventListener("change", () => {
  speech.voice = voices[voiceSelect.value];
});

reproducirBtn.addEventListener("click", () => {
  console.log('BOTON TOCADO');
  noticias = [];
  currentNoticiaIndex = 0;
  currentImageIndex = 0;

  fetch('http://localhost:5000/tn')
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(data => {
      if (Array.isArray(data)) {
        data.forEach(noticia => {
          let noticiaCompleta = "";
          noticiaCompleta += `${noticia.h1}. `;
          noticiaCompleta += `${noticia.h2}. `;

          if (noticia.parrafos != undefined) {
            noticia.parrafos.forEach((parrafo, index) => {
              if (!parrafo.startsWith("Leé también:")) {
                const parrafoSinParentesis = parrafo.replace(/\([^)]*\)/g, '');
                noticiaCompleta += `${parrafoSinParentesis}. `;
              }
            });
          }

          if (
            noticia.fotos !== undefined &&
            noticia.fotos.length >= 2
          ) {
            noticias.push({
              contenido: noticiaCompleta.trim(),
              fotos: noticia.fotos || [],
              h1: noticia.h1,
              h2: noticia.h2
            });
          }
        });

        readNextNoticia();
      } else {
        console.error("No se encontraron noticias o el formato de respuesta es incorrecto.");
      }
    })
    .catch(error => {
      console.error("Error al cargar las noticias:", error);
    });
});

function readNextNoticia() {
  if (currentNoticiaIndex < noticias.length) {
    console.log("Comienzo a leer noticia");
    const fotos = noticias[currentNoticiaIndex].fotos || [];
    console.log(`Número de fotos: ${fotos.length}`);
    console.log("h1:", noticias[currentNoticiaIndex].h1);
    console.log("h2:", noticias[currentNoticiaIndex].h2);

    const imageElement = document.querySelector(".image-slider-inner img");

    speech.text = noticias[currentNoticiaIndex].contenido;
    window.speechSynthesis.speak(speech);

    function changeImage() {
      if (currentImageIndex < fotos.length) {
        imageElement.src = fotos[currentImageIndex];
        currentImageIndex++;
      } else {
        currentImageIndex = 0; // Volver al principio cuando se han mostrado todas las imágenes
      }

      if (!speech.paused) {
        // Si el discurso no está en pausa, continuar cambiando las imágenes
        setTimeout(changeImage, 3000);
      }
    }

    speech.onstart = () => {
      console.log("Comienzo a leer texto");
      changeImage(); // Comenzar a cambiar las imágenes cuando comienza el discurso
    };

    speech.onend = () => {
      console.log("Terminé de leer noticia");
      currentNoticiaIndex++;
      if (currentNoticiaIndex < noticias.length) {
        readNextNoticia();
      } else {
        // Si se han leído todas las noticias, volver al principio
        currentNoticiaIndex = 0;
        readNextNoticia();
      }
    };
  }
}
