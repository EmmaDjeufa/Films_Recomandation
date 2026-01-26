import { Component } from '@angular/core';
import { AuthService } from '../../../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  error = '';
  success = '';

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    this.auth.register({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: (res: any) => this.success = res.message,
      error: (err) => this.error = err.error.message
    });
  }
}
