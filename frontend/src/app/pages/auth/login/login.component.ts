import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.auth.login({ email:this.email, password:this.password }).subscribe({
      next: (res:any) => { this.auth.setUser(res); this.router.navigate(['/profile']); },
      error: (err) => this.error = err.error.message
    });
  }
}
