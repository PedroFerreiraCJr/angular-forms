import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from "@angular/forms";

export class FormValidations {
  public static requiredMinCheckbox(min: number = 1): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control instanceof FormArray) {
        return this.validateFormArray(min, control as FormArray);
      }
      return null;
    };
  }

  private static validateFormArray(min: number = 1, control: FormArray): ValidationErrors | null {
    const totalChecked = control.controls
      .map((v: AbstractControl) => v.value)
      .reduce((total, current) => {
        current ? total++ : total;
        return total;
      }, 0);
    console.log(totalChecked);
    return totalChecked >= min ? null : { requiredMinCheckbox: true };
  }
}
