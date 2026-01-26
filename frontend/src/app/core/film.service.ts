
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FilmService {
  private apiUrl = 'http://localhost:5000/api/films';

  constructor(private http: HttpClient, private auth: AuthService) { }

  private getHeaders() {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` }) };
  }

  getRecommendations() {
    return this.http.get(`${this.apiUrl}/recommendations`, this.getHeaders());
  }

  addFilm(data: any) {
    return this.http.post(`${this.apiUrl}/`, data, this.getHeaders());
  }
}
