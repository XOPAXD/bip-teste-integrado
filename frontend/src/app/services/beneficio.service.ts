import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Beneficio } from '../models/beneficio.model';
import {HttpClient} from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class BeneficioService {
  private readonly API = 'http://localhost:8080/api/v1/beneficios';

  constructor(private http: HttpClient) {}

  listar(): Observable<Beneficio[]> {
    return this.http.get<Beneficio[]>(this.API);
  }

  salvar(beneficio: Beneficio): Observable<Beneficio> {
    return this.http.post<Beneficio>(this.API, beneficio);
  }

  transferir(from: number, to: number, valor: number): Observable<any> {
    return this.http.post(`${this.API}/transferir`, null, {
      params: { from: from.toString(), to: to.toString(), valor: valor.toString() }
    });
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
