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
