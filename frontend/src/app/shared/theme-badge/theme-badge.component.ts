import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-theme-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-badge.component.html',
  styleUrls: ['./theme-badge.component.scss']
})
export class ThemeBadgeComponent {
  @Input() name: string = '';
}
