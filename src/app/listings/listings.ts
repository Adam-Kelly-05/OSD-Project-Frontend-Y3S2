import { Component, inject } from '@angular/core';
import { ListingService } from './listing.service';
import { Observable } from 'rxjs';
import { Listing } from './listing.interface';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-listings',
  imports: [AsyncPipe, RouterLink, FormsModule],
  templateUrl: './listings.html',
  styleUrl: './listings.scss',
})

export class Listings {
  private dataService = inject(ListingService);
  listings$: Observable<Listing[]> = this.dataService.getListings();
  searchId = '';
}
