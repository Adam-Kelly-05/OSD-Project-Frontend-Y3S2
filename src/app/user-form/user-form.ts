import { Component, effect, inject, input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatCard } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../users/user.service';
import { User } from '../users/user.interface';
import { dateInFutureValidator } from '../../validators/dateInFutureValidator';

@Component({
  selector: 'app-user-form',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatError,
    MatCard,
    MatButtonModule,
  ],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserForm {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  user = input<User | undefined>();
  cognitoSubFromAuth = '';

  userForm: FormGroup;

  constructor() {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      phonenumber: [
        '',
        [Validators.required, Validators.minLength(14), Validators.pattern(/^\+353/)],
      ],
      email: [
        { value: '', disabled: true },
        [Validators.required, Validators.email, Validators.maxLength(100)],
      ],
      dob: ['', [Validators.required, dateInFutureValidator()]],
    });

    effect(() => {
      const user = this.user();
      if (user) {
        this.userForm.patchValue({
          name: user.name,
          phonenumber: user.phonenumber,
          email: user.email,
          dob: this.formatDateForInput(user.dob),
        });
      }
    });

    const prefillId = this.route.snapshot.queryParamMap.get('id')?.trim() ?? '';
    const prefillEmail = this.route.snapshot.queryParamMap.get('email')?.trim() ?? '';
    const prefillName = this.route.snapshot.queryParamMap.get('name')?.trim() ?? '';

    if (prefillId) {
      this.cognitoSubFromAuth = prefillId;
    }

    if (!this.user()) {
      this.userForm.patchValue({
        email: prefillEmail || this.userForm.get('email')?.value,
        name: prefillName || this.userForm.get('name')?.value,
      });
    }
  }

  onSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const currentUser = this.user();
    const formValues = this.userForm.getRawValue() as Omit<User, 'dob'> & { dob: string };
    const normalizedValues: User = {
      ...formValues,
      dob: new Date(formValues.dob),
    };

    if (!currentUser || !currentUser.id) {
      this.createNew(normalizedValues);
    } else {
      this.updateExisting(currentUser.id, normalizedValues);
    }
  }

  updateExisting(id: string, updatedValues: User) {
    this.userService.updateUser(id, { ...updatedValues }).subscribe({
      next: () => {
        this.router.navigateByUrl('/user-list');
      },
      error: (err: Error) => {
        console.error(err.message);
      },
    });
  }

  createNew(formValues: User) {
    this.userService.addUser({ ...formValues }).subscribe({
      next: () => {
        this.router.navigateByUrl('/user-list');
      },
      error: (err: Error) => {
        console.error(err.message);
      },
    });
  }

  private formatDateForInput(dateValue?: Date | string | null): string {
    if (!dateValue) {
      return '';
    }
    const parsedDate = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    return Number.isNaN(parsedDate.getTime()) ? '' : parsedDate.toISOString().slice(0, 10);
  }

  get name() {
    return this.userForm.get('name');
  }

  get phonenumber() {
    return this.userForm.get('phonenumber');
  }

  get email() {
    return this.userForm.get('email');
  }

  get dob() {
    return this.userForm.get('dob');
  }
}
