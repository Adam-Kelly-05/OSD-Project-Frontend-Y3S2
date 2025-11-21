import { Injectable, inject } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { User } from './user.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUri}/users`;

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(retry(3), catchError(this.handleError));
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  updateUser(id: string, user: User): Observable<User> {
    console.log('subscribing to update/' + id);
    let uri = `${this.apiUrl}/${id}`;
    return this.http.put<User>(uri, user).pipe(catchError(this.handleError));
  }

  deleteUser(id: string) {
    let uri = `${this.apiUrl}/${id}`;
    return this.http.delete<User>(uri).pipe(catchError(this.handleError));
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user).pipe(catchError(this.handleError));
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
