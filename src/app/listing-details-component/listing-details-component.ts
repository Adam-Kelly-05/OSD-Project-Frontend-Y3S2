import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ListingService } from '../listings/listing.service';
import { Listing } from '../listings/listing.interface';
import { Observable } from 'rxjs';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { ListingForm } from '../listing-form/listing-form';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-listing-details-component',
  imports: [
    RouterModule,
    AsyncPipe,
    MatCard,
    MatCardContent,
    MatCardTitle,
    ListingForm,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './listing-details-component.html',
  styleUrl: './listing-details-component.scss',
})
export class ListingDetailsComponent {
  private route = inject(ActivatedRoute);
  private listingService = inject(ListingService);
  private router = inject(Router);
  public dialog = inject(MatDialog);

  id: string = '';
  constructor(private snackBar: MatSnackBar) {}
  listing$: Observable<Listing> | undefined;

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';

    if (this.id) {
      this.listing$ = this.listingService.getListingById(this.id);
    }
  }

  deleteListing() {
    this.openConfirmDeleteDialog();
  }

  openConfirmDeleteDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        title: 'Delete Listing',
        message: 'Are you sure you want to delete a listing',
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean | undefined) => {
      if (result) {
        // User clicked "Yes", perform the delete operation
        this.deleteItem();
      }
    });
  }

  deleteItem(): void {
    if (this.id) {
      this.listingService.deleteListing(this.id).subscribe({
        next: () => {
          this.router.navigateByUrl('/listing-list');
        },
        error: (error: Error) => {
          this.openErrorSnackBar(error.message);
        },
      });
    }
  }

  openErrorSnackBar(message: string): void {
    this.snackBar.open(message, 'Dismiss', {
      duration: 15000, // Set the duration for how long the snackbar should be visible (in milliseconds)
      panelClass: ['error-snackbar'], // You can define custom styles for the snackbar
    });
  }
}
