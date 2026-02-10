import { Component, effect, inject, input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatLabel, MatInput, MatError } from '@angular/material/input';
import { MatCard } from '@angular/material/card';
import { priceValidator } from '../../validators/priceValidator';
import { Listing } from '../listings/listing.interface';
import { ListingService } from '../listings/listing.service';
import { Router } from '@angular/router';

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

  listing = input<Listing | undefined>();

  listingForm: FormGroup;

  constructor() {
    this.listingForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(12)]],
      image: ['', [Validators.required]],
      price: ['', [Validators.required, priceValidator()]],
      posterUser: ['', [Validators.minLength(24), Validators.maxLength(24)]],
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
          posterUser: listing.posterUser,
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

    if (!currentListing || !currentListing._id) {
      this.createNew(normalizedValues);
    } else {
      this.updateExisting(currentListing._id, normalizedValues);
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

  get posterUser() {
    return this.listingForm.get('posterUser');
  }
}
