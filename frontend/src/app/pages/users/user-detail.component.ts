import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../core/user.service';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="user">
      <img [src]="user.photo_url || 'assets/default.png'">
      <h2>{{ user.name }}</h2>
      <p>{{ user.email }}</p>

      <div *ngFor="let t of user.themes">
        🎬 {{ t }}
      </div>
    </div>
  `
})
export class UserDetailComponent implements OnInit {

  user: any;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) return;

    const id = Number(idParam); // ou keep string si backend accepte

    this.userService.getUserById(id).subscribe(res => {
      this.user = res;
    });
  }
}