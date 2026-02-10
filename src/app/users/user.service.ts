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
    return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  updateUser(id: string, user: User): Observable<User> {
    const uri = `${this.apiUrl}/${id}`;
    return this.http.put<User>(uri, user).pipe(catchError(this.handleError));
  }

  deleteUser(id: string): Observable<{ message?: string }> {
    const uri = `${this.apiUrl}/${id}`;
    return this.http.delete<{ message?: string }>(uri).pipe(catchError(this.handleError));
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user).pipe(catchError(this.handleError));
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
}
