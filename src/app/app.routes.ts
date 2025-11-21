import { Routes } from '@angular/router';
import { Listings } from './listings/listings';
import { Home } from './home/home';
import { ListingForm } from './listing-form/listing-form';
import { ListingDetailsComponent } from './listing-details-component/listing-details-component';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'home', redirectTo: '/'},
    {path: 'listing-list', component: Listings},
    {path: 'listing-form', component: ListingForm},
    {path: 'listing-list/:id', component: ListingDetailsComponent}
];
