import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FormsModule } from '@angular/forms'; 
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FormsModule], 
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})

export class App implements OnInit {

  protected readonly title = signal('frontend');

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.auth.loadUserFromStorage();
  }
}

