import { Component, OnInit } from '@angular/core';
import { AbstractControl, NgModel } from '@angular/forms';
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

  public onSubmit(form: any): void {
    console.log(form);
    console.log(this.usuario);
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

  consultarCEP(event: any): void {
    const value = event?.target?.value.replace(/\D/g, '');
    if (value) {
      const validarCEP = /^[0-9]{8}$/;
      if (validarCEP.test(value)) {
        this.http.get(`//viacep.com.br/ws/${value}/json`).subscribe((result) => {
          console.log(result);
        });
      }
    }
  }
}
