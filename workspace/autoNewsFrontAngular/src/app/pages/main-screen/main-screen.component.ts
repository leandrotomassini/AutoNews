import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { NewsService } from '../../services/news.service';
import { NewsDatum } from 'src/app/interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.css'],
})
export class MainScreenComponent implements OnInit, OnDestroy {
  isNews: boolean = false;
  speech = new SpeechSynthesisUtterance();
  voices: SpeechSynthesisVoice[] = [];
  newsList: NewsDatum[] = [];
  images: string[] = [];
  currentIndex = 0;
  isSpeaking = false;
  title: string = '';
  titles: string[] = [];
  private newsSubscription: any;
  private isReadingNews = false;
  showLogoVideo: boolean = true;
  private newsCounter: number = 0;

  constructor(
    private newsService: NewsService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.initializeSpeechSynthesis();
    this.getNews();
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
      this.currentIndex = 0;
      this.speakNext();
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
      this.isNews = true;
      this.title = newData.h1;
      this.images = newData.images;
      this.speech.text = newData.combinedText;
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
          this.isNews = false;
          this.showLogoVideo = true;
          console.log('Solicitando noticias nuevas !!!!!!!');

          this.getNews();
        } else {
          this.speakNext();
        }

        this.newsCounter++;
        console.log(this.newsCounter + ' CONTADOR');

        if (this.newsCounter >= 2) {
          console.log('RECARGANDOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO');
          // Redirige a la página actual para simular una recarga completa
          this.ngZone.run(() => {
            this.router.navigate(['/', { skipLocationChange: true }]);
          });
        }
      };

      this.isReadingNews = true;
      this.setIsReadingNews(true);
    }
  }

  private setIsReadingNews(value: boolean) {
    this.isReadingNews = value;
  }

  private speakText() {
    window.speechSynthesis.speak(this.speech);
  }
}
