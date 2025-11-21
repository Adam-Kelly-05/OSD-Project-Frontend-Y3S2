import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { ListingService } from "../listings/listing.service";
import { Listing } from "../listings/listing.interface";
import { Observable } from "rxjs";
import { MatCard, MatCardContent, MatCardTitle } from "@angular/material/card";
import { MatFormField } from "@angular/material/input";
import { ListingForm } from "../listing-form/listing-form";

@Component({
  selector: 'app-user-details-component',
  imports: [RouterModule, AsyncPipe, MatCard, MatCardContent, MatCardTitle, ListingForm],
  templateUrl: './listing-details-component.html',
  styleUrl: './listing-details-component.scss',
})
export class ListingDetailsComponent {
  private route = inject(ActivatedRoute);
  private listingService = inject(ListingService);
  private router = inject(Router);

  id: string = '';
  listing$: Observable<Listing> | undefined;

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';

    if (this.id) {
      this.listing$ = this.listingService.getListingById(this.id);
    }
  }

  deleteListing(): void {
    if (this.id) {
      this.listingService.deleteListing(this.id).subscribe({
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
