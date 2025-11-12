import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

interface UsuarioBase {
  dni: string;
  contrasena: string;
  nombreUsuario: string;
  nombres: string;
  apellidos: string;
  rol?: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  rolSeleccionado = 'PACIENTE'; // Por defecto solo paciente

  usuarioBase: UsuarioBase = {
    dni: '',
    contrasena: '',
    nombreUsuario: '',
    nombres: '',
    apellidos: '',
    rol: 'PACIENTE'
  };

  datosPaciente = {
    dni: '',
    correo: '',
    telefono: '',
    nombres: '',
    apellidos: '',
    seguro: '',
    contrasena: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  onRegister(): void {
    // Asignar datos del formulario a usuarioBase
    this.usuarioBase.nombreUsuario = `${this.datosPaciente.nombres} ${this.datosPaciente.apellidos}`;
    this.usuarioBase.dni = this.datosPaciente.dni;
    this.usuarioBase.contrasena = this.datosPaciente.contrasena;
    this.usuarioBase.nombres = this.datosPaciente.nombres; 
    this.usuarioBase.apellidos = this.datosPaciente.apellidos; 

    // Registrar usuario base
    this.authService.registerUsuario(this.usuarioBase).subscribe(usuario => {
      const { contrasena, ...pacienteDTO } = this.datosPaciente;
      this.authService.registrarPaciente(pacienteDTO).subscribe(() => {
        alert('Paciente registrado correctamente');
        this.router.navigate(['/login']);
      });
    });
  }
}
