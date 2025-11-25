import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../users/user.service';
import { User } from '../users/user.interface';
import { MatCard, MatCardTitle, MatCardContent } from "@angular/material/card";
import { AsyncPipe } from '@angular/common';
import { UserForm } from "../user-form/user-form";
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-details-component',
  imports: [
    MatCard,
    MatCardTitle,
    MatCardContent,
    AsyncPipe,
    UserForm,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './user-details-component.html',
  styleUrl: './user-details-component.scss',
})
export class UserDetailsComponent {
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private router = inject(Router);
  public dialog = inject(MatDialog);

  constructor(private snackBar: MatSnackBar) {}

  id: string = '';
  user$: Observable<User> | undefined;

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';

    if (this.id) {
      this.user$ = this.userService.getUserById(this.id);
    }
  }

  deleteUser() {
    this.openConfirmDeleteDialog();
  }

  openConfirmDeleteDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        title: "Delete User ",
        message: "Are you sure you want to delete a user"
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // User clicked "Yes", perform the delete operation
        this.deleteItem();
      }
    });
  }

  deleteItem(): void {
    if (this.id) {
      this.userService.deleteUser(this.id)
        .subscribe({
          next: response => {
            this.router.navigateByUrl('/user-list')
          },
          error: (message) => {
            this.openErrorSnackBar(message);
          }
        })
    }
  }

  openErrorSnackBar(message: string): void {
    this.snackBar.open(message, 'Dismiss', {
      duration: 15000, // Set the duration for how long the snackbar should be visible (in milliseconds)
      panelClass: ['error-snackbar'], // You can define custom styles for the snackbar
    });
  }
}
