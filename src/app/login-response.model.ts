export interface LoginResponse {
  id: number;
  dni: string;
  rol: string;
  nombreUsuario: string;
  idPaciente?: number | null;
  idMedico?: number | null; // 
}
