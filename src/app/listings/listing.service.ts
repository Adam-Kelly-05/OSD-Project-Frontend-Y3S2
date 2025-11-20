import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { Listing } from './listing.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class ListingService {

  private http =  inject(HttpClient);

  private apiUrl = `${environment.apiUri}/listings`;

  getListings(): Observable<Listing[]> {
    return this.http.get<Listing[]>(this.apiUrl).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.status === 404) {
      errorMessage = 'Listing not found (404)';
    } else if (error.status === 500) {
      errorMessage = 'Server error (500). Please try again later.';
    } else if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Network error: ${error.error.message}`;
    }

    console.error('API Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
