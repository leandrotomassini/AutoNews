import { Component, OnInit } from '@angular/core';

import { NoticiasService } from 'src/app/services/noticias.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  noticias: any[] = [];

  constructor(private noticiasService: NoticiasService) { }

  ngOnInit(): void {
    this.noticiasService.getNoticias().subscribe(
      (data) => {
        this.noticias = data;
        console.log(this.noticias)
      },
      (error) => {
        console.error('Error al obtener noticias:', error);
      }
    );
  }

  // Mostrar Noticia

  
}
