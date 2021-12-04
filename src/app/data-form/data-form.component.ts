import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.scss']
})
export class DataFormComponent implements OnInit {

  // variável que representa o formulário
  formulario!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient) { }

  ngOnInit(): void {
    /*
    // forma mais verbosa
    this.formulario = new FormGroup({
      nome: new FormControl(null),
      email: new FormControl(null)
    });
    */

    // forma simplificada de construir os campos do formulário
    this.formulario = this.formBuilder.group({
      nome: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]], // o validator de email só está disponível a partir do Angular 4
      endereco: this.formBuilder.group({
        cep: [null, Validators.required],
        numero: [null, Validators.required],
        complemento: [null],
        rua: [null, Validators.required],
        bairro: [null, Validators.required],
        cidade: [null, Validators.required],
        estado: [null, Validators.required]
      })
    });
  }

  public onSubmit(): void {
    console.log(this.formulario.value);
    this.http.post(`enderecoServer/enderecoForm`, JSON.stringify(this.formulario.value)).subscribe((result) => {
      console.log(result);
      this.resetar();
    });
  }

  public resetar(): void {
    this.formulario.reset();
  }

  aplicarCSSErro(campo: string): any {
    const field: AbstractControl | null = this.formulario.get(campo);
    return {
      'is-invalid': this.fieldInvalidAndTouched(field),
      'is-valid': this.fieldValidAndTouched(field)
    };
  }

  public fieldInvalidAndTouched(field: AbstractControl | string | null): boolean {
    if (field) {
      if (typeof (field) === 'string') {
        return (!this.formulario.get(field)?.valid && this.formulario.get(field)?.touched) || false;
      }
      return (!field?.valid && field?.touched) || false;
    }

    return false;
  }

  public fieldValidAndTouched(field: AbstractControl | string | null): boolean {
    if (field) {
      if (typeof (field) === 'string') {
        return (this.formulario.get(field)?.valid && this.formulario.get(field)?.touched) || false;
      }
      return (field?.valid && field?.touched) || false;
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
}
