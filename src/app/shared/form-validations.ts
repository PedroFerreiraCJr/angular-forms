import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

export class FormValidations {
  /**
   * 
   * Essa função de validação, valida se determinada quantidade de componentes do tipo FormControl estão selecionados, pois
   * fazem parte de um FormArray de tipos de frameworks.
  */
  public static requiredMinCheckbox(min: number = 1): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control instanceof FormArray) {
        return this.validateFormArray(min, control as FormArray);
      }
      return null;  // caso não haja erro de validação, deve retornar o valor null
    };
  }

  public static cepValidator(control: FormControl): any | null {
    const cep = control.value;
    if (cep && cep !== '') {
      const validarCep = /^[0-9]{8}$/;
      return validarCep.test(cep) ? null : { cepInvalido: true };   // o objeto resultante do erro de validação, tem que ser um objeto, e opcionalmente pode retornar valores truthy
    }
    return null;  // caso não haja erro de validação, deve retornar o valor null
  }

  public static equalsTo(otherField: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!otherField) {
        throw new Error('É necessário informar um campo');
      }

      // validação necessária, pois caso o formulário ainda não esteja pronto, não deve ser
      //feita a validação de iqualdade dos campos
      if (!control.root || !(<FormGroup>control.root).controls) {
        return null;
      }

      const field: AbstractControl | null = (control.root as FormGroup).get(otherField);
      if (!field) {
        throw new Error('É necessário informar um campo válido!');
      }

      if (field.value !== control.value) {
        return { equalsTo: otherField };
      }

      return null;  // caso não haja erro de validação, deve retornar o valor null
    };
  }

  /**
   * 
   * Essa função é complemento da função de validação de quantidade mínima de seleção dos valores de um FormArray.
  */
  private static validateFormArray(min: number = 1, control: FormArray): ValidationErrors | null {
    const totalChecked = control.controls
      .map((v: AbstractControl) => v.value)
      .reduce((total, current) => {
        current ? total++ : total;
        return total;
      }, 0);
    return totalChecked >= min ? null : { requiredMinCheckbox: true };
  }
}
