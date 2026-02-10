import { Component, inject } from '@angular/core';
import { ListingService } from './listing.service';
import { Observable } from 'rxjs';
import { Listing } from './listing.interface';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCard, MatCardTitle, MatCardContent } from '@angular/material/card';

@Component({
  selector: 'app-listings',
  imports: [AsyncPipe, RouterLink, FormsModule, MatCard, MatCardTitle, MatCardContent],
  templateUrl: './listings.html',
  styleUrl: './listings.scss',
})
export class Listings {
  private dataService = inject(ListingService);
  listings$: Observable<Listing[]> = this.dataService.getListings();
  searchId = '';
}
