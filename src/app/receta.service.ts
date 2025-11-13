import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment'; // importa environment

// Receta simple (una por medicamento)
export interface Receta {
  idMedicamento: number;
  nombrePaciente: string;
  nombreMedico: string;
  medicamento: string;
  presentacion: string;
  cantidad: number;
  fechaCita: string;
  estado: string;
  fechaDespacho?: string;
}

export interface RecetaAgrupada {
  nombrePaciente: string;
  nombreMedico: string;
  especialidad: string; // agregado
  fechaCita: string;
  estado: string;
  medicamentos: {
    nombre: string;
    presentacion: string;
    cantidad: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class RecetaService {
  private apiUrl = `${environment.apiUrl}/api/farmacia`; // usa environment para backend dinámico
  private citasApiUrl = `${environment.apiUrl}/api/citas`; // para consultas de citas

  constructor(private http: HttpClient) {}

  // Para estructura anterior (una receta por fila)
  obtenerRecetasPorPaciente(idPaciente: number): Observable<Receta[]> {
    return this.http.get<Receta[]>(`${this.apiUrl}/recetas/paciente/${idPaciente}`);
  }

  // Nuevo método para obtener recetas agrupadas por cita
  obtenerRecetasAgrupadasPorPaciente(idPaciente: number): Observable<RecetaAgrupada[]> {
    return this.http.get<RecetaAgrupada[]>(`${this.apiUrl}/recetas/paciente/agrupado/${idPaciente}`);
  }

  obtenerCitasPorMedicoYFecha(idMedico: number, fecha: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.citasApiUrl}/medico/${idMedico}/fecha/${fecha}`);
  }
}
