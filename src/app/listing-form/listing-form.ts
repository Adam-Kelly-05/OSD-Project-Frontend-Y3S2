import { Component, effect, inject, input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { linkValidator } from '../../validators/linkValidator';
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
    if (this.listing()) {
      console.log(this.listing()?.title || 'nothing');
    }

    this.listingForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(12)]],
      image: ['', [Validators.required, linkValidator()]],
      price: ['', [Validators.required, priceValidator()]],
      datePosted: [new Date().toDateString(), Validators.required],
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
    console.log('forms submitted with ');
    console.table(this.listingForm.value);

    const currentListing = this.listing();

    if (!currentListing || !currentListing._id) {
      this.createNew(this.listingForm.value as Listing);
    } else {
      this.updateExisting(currentListing._id, this.listingForm.value as Listing);
    }
  }

  updateExisting(id: string, updatedValues: Listing) {
    this.listingService.updateListing(id, { ...updatedValues }).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/listing-list');
      },
      error: (err: Error) => {
        console.log(err.message);
        // this.message = err
      },
    });
  }

  createNew(formValues: Listing) {
    this.listingService.addListing({ ...formValues }).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/listing-list');
      },
      error: (err: Error) => {
        console.log(err.message);
        // this.message = err
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
}
