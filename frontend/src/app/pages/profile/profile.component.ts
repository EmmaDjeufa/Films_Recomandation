import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/user.service';
import { FilmService } from '../../core/film.service';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

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
  loading = true;

  constructor(
    private userService: UserService,
    private filmService: FilmService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  // =========================
  // LOAD PROFILE + FAVORITES
  // =========================
  loadData() {
    forkJoin({
      profile: this.userService.getProfile(),
      favorites: this.filmService.getFavorites()
    }).subscribe({
      next: (res) => {
        this.user = res.profile;
        this.favorites = res.favorites as any[];
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  // =========================
  // REMOVE FAVORITE
  // =========================
  removeFavorite(id: number) {
    this.filmService.removeFavorite(id).subscribe({
      next: () => {
        this.loadData(); // refresh propre
      },
      error: (err) => console.error(err)
    });
  }

  // =========================
  // UPDATE PASSWORD
  // =========================
  updatePassword() {
    if (!this.newPassword || this.newPassword.length < 6) {
      alert("Mot de passe trop court");
      return;
    }

    this.userService.updatePassword(this.newPassword).subscribe({
      next: () => {
        alert("Mot de passe mis à jour");
        this.newPassword = '';
      },
      error: (err) => console.error(err)
    });
  }
}