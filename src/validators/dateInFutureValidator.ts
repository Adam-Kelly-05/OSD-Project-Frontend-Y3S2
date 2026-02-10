import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateInFutureValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (new Date(value) > new Date()) {
      return { futureDate: true };
    }

    return null;
  };
}
