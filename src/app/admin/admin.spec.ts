import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';

import { Admin } from './admin';
import { ListingService } from '../listings/listing.service';

describe('Admin', () => {
  let component: Admin;
  let fixture: ComponentFixture<Admin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Admin],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: ListingService,
          useValue: {
            getListings: () => of([]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Admin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should return the matched profane word', () => {
    expect(component.containsProfanity('butthead')).toBe('butthead');
  });

  it('should return null for clean text', () => {
    expect(component.containsProfanity('clean words only')).toBeNull();
  });
});
