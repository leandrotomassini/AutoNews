let speech = new SpeechSynthesisUtterance();
let voices = [];

window.speechSynthesis.onvoiceschanged = () => {
  voices = window.speechSynthesis.getVoices();
  speech.voice = voices[262];
};

speech.onend = function () {
  console.log("La reproducción del audio ha terminado.");
};

document.querySelector("button").addEventListener("click", () => {


  fetch('http://localhost:5000/tn')
    .then(response => response.json())
    .then(data => {
      data.forEach(noticia => {
        console.log("ID:", noticia.id);
        console.log("Enlace de la noticia:", noticia.linkNoticia);
        console.log("Título:", noticia.h1);
        console.log("Subtítulo:", noticia.h2);
        console.log("Portada:", noticia.portada);
        console.log("Párrafos:");

        noticia.parrafos.forEach((parrafo, index) => {
          console.log(`  ${index + 1}. ${parrafo}`);
        });

        console.log("-------------------");
      });
    })
    .catch(error => {
      console.error("Error al cargar las noticias:", error);
    });


  fetch('db/data.json')
    .then(response => response.json())
    .then(data => {
      const title = data.title;
      const text = data.text;

      speech.text = title + ". " + text;

      window.speechSynthesis.speak(speech);
    })
    .catch(error => {
      console.error("Error al cargar el archivo JSON:", error);
    });
});
