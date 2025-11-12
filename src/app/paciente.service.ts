import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private apiUrl = 'http://localhost:8080/api/pacientes'; // Cambia la URL por la de tu backend

  constructor(private http: HttpClient) {}

  obtenerPacientes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  crearPaciente(paciente: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, paciente);
  }

  actualizarPaciente(id: number, paciente: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, paciente);
  }

  eliminarPaciente(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
