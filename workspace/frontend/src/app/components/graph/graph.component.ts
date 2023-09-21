import { Component, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements AfterViewInit {
  constructor(private elRef: ElementRef) {}

  ngAfterViewInit() {
    const marqueeList = this.elRef.nativeElement.querySelector('#marquee-list');
    const marqueeItems = Array.from(marqueeList.getElementsByTagName('li')) as HTMLElement[];

    function resetMarquee() {
      const firstItem = marqueeItems[0];
      marqueeList.appendChild(firstItem.cloneNode(true));
      marqueeList.removeChild(firstItem);
    }

    setInterval(resetMarquee, 10000);

    for (let i = 0; i < marqueeItems.length; i++) {
      marqueeList.appendChild(marqueeItems[i].cloneNode(true));
    }
  }
}