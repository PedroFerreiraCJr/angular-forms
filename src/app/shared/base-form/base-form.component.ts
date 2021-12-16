import { AbstractControl, FormArray, FormGroup } from '@angular/forms';

export abstract class BaseFormComponent {

  /**
   * Pesquisei sobre o erro relatado pelo compilador do typescript com relação a variável
   * não inicializada. Cheguei a essa conclusão na resposta encontrada no link:
   * https://cursos.alura.com.br/forum/topico-error-ts2564-property-destino-has-no-initializer-and-is-not-definitely-assigned-in-the-constructor-156237
   */
  formulario!: FormGroup;

  constructor() { }

  protected abstract submit(): void;

  public onSubmit(): void {
    if (this.formulario.valid) {
      this.submit();
    }
    else {
      this.verificarValidacoesForm(this.formulario);
    }
  }

  public verificarValidacoesForm(form: FormGroup | FormArray): void {
    Object.keys(form.controls).forEach(campo => {
      const controle = this.formulario.get(campo);
      controle?.markAsDirty();
      controle?.markAsTouched();
      if (controle instanceof FormGroup || controle instanceof FormArray) {
        this.verificarValidacoesForm(controle);
      }
    });
  }

  public resetar(): void {
    this.formulario.reset();
  }

  public fieldInvalidAndTouched(field: AbstractControl | string | null): boolean {
    if (field) {
      if (typeof (field) === 'string') {
        return !this.formulario.get(field)?.valid && ((this.formulario.get(field)?.touched || false) || (this.formulario.get(field)?.dirty || false));
      }
      return (!field?.valid && (field?.touched || field?.dirty)) || false;
    }

    return false;
  }

  public fieldValidAndTouched(field: AbstractControl | string | null): boolean {
    if (field) {
      if (typeof (field) === 'string') {
        return this.formulario.get(field)?.valid && ((this.formulario.get(field)?.touched || false) || (this.formulario.get(field)?.dirty || false)) || false;
      }
      return (field?.valid && (field?.touched || field?.dirty)) || false;
    }

    return false;
  }


  public verificaRequired(field: AbstractControl | string | null): boolean {
    if (field) {
      if (typeof (field) === 'string') {
        return (this.formulario.get(field)?.hasError('required') || false) && ((this.formulario.get(field)?.touched || false) || (this.formulario.get(field)?.dirty || false));
      }
      return (!field?.valid && (field?.touched || field?.dirty)) || false;
    }

    return false;
  }

  public verificarEmailInvalido(): boolean {
    const fieldEmail = this.formulario.get('email');
    if (fieldEmail?.errors) {
      return fieldEmail.errors['email'] && fieldEmail.touched;
    }
    return false;
  }

  aplicarCSSErro(campo: string): any {
    const field: AbstractControl | null = this.formulario.get(campo);
    return {
      'is-invalid': this.fieldInvalidAndTouched(field) || this.verificaRequired(field),
      'is-valid': this.fieldValidAndTouched(field)
    };
  }
}
