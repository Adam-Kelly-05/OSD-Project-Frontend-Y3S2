import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Listing } from '../listings/listing.interface';

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

  // listingForm = new FormGroup({
  //   _id: new FormControl(""),
  //   title: new FormControl(""),
  //   description: new FormControl(""),
  //   image: new FormControl(""),
  //   price: new FormControl(""),
  //   datePosted: new FormControl(""),

  private fb = new FormBuilder();
  listingForm = this.fb.group({
    _id: [''],
    title: [''],
    description: [''],
    image: [''],
    price: [''],
    datePosted: [''],
  });
}
