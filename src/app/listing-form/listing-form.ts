import { Component, effect, inject, input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatLabel, MatInput, MatError } from '@angular/material/input';
import { MatCard } from '@angular/material/card';
import { priceValidator } from '../../validators/priceValidator';
import { Listing } from '../listings/listing.interface';
import { ListingService } from '../listings/listing.service';
import { Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-listing-form',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatCard,
    MatButtonModule,
  ],
  templateUrl: './listing-form.html',
  styleUrl: './listing-form.scss',
})
export class ListingForm {
  private fb = inject(FormBuilder);
  private listingService = inject(ListingService);
  private router = inject(Router);
  private oidc = inject(OidcSecurityService);

  listing = input<Listing | undefined>();

  listingForm: FormGroup;

  constructor() {
    this.listingForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(12)]],
      image: ['', [Validators.required]],
      price: ['', [Validators.required, priceValidator()]],
      datePosted: [new Date().toISOString(), Validators.required],
    });

    effect(() => {
      const listing = this.listing();
      if (listing) {
        this.listingForm.patchValue({
          title: listing.title,
          description: listing.description,
          image: listing.image,
          price: listing.price,
          datePosted: listing.datePosted,
        });
      }
    });
  }

  onSubmit() {
    if (this.listingForm.invalid) {
      this.listingForm.markAllAsTouched();
      return;
    }

    const currentListing = this.listing();
    const formValues = this.listingForm.value as Listing & { datePosted?: string | Date };
    const normalizedValues: Listing = {
      ...formValues,
      price: Number(formValues.price),
      datePosted: formValues.datePosted ? new Date(formValues.datePosted) : new Date(),
    };

    if (!currentListing || !currentListing.id) {
      this.oidc.userData$.pipe(take(1)).subscribe({
        next: (result) => {
          const userSub = this.extractUserSub(result);
          if (!userSub) {
            console.error('Unable to create listing: authenticated user id (sub) not found.');
            return;
          }
          this.createNew({ ...normalizedValues, posterUser: userSub });
        },
        error: (err: Error) => {
          console.error(err.message);
        },
      });
    } else {
      this.updateExisting(currentListing.id, normalizedValues);
    }
  }

  updateExisting(id: string, updatedValues: Listing) {
    this.listingService.updateListing(id, { ...updatedValues }).subscribe({
      next: () => {
        this.router.navigateByUrl('/listing-list');
      },
      error: (err: Error) => {
        console.error(err.message);
      },
    });
  }

  createNew(formValues: Listing) {
    this.listingService.addListing({ ...formValues }).subscribe({
      next: () => {
        this.router.navigateByUrl('/listing-list');
      },
      error: (err: Error) => {
        console.error(err.message);
      },
    });
  }

  get title() {
    return this.listingForm.get('title');
  }

  get description() {
    return this.listingForm.get('description');
  }

  get image() {
    return this.listingForm.get('image');
  }

  get price() {
    return this.listingForm.get('price');
  }

  private extractUserSub(result: unknown): string | undefined {
    if (!result || typeof result !== 'object') {
      return undefined;
    }

    const userDataResult = result as { userData?: { sub?: string }; sub?: string };
    return userDataResult.userData?.sub ?? userDataResult.sub;
  }
}
