import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { LoginResponse } from '../login-response.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  dni: string = '';
  contrasena: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
  const credentials = {
    dni: this.dni,
    contrasena: this.contrasena
  };

  console.log('Enviando credenciales:', credentials);

  this.authService.login(credentials).subscribe({
    next: (response: LoginResponse) => {
      console.log('Respuesta del backend:', response);

      if (!response || typeof response.id !== 'number' || !response.rol) {
        alert('Respuesta inválida del servidor');
        return;
      }

      //  Guardamos el ID real del usuario para todos los roles
      localStorage.setItem('usuarioId', response.id.toString());

      //  Guardamos también los ID específicos si existen
      if (typeof response.idPaciente === 'number') {
        localStorage.setItem('pacienteId', response.idPaciente.toString());
      }

      if (typeof response.idMedico === 'number') {
        localStorage.setItem('medicoId', response.idMedico.toString());
      }

      //  Datos comunes
      localStorage.setItem('authToken', 'true');
      localStorage.setItem('usuarioNombre', response.nombreUsuario ?? '');
      localStorage.setItem('rol', response.rol ?? '');
      localStorage.setItem('dni', response.dni ?? '');

      alert('Inicio de sesión exitoso');

      //  Redirigir según el rol
      switch (response.rol) {
        case 'PACIENTE':
          this.router.navigate(['/dashboard-paciente']);
          break;
        case 'MEDICO':
          this.router.navigate(['/dashboard']);
          break;
        case 'ADMIN':
          this.router.navigate(['/admin-dashboard']);
          break;
        default:
          alert('Rol no reconocido: ' + response.rol);
      }
    },
    error: (error) => {
      console.error('Error en login:', error);
      if (error.status === 401) {
        alert('Credenciales incorrectas');
      } else {
        alert(error.error || 'Error interno del servidor');
      }
    }
  });
}

}
