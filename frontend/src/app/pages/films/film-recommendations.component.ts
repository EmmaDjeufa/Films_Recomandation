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

    console.log('[Films] ngOnInit appelé');
    this.films = []; // état initial visible

    this.loadPopular();
    this.loadFavorites();
  }

  private fetchFilms(request$: any, category: string) {

    console.log('==============================');
    console.log('[Films] Début chargement');
    console.log('Catégorie :', category);

    this.loading = true;
    this.activeCategory = category;

    request$.subscribe({

      next: (res: any) => {

        console.log('[Films] Réponse API :', res);

        this.films = Array.isArray(res) ? res : [];

        console.log('[Films] Nombre de films :', this.films.length);

        if (this.films.length > 0) {
          console.log('[Films] Premier film :', this.films[0]);
        } else {
          console.warn('[Films] Aucun film reçu');
        }

        this.loading = false;

        console.log('[Films] Chargement terminé');
        console.log('==============================');

      },

      error: (err: any) => {

        console.error('[Films] Erreur API :', err);

        this.films = [];
        this.loading = false;

        console.log('[Films] Chargement terminé avec erreur');
        console.log('==============================');

      }

    });

  }

  loadPopular() {
    console.log('[Films] Appel de loadPopular()');
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


