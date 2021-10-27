import { Component, OnInit } from '@angular/core';
import { AbstractControl, NgModel } from '@angular/forms';

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

  constructor() { }

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
}
