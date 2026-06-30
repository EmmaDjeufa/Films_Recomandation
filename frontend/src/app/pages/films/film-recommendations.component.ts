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
  searchQuery = '';
  favorites: any[] = [];

  constructor(private filmService: FilmService) {}

  ngOnInit() {
    this.loadPopular();
    this.loadFavorites();
  }

  // =====================
  // POPULAR
  // =====================
  loadPopular() {
    this.filmService.getPopular().subscribe((res: any) => {
      this.films = res;
    });
  }

  // =====================
  // TOP RATED
  // =====================
  loadTopRated() {
    this.filmService.getTopRated().subscribe((res: any) => {
      this.films = res;
    });
  }

  // =====================
  // UPCOMING
  // =====================
  loadUpcoming() {
    this.filmService.getUpcoming().subscribe((res: any) => {
      this.films = res;
    });
  }

  // =====================
  // SEARCH
  // =====================
  search() {
    if (!this.searchQuery) return;

    this.filmService.search(this.searchQuery)
      .subscribe((res: any) => {
        this.films = res;
      });
  }
  
  loadFavorites() {
    this.filmService.getFavorites()
      .subscribe((res: any) => {
        this.favorites = res;
      });
  }
  addFavorite(film: any) {
    this.filmService.addFavorite({
      tmdb_id: film.id,
      title: film.title,
      poster_path: film.poster_path
    }).subscribe(() => {
      this.loadFavorites(); // IMPORTANT
    });
  }
}