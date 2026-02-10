import { Routes } from '@angular/router';
import { Listings } from './listings/listings';
import { Home } from './home/home';
import { ListingForm } from './listing-form/listing-form';
import { ListingDetailsComponent } from './listing-details-component/listing-details-component';
import { UserForm } from './user-form/user-form';
import { Users } from './users/users';
import { UserDetailsComponent } from './user-details-component/user-details-component';
import { AuthCallbackComponent } from './auth/auth-callback.component';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'home', redirectTo: '/' },
  { path: 'auth/callback', component: AuthCallbackComponent },
  { path: 'listing-list', component: Listings },
  { path: 'listing-form', component: ListingForm },
  { path: 'listing-list/:id', component: ListingDetailsComponent },
  { path: 'user-list', component: Users },
  { path: 'user-form', component: UserForm },
  { path: 'user-list/:id', component: UserDetailsComponent },
];
