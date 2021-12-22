import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormArray, ValidationErrors } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { empty } from 'rxjs';
import { distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';

import { DropdownService } from './../shared/services/dropdown.service';
import { EstadoBr } from '../shared/models/estado-br.model';
import { CidadeBr } from '../shared/models/cidade-br.model';
import { ConsultaCepService } from './../shared/services/consulta-cep.service';
import { FormValidations } from '../shared/form-validations';
import { VerificaEmailService } from './services/verifica-email.service';
import { BaseFormComponent } from '../shared/base-form/base-form.component';


@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.scss']
})
export class DataFormComponent extends BaseFormComponent implements OnInit {

  // variável que representa o formulário
  // formulario!: FormGroup; // variável comentada, pois está herdando de BaseFormComponent
  estados!: EstadoBr[];
  /**
   * Implementação feita na aula sobre combobox aninhado
  */
  cidades!: CidadeBr[]; 
  //estados!: Observable<EstadoBr[]>;   // valores de estados, select de estado com autocomplete
  cargos: any[] = [];         // valores de cargos, exemplo de select com uma única opção de seleção
  tecnologias: any[] = [];    // valores de tecnologias, exemplo de select com multiplas opções de seleção
  newsletterOp: any[] = [];   // valores da newsletter, exemplo de radio button

  frameworks = ['Angular 2', 'React', 'Vue', 'Sencha'];

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dropDownService: DropdownService,
    private cepService: ConsultaCepService,
    private verificaEmailService: VerificaEmailService) {
    super();
  }

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
      nome: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, Validators.email], this.validarEmail.bind(this)],   // o terceiro parâmetro recebe um ou mais validações assícronas
      confirmarEmail: [null, FormValidations.equalsTo('email')],
      endereco: this.formBuilder.group({
        cep: [null, [Validators.required, FormValidations.cepValidator]],
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

    //this.estados = this.dropDownService.getEstados();
    /**
     * Implementação feita na aula sobre combobox aninhado
    */
    this.dropDownService.getEstados().subscribe((estados) => {
      this.estados = estados;
    });

    this.cargos = this.dropDownService.getCargos();
    this.tecnologias = this.dropDownService.getTecnologias();
    this.newsletterOp = this.dropDownService.getNewsletter();
    /*
    this.verificaEmailService.verificarEmail('').subscribe((v) => );
    */

    // forma alternativa de se trabalhar com eventos em formulários reativos
    this.formulario.get('endereco.cep')?.statusChanges
      .pipe(
        distinctUntilChanged(),
        tap(value => console.log('Valor CEP: ', value)),
        switchMap(status => status === 'VALID' ?
          this.cepService.consultaCep(this.formulario.get('endereco.cep')?.value) :
          empty())
      )
      .subscribe(dados => dados ? this.popularDadosForm(dados) : {});
    
    /**
     * Implementação feita na aula sobre combobox aninhado
    */
    this.formulario.get('endereco.estado')?.valueChanges
      .pipe(
        tap((sigla: string) => console.log('novo estado', sigla)),
        map((sigla: string) => this.estados.filter(e => e.sigla === sigla)),
        map((estados: EstadoBr[]) => estados && estados.length > 0 ? estados[0].id : -1),
        tap(console.log), // recebe o id do estado, ou -1
        switchMap((id: number) => this.dropDownService.getCidades(id)),
        tap(console.log)  // lista com as cidades para determinado estado consultado pelo id
      )
      .subscribe(cidades => this.cidades = cidades);
  }

  private buildFrameworks(): FormArray {
    const values = this.frameworks.map(v => new FormControl(false));
    return this.formBuilder.array(values, FormValidations.requiredMinCheckbox(1));
  }

  getControls() {
    return (this.formulario.get('frameworks') as FormArray).controls;
  }

  public submit(): void {
    let valueSubmit = Object.assign({}, this.formulario.value);

    valueSubmit = Object.assign(valueSubmit, {
      frameworks: valueSubmit.frameworks.map((v: FormControl, i: number) => {
        return v ? this.frameworks[i] : null
      }).filter((v: string) => v !== null)
    });

    if (this.formulario.valid) {
      this.http.post(`enderecoServer/enderecoForm`, JSON.stringify(valueSubmit)).subscribe((result) => {
        console.log(result);
        this.resetar();
      });
    }
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

  /**
   * 
   * Função de validação de email usando validação assincrona
  */
  private validarEmail(control: FormControl): ValidationErrors | null {
    return this.verificaEmailService.verificarEmail(control.value).
      pipe(
        map(emailExiste => emailExiste ? { emailInvalido: true } : null)
      );
  }

  /**
   * 
   * Refatoração para aula sobre mensagem de erro centralizada
  */
  public mostrarErroCampoNome(): boolean {
    return (!this.formulario.controls['nome'].valid) && (this.formulario.controls['nome'].touched || this.formulario.controls['nome'].dirty)
  }
}
