import { Component, OnInit } from '@angular/core';
import { AbstractControl, NgModel, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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
    private readonly http: HttpClient
  ) { }

  ngOnInit(): void {
  }

  public onSubmit(form: NgForm): void {
    this.http.post(`enderecoServer/enderecoForm`, JSON.stringify(form.value)).subscribe((result) => {
      console.log(result);
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
    const value = event?.target?.value.replace(/\D/g, '');
    if (value) {
      const validarCEP = /^[0-9]{8}$/;
      if (validarCEP.test(value)) {
        this.resetarDadosForm(form);
        this.http.get(`//viacep.com.br/ws/${value}/json`).subscribe((result) => {
          console.log(result);
          this.popularDadosForm(result, form);
        });
      }
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
