import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-theme-badge',
  standalone: true,
  template: `<span class="badge">{{ name }}</span>`,
  styles: [`.badge { background:#007bff; color:white; padding:4px 8px; border-radius:12px; margin-right:4px; }`]
})
export class ThemeBadgeComponent {
  @Input() name: string = '';
}
