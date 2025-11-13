import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment'; // importa environment

@Injectable({
  providedIn: 'root'
})
export class HistorialService {
  private apiUrl = `${environment.apiUrl}/api/historia-clinica`; // usa environment para backend dinámico

  constructor(private http: HttpClient) {}

  obtenerHistorialesPorPacienteId(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/paciente/${id}`);
  }

  actualizarHistoria(historia: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/actualizar/${historia.id}`, historia);
  }

  obtenerHistorialPorDni(dni: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/por-dni/${dni}`);
  }
}
