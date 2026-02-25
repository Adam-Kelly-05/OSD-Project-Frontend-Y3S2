import { Component, inject } from '@angular/core';
import { ListingService } from './listing.service';
import { Observable, shareReplay } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCard, MatCardTitle, MatCardContent } from '@angular/material/card';
import { ListingSearchState } from '../shared/listing-search.service';
import { CurrencyState } from '../shared/currency.service';
import { Listing } from './listing.interface';

@Component({
  selector: 'app-listings',
  imports: [AsyncPipe, RouterLink, MatCard, MatCardTitle, MatCardContent],
  templateUrl: './listings.html',
  styleUrl: './listings.scss',
})
export class Listings {
  protected dataService = inject(ListingService);
  protected listingSearch = inject(ListingSearchState);
  protected selectedCurrency = inject(CurrencyState);
  private convertedPriceCache = new Map<string, Observable<number>>();

  listings$: Observable<Listing[]> = this.dataService.getListings();

  protected convertedPrice$(listing: Listing): Observable<number> {
    const currency = this.selectedCurrency.currency();
    const key = `${listing._id}${listing.price}-${currency}`;
    if (this.convertedPriceCache.get(key)) {
      return this.convertedPriceCache.get(key)!;
    } else {
      return this.convertedPriceCache
        .set(key, this.dataService.convertCurrency(listing.price, currency).pipe(shareReplay(1)))
        .get(key)!;
    }
  }
}
