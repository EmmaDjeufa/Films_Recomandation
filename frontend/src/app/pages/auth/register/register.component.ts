import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../../core/auth.service'; // <- bien vérifier le chemin
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  form: FormGroup;
  error = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  register() {
    if (this.form.invalid) {
      this.error = 'Veuillez remplir tous les champs correctement';
      return;
    }

    // Appel à l'API backend
    this.auth.register(this.form.value).subscribe({
      next: (res: any) => {
        console.log('Inscription réussie:', res);
        // Stocke l'utilisateur et redirige
        this.auth.setUser(res);
        this.router.navigate(['/profile']); // redirection après inscription
      },
      error: (err) => {
        console.error('Erreur inscription:', err);
        this.error = err.error?.message || 'Erreur serveur';
      }
    });
  }
}
