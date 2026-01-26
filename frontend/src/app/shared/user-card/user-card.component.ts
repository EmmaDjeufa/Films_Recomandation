import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeBadgeComponent } from '../theme-badge/theme-badge.component';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule, ThemeBadgeComponent],
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent {
  @Input() user: any;
}
