import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../users/user.service';
import { User } from '../users/user.interface';
import { MatCard, MatCardTitle, MatCardContent } from "@angular/material/card";
import { AsyncPipe } from '@angular/common';
import { UserForm } from "../user-form/user-form";

@Component({
  selector: 'app-user-details-component',
  imports: [MatCard, MatCardTitle, MatCardContent, AsyncPipe, UserForm],
  templateUrl: './user-details-component.html',
  styleUrl: './user-details-component.scss',
})
export class UserDetailsComponent {
  private route = inject(ActivatedRoute);
  private UserService = inject(UserService);
  private router = inject(Router);

  id: string = '';
  user$: Observable<User> | undefined;

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';

    if (this.id) {
      this.user$ = this.UserService.getUserById(this.id);
    }
  }

  deleteUser(): void {
    if (this.id) {
      this.UserService.deleteUser(this.id).subscribe({
        next: (response) => {
          this.router.navigateByUrl('/user-list');
        },
        error: (err: Error) => {
          console.log(err.message);
        },
      });
    }
  }
}
