import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./home/home').then((m) => m.Home) },
  { path: 'home', redirectTo: '/' },
  {
    path: 'auth/callback',
    loadComponent: () =>
      import('./auth/auth-callback.component').then((m) => m.AuthCallbackComponent),
  },
  {
    path: 'listing-list',
    loadComponent: () => import('./listings/listings').then((m) => m.Listings),
  },
  {
    path: 'listing-form',
    loadComponent: () => import('./listing-form/listing-form').then((m) => m.ListingForm),
    canActivate: [authGuard],
  },
  {
    path: 'listing-list/:id',
    loadComponent: () =>
      import('./listing-details-component/listing-details-component').then(
        (m) => m.ListingDetailsComponent,
      ),
  },
  {
    path: 'user-list',
    loadComponent: () => import('./users/users').then((m) => m.Users),
  },
  {
    path: 'user-form',
    loadComponent: () => import('./user-form/user-form').then((m) => m.UserForm),
    canActivate: [authGuard],
  },
  {
    path: 'user-list/:id',
    loadComponent: () =>
      import('./user-details-component/user-details-component').then((m) => m.UserDetailsComponent),
  },
];
