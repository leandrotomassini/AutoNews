import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoticiasService implements OnInit {

  private apiUrl = 'http://localhost:5000/tn';

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  getNoticias(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.apiUrl);
  }

}
