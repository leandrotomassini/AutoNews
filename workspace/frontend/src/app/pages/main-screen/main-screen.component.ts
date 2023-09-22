import { Component, OnInit, OnDestroy } from '@angular/core';
import { NewsService } from '../../services/news.service';
import { NewsDatum } from 'src/app/interface';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.css'],
})
export class MainScreenComponent implements OnInit, OnDestroy {
  speech = new SpeechSynthesisUtterance();
  voices: SpeechSynthesisVoice[] = [];
  newsList: NewsDatum[] = [];
  images: string[] = [];
  currentIndex = 0;
  isSpeaking = false;
  title: string = '';
  titles: string[] = [];
  private newsSubscription: any;

  constructor(private newsService: NewsService) {}

  ngOnInit() {
    this.initializeSpeechSynthesis(); // Inicia la síntesis de voz al cargar el componente
    this.getNews();
  }

  ngOnDestroy() {
    // Asegúrate de cancelar la suscripción cuando el componente se destruye
    if (this.newsSubscription) {
      this.newsSubscription.unsubscribe();
    }
  }

  private getNews() {
    // Inicia la solicitud de noticias nuevas de manera asincrónica
    const newNewsSubscription = this.newsService.getNews().subscribe((news) => {
      // Limpiar los títulos antiguos y guardar los nuevos títulos
      this.titles = news.newsData.map((newData) => newData.h1);
      // Una vez que lleguen las noticias nuevas, reemplaza las noticias actuales
      this.newsList = news.newsData;
      // Comienza a leer las noticias cuando llegan
      this.speakNext();
    });

    // Si ya había una solicitud en curso, cancela la suscripción anterior
    if (this.newsSubscription) {
      this.newsSubscription.unsubscribe();
    }

    // Establece la nueva suscripción como la actual
    this.newsSubscription = newNewsSubscription;
  }

  private initializeSpeechSynthesis() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        this.voices = window.speechSynthesis.getVoices();
      };
    }
  }

  speakNext() {
    if (!this.isSpeaking && this.currentIndex < this.newsList.length) {
      const newData = this.newsList[this.currentIndex];
      console.log('Empezando a leer:', newData.h1);
      this.title = newData.h1;
      this.images = newData.images;
      this.speech.text = newData.h1;
      this.isSpeaking = true;

      // Generar un índice aleatorio entre 0 y 2
      const randomIndex = Math.floor(Math.random() * 3);

      // Seleccionar el valor del índice aleatorio
      const voiceIndex = [263, 261, 264][randomIndex];
      console.log('Estoy usando la voz número: ' + voiceIndex);

      this.speech.voice = this.voices[voiceIndex];
      this.speakText();

      this.speech.onend = () => {
        console.log('Terminó de leer:', newData.h1);
        this.currentIndex++;
        this.isSpeaking = false;
        this.speech.onend = null;

        // Verificar si se están leyendo las últimas tres noticias
        if (this.currentIndex >= this.newsList.length - 3) {
          // Solicitar nuevas noticias mientras se siguen leyendo las actuales
          this.getNews();
        } else {
          // Continuar leyendo las noticias actuales
          this.speakNext();
        }
      };
    }
  }

  private speakText() {
    window.speechSynthesis.speak(this.speech);
  }
}
