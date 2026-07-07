import { Routes } from '@angular/router';

import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { VerifyComponent } from './pages/auth/verify/verify.component';

import { ProfileComponent } from './pages/profile/profile.component';
import { UsersListComponent } from './pages/users/users-list.component';
import { UserDetailComponent } from './pages/users/user-detail.component';

import { FilmRecommendationsComponent } from './pages/films/film-recommendations.component';

import { AdminDashboardComponent } from './pages/admin/admin-dashboard.component';

import { AuthGuard } from './core/auth.guard';
import { AdminGuard } from './core/admin.guard';


export const routes: Routes = [


  // ============================
  // PUBLIC
  // ============================

  {
    path:'login',
    component:LoginComponent
  },


  {
    path:'register',
    component:RegisterComponent
  },


  {
    path:'verify',
    component:VerifyComponent
  },


  {
    path:'films',
    component:FilmRecommendationsComponent
  },



  // ============================
  // AUTHENTIFIED
  // ============================


  {
    path:'profile',
    component:ProfileComponent,
    canActivate:[AuthGuard]
  },


  {
    path:'users',
    component:UsersListComponent,
    canActivate:[AuthGuard]
  },


  {
    path:'users/:id',
    component:UserDetailComponent,
    canActivate:[AuthGuard]
  },



  // ============================
  // ADMIN
  // ============================

  {
    path:'admin',
    component:AdminDashboardComponent,
    canActivate:[AdminGuard]
  },



  {
    path:'',
    redirectTo:'/films',
    pathMatch:'full'
  },


  {
    path:'**',
    redirectTo:'/films'
  }


];