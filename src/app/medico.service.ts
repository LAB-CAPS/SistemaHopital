import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medico } from './medico.model';
import { environment } from '../environments/environment'; // importa environment

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  private apiUrl = `${environment.apiUrl}/api/medicos`; // usa environment para backend dinámico

  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<Medico[]> {
    return this.http.get<Medico[]>(this.apiUrl);
  }

  obtenerIdMedicoPorUsuario(idUsuario: number): Observable<{ idMedico: number }> {
    return this.http.get<{ idMedico: number }>(`${this.apiUrl}/usuario/${idUsuario}/id-medico`);
  }
}
