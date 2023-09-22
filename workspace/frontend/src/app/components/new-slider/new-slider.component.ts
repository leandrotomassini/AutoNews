import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-slider',
  templateUrl: './new-slider.component.html',
  styleUrls: ['./new-slider.component.css'],
})
export class NewSliderComponent implements OnInit {
  @Input() images: string[] = [];

  currentIndex = 0;

  ngOnInit() {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }, 3000);
  }
}
