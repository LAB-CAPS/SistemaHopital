import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment'; // usando environment

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {
  private apiUrl = `${environment.apiUrl}/api/consultas`; // usa environment para backend dinámico

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
