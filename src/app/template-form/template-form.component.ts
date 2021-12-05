import { Component, OnInit } from '@angular/core';
import { AbstractControl, NgModel, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { ConsultaCepService } from '../shared/services/consulta-cep.service';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.scss']
})
export class TemplateFormComponent implements OnInit {

  usuario: any = {
    nome: null,
    email: null
  };

  constructor(
    private readonly http: HttpClient,
    private readonly cepService: ConsultaCepService
  ) { }

  ngOnInit(): void {
  }

  public onSubmit(form: NgForm): void {
    this.http.post(`enderecoServer/enderecoForm`, JSON.stringify(form.value)).subscribe((result) => {
      console.log(result);
      form.form.reset();
    });
  }

  public fieldInvalidAndTouched(field: AbstractControl): boolean {
    return !field.valid && field.touched;
  }

  public fieldValidAndTouched(field: AbstractControl): boolean {
    return field.valid && field.touched;
  }

  aplicarCSSErro(model: NgModel): any {
    const field: AbstractControl = model.control;
    return {
      'is-invalid': this.fieldInvalidAndTouched(field),
      'is-valid': this.fieldValidAndTouched(field)
    };
  }

  consultarCEP(event: any, form: NgForm): void {
    const cep = event?.target?.value.replace(/\D/g, '');
    if (cep != null && cep != '') {
      this.cepService.consultaCep(cep).subscribe((dados) => {
        this.popularDadosForm(dados, form);
      });
    }
  }

  popularDadosForm(dados: any, form: NgForm): void {
    // configura campo a campo dos valores do formulário
    form.setValue({
      nome: form.value.nome,
      email: form.value.email,
      endereco: {
        rua: dados.logradouro,
        cep: dados.cep,
        numero: '',
        complemento: dados.complemento,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    });

    form.form.patchValue({
      endereco: {
        rua: dados.logradouro,
        complemento: dados.complemento,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    });
  }

  resetarDadosForm(formulario: NgForm): void {
    formulario.form.patchValue({
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
