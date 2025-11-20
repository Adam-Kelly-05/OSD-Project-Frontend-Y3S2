import { Injectable, inject } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { Listing } from './listing.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ListingService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUri}/listings`;

  getListings(): Observable<Listing[]> {
    return this.http.get<Listing[]>(this.apiUrl).pipe(retry(3), catchError(this.handleError));
  }

  getListingById(id: string): Observable<Listing> {
    return this.http.get<Listing>(`${this.apiUrl}/${id}`);
  }

  updateListing(id: string, listing: Listing): Observable<Listing> {
    console.log('subscribing to update/' + id);
    let uri = `${this.apiUrl}/${id}`;
    return this.http.put<Listing>(uri, listing).pipe(catchError(this.handleError));
  }

  deleteListing(id: string) {
    let uri = `${this.apiUrl}/${id}`;
    return this.http.delete<Listing>(uri).pipe(catchError(this.handleError));
  }

  addListing(listing: Listing): Observable<Listing> {
    return this.http.post<Listing>(this.apiUrl, listing).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(`Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
