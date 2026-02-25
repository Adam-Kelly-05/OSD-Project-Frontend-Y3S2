import { AsyncPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ListingService } from '../listings/listing.service';
import { Listing } from '../listings/listing.interface';
import { Observable, combineLatest, of } from 'rxjs';
import { ListingForm } from '../listing-form/listing-form';
import { MapComponent } from '../map/map';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map, shareReplay, take } from 'rxjs/operators';
import { CurrencyState } from '../shared/currency.service';

@Component({
  selector: 'app-listing-details-component',
  imports: [
    RouterModule,
    AsyncPipe,
    DatePipe,
    DecimalPipe,
    ListingForm,
    MapComponent,
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
  private dialog = inject(MatDialog);
  private oidc = inject(OidcSecurityService);
  protected selectedCurrency = inject(CurrencyState);

  id = '';
  constructor(private snackBar: MatSnackBar) {}
  listing$: Observable<Listing> | undefined;
  canEditListing$: Observable<boolean> = of(false);
  private convertedPriceCache = new Map<string, Observable<number>>();

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';

    if (this.id) {
      this.listing$ = this.listingService.getListingById(this.id).pipe(shareReplay(1));
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
      duration: 15000,
      panelClass: ['error-snackbar'],
    });
  }

  protected convertedPrice$(listing: Listing): Observable<number> {
    const currency = this.selectedCurrency.currency();
    const key = `${listing._id}${listing.price}-${currency}`;
    if (this.convertedPriceCache.get(key)) {
      return this.convertedPriceCache.get(key)!;
    } else {
      return this.convertedPriceCache
        .set(key, this.listingService.convertCurrency(listing.price, currency).pipe(shareReplay(1)))
        .get(key)!;
    }
  }

  private extractUserSub(result: unknown): string | undefined {
    if (!result || typeof result !== 'object') {
      return undefined;
    }

    const userDataResult = result as { userData?: { sub?: string }; sub?: string };
    return userDataResult.userData?.sub ?? userDataResult.sub;
  }
}
