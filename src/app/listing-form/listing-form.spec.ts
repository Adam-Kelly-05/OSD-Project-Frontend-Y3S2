import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingForm } from './listing-form';

describe('ListingForm', () => {
  let component: ListingForm;
  let fixture: ComponentFixture<ListingForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListingForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListingForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
