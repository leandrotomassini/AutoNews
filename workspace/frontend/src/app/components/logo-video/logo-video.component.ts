import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Component({
  templateUrl: './logo-video.component.html',
  styleUrls: ['./logo-video.component.css'],
  selector: 'app-logo-video',
})
export class LogoVideoComponent implements AfterViewInit, OnChanges {
  @Input() showVideo: boolean = false;
  @ViewChild('backgroundVideo', { static: false }) backgroundVideo!: ElementRef;
  private videoUrls = [
    '../../../assets/videos/logo1.mp4',
    '../../../assets/videos/logo2.mp4',
    '../../../assets/videos/logo3.mp4',
  ];
  private currentVideoIndex = 0;
  public currentVideoUrl: string = '';
  private videoInterval: any;
  private isFirstLoad = true;

  ngAfterViewInit() {

    if (this.isFirstLoad) {
      this.setupVideo();
      this.isFirstLoad = false;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['showVideo']) {
      if (this.showVideo) {
        this.clearVideo();
      } else {
        this.setupVideo();
      }
    }
  }

  private setupVideo() {
    const videoElement = this.backgroundVideo.nativeElement as HTMLVideoElement;

    const changeRandomVideo = () => {
      this.currentVideoIndex = Math.floor(
        Math.random() * this.videoUrls.length
      );
      this.currentVideoUrl = this.videoUrls[this.currentVideoIndex];
      videoElement.load();
      videoElement.play().catch((error) => {
        console.error('Error al reproducir el video automáticamente:', error);
        setTimeout(changeRandomVideo, 1000);
      });
    };

    changeRandomVideo();

    if(this.showVideo){
      this.videoInterval = setInterval(changeRandomVideo, 30000);
    }
  }

  private clearVideo() {
    const videoElement = this.backgroundVideo.nativeElement as HTMLVideoElement;
    videoElement.pause();
    clearInterval(this.videoInterval);
    this.currentVideoUrl = '';
  }
}
