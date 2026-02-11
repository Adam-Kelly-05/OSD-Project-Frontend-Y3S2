import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ListingService } from '../listings/listing.service';
import { Listing } from '../listings/listing.interface';
import { Observable, combineLatest, of } from 'rxjs';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { ListingForm } from '../listing-form/listing-form';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-listing-details-component',
  imports: [
    RouterModule,
    AsyncPipe,
    DatePipe,
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
  private oidc = inject(OidcSecurityService);

  id: string = '';
  constructor(private snackBar: MatSnackBar) {}
  listing$: Observable<Listing> | undefined;
  canEditListing$: Observable<boolean> = of(false);

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';

    if (this.id) {
      this.listing$ = this.listingService.getListingById(this.id);
      this.canEditListing$ = combineLatest([this.listing$, this.oidc.userData$]).pipe(
        map(([listing, userDataResult]) => {
          const userSub = this.extractUserSub(userDataResult);
          return Boolean(userSub && listing.posterUser && listing.posterUser === userSub);
        }),
      );
    }
  }

  deleteListing() {
    this.canEditListing$.pipe(take(1)).subscribe((canEditListing) => {
      if (!canEditListing) {
        this.openErrorSnackBar('You can only delete listings that you created.');
        return;
      }
      this.openConfirmDeleteDialog();
    });
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
    this.canEditListing$.pipe(take(1)).subscribe((canEditListing) => {
      if (!canEditListing) {
        this.openErrorSnackBar('You can only delete listings that you created.');
        return;
      }

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
    });
  }

  openErrorSnackBar(message: string): void {
    this.snackBar.open(message, 'Dismiss', {
      duration: 15000, // Set the duration for how long the snackbar should be visible (in milliseconds)
      panelClass: ['error-snackbar'], // You can define custom styles for the snackbar
    });
  }

  private extractUserSub(result: unknown): string | undefined {
    if (!result || typeof result !== 'object') {
      return undefined;
    }

    const userDataResult = result as { userData?: { sub?: string }; sub?: string };
    return userDataResult.userData?.sub ?? userDataResult.sub;
  }
}
