import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {
  private apiUrl = 'http://tu-api.com/api/consultas'; // Cambia la URL por la de tu backend

  constructor(private http: HttpClient) {}

  obtenerConsultas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  crearConsulta(consulta: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, consulta);
  }

  actualizarConsulta(id: number, consulta: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, consulta);
  }

  eliminarConsulta(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
