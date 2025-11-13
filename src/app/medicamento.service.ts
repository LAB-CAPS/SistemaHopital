// src/app/medicamento.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment'; // importa environment

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
  private apiUrl = `${environment.apiUrl}/api/medicamentos`; // usa environment para backend dinámico

  constructor(private http: HttpClient) {}

  getMedicamentos(): Observable<Medicamento[]> {
    return this.http.get<Medicamento[]>(this.apiUrl);
  }
}
