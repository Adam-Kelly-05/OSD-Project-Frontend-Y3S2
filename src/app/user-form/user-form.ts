import { Component, effect, inject, input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatLabel, MatInput, MatError } from '@angular/material/input';
import { MatCard } from '@angular/material/card';
import { Router } from '@angular/router';
import { UserService } from '../users/user.service';
import { User } from '../users/user.interface';

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
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserForm {
  private fb = inject(FormBuilder);
  private listingService = inject(UserService);
  private router = inject(Router);

  user = input<User | undefined>();

  userForm: FormGroup;

  constructor() {
    if (this.user()) {
      console.log(this.user()?.name || 'nothing');
    }

    this.userForm = this.fb.group({
    //   _id: [''],
    //   title: ['', [Validators.required]],
    //   description: ['', [Validators.required, Validators.minLength(12)]],
    //   image: ['', [Validators.required, linkValidator()]],
    //   price: ['', [Validators.required, priceValidator()]],
    //   datePosted: [new Date().toDateString(), Validators.required],
    });

    effect(() => {
      const user = this.user();
      if (user) {
        this.userForm.patchValue({
          // _id: user._id ?? '',
          // title: user.title,
          // description: user.description,
          // image: user.image,
          // price: user.price,
          // datePosted: user.datePosted,
        });
      }
    });
  }

  onSubmit() {
    console.log('forms submitted with ');
    console.table(this.userForm.value);

    const currentUser = this.user();
    const formValues = this.userForm.value as User;
    const id = currentUser?._id || formValues._id;

    if (!id) {
      this.createNew(formValues);
    } else {
      this.updateExisting(id, formValues);
    }
  }

  updateExisting(id: string, updatedValues: User) {
    this.listingService.updateUser(id, { ...updatedValues, _id: id }).subscribe({
      next: response => {
        this.router.navigateByUrl('/user-list');
      },
      error: (err: Error) => {
        console.log(err.message);
        // this.message = err
      },
    });
  }

  createNew(formValues: User) {
    this.listingService.addUser({ ...formValues }).subscribe({
      next: response => {
        this.router.navigateByUrl('/user-list');
      },
      error: (err: Error) => {
        console.log(err.message);
        // this.message = err
      },
    });
  }

  get title() {
    return this.userForm.get('title');
  }

  get description() {
    return this.userForm.get('description');
  }

  get image() {
    return this.userForm.get('image');
  }

  get price() {
    return this.userForm.get('price');
  }
}
