import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medico } from './medico.model';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  private apiUrl = 'http://localhost:8080/api/medicos';

  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<Medico[]> {
    return this.http.get<Medico[]>(this.apiUrl);
  }

 obtenerIdMedicoPorUsuario(idUsuario: number): Observable<{ idMedico: number }> {
  return this.http.get<{ idMedico: number }>(`${this.apiUrl}/usuario/${idUsuario}/id-medico`);
}
  
}
