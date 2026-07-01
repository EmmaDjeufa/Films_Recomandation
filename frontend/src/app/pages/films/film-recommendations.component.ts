import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilmService } from '../../core/film.service';

@Component({
  selector: 'app-film-recommendations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './film-recommendations.component.html',
  styleUrls: ['./film-recommendations.component.css']
})
export class FilmRecommendationsComponent implements OnInit {

  films: any[] = [];
  favorites: any[] = [];

  loading = false;
  activeCategory: string | null = null;

  constructor(private filmService: FilmService) {}

  ngOnInit() {
    this.films = []; // état initial visible

    this.loadPopular();
    this.loadFavorites();
  }

  private fetchFilms(request$: any, category: string) {
    this.loading = true;
    this.activeCategory = category;

    request$.subscribe({
      next: (res: any) => {
        this.films = Array.isArray(res) ? res : [];
        this.loading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.films = [];
        this.loading = false;
      }
    });
  }

  loadPopular() {
    this.fetchFilms(this.filmService.getPopular(), 'popular');
  }

  loadTopRated() {
    this.fetchFilms(this.filmService.getTopRated(), 'top');
  }

  loadUpcoming() {
    this.fetchFilms(this.filmService.getUpcoming(), 'upcoming');
  }

  loadFavorites() {
    this.filmService.getFavorites().subscribe({
      next: (res: any) => this.favorites = res || [],
      error: () => this.favorites = []
    });
  }

  addFavorite(film: any) {
    this.filmService.addFavorite({
      tmdb_id: film.id,
      title: film.title,
      poster_path: film.poster_path
    }).subscribe(() => {
      this.loadFavorites();
    });
  }
}