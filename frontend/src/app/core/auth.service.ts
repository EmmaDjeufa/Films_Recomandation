//auth.service.ts
import { jwtDecode } from 'jwt-decode';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  currentUser = new BehaviorSubject<any>(null);

  login(token: string) {
    localStorage.setItem('token', token);

    const decoded = jwtDecode(token);
    this.currentUser.next(decoded);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  loadUserFromStorage() {
    const token = localStorage.getItem('token');

    if (token) {
      const decoded = jwtDecode(token);
      this.currentUser.next(decoded);
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUser.next(null);
  }
}