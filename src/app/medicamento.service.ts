// src/app/medicamento.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Medicamento {
  id: number;
  nombreComercial: string;
  presentacion: string;
  viaAdministrativa: string;
  stock: number;
}

@Injectable({
  providedIn: 'root'
})
export class MedicamentoService {
  private apiUrl = 'http://localhost:8080/api/medicamentos';

  constructor(private http: HttpClient) {}

  getMedicamentos(): Observable<Medicamento[]> {
    return this.http.get<Medicamento[]>(this.apiUrl);
  }
}
