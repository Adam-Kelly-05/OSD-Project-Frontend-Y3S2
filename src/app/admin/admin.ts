import { Component, inject } from '@angular/core';
import { ListingService } from '../listings/listing.service';
import { Observable } from 'rxjs';
import { Listing } from '../listings/listing.interface';
import words from 'profane-words';
import { AsyncPipe } from '@angular/common';
import {
  MatCard,
  MatCardTitle,
  MatCardContent,
  MatCardFooter,
  MatCardSubtitle,
} from '@angular/material/card';
import { RouterLink } from '@angular/router';

const profanityWords = new Set(words);

@Component({
  selector: 'app-admin',
  imports: [AsyncPipe, RouterLink, MatCard, MatCardTitle, MatCardContent, MatCardSubtitle],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin {
  dataService = inject(ListingService);
  listings$: Observable<Listing[]> = this.dataService.getListings();

  containsProfanity(string: string): string | null {
    const matchedWord = string
      .toLowerCase()
      .split(' ')
      .find((word) => profanityWords.has(word));

    return matchedWord ?? null;
  }
}
