//auth.service.ts
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private apiUrl = '/api/auth';

  public currentUser = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {}

  register(data:any){

    return this.http.post(
      `${this.apiUrl}/register`,
      data
    );

  }

  login(data:any){

    return this.http.post(
      `${this.apiUrl}/login`,
      data
    );

  }

  verifyCode(email:string,code:string){

    return this.http.post(

      `${this.apiUrl}/verify-code`,

      {

        email,

        code

      }

    );

  }

  setUser(user:any){

    this.currentUser.next(user);

    localStorage.setItem("token",user.token);

  }

  logout(){

    this.currentUser.next(null);

    localStorage.removeItem("token");

  }

  getToken(){

    return localStorage.getItem("token");

  }

}