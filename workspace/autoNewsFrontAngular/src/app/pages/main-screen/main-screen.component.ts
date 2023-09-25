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

  constructor(private newsService: NewsService) {}

  ngOnInit() {
    this.newsService.getNews().subscribe((response: NewsListResponse) => {
      if (response.ok) {
        this.latestPost = response.noticias;
        console.log(this.latestPost);
      } else {
        console.error('Error al obtener noticias.');
      }
    });

    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        this.loadVoices();
      };
    }
  }

  loadVoices() {
    this.voices = window.speechSynthesis.getVoices();
    // this.speakRandomText();
  }

  speakRandomText() {
    this.speech.text = 'Hola mundo';

    const voiceIndexes = [263, 261, 264];
    const randomIndex = Math.floor(Math.random() * voiceIndexes.length);
    const voiceIndex = voiceIndexes[randomIndex];
    const selectedVoice = this.voices.find(
      (voice) => voice.voiceURI === this.voices[voiceIndex].voiceURI
    );

    if (selectedVoice) {
      this.speech.voice = selectedVoice;
      window.speechSynthesis.speak(this.speech);
    } else {
      console.error('No se encontró una voz válida.');
    }
  }
}
