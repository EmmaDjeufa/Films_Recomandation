import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  template: `
    <nav>
      <a routerLink="/profile">Profil</a>
      <a routerLink="/users">Utilisateurs</a>
      <a routerLink="/films">Films</a>
      <a routerLink="/admin" *ngIf="auth.currentUser.value?.role==='admin'">Admin</a>
      <button (click)="logout()">Logout</button>
    </nav>
  `,
  styles: [`nav { display:flex; gap:12px; margin-bottom:16px; }`]
})
export class NavbarComponent {
  constructor(public auth: AuthService, private router: Router) {}
  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
