import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { EstadoBr } from '../models/estado-br.model';

@Injectable()
export class DropdownService {

  constructor(
    private http: HttpClient
  ) { }

  public getEstados(): Observable<EstadoBr[]> {
    return this.http.get('assets/estados_br.json') as Observable<EstadoBr[]>;
  }
}
