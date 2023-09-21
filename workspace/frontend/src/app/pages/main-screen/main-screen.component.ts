import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.css'],
})
export class MainScreenComponent implements OnInit {
  speech = new SpeechSynthesisUtterance();
  voices: SpeechSynthesisVoice[] = [];

  ngOnInit() {
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
