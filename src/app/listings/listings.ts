import { Component, inject } from '@angular/core';
import { ListingService } from './listing.service';
import { Observable } from 'rxjs';
import { Listing } from './listing.interface';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCard, MatCardTitle, MatCardContent } from '@angular/material/card';
import { ListingSearchState } from './listing-search.service';

@Component({
  selector: 'app-listings',
  imports: [AsyncPipe, RouterLink, MatCard, MatCardTitle, MatCardContent],
  templateUrl: './listings.html',
  styleUrl: './listings.scss',
})
export class Listings {
  private dataService = inject(ListingService);
  protected listingSearch = inject(ListingSearchState);
  listings$: Observable<Listing[]> = this.dataService.getListings();
}
