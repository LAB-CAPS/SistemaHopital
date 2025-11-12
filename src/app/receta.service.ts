import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  especialidad: string; //  Agregado
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
  private apiUrl = 'http://localhost:8080/api/farmacia';

  constructor(private http: HttpClient) {}

  //  Para estructura anterior (una receta por fila)
  obtenerRecetasPorPaciente(idPaciente: number): Observable<Receta[]> {
    return this.http.get<Receta[]>(`${this.apiUrl}/recetas/paciente/${idPaciente}`);
  }

  // Nuevo método para obtener recetas agrupadas por cita
  obtenerRecetasAgrupadasPorPaciente(idPaciente: number): Observable<RecetaAgrupada[]> {
    return this.http.get<RecetaAgrupada[]>(`${this.apiUrl}/recetas/paciente/agrupado/${idPaciente}`);
  }

  obtenerCitasPorMedicoYFecha(idMedico: number, fecha: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/citas/medico/${idMedico}/fecha/${fecha}`);
  }
}
