import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { linkValidator } from '../../validators/linkValidator';

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule],
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
    title: ['', [Validators.required, Validators.minLength(1)]],
    description: ['', [Validators.required, Validators.minLength(12)]],
    image: ['', [Validators.required, linkValidator()]],
    price: ['', [Validators.required, Validators.min(0.01), Validators.max(999999999)]],
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
