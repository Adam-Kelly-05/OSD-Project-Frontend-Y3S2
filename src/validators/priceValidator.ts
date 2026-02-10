import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function priceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value < 0 || value > 1000000000) {
      return { invalidPrice: true };
    }

    return null;
  };
}
