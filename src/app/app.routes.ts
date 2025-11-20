import { Routes } from '@angular/router';
import { Listings } from './listings/listings';
import { Home } from './home/home';
import { Form } from './form/form';
import { ListingDetailsComponent } from './listing-details-component/listing-details-component';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'home', redirectTo: '/'},
    {path: 'listings-list', component: Listings},
    {path: 'form', component: Form},
    {path: 'listing-list/:id', component: ListingDetailsComponent}
];
