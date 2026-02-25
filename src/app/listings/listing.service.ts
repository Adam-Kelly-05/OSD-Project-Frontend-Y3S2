import { Injectable, inject } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, of, retry, throwError } from 'rxjs';
import { Listing } from './listing.interface';
import { environment } from '../../environments/environment';

export type ListingView = Listing & { convertedPrice: number };

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
    return this.http.get<Listing>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  updateListing(id: string, listing: Listing): Observable<Listing> {
    const uri = `${this.apiUrl}/${id}`;
    return this.http.put<Listing>(uri, listing).pipe(catchError(this.handleError));
  }

  deleteListing(id: string): Observable<{ message?: string }> {
    const uri = `${this.apiUrl}/${id}`;
    return this.http.delete<{ message?: string }>(uri).pipe(catchError(this.handleError));
  }

  addListing(listing: Listing): Observable<Listing> {
    return this.http.post<Listing>(this.apiUrl, listing).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error && typeof error.error === 'object' && 'message' in error.error) {
      return throwError(() => new Error(String(error.error.message)));
    }
    if (typeof error.error === 'string' && error.error.trim()) {
      return throwError(() => new Error(error.error));
    }
    if (error.status === 0) {
      return throwError(
        () => new Error('Network error. Please check your connection and try again.'),
      );
    }
    return throwError(() => new Error(`Request failed (${error.status}). Please try again.`));
  }

  convertCurrency(amount: number, currency: string): Observable<number> {
    if (currency === 'EUR') {
      return of(amount);
    } else {
      return this.http
        .get<any>(`https://api.frankfurter.app/latest?amount=${amount}&from=EUR&to=${currency}`)
        .pipe(
          map((res) => res.rates[currency]),
          catchError(() => of(amount)),
        );
    }
  }
}
