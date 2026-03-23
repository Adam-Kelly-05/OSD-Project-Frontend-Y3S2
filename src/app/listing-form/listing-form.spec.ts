import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { of } from 'rxjs';

import { ListingForm } from './listing-form';
import { ListingService } from '../listings/listing.service';

describe('ListingForm', () => {
  let component: ListingForm;
  let fixture: ComponentFixture<ListingForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListingForm],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        {
          provide: ListingService,
          useValue: {
            addListing: jasmine.createSpy('addListing').and.returnValue(of({})),
            updateListing: jasmine.createSpy('updateListing').and.returnValue(of({})),
          },
        },
        {
          provide: OidcSecurityService,
          useValue: {
            userData$: of({ userData: { sub: 'test-user' } }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListingForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
