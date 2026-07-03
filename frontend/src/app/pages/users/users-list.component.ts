//users-list.component.ts
// users-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../core/user.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  users: any[] = [];
  loading = false; 
  private loaded = false; 
  private destroy$ = new Subject<void>()

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

 loadUsers() {
    this.loading = true;

    this.userService.getAllUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users: any) => {
          this.users = users;
          this.loading = false;
        },
        error: (err) => {
          console.error("GET USERS ERROR:", err); // 🔥 IMPORTANT
          this.loading = false;
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}