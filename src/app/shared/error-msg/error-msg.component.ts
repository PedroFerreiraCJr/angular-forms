import { Component, OnInit, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { FormValidations } from '../form-validations';

@Component({
  selector: 'app-error-msg',
  templateUrl: './error-msg.component.html',
  styleUrls: ['./error-msg.component.scss']
})
export class ErrorMsgComponent implements OnInit {

  @Input()
  label: string | null = null;

  @Input()
  control: AbstractControl | null = null;

  constructor() { }

  ngOnInit(): void {
  }

  public get errorMessage() {
    for (const propertyName in this.control?.errors) {
      if (this.control?.errors.hasOwnProperty(propertyName) &&
        (this.control.touched || this.control.dirty)) {
        return FormValidations.getErrorMsg(this?.label ?? '', propertyName, this.control.errors[propertyName]);
      }
    }

    return null;
  }
}
