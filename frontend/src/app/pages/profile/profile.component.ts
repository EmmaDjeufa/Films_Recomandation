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

  user: any = null;
  favorites: any[] = [];

  newPassword = '';
  passwordSuccess = false;

  loading = true;

  selectedFile: File | null = null;
  previewUrl: string | null = null;
  defaultAvatar = 'assets/default.png';

  constructor(
    private userService: UserService,
    private filmService: FilmService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  // =========================
  // LOAD PROFILE
  // =========================
  loadProfile() {
    this.loading = true;

    this.userService.getProfile().subscribe({
      next: (data: any) => {

        console.log('[PROFILE] DATA:', data);

        this.user = structuredClone(data.user ?? {});
        this.favorites = data.favorites ?? [];

        this.loading = false;
      },
      error: err => {
        console.error('[PROFILE ERROR]', err);
        this.loading = false;
      }
    });
  }

  // =========================
  // PHOTO SELECTION
  // =========================
  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  // =========================
  // UPLOAD PHOTO
  // =========================
  uploadPhoto() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('photo', this.selectedFile);

    this.userService.updateProfile(formData).subscribe({
      next: (res) => {
        console.log('[UPLOAD SUCCESS]', res);

        this.selectedFile = null;
        this.previewUrl = null;

        this.loadProfile(); // 🔥 important: refresh user
      },
      error: err => console.error('[UPLOAD ERROR]', err)
    });
  }

  // =========================
  // REMOVE FAVORITE
  // =========================
  removeFavorite(tmdbId: number) {
    this.filmService.removeFavorite(tmdbId).subscribe({
      next: () => {
        this.favorites = this.favorites.filter(
          f => f.tmdb_id !== tmdbId
        );
      },
      error: err => console.error('[DELETE FAVORITE ERROR]', err)
    });
  }

  // =========================
  // UPDATE PASSWORD
  // =========================
  updatePassword() {
    if (this.newPassword.length < 6) return;

    this.userService.updatePassword(this.newPassword).subscribe({
      next: () => {
        this.newPassword = '';
        this.passwordSuccess = true;

        setTimeout(() => {
          this.passwordSuccess = false;
        }, 3000);
      },
      error: err => console.error('[PASSWORD ERROR]', err)
    });
  }
}