import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { EstadoBr } from '../models/estado-br.model';
import { CidadeBr } from '../models/cidade-br.model';

@Injectable()
export class DropdownService {

  constructor(
    private http: HttpClient
  ) { }

  public getEstados(): Observable<EstadoBr[]> {
    return this.http.get('assets/estados_br.json') as Observable<EstadoBr[]>;
  }

  public getCargos(): any[] {
    return [
      { nome: 'Dev', nivel: 'Junior', desc: 'Dev Jr' },
      { nome: 'Dev', nivel: 'Pleno', desc: 'Dev Pl' },
      { nome: 'Dev', nivel: 'Senior', desc: 'Dev Sr' }
    ];
  }

  public getTecnologias(): any[] {
    return [
      { nome: 'java', desc: 'Java' },
      { nome: 'javascript', desc: 'JavaScript' },
      { nome: 'php', desc: 'PHP' },
      { nome: 'ruby', desc: 'Ruby' }
    ];
  }

  public getNewsletter(): any[] {
    return [
      { valor: 'sim', desc: 'Sim' },
      { valor: 'nao', desc: 'Não' }
    ];
  }

  public getCidades(idEstado: number): Observable<CidadeBr[]> {
    return (this.http.get('assets/cidades_br.json') as Observable<CidadeBr[]>)
      .pipe(
        map((cidades: CidadeBr[]) => cidades
          .filter((cidade: CidadeBr) => cidade.estado === idEstado)
        )
      );
  }
}
