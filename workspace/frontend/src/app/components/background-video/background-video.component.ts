import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-background-video',
  templateUrl: './background-video.component.html',
  styleUrls: ['./background-video.component.css'],
})
export class BackgroundVideoComponent implements OnInit {

  videoSources = [
    '../../assets/videos/1.mp4',
    '../../assets/videos/2.mp4',
    '../../assets/videos/4.mp4',
    '../../assets/videos/5.mp4',
    '../../assets/videos/6.mp4',
    '../../assets/videos/7.mp4',
    '../../assets/videos/8.mp4',
  ];

  currentVideoIndex = 0;

  ngOnInit(): void {
    this.rotateBackgroundVideos();
  }

  private rotateBackgroundVideos() {
    const videoElement = document.getElementById(
      'background-video'
    ) as HTMLVideoElement;

    const changeRandomVideo = () => {
      // Escoge un nuevo índice de video aleatorio
      const randomVideoIndex = Math.floor(
        Math.random() * this.videoSources.length
      );

      // Cambia el video actual
      this.currentVideoIndex = randomVideoIndex;

      // Carga y reproduce el nuevo video seleccionado
      videoElement.src = this.videoSources[randomVideoIndex];
      videoElement.load();
      videoElement.play();
    };

    // Cambiar aleatoriamente cada tres segundos (3000 milisegundos)
    setInterval(changeRandomVideo, 10000);

    // Iniciar la reproducción del primer video al cargar la página
    videoElement.src = this.videoSources[this.currentVideoIndex];
    videoElement.load();
    videoElement.play();
  }

  get currentVideoSource(): string {
    return this.videoSources[this.currentVideoIndex];
  }
}
