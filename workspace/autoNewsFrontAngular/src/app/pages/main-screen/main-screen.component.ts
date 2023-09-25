import { Component, OnInit } from '@angular/core';
import { NewsListResponse, Noticia } from 'src/app/interface';
import { NewsService } from 'src/app/services/news.service';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.css'],
})
export class MainScreenComponent implements OnInit {
  speech = new SpeechSynthesisUtterance();
  voices: SpeechSynthesisVoice[] = [];
  latestPost: Noticia[] = [];
  currentNewsIndex = 0;
  title: string = '';
  titles: string[] = [];
  images: string[] = [];

  constructor(private newsService: NewsService) {}

  ngOnInit() {
    this.loadVoices();
    this.getAndReadNews();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        this.loadVoices();
      };
    }
  }

  loadVoices() {
    this.voices = window.speechSynthesis.getVoices();
  }

  getAndReadNews() {
    this.images = []; // Vaciar el arreglo 'images' antes de hacer la solicitud de noticias

    this.newsService.getNews().subscribe((response: NewsListResponse) => {
      if (response.ok) {
        // Filtrar las noticias que contienen la frase no deseada en el contenido
        this.latestPost = response.noticias.filter((news) => {
          return !news.contenidoTerminado.includes(
            'Primero cambia todo lo que diga TN por Argentina Noticias'
          );
        });

        // Llenar el arreglo 'titles' con los títulos de las noticias
        this.titles = this.latestPost.map((news) => news.titulo);

        console.log(this.latestPost);
        this.readNewsContent();
      } else {
        console.error('Error al obtener noticias.');
      }
    });
  }

  readNewsContent() {
    if (this.currentNewsIndex < this.latestPost.length) {
      const news = this.latestPost[this.currentNewsIndex];
      this.speech.text = news.titulo;
      this.title = news.titulo;

      // Llenar el arreglo 'images' con las fotos de la noticia actual
      this.images = [...news.fotos];

      const voiceIndexes = [263, 261, 264];
      const randomIndex = Math.floor(Math.random() * voiceIndexes.length);
      const voiceIndex = voiceIndexes[randomIndex];
      const selectedVoice = this.voices.find(
        (voice) => voice.voiceURI === this.voices[voiceIndex].voiceURI
      );

      if (selectedVoice) {
        this.speech.voice = selectedVoice;
        this.speech.onend = () => {
          this.currentNewsIndex++;
          this.readNewsContent();
        };
        window.speechSynthesis.speak(this.speech);
      } else {
        console.error('No se encontró una voz válida.');
      }
    } else {
      this.currentNewsIndex = 0;
      this.getAndReadNews();
    }
  }
}
