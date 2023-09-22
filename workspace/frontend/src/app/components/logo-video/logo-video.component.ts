import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  templateUrl: './logo-video.component.html',
  styleUrls: ['./logo-video.component.css'],
  selector: 'app-logo-video',
})
export class LogoVideoComponent implements AfterViewInit {
  @ViewChild('backgroundVideo', { static: false }) backgroundVideo!: ElementRef;

  ngAfterViewInit() {
    // Obtener el elemento de video
    const videoElement = this.backgroundVideo.nativeElement as HTMLVideoElement;

    // Intentar forzar la reproducción
    function forcePlay() {
      videoElement.play().catch((error) => {
        // Si la reproducción falla, intentar nuevamente después de un tiempo
        console.error('Error al reproducir el video automáticamente:', error);
        setTimeout(forcePlay, 1000); // Intentar nuevamente después de 1 segundo
      });
    }

    // Llamar a la función para forzar la reproducción
    forcePlay();
  }
}
