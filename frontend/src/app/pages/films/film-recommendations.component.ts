import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-film-recommendations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './film-recommendations.component.html',
})
export class FilmRecommendationsComponent {
  films = [
    { title: 'Film A', theme: 'Action' },
    { title: 'Film B', theme: 'Comédie' }
  ];
}

