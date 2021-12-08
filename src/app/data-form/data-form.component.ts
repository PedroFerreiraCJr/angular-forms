import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl, FormArray, ValidatorFn, ValidationErrors } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { DropdownService } from './../shared/services/dropdown.service';
import { EstadoBr } from '../shared/models/estado-br.model';
import { ConsultaCepService } from './../shared/services/consulta-cep.service';
import { Observable } from 'rxjs';
import { FormValidations } from '../shared/form-validations';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.scss']
})
export class DataFormComponent implements OnInit {

  // variável que representa o formulário
  formulario!: FormGroup;
  //estados!: EstadoBr[];
  estados!: Observable<EstadoBr[]>;   // valores de estados, select de estado com autocomplete
  cargos: any[] = [];         // valores de cargos, exemplo de select com uma única opção de seleção
  tecnologias: any[] = [];    // valores de tecnologias, exemplo de select com multiplas opções de seleção
  newsletterOp: any[] = [];   // valores da newsletter, exemplo de radio button
  
  frameworks = ['Angular 2', 'React', 'Vue', 'Sencha'];

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dropDownService: DropdownService,
    private cepService: ConsultaCepService) { }

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
      }),
      cargo: [null],
      tecnologias: [null],
      newsletter: ['sim'],
      termos: [null, Validators.pattern('true')],  // essa é a forma mais simples de validar um campo do tipo toggle
      frameworks: this.buildFrameworks()
    });

    /*
    this.dropDownService.getEstados().subscribe((estados) => {
      this.estados = estados;
      console.log(this.estados);
    });
    */
   
    this.estados = this.dropDownService.getEstados();

    this.cargos = this.dropDownService.getCargos();

    this.tecnologias = this.dropDownService.getTecnologias();

    this.newsletterOp = this.dropDownService.getNewsletter();
  }

  private buildFrameworks(): FormArray {
    const values = this.frameworks.map(v => new FormControl(false));
    return this.formBuilder.array(values, FormValidations.requiredMinCheckbox(1));
  }

  getControls() {
    return (this.formulario.get('frameworks') as FormArray).controls;
  }

  public onSubmit(): void {
    let valueSubmit = Object.assign({}, this.formulario.value);

    valueSubmit = Object.assign(valueSubmit, {
      frameworks: valueSubmit.map((v: FormControl, i: number) => {
        return v ? this.frameworks[i] : null
      }).filter((v: string) => v !== null)
    });

    if (this.formulario.valid) {
      this.http.post(`enderecoServer/enderecoForm`, JSON.stringify(valueSubmit)).subscribe((result) => {
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
    if (cep != null && cep != '') {
      this.cepService.consultaCep(cep).subscribe((dados) => {
        this.popularDadosForm(dados);
      });
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

  public setarCargo(): void {
    const cargo = { nome: 'Dev', nivel: 'Pleno', desc: 'Dev Pl' };
    this.formulario.get('cargo')?.setValue(cargo);
  }

  public compararCargos(obj1: any, obj2: any): boolean {
    return obj1 && obj2 ? (obj1.nome === obj2.nome && obj1.nivel === obj2.nivel) : obj1 && obj2;
  }

  public setarTecnologias(): void {
    this.formulario.get('tecnologias')?.setValue(['java', 'javascript']);
  }
}
