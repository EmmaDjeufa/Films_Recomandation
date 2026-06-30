import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/user.service';
import { FilmService } from '../../core/film.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  
  user: any;
  favorites: any[] = [];
  newPassword = '';

  constructor(
    private userService: UserService,
    private filmService: FilmService
  ) {}

  ngOnInit() {
    this.loadProfile();
    this.loadFavorites();
  }

  loadProfile() {
    this.userService.getProfile().subscribe(res => this.user = res);
  }

  loadFavorites() {
    this.filmService.getFavorites().subscribe(res => this.favorites = res as any[]);
  }

  updatePassword() {
    this.userService.updatePassword(this.newPassword).subscribe(() => {
      alert("Mot de passe mis à jour");
      this.newPassword = '';
    });
  }

  removeFavorite(id: number) {
    this.filmService.removeFavorite(id).subscribe(() => this.loadFavorites());
  }
}