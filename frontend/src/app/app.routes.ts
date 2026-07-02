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
import { UserDetailComponent } from './pages/users/user-detail.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify', component: VerifyComponent },

  // PROFIL CONNECTÉ
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },

  // USERS LIST
  { path: 'users', component: UsersListComponent, canActivate: [AuthGuard] },

  {
    path: 'users/:id',
    component: UserDetailComponent
  },

  { path: 'films', component: FilmRecommendationsComponent },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AdminGuard] },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];