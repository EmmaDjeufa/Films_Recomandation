import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/user.service';

@Component({
  selector: 'app-users-list',
  template: `
  <h2>Utilisateurs</h2>
  <div *ngFor="let user of users">
    <app-user-card [user]="user"></app-user-card>
  </div>`
})
export class UsersListComponent implements OnInit {
  users: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getAllUsers().subscribe(res => this.users = res as any[]);
  }
}
