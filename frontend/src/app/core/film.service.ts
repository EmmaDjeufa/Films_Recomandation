// film.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FilmService {

  private apiUrl = '/api/films';

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}
  hasAuth(): boolean {

  return !!this.auth.getToken();

  }
  private headers() {

    const token = this.auth.getToken();


    if(!token){

      return {};

    }


    return {

      headers:new HttpHeaders({

        Authorization:`Bearer ${token}`

      })

    };


  }

  getPopular() {

    console.log('[FilmService] GET /popular');

    return this.http
      .get(`${this.apiUrl}/popular`)
      .pipe(
        tap(res => console.log('[FilmService] Popular response', res))
      );

  }

  getTopRated() {

    console.log('[FilmService] GET /top-rated');

    return this.http
      .get(`${this.apiUrl}/top-rated`)
      .pipe(
        tap(res => console.log('[FilmService] Top response', res))
      );

  }

  getUpcoming() {

    console.log('[FilmService] GET /upcoming');

    return this.http
      .get(`${this.apiUrl}/upcoming`)
      .pipe(
        tap(res => console.log('[FilmService] Upcoming response', res))
      );

  }

  getFavorites() {

    console.log('[FilmService] GET /favorites');

    return this.http.get(
      `${this.apiUrl}/favorites`,
      this.headers()
    );

  }

  addFavorite(film: any) {

    console.log('[FilmService] POST favorite', film);

    return this.http.post(
      `${this.apiUrl}/favorites`,
      film,
      this.headers()
    );

  }

  removeFavorite(id: number) {

    console.log('[FilmService] DELETE favorite', id);

    return this.http.delete(
      `${this.apiUrl}/favorites/${id}`,
      this.headers()
    );

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

}