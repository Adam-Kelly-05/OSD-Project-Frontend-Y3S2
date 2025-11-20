import { Component, inject } from '@angular/core';
import { ListingService } from './listing.service';
import { Observable } from 'rxjs';
import { Listing } from './listing.interface';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-listings',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './listings.html',
  styleUrl: './listings.scss',
})

export class Listings {
  private dataService = inject(ListingService);
  listings$: Observable<Listing[]> = this.dataService.getListings();
}
