import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { linkValidator } from '../../validators/linkValidator';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule, MatFormField, MatLabel, MatInput, MatHint, MatError } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule, MatCard } from '@angular/material/card';
import { priceValidator } from '../../validators/priceValidator';

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatError, MatCard, MatButtonModule],
  templateUrl: './form.html',
  styleUrl: './form.scss',
})
export class Form {
  onSubmit() {
    console.log('forms submitted with ');
    console.table(this.listingForm.value);
  }

  listingTitle = new FormControl('Blue Couch');

  updateListing() {
    this.listingTitle.setValue(this.listingTitle.value + ' is the listing title');
  }

  private fb = inject (FormBuilder);
  listingForm = this.fb.group({
    _id: [''],
    title: ['', [Validators.required]],
    description: ['', [Validators.required, Validators.minLength(12)]],
    image: ['', [Validators.required, linkValidator()]],
    price: ['', [Validators.required, priceValidator()]],
    datePosted: [new Date().toDateString(), Validators.required],
  });

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
