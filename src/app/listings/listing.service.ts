import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Listing } from './listing.interface';

@Injectable({
  providedIn: 'root',
})

export class ListingService {

  private http =  inject(HttpClient);

  private apiUrl = 'http://localhost:3000/listings'  // for now - we should read this from an env variable

  getListings(): Observable<Listing[]> {
    return this.http.get<Listing[]>(this.apiUrl)
  } 
}
