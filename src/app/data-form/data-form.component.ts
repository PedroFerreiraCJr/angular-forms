import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { DropdownService } from './../shared/services/dropdown.service';
import { EstadoBr } from '../shared/models/estado-br.model';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.scss']
})
export class DataFormComponent implements OnInit {

  // variável que representa o formulário
  formulario!: FormGroup;
  estados!: EstadoBr[];

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dropDownService: DropdownService) { }

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

    this.dropDownService.getEstados().subscribe((estados) => {
      this.estados = estados;
      console.log(this.estados);
    });
  }

  public onSubmit(): void {
    if (this.formulario.valid) {
      this.http.post(`enderecoServer/enderecoForm`, JSON.stringify(this.formulario.value)).subscribe((result) => {
        console.log(result);
        this.resetar();
      });
    }
    else {
      this.verificarValidacoesForm(this.formulario);
    }
  }

  private verificarValidacoesForm(form: FormGroup): void {
    Object.keys(form.controls).forEach(campo => {
      const controle = this.formulario.get(campo);
      controle?.markAsDirty();
      if (controle instanceof FormGroup) {
        this.verificarValidacoesForm(controle);
      }
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

  public verificarEmailInvalido(): boolean {
    const fieldEmail = this.formulario.get('email');
    if (fieldEmail?.errors) {
      return fieldEmail.errors['email'] && fieldEmail.touched;
    }
    return false;
  }

  public consultarCEP(): void {
    const cep = this.formulario.get('endereco.cep')?.value?.replace(/\D/g, '');
    if (cep) {
      const validarCEP = /^[0-9]{8}$/;
      if (validarCEP.test(cep)) {
        this.resetarDadosForm();
        this.http.get(`//viacep.com.br/ws/${cep}/json`).subscribe((result) => {
          console.log(result);
          this.popularDadosForm(result);
        });
      }
    }
  }

  private popularDadosForm(dados: any): void {
    this.formulario.patchValue({
      endereco: {
        rua: dados.logradouro,
        complemento: dados.complemento,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    });
  }

  private resetarDadosForm(): void {
    this.formulario.patchValue({
      endereco: {
        rua: null,
        complemento: null,
        bairro: null,
        cidade: null,
        estado: null
      }
    });
  }
}
