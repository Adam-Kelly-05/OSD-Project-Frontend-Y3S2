import { Component, inject } from '@angular/core';
import { ListingService } from './listing.service';
import { Observable } from 'rxjs';
import { Listing } from './listing.interface';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-listings',
  imports: [AsyncPipe],
  templateUrl: './listings.html',
  styleUrl: './listings.scss',
})

export class Listings {
  service = inject(ListingService);

  private dataService = inject(ListingService);
  listings$: Observable<Listing[]> = this.service.getListings();

}
