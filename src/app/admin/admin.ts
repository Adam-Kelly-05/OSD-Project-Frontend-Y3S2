import { Component, inject } from '@angular/core';
import { ListingService } from '../listings/listing.service';
import { Observable } from 'rxjs';
import { Listing } from '../listings/listing.interface';
import words from 'profane-words';
import { AsyncPipe } from '@angular/common';
import { MatCard, MatCardTitle, MatCardContent } from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [AsyncPipe, RouterLink, MatCard, MatCardTitle, MatCardContent],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin {
  protected dataService = inject(ListingService);
  listings$: Observable<Listing[]> = this.dataService.getListings();

  protected containsProfanity(string: string): boolean {
    const lowerString = string.toLowerCase();
    return words.some((word) => lowerString.includes(word));
  }
}
