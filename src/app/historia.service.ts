import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegistroHistoriaDTO } from './registro-historia.dto';

@Injectable({
  providedIn: 'root'
})
export class HistoriaService {

  private apiUrl = 'http://localhost:8080/api/historia-clinica'; // Ruta base correcta

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

  //  Versión corregida: método unificado y correcto
  obtenerTodoElHistorial(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/todos`);
  }
}
