import { Injectable, signal } from '@angular/core';

export type CurrencyCode = 'EUR' | 'USD' | 'GBP';

@Injectable({ providedIn: 'root' })
export class CurrencyState {
  currency = signal<CurrencyCode>('EUR');
}
