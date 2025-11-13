import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegistroHistoriaDTO } from './registro-historia.dto';
import { environment } from '../environments/environment'; // ruta usando environment

@Injectable({
  providedIn: 'root'
})
export class HistoriaService {

  private apiUrl = `${environment.apiUrl}/api/historia-clinica`; // usa environment para producción

  constructor(private http: HttpClient) { }

  registrarHistoria(historia: RegistroHistoriaDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrar`, historia);
  }

  obtenerHistorialesPorPacienteId(idPaciente: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/paciente/${idPaciente}`);
  }

  obtenerHistorialPorDni(dni: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/por-dni/${dni}`);
  }

  actualizarHistoria(historia: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/actualizar/${historia.id}`, historia);
  }

  obtenerTodoElHistorial(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/todos`);
  }
}
