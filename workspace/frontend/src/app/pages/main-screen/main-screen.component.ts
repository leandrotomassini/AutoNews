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
    this.initializeSpeechSynthesis();
    this.getNews(); // Solicita las noticias al inicio
  }

  ngOnDestroy() {
    if (this.newsSubscription) {
      this.newsSubscription.unsubscribe();
    }
  }

  private getNews() {
    this.newsSubscription = this.newsService.getNews().subscribe((news) => {
      this.titles = news.newsData.map((newData) => newData.h1);
      this.newsList = news.newsData;
      this.currentIndex = 0; // Restablece el índice al inicio
      this.speakNext(); // Comienza a leer las noticias
    });
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

      const randomIndex = Math.floor(Math.random() * 3);

      const voiceIndex = [263, 261, 264][randomIndex];
      console.log('Estoy usando la voz número: ' + voiceIndex);

      this.speech.voice = this.voices[voiceIndex];
      this.speakText();

      this.speech.onend = () => {
        console.log('Terminó de leer:', newData.h1);
        this.currentIndex++;
        this.isSpeaking = false;
        this.speech.onend = null;

        if (this.currentIndex >= this.newsList.length - 3) {
          this.getNews();
          console.log('Solicitando noticias nuevas !!!!!!!');
        } else {
          this.speakNext();
        }
      };
    }
  }

  private speakText() {
    window.speechSynthesis.speak(this.speech);
  }
}
