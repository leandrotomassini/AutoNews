import { Component, OnInit } from '@angular/core';
import { NewsService } from './services/news.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    // Ejecuta searchNews() inmediatamente al cargar el componente.
    this.newsService.searchNews().subscribe();

    // Establece un intervalo para ejecutar searchNews() cada 3 minutos (180,000 milisegundos).
    setInterval(() => {
      this.newsService.searchNews().subscribe();
    }, 180000);
  }
}
