import { Component, forwardRef, Input } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * 1º O segundo passo que deve ser feito após implementar os métodos da interface ControlValueAccessor
 * é registrar um provider para este campo, isso é feito através da constante que registra um
 * objeto com as propriedades necessárias, que é a constante (INPUT_FIELD_VALUE_ACCESSOR).
 * 2º Essa mesma implementação de registro de componente pode ser utilizada por outras componentes
 * customizados.
 */
const INPUT_FIELD_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputFieldComponent),
  multi: true
};

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss'],
  providers: [INPUT_FIELD_VALUE_ACCESSOR]
})
export class InputFieldComponent implements ControlValueAccessor {

  @Input()
  public classeCSS: any = {};

  @Input()
  public label: string = '';

  @Input()
  public type: string = 'text';

  @Input()
  public control: AbstractControl | null = null;

  @Input()
  public isReadOnly: boolean = false;

  /**
   * 1º Essa implementação não foi apresentada na aula sobre input customizado (ControlValueAcessor).
   * 2º Foi desenvolvida com o objetivo criar id's dos componentes de forma aleatória.
  */
  private _id: string | null = null;

  /**
   * Essa é o atributo que gerencia o valor deste campo de formulário
   */
  private _value: any;

  constructor() { }

  onChangeCb: (_: any) => void = () => { };
  onTouchedCb: (_: any) => void = () => { };

  public get value(): any {
    return this._value;
  }

  public set value(value: any) {
    /**
     * Essa verificação é necessária pois somente quando o valor for diferente é que deve
     * ser feita uma reatribuição de valor para a variável de estado deste campo de formulário.
     * Dessa forma, é possível controlar quando emitir o evento de 'valor mudou' para o Angular.
     */
    if (value !== this._value) {
      this._value = value;
      this.onChangeCb(value);
    }
  }

  public get id(): string {
    return <string>this._id;
    // return this._id as string; forma alternativa de implementar um casting, como acima.
  }

  @Input()
  public set id(value: string) {
    // se parâmetro value inválido, configura id gerado aleatóriamente.
    if (value === '' || value === null) {
      this._id = this.generateRandomID();
      return;
    }

    this._id = value;
  }

  // começo dos métodos da interface ControlValueAccessor
  public writeValue(value: any): void {
    /**
     * Quando o componente receber um novo valor, atribui através do método set de _value
     */
    this.value = value;
  }

  public registerOnChange(fn: any): void {
    /**
     * Essa função vai ser registrada pelo próprio framework do Angular, dessa forma
     * substituíndo o valor antigo configurado lá em cima na definição dos atributos.
     */
    this.onChangeCb = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouchedCb = fn;
  }

  public setDisabledState?(isDisabled: boolean): void {
    this.isReadOnly = isDisabled;
  }
  // fim dos métodos da interface ControlValueAccessor

  private generateRandomID(): string {
    return (Math.random() + 1).toString(36).substring(10);
  }
}
