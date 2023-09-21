import { Component, OnInit } from '@angular/core';

import { NewsService } from '../../services/news.service';
import { NewsListResponse } from 'src/app/interface';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.css'],
})
export class MainScreenComponent implements OnInit {
  speech = new SpeechSynthesisUtterance();
  voices: SpeechSynthesisVoice[] = [];
  newsList: NewsListResponse[] = [];

  constructor(private newsService: NewsService) {}

  ngOnInit() {
    this.newsService.getNews().subscribe((news) => {
      this.newsList = news;
      console.log(this.newsList);
    });

    this.initializeSpeechSynthesis();
  }

  speak() {
    this.speakText('Desde 1996, A Dos Voces es el programa político.');
  }

  private initializeSpeechSynthesis() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        this.voices = window.speechSynthesis.getVoices();
      };
    }
  }

  private speakText(text: string) {
    this.speech.voice = this.voices[262];
    this.speech.text = text;
    window.speechSynthesis.speak(this.speech);
  }
}
