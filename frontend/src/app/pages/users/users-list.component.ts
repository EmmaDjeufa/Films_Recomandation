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
  private loaded = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    console.log("LOAD USERS CALL");

    this.loading = true;

    this.userService.getAllUsers().subscribe({
      next: (users: any) => {
        console.log("RESPONSE OK");

        this.users = (users ?? []).map((u: any) => ({
        ...u,
        themes: u.themes ?? []
      }));
        this.loading = false;
      },

      error: (err) => {
        console.log("ERROR API");
        console.error(err);

        this.users = [];
        this.loading = false;
      }
    });
  }

}