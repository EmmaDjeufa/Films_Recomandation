//auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = "/api/auth";

  currentUser = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {}

  login(data: any) {

    return this.http.post<any>(
      `${this.apiUrl}/login`,
      data
    ).pipe(

      tap(res => {

        localStorage.setItem("token", res.token);

        const decoded = jwtDecode(res.token);

        this.currentUser.next(decoded);

      })

    );

  }

  register(data: any) {

    return this.http.post(
      `${this.apiUrl}/register`,
      data
    );

  }

  verifyCode(email: string, code: string) {

    return this.http.post(
      `${this.apiUrl}/verify`,
      {
        email,
        code
      }
    );

  }

  getToken() {
    return localStorage.getItem("token");
  }

  loadUserFromStorage() {

    const token = localStorage.getItem("token");

    if (token) {

      const decoded = jwtDecode(token);

      this.currentUser.next(decoded);

    }

  }

  logout() {

    localStorage.removeItem("token");

    this.currentUser.next(null);

  }

}