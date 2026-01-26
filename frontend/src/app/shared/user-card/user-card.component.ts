import { Component, Input } from '@angular/core';
import { ThemeBadgeComponent } from '../theme-badge/theme-badge.component';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [ThemeBadgeComponent],
  template: `
    <div class="card">
      <img [src]="user.photo_url || 'assets/default-avatar.png'" class="avatar">
      <h3>{{ user.name }}</h3>
      <div *ngFor="let theme of user.themes">
        <app-theme-badge [name]="theme"></app-theme-badge>
      </div>
    </div>
  `,
  styles: [`.card { border:1px solid #ccc; padding:12px; margin:8px; border-radius:8px; text-align:center; } .avatar { width:60px; height:60px; border-radius:50%; }`]
})
export class UserCardComponent {
  @Input() user: any;
}
