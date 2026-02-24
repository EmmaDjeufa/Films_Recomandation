import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeBadgeComponent } from '../../shared/theme-badge/theme-badge.component';

interface Film {
  title: string;
  theme: string;
  image: string;
  description: string;
}

interface User {
  name: string;
  email: string;
  photo_url?: string;
  themes: string[];
  favoriteFilms: Film[];
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ThemeBadgeComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  // Mock user data pour affichage visuel
  user: User = {
    name: 'Emma Djeufa',
    email: 'emma@example.com',
    photo_url: 'https://randomuser.me/api/portraits/women/68.jpg',
    themes: ['Action', 'Science-Fiction', 'Comédie'],
    favoriteFilms: [
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
      }
    ]
  };

  // Gestion films
  categories: string[] = ['Tous', 'Action', 'Comédie', 'Science-Fiction', 'Drame'];
  selectedCategory = 'Tous';

  // Gestion mot de passe
  showPasswordForm: boolean = false;
  newPassword: string = '';
  confirmPassword: string = '';
  passwordError: string = '';
  passwordSuccess: string = '';

  constructor() {}

  ngOnInit() {}

  filteredFilms(): Film[] {
    if (this.selectedCategory === 'Tous') return this.user.favoriteFilms;
    return this.user.favoriteFilms.filter(f => f.theme === this.selectedCategory);
  }

  togglePasswordForm() {
    this.showPasswordForm = !this.showPasswordForm;
    this.passwordError = '';
    this.passwordSuccess = '';
  }

  changePassword() {
    if (!this.newPassword || !this.confirmPassword) {
      this.passwordError = 'Veuillez remplir tous les champs.';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.passwordError = 'Les mots de passe ne correspondent pas.';
      return;
    }
    this.passwordSuccess = 'Mot de passe mis à jour !';
    this.newPassword = '';
    this.confirmPassword = '';
  }
}