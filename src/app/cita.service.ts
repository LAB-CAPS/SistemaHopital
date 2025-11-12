import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cita } from './cita.model';
import { CitaResponseDTO } from './cita-response.dto';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private apiUrl = 'http://localhost:8080/api/citas';

  constructor(private http: HttpClient) {}

  reservarCita(cita: any): Observable<Cita> {
    return this.http.post<Cita>(`${this.apiUrl}/reservar`, cita);
  }

  obtenerCitasPorPaciente(idPaciente: number): Observable<CitaResponseDTO[]> {
    return this.http.get<CitaResponseDTO[]>(`${this.apiUrl}/paciente/${idPaciente}`);
  }

  obtenerCitasPorMedico(id: number): Observable<CitaResponseDTO[]> {
    return this.http.get<CitaResponseDTO[]>(`${this.apiUrl}/medico/${id}`);
  }

  getIdMedicoPorUsuario(idUsuario: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/medico/usuario/${idUsuario}`);
  }

  obtenerCitasPorUsuarioId(idUsuario: number): Observable<CitaResponseDTO[]> {
    return this.http.get<CitaResponseDTO[]>(`${this.apiUrl}/medico/usuario/${idUsuario}`);
  }

  actualizarEstadoCita(id: number, estado: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/estado`, null, {
      params: { estado }
    });
  }

  registrarRecetas(idCita: number, recetas: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/${idCita}/recetas`, recetas);
  }

  obtenerCantidadCitasPorMedicoYFecha(idMedico: number, fecha: string): Observable<number> {
  return this.http.get<number>(`http://localhost:8080/api/citas/medico/${idMedico}/fecha/${fecha}/cantidad`);
}

obtenerCitasPorMedicoYFecha(idMedico: number, fecha: string): Observable<CitaResponseDTO[]> {
  return this.http.get<CitaResponseDTO[]>(`${this.apiUrl}/medico/${idMedico}/fecha/${fecha}`);
}

}
