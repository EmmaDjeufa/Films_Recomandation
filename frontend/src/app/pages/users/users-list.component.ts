import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserCardComponent } from '../../shared/user-card/user-card.component';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, UserCardComponent],
  templateUrl: './users-list.component.html',
})
export class UsersListComponent {
  users = [
    { name: 'Alice', themes: ['Action', 'Comédie'] },
    { name: 'Bob', themes: ['Horreur'] }
  ];
}
