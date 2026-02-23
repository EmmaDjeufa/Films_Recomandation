import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-film-recommendations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './film-recommendations.component.html',
  styleUrls: ['./film-recommendations.component.css']
})
export class FilmRecommendationsComponent {

  categories = ['Tous', 'Action', 'Comédie', 'Science-Fiction', 'Drame'];
  selectedCategory = 'Tous';

  films = [
    {
      title: 'Inception',
      theme: 'Science-Fiction',
      image: 'https://m.media-amazon.com/images/I/51EG732BV3L.jpg',
      description: 'Un thriller sur les rêves et la manipulation mentale.'
    },
    {
      title: 'The Dark Knight',
      theme: 'Action',
      image: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      description: 'Batman affronte le Joker dans un duel légendaire.'
    },
    {
      title: 'Intouchables',
      theme: 'Comédie',
      image: 'https://image.tmdb.org/t/p/w500/323BP0itpxTsO0skTwdnVmf7YC9.jpg',
      description: 'Une amitié improbable pleine d’émotions.'
    },
    {
      title: 'Interstellar',
      theme: 'Science-Fiction',
      image: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
      description: 'Voyage spatial à la recherche d’une nouvelle planète.'
    },
    {
      title: 'Titanic',
      theme: 'Drame',
      image: 'https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg',
      description: 'Une histoire d’amour sur fond de catastrophe maritime.'
    }
  ];

  filteredFilms() {
    if (this.selectedCategory === 'Tous') {
      return this.films;
    }
    return this.films.filter(film => film.theme === this.selectedCategory);
  }
}
