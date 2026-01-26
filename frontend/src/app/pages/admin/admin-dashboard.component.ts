import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  template: `
  <h2>Dashboard Admin</h2>
  <p>Utilisateurs: {{stats?.total_users}}</p>
  <p>Films: {{stats?.total_films}}</p>
  <p>Thèmes: {{stats?.total_themes}}</p>`
})
export class AdminDashboardComponent implements OnInit {
  stats: any;

  constructor(private http: HttpClient, private auth: AuthService) {}

  ngOnInit() {
    const headers = { Authorization: `Bearer ${this.auth.getToken()}` };
    this.http.get('http://localhost:5000/api/admin/dashboard', { headers }).subscribe(res => this.stats = res);
  }
}
