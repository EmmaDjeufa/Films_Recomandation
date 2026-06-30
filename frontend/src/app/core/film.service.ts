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
    return this.http.get(`${this.apiUrl}/popular`, this.headers());
  }

  getTopRated() {
    return this.http.get(`${this.apiUrl}/top-rated`, this.headers());
  }

  getUpcoming() {
    return this.http.get(`${this.apiUrl}/upcoming`, this.headers());
  }

  search(query: string) {
    return this.http.get(`${this.apiUrl}/search?query=${query}`, this.headers());
  }

  searchActor(query: string) {
    return this.http.get(`${this.apiUrl}/search/actor?query=${query}`, this.headers());
  }

  getByGenre(id: number) {
    return this.http.get(`${this.apiUrl}/genre/${id}`, this.headers());
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