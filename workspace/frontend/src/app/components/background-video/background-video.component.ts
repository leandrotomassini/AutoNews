import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-background-video',
  templateUrl: './background-video.component.html',
  styleUrls: ['./background-video.component.css'],
})
export class BackgroundVideoComponent implements OnInit {
  ngOnInit(): void {
    this.rotateBackgroundVideos();
  }

  private rotateBackgroundVideos() {
    const videoElements = [
      document.getElementById('background-video1') as HTMLVideoElement,
      document.getElementById('background-video2') as HTMLVideoElement,
      document.getElementById('background-video3') as HTMLVideoElement,
    ];
    const videoSources = [
      'assets/videos/1.mp4',
      'assets/videos/2.mp4',
      'assets/videos/3.mp4',
    ];
    let currentIndex = 0;

    videoElements.forEach((videoElement) => {
      videoElement.muted = true;
    });

    setInterval(() => {
      currentIndex = (currentIndex + 1) % videoSources.length;
      videoElements.forEach((videoElement, index) => {
        videoElement.src = videoSources[index];
        videoElement.load();
        videoElement.play();
      });
    }, 30000);
  }
}
