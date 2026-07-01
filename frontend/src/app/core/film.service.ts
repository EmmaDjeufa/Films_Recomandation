// film.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class FilmService {

  private apiUrl = '/api/films';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private headers() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.auth.getToken()}`
      })
    };
  }

  getPopular() {
    return this.http.get(`${this.apiUrl}/popular`);
  }

  getTopRated() {
    return this.http.get(`${this.apiUrl}/top-rated`);
  }

  getUpcoming() {
    return this.http.get(`${this.apiUrl}/upcoming`);
  }

  search(query: string) {
    return this.http.get(`${this.apiUrl}/search?query=${query}`);
  }

  searchActor(query: string) {
    return this.http.get(`${this.apiUrl}/search/actor?query=${query}`);
  }

  getByGenre(id: number) {
    return this.http.get(`${this.apiUrl}/genre/${id}`);
  }

  getDetails(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`, this.headers());
  }

  getRecommendations() {
    return this.http.get(`${this.apiUrl}/recommendations`, this.headers());
  }

  addFavorite(film: any) {
    return this.http.post(`${this.apiUrl}/favorites`, film, this.headers());
  }

  getFavorites() {
    return this.http.get(`${this.apiUrl}/favorites`, this.headers());
  }

  removeFavorite(id: number) {
    return this.http.delete(`${this.apiUrl}/favorites/${id}`, this.headers());
  }
  
}