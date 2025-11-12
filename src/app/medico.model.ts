export interface Usuario {
  id: number;
  dni: string;
  contrasena: string;
  rol: string;
  nombreUsuario: string;
  nombres: string;
  apellidos: string;
}

export interface Especialidad {
  id: number;
  nombre: string;
}

export interface Medico {
  id: number;
  usuario: Usuario;
  dni: string;
  correo: string;
  telefono: string;
  nombres: string;
  apellidos: string;
  especialidad: String;
  codigoMedico: string;
}
