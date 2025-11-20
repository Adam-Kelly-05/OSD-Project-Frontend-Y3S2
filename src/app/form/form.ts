import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Listing } from '../listings/listing.interface';

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.scss',
})
export class Form {
onSubmit() {
throw new Error('Method not implemented.');
}
  listingTitle = new FormControl('Blue Couch');

  updateListing() {
    this.listingTitle.setValue(this.listingTitle.value + ' is the listing title');
  }

  listingForm = new FormGroup({
    _id: new FormControl(""),
    title: new FormControl(""),
    description: new FormControl(""),
    image: new FormControl(""),
    price: new FormControl(""),
    datePosted: new FormControl(""),
  });
}
