let speech = new SpeechSynthesisUtterance();
let voices = [];
let voiceSelect = document.querySelector("select");
let noticias = [];
let currentNoticiaIndex = 0;

window.speechSynthesis.onvoiceschanged = () => {
  voices = window.speechSynthesis.getVoices();
  speech.voice = voices[249];

  voices.forEach((voice, i) => (voiceSelect.options[i] = new Option(voice.name, i)));
};

voiceSelect.addEventListener("change", () => {
  speech.voice = voices[voiceSelect.value];
});

document.querySelector("button").addEventListener("click", () => {
  console.log('BOTON TOCADO')
  noticias = [];
  currentNoticiaIndex = 0;

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

          // Comprobar si existen la portada y fotos, y si hay al menos 2 fotos
          if (
            noticia.portada !== undefined &&
            noticia.fotos !== undefined &&
            noticia.fotos.length >= 2
          ) {
            noticias.push({
              contenido: noticiaCompleta.trim(),
              portada: noticia.portada,
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

    // Mostrar la URL de la portada de la noticia actual
    console.log("URL de la portada:", noticias[currentNoticiaIndex].portada);

    // Mostrar la URL de cada foto de la noticia actual
    const fotos = noticias[currentNoticiaIndex].fotos || [];
    fotos.forEach((foto, index) => {
      console.log(`URL de la foto ${index + 1}:`, foto);
    });

    // Mostrar h1 y h2 de la noticia actual
    console.log("h1:", noticias[currentNoticiaIndex].h1);
    console.log("h2:", noticias[currentNoticiaIndex].h2);

    speech.text = noticias[currentNoticiaIndex].contenido;
    speech.onend = () => {
      console.log("Terminé de leer noticia");
      currentNoticiaIndex++;
      if (currentNoticiaIndex < noticias.length) {
        readNextNoticia();
      }
    };
    window.speechSynthesis.speak(speech);
  }
}
