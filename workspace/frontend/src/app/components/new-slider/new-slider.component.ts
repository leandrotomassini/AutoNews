import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-slider',
  templateUrl: './new-slider.component.html',
  styleUrls: ['./new-slider.component.css']
})
export class NewSliderComponent implements OnInit {
  images: string[] = [
    "https://tn.com.ar/resizer/3yUFgh6LupiS5MQzUFc0cKP_pRo=/1440x0/smart/filters:format(webp)/cloudfront-us-east-1.images.arcpublishing.com/artear/OAJ5Z3ALQRF5JIK6SGXYC3UFHQ.JPG",
    "https://tn.com.ar/resizer/n_StVffgQsmSio-lpRuXUEBU_M4=/1440x0/smart/filters:format(webp)/cloudfront-us-east-1.images.arcpublishing.com/artear/OZNQ7HZVIVEOLKUCCFKMLXVY7U.jpg",
    "https://tn.com.ar/resizer/8i3-2WQPpgYiaNaE71bvP34-l40=/1440x0/smart/filters:format(webp)/cloudfront-us-east-1.images.arcpublishing.com/artear/WPM7ZYDGPNBKPE6TIJZ4ZC4SFU.jpg"
  ];

  currentIndex = 0;

  ngOnInit() {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }, 3000);
  }
}
