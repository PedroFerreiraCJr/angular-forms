import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

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
      email: [null, [Validators.required, Validators.email]] // o validator de email só está disponível a partir do Angular 4
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
}
