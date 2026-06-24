//auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl ='https://upgraded-happiness-grrq944qqg5fw569-5000.app.github.dev/api/auth';
  public currentUser = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) { }

  register(data: any) {
    console.log('URL APPELEE =', `${this.apiUrl}/register`);
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: any) {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  verifyEmail(token: string) {
    return this.http.get(`${this.apiUrl}/verify/${token}`);
  }

  setUser(user: any) {
    this.currentUser.next(user);
    localStorage.setItem('token', user.token);
  }

  logout() {
    this.currentUser.next(null);
    localStorage.removeItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }
}
