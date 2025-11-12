import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) {}

  registerPaciente(registro: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrar-paciente`, registro);
  }

  login(credentials: { dni: string, contrasena: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response) {
          localStorage.setItem('authToken', 'true');
          localStorage.setItem('usuario', JSON.stringify(response));
          localStorage.setItem('rol', response.rol);
          localStorage.setItem('nombreUsuario', response.nombreUsuario);
          localStorage.setItem('dni', response.dni);

  const rol = response.rol?.toLowerCase();

if (rol === 'medico' && response.idMedico) {
  localStorage.setItem('medicoId', response.idMedico.toString());
}
if (rol === 'paciente' && response.idPaciente) {
  localStorage.setItem('pacienteId', response.idPaciente.toString());
}

        }
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getUserRole(): string {
    return localStorage.getItem('rol') || '';
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('usuario');
    localStorage.removeItem('rol');
    localStorage.removeItem('pacienteId');
    localStorage.removeItem('medicoId');
    localStorage.removeItem('nombreUsuario');
    
  }

  getUsuarioId(): number {
    const userStr = localStorage.getItem('usuario');
    if (!userStr) return 0;
    const user = JSON.parse(userStr);
    return user?.id || 0;
  }

  getPacienteId(): number | null {
    const pacienteId = localStorage.getItem('pacienteId');
    return pacienteId ? parseInt(pacienteId, 10) : null;
  }

  getMedicoId(): number | null {
    const medicoId = localStorage.getItem('medicoId');
    return medicoId ? parseInt(medicoId, 10) : null;
  }

  getNombreUsuario(): string | null {
    return localStorage.getItem('nombreUsuario');
  }

  registerUsuario(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, usuario);
  }

  registrarPaciente(paciente: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrar-paciente`, paciente);
  }

  registrarMedico(medico: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrar-medico`, medico);
  }

  verificarUsuarioPorDni(dni: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/buscar/${dni}`);
  }

  getIdMedicoPorUsuario(idUsuario: number): Observable<number> {
    return this.http.get<number>(`http://localhost:8080/api/citas/medico/usuario/${idUsuario}`);
  }

  
}
