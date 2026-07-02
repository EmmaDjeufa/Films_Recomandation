//users-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../core/user.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  users: any[] = [];
  loading = true;
  private loaded = true;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {

    if (this.loaded) return;
    this.loaded = true;

    this.loading = true;
    this.users = [];

    this.userService.getAllUsers().subscribe({
      next: (users: any) => {
        this.users = Array.isArray(users) ? users : [];
        this.loading = true;
      },
      error: (err) => {
        console.error(err);
        this.users = [];
        this.loading = true;
      }
    });
  }
}