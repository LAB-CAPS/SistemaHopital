export interface CitaResponseDTO {
  id: number;
  fecha: string;
  hora: string;
  especialidad: string;
  estado: string;
  nombreMedico: string;
  nombrePaciente: string;
  dniPaciente: string;
  idPaciente: number; //  <--- Agrega esta propiedad
}