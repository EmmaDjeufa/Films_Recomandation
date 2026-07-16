//user.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient, private auth: AuthService) { }

  private getHeaders() {
    const token = this.auth.getToken();

    console.log("TOKEN =", token);
    return { headers: new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` }) };
  }

  updateProfile(formData: FormData) {
    return this.http.put(`${this.apiUrl}/profile`, formData, this.getHeaders());
  }

  updateThemes(themeIds: number[]) {
    return this.http.put(`${this.apiUrl}/themes`, { themeIds }, this.getHeaders());
  }

  getAllUsers() {
    return this.http.get(`${this.apiUrl}/all`, this.getHeaders());
  }

  // ✅ Ajouté
  getProfile() {
    return this.http.get(`${this.apiUrl}/me`, this.getHeaders());
  }

  updatePassword(newPassword: string) {
    return this.http.put(`${this.apiUrl}/password`, { password: newPassword }, this.getHeaders());
  }
  getUserById(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`,this.getHeaders());
  }
}