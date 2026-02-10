import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function linkValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value.includes('www.')) {
      return { invalidUrl: true };
    }

    return null;
  };
}
