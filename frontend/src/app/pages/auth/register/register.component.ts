//register.component.ts
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
  styleUrls: ['./register.component.css']
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

 register(){

    if(this.form.invalid){

        this.error="Tous les champs sont obligatoires";

        return;

    }

    this.auth.register(

        this.form.value

    ).subscribe({

        next:(res:any)=>{

            this.router.navigate(

                ["/verify"],

                {

                    queryParams:{

                        email:this.form.value.email

                    }

                }

            );

        },

        error:(err)=>{

            this.error=err.error.message;

        }

    });

}
}
