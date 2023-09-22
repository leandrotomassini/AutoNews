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
      // Una vez que lleguen las noticias nuevas, agrega las nuevas noticias
      this.newsList.push(...news.newsData);
    });

    // Si ya había una solicitud en curso, cancela la suscripción anterior
    if (this.newsSubscription) {
      this.newsSubscription.unsubscribe();
    }

    // Establece la nueva suscripción como la actual
    this.newsSubscription = newNewsSubscription;

    // Inicializa la síntesis de voz si aún no se ha hecho
    if (!this.isSpeaking) {
      this.initializeSpeechSynthesis();
    }
  }

  private initializeSpeechSynthesis() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        this.voices = window.speechSynthesis.getVoices();
        this.speakNext();
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
          console.log('PIDIENDO NOTICIAS NUEVAS!!!!!')
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
