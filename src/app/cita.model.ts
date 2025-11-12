export interface Cita {
  id?: number;
  especialidad: string;
  fecha: string;       // formato: 'YYYY-MM-DD'
  hora: string;        // formato: 'HH:mm'
  idPaciente: number;
  idMedico: number;
  estado?: string; 
  nombreMedico?: string;    // PENDIENTE, ATENDIDA, CANCELADA
}
