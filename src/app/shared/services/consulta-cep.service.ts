import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultaCepService {

  constructor(
    private readonly http: HttpClient
  ) { }

  public consultaCep(cep: string): Observable<any> {
    cep = cep.replace(/\D/g, '');
    if (cep) {
      const validarCEP = /^[0-9]{8}$/;
      if (validarCEP.test(cep)) {
        return this.http.get(`//viacep.com.br/ws/${cep}/json`);
      }
    }

    return throwError('CEP inválido');
  }
}
