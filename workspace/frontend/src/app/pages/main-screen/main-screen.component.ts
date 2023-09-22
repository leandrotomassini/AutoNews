import { Component, OnInit } from '@angular/core';
import { NewsService } from '../../services/news.service';
import { NewsDatum, NewsListResponse } from 'src/app/interface';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.css'],
})
export class MainScreenComponent implements OnInit {
  speech = new SpeechSynthesisUtterance();
  voices: SpeechSynthesisVoice[] = [];
  newsList: NewsDatum[] = [];
  images: string[] = [];
  currentIndex = 0;
  isSpeaking = false;
  title: string = '';
  titles: string[] = [];

  constructor(private newsService: NewsService) {}

  ngOnInit() {
    this.getNews();
  }

  private getNews() {
    this.newsService.getNews().subscribe((news) => {
      this.newsList = news.newsData;
      this.titles = this.newsList.map((newData) => newData.h1);
      this.initializeSpeechSynthesis();
    });
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
      this.speech.text = newData.combinedText;
      this.isSpeaking = true;
      this.speakText();

      this.speech.onend = () => {
        console.log('Terminó de leer:', newData.h1);
        this.currentIndex++;
        this.isSpeaking = false;
        this.speech.onend = null;
        this.speakNext();
      };
    } else if (this.currentIndex >= this.newsList.length) {
    }
  }

  private speakText() {
    this.speech.voice = this.voices[263];
    window.speechSynthesis.speak(this.speech);
  }
}
