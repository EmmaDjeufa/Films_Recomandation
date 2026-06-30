import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { UsersListComponent } from './pages/users/users-list.component';
import { FilmRecommendationsComponent } from './pages/films/film-recommendations.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard.component';
import { VerifyComponent } from './pages/auth/verify/verify.component';
import { AuthGuard } from './core/auth.guard';
import { AdminGuard } from './core/admin.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent},
  { path: 'verify', component: VerifyComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  { path: 'users', component: UsersListComponent, canActivate: [AuthGuard] },
  { path: 'films', component: FilmRecommendationsComponent },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AdminGuard] },

  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Facultatif mais recommandé
  { path: '**', redirectTo: '/login' }
];