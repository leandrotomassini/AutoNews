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
    return this.http.get<NewsListResponse>(
      'http://192.168.1.33:3000/api/noticias/ultimas-publicaciones'
    );
  }

  searchNews(): Observable<any> {
    return this.http.get<NewsListResponse>(
      'http://192.168.1.33:3000/api/noticias/nuevas'
    );
  }
}
