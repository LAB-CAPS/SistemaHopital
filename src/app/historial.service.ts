import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistorialService {
  private apiUrl = 'http://localhost:8080/api/historial'; // ajusta si es diferente

  constructor(private http: HttpClient) {}

  obtenerHistorialesPorPacienteId(id: number): Observable<any[]> {
  return this.http.get<any[]>(`/api/historia-clinica/paciente/${id}`);
}

actualizarHistoria(historia: any): Observable<any> {
  return this.http.put(`/api/historia-clinica/actualizar/${historia.id}`, historia);
}
obtenerHistorialPorDni(dni: string): Observable<any[]> {
  return this.http.get<any[]>(`http://localhost:8080/api/historia-clinica/por-dni/${dni}`);
}

}
