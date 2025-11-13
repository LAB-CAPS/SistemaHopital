import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment'; // importa environment

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private apiUrl = `${environment.apiUrl}/api/pacientes`; // usa environment para backend dinámico

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
