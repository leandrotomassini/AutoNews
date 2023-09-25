import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { NewsListResponse } from '../interface';


@Injectable({
  providedIn: 'root',
})
export class NewsService {
  constructor(private http: HttpClient) {}

  getNews(): Observable<NewsListResponse> {
    return this.http.get<NewsListResponse>('http://localhost:3000/api/noticias/ultimas-publicaciones');
  }
}
