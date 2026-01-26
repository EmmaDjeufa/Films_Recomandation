import { Component, OnInit } from '@angular/core';
import { FilmService } from '../../core/film.service';

@Component({
  selector: 'app-film-recommendations',
  template: `
  <h2>Films recommandés</h2>
  <div *ngFor="let film of films">
    <h3>{{film.title}}</h3>
    <p>{{film.description}}</p>
    <img [src]="film.poster_url" width="100">
  </div>`
})
export class FilmRecommendationsComponent implements OnInit {
  films: any[] = [];

  constructor(private filmService: FilmService) {}

  ngOnInit() {
    this.filmService.getRecommendations().subscribe(res => this.films = res as any[]);
  }
}
