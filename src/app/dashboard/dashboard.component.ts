import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CitaService } from '../cita.service';
import { HistoriaService } from '../historia.service';
import { CitaResponseDTO } from '../cita-response.dto';
import { RegistroHistoriaDTO } from '../registro-historia.dto';
import { MedicamentoService, Medicamento } from '../medicamento.service';
import { MedicoService } from '../medico.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  doctorNombre: string = '';
  doctorId: number = 0;
  usuarioId: number = 0;

  citasAsignadas: CitaResponseDTO[] = [];
  citaSeleccionada: CitaResponseDTO | null = null;

  // Historia clínica
  modoHistorial: boolean = false;
  modoHistorialGlobal: boolean = false;
  historialesPaciente: any[] = [];
  historialGlobal: any[] = [];
  historialSeleccionado: any | null = null;

  diagnostico: string = '';
  notas: string = '';

  // Medicamentos
  medicamentosDisponibles: Medicamento[] = [];
  medicamentosSeleccionados: Medicamento[] = [];
  medicamentosConCantidad: { [id: number]: number } = {};
  filtroMedicamento: string = '';

  // Búsqueda por DNI
  dniFiltro: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private citaService: CitaService,
    private historiaService: HistoriaService,
    private medicamentoService: MedicamentoService,
    private medicoService: MedicoService
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.doctorNombre = this.authService.getNombreUsuario() || 'Doctor';
    this.usuarioId = this.authService.getUsuarioId(); // ✅ El ID del usuario logueado (no el ID del médico)

    console.log("🧪 ID de usuario real:", this.usuarioId);

    // Primero obtener el ID del médico
    this.medicoService.obtenerIdMedicoPorUsuario(this.usuarioId).subscribe({
      next: (resp) => {
        this.doctorId = resp.idMedico;
        console.log("🧪 ID de médico obtenido:", this.doctorId);

        // ✅ Luego de tener el ID del médico, cargamos las citas usando el ID de usuario
        this.cargarCitasAsignadas();
        this.obtenerMedicamentos();
      },
      error: err => {
        console.error('Error al obtener ID del médico:', err);
        alert('No se pudo obtener el ID del médico');
      }
    });
  }

  cargarCitasAsignadas(): void {
    // ✅ Este método espera el ID del USUARIO, no del médico
    this.citaService.obtenerCitasPorUsuarioId(this.usuarioId).subscribe({
      next: data => this.citasAsignadas = data,
      error: err => {
        console.error('Error al cargar citas del médico:', err);
        alert("No se pudieron cargar las citas.");
      }
    });
  }

  obtenerMedicamentos(): void {
    this.medicamentoService.getMedicamentos().subscribe({
      next: data => this.medicamentosDisponibles = data,
      error: err => console.error('Error al obtener medicamentos:', err)
    });
  }

  get medicamentosDisponiblesFiltrados(): Medicamento[] {
    if (!this.filtroMedicamento.trim()) return this.medicamentosDisponibles;
    return this.medicamentosDisponibles.filter(m =>
      m.nombreComercial.toLowerCase().includes(this.filtroMedicamento.toLowerCase())
    );
  }

  medicamentoEstaSeleccionado(med: Medicamento): boolean {
    return this.medicamentosSeleccionados.some(m => m.id === med.id);
  }

  toggleMedicamentoSeleccionado(med: Medicamento): void {
    const index = this.medicamentosSeleccionados.findIndex(m => m.id === med.id);
    if (index >= 0) {
      this.medicamentosSeleccionados.splice(index, 1);
      delete this.medicamentosConCantidad[med.id];
    } else {
      this.medicamentosSeleccionados.push(med);
      this.medicamentosConCantidad[med.id] = 1;
    }
  }

  atenderCita(cita: CitaResponseDTO): void {
    this.citaSeleccionada = cita;
    this.modoHistorial = false;
    this.modoHistorialGlobal = false;
    this.diagnostico = '';
    this.notas = '';
    this.medicamentosSeleccionados = [];
  }

  cancelarAtencion(): void {
    this.citaSeleccionada = null;
    this.modoHistorial = false;
    this.modoHistorialGlobal = false;
    this.historialSeleccionado = null;
  }

  registrarAtencion(): void {
    const cita = this.citaSeleccionada;
    if (!cita) return;

    const historia: RegistroHistoriaDTO = {
      dniPaciente: cita.dniPaciente,
      idMedico: this.doctorId,
      diagnostico: this.diagnostico,
      notas: this.notas,
      medicamentos: this.medicamentosSeleccionados.map(m => m.nombreComercial).join(', ')
    };

    this.historiaService.registrarHistoria(historia).subscribe({
      next: () => {
        const recetas = this.medicamentosSeleccionados.map(med => ({
          idMedicamento: med.id,
          cantidad: this.medicamentosConCantidad[med.id] || 1
        }));

        this.citaService.registrarRecetas(cita.id!, recetas).subscribe({
          next: () => {
            this.citaService.actualizarEstadoCita(cita.id!, 'ATENDIDA').subscribe({
              next: () => {
                cita.estado = 'ATENDIDA';
                this.cargarCitasAsignadas();
                this.cancelarAtencion();
              },
              error: err => {
                console.error('Error al actualizar estado de cita', err);
                alert("No se pudo actualizar el estado de la cita.");
              }
            });
          },
          error: err => {
            console.error('Error al registrar recetas médicas', err);
            alert("No se pudieron registrar las recetas médicas.");
          }
        });
      },
      error: err => {
        console.error('Error al registrar historia clínica', err);
        alert("Error al registrar historia clínica.");
      }
    });
  }

  verHistorialDeCita(cita: CitaResponseDTO): void {
    this.citaSeleccionada = cita;
    this.modoHistorial = true;
    this.modoHistorialGlobal = false;
    this.historialSeleccionado = null;

    if (cita.idPaciente) {
      this.cargarHistorialesPorPaciente(cita.idPaciente);
    }
  }

  cargarHistorialesPorPaciente(idPaciente: number): void {
    this.historiaService.obtenerHistorialesPorPacienteId(idPaciente).subscribe({
      next: data => this.historialesPaciente = data,
      error: err => console.error('Error al obtener historial médico del paciente', err)
    });
  }

  editarHistorial(historia: any): void {
    this.historialSeleccionado = { ...historia };
  }

  guardarCambiosHistorial(): void {
    if (!this.historialSeleccionado) return;

    this.historiaService.actualizarHistoria(this.historialSeleccionado).subscribe({
      next: () => {
        alert("Historia actualizada correctamente");
        this.historialSeleccionado = null;
        if (this.citaSeleccionada?.idPaciente) {
          this.cargarHistorialesPorPaciente(this.citaSeleccionada.idPaciente);
        }
      },
      error: err => {
        console.error("Error al actualizar historia clínica", err);
        alert("No se pudo actualizar la historia clínica.");
      }
    });
  }

  cargarHistorialGlobal(): void {
    this.modoHistorialGlobal = true;
    this.modoHistorial = false;
    this.citaSeleccionada = null;

    this.historiaService.obtenerTodoElHistorial().subscribe({
      next: data => this.historialGlobal = data,
      error: err => {
        console.error('Error al obtener historial global', err);
        alert('No se pudo cargar el historial médico global.');
      }
    });
  }

  buscarHistorialPorDni(): void {
    if (!this.dniFiltro.trim()) {
      alert("Ingrese un DNI válido");
      return;
    }

    this.modoHistorialGlobal = true;
    this.modoHistorial = false;
    this.citaSeleccionada = null;

    this.historiaService.obtenerHistorialPorDni(this.dniFiltro.trim()).subscribe({
      next: data => this.historialGlobal = data,
      error: err => {
        console.error('Error al buscar historial por DNI:', err);
        alert('No se encontró historial para el DNI ingresado.');
        this.historialGlobal = [];
      }
    });
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  retroceder(): void {
    this.router.navigate(['/dashboard']);
  }
}
