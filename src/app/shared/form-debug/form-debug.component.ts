import { Component, Input, OnInit } from '@angular/core';
import { NgForm, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-debug',
  templateUrl: './form-debug.component.html',
  styleUrls: ['./form-debug.component.scss']
})
export class FormDebugComponent implements OnInit {

  @Input('form')
  form!: NgForm | FormGroup;

  constructor() { }

  ngOnInit(): void {
  }

}
