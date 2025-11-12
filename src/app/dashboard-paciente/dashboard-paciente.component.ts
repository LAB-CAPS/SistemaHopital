import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HistorialService } from '../historial.service';
import { CitaService } from '../cita.service';
import { MedicoService } from '../medico.service';
import { CitaResponseDTO } from '../cita-response.dto';
import { RecetaService, RecetaAgrupada } from '../receta.service'; // 👈 usa RecetaAgrupada
import { formatDate } from '@angular/common';
import { Cita } from '../cita.model';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-dashboard-paciente',
  templateUrl: './dashboard-paciente.component.html',
  styleUrls: ['./dashboard-paciente.component.css']
})
export class DashboardPacienteComponent implements OnInit {
  seccionActiva: string = 'inicio';
  historialMedico: any[] = [];
  citasPaciente: CitaResponseDTO[] = [];
  medicos: any[] = [];
  recetasPaciente: RecetaAgrupada[] = []; //  nuevo tipo
mostrarMensajeDespacho: boolean = false;
recetasCargadas: boolean = false;
recetasCargando: boolean = false;


  fechaMinima: string = new Date().toISOString().split('T')[0];
  citasActualesMedico: number = 0;
  limiteCitasPorDia: number = 10;
  citasReservadas: CitaResponseDTO[] = [];
  horariosDisponibles: { hora: string; disponible: boolean }[] = [];

  doctorNombre: string = '';
  dniPaciente: string = '';
  idPaciente: number = 0;

  nuevaCita = {
    especialidad: '',
    fecha: '',
    hora: '',
    idPaciente: 0,
    idMedico: 0,
    estado: ''
  };

imagenesCarrusel = [
  'https://res.cloudinary.com/dfinqvmue/image/upload/v1751414529/campaign_BOT%C3%93N-WEB__3__clfqxf.png',
  'https://res.cloudinary.com/dfinqvmue/image/upload/v1751414529/campaign_27B78ED0-506D-4F75-922D-F35EC83902F2_lceypj.png',
  'https://res.cloudinary.com/dfinqvmue/image/upload/v1751414530/campaign_BOT%C3%93N_WEB_rf4zk3.png',
  'https://res.cloudinary.com/dfinqvmue/image/upload/v1751414530/maxresdefault_csalsg.jpg'
];

indiceCarrusel = 0;

  constructor(
    private router: Router,
    private historialService: HistorialService,
    private citaService: CitaService,
    private medicoService: MedicoService,
    private recetaService: RecetaService
  ) {}

  

  ngOnInit(): void {
    this.dniPaciente = localStorage.getItem('dni') || '';
    this.doctorNombre = localStorage.getItem('usuarioNombre') || '';
    this.idPaciente = parseInt(localStorage.getItem('pacienteId') || '0', 10);

    if (!this.dniPaciente || this.idPaciente === 0) {
      alert('Sesión no válida: no se encontró el DNI o ID del paciente.');
      this.router.navigate(['/login']);
      return;
    }

    this.nuevaCita.idPaciente = this.idPaciente;
    this.generarHorarios([]);
    this.cargarHistorial();
    this.obtenerCitas();
    this.cargarMedicos();
  }
siguienteAnuncio(): void {
  if (this.indiceCarrusel < this.imagenesCarrusel.length - 1) {
    this.indiceCarrusel++;
  } else {
    this.indiceCarrusel = 0; // Vuelve al inicio
  }
}

anteriorAnuncio(): void {
  if (this.indiceCarrusel > 0) {
    this.indiceCarrusel--;
  } else {
    this.indiceCarrusel = this.imagenesCarrusel.length - 1; // Va al final
  }
}

  
 mostrarSeccion(seccion: string): void {
  this.seccionActiva = seccion;

  if (seccion === 'historialMedico') {
    this.cargarHistorial();
  }

  if (seccion === 'citas') {
    this.obtenerCitas();
  }

  if (seccion === 'recetas' && !this.recetasCargadas) {
    this.cargarRecetasMedicas();
    this.recetasCargadas = true;
  }
}


  cerrarSesion(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  cargarHistorial(): void {
    this.historialService.obtenerHistorialPorDni(this.dniPaciente).subscribe({
      next: data => this.historialMedico = data,
      error: err => {
        console.error('Error al obtener historial médico:', err);
        alert('No se pudo obtener el historial médico');
      }
    });
  }

  obtenerCitas(): void {
    this.citaService.obtenerCitasPorPaciente(this.idPaciente).subscribe({
      next: data => this.citasPaciente = data,
      error: err => {
        console.error('Error al obtener citas del paciente:', err);
        alert('No se pudieron cargar las citas');
      }
    });
  }

  cargarMedicos(): void {
    this.medicoService.obtenerTodos().subscribe({
      next: data => this.medicos = data,
      error: err => {
        console.error('Error al obtener médicos:', err);
        alert('No se pudieron cargar los médicos');
      }
    });
  }

  actualizarCitasMedicoPorFecha(): void {
    if (!this.nuevaCita.idMedico || !this.nuevaCita.fecha) return;

    this.citaService.obtenerCitasPorMedicoYFecha(this.nuevaCita.idMedico, this.nuevaCita.fecha).subscribe({
      next: (citas: CitaResponseDTO[]) => {
        this.citasReservadas = citas;
        const horasOcupadas = citas.map(c => c.hora.substring(0, 5));
        this.horariosDisponibles = this.generarHorarios(horasOcupadas);
        this.citasActualesMedico = citas.length;
      },
      error: (error) => {
        console.error('Error al obtener citas:', error);
      }
    });
  }

  generarHorarios(horasOcupadas: string[]): { hora: string; disponible: boolean }[] {
    const horarios: { hora: string; disponible: boolean }[] = [];
    const inicio = 7 * 60;
    const fin = 16 * 60;
    const intervalo = 30;

    for (let minutos = inicio; minutos <= fin; minutos += intervalo) {
      const hora = ('0' + Math.floor(minutos / 60)).slice(-2) + ':' + ('0' + (minutos % 60)).slice(-2);
      const disponible = !horasOcupadas.includes(hora);
      if (disponible) horarios.push({ hora, disponible });
      if (horarios.length === 10) break;
    }

    return horarios;
  }

  reservarCita(): void {
    if (!this.nuevaCita.fecha || !this.nuevaCita.hora) {
      alert(" Debes seleccionar fecha y hora.");
      return;
    }

    let horaString = this.nuevaCita.hora;
    if (/^\d{2}:\d{2}$/.test(horaString)) horaString += ':00';
    else if (!/^\d{2}:\d{2}:\d{2}$/.test(horaString)) {
      alert(' Formato de hora inválido.');
      return;
    }

    const [anio, mes, dia] = this.nuevaCita.fecha.split('-').map(Number);
    const [hora, minuto, segundo] = horaString.split(':').map(Number);
    const fechaHoraSeleccionada = new Date(anio, mes - 1, dia, hora, minuto, segundo);
    const ahora = new Date();

    if (fechaHoraSeleccionada.getTime() <= ahora.getTime()) {
      alert(" No puedes seleccionar una fecha u hora pasada.");
      return;
    }

    if (this.citasActualesMedico >= this.limiteCitasPorDia) {
      alert(" Cupos no disponibles para este médico en la fecha seleccionada.");
      return;
    }

    const medicoSeleccionado = this.medicos.find(m => m.id === this.nuevaCita.idMedico);
    const especialidadMedico = medicoSeleccionado ? medicoSeleccionado.especialidad : 'General';

    const citaFormateada = {
      idPaciente: this.idPaciente,
      idMedico: this.nuevaCita.idMedico,
      fecha: this.nuevaCita.fecha,
      hora: horaString,
      especialidad: especialidadMedico,
      estado: this.nuevaCita.estado || 'PENDIENTE'
    };

    this.citaService.reservarCita(citaFormateada).subscribe({
      next: () => {
        alert(' Cita reservada exitosamente');
        const horaSolo = horaString.substring(0, 5);
        this.horariosDisponibles = this.horariosDisponibles.filter(h => h.hora !== horaSolo);
        this.nuevaCita = {
          especialidad: '',
          fecha: '',
          hora: '',
          idPaciente: this.idPaciente,
          idMedico: 0,
          estado: ''
        };
        this.obtenerCitas();
        this.actualizarCitasMedicoPorFecha();
      },
      error: err => {
        console.error('Error al reservar cita:', err);
        if (err.status === 409) {
          alert(" Ya existe una cita para ese médico en esa fecha y hora.");
        } else if (err.status === 400) {
          alert(" Error: Fecha u hora no válida.");
        } else {
          alert(" Error al reservar la cita. Intenta nuevamente.");
        }
      }
    });
  }

 cargarRecetasMedicas(): void {
  let contadorRecargas = parseInt(localStorage.getItem('contadorRecetas') || '0');
  contadorRecargas++;
  localStorage.setItem('contadorRecetas', contadorRecargas.toString());

  this.recetaService.obtenerRecetasAgrupadasPorPaciente(this.idPaciente).subscribe({
    next: data => {
      // Debug para verificar estado real
      console.log('Estados recibidos:', data.map(r => r.estado));

      if (contadorRecargas >= 2) {
        this.recetasPaciente = data.filter(receta =>
          receta.estado?.toString().trim().toUpperCase() !== 'DESPACHADO'
        );
        this.mostrarMensajeDespacho = true;
      } else {
        this.recetasPaciente = data;
        this.mostrarMensajeDespacho = false;
      }

      if (contadorRecargas >= 3) {
        localStorage.setItem('contadorRecetas', '0');
      }
    },
    error: err => {
      console.error('Error al obtener recetas agrupadas:', err);
      alert('No se pudieron cargar las recetas médicas');
    }
  });
}


descargarRecetaPDF(receta: RecetaAgrupada): void {
  const logoUrl = 'https://res.cloudinary.com/dfinqvmue/image/upload/v1751080787/600_lgbjnn.jpg';

  this.convertirImagenABase64(logoUrl).then((logoBase64) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a5'
    });

    const ahora = new Date();
    const fechaHoraImpresion = ahora.toLocaleString();
    const altoPagina = doc.internal.pageSize.getHeight();

    //  CABECERA CON LOGO
    doc.addImage(logoBase64, 'JPEG', 3, 10, 40, 20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('HOSPITAL DE CHANCAY Y SBS', 45, 15);

    doc.setFont('times', 'italic');
    doc.setFontSize(10);
    doc.text('"Dr. Hidalgo Atoche Lopez"', 45, 20);
    doc.setFont('courier', 'normal');
    doc.text('RUC: 20284684827', 45, 25);
    doc.text('Jr. Sucre Nro. S/N, Chancay - Huaral - Lima', 45, 30);
    doc.line(10, 38, 145, 38);

    //  TÍTULO
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(13);
    doc.text('COMPROBANTE DE RECETA MEDICA', 10, 45);

    // DATOS PRINCIPALES
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Paciente:`, 10, 52);
     doc.setFont('courier', 'italic');
    doc.text(`${receta.nombrePaciente}`, 35, 52);

    doc.setFont('helvetica', 'normal');
    doc.text(`Médico:`, 10, 58);
    doc.setFont('courier', 'italic');
    doc.text(`${receta.nombreMedico}`, 35, 58);

    doc.setFont('helvetica', 'normal');
    doc.text(`Especialidad:`, 10, 64);
     doc.setFont('courier', 'italic');
    doc.text(`${receta.especialidad}`, 35, 64);

    doc.setFont('helvetica', 'normal');
    doc.text(`Fecha de la cita:`, 10, 70);
    doc.setFont('courier', 'italic');
    doc.text(`${receta.fechaCita}`, 45, 70);

    //  TABLA DE MEDICAMENTOS
    const bodyMedicamentos = receta.medicamentos.map(m => [
      m.nombre,
      m.presentacion,
      m.cantidad.toString()
    ]);

    autoTable(doc, {
      startY: 78,
      head: [['Medicamento', 'Presentación', 'Cantidad']],
      body: bodyMedicamentos,
      theme: 'striped',
      styles: { fontSize: 9, font: 'helvetica' },
      margin: { left: 10, right: 10 }
    });

    //  NOTA INFORMATIVA
    const finalY = (doc as any).lastAutoTable.finalY || 100;
    doc.setFont('times', 'italic');
    doc.setFontSize(9);
    doc.text('Presente este comprobante en farmacia para recibir su tratamiento.', 10, finalY + 6);

    //  PIE DE PÁGINA
    doc.setFont('courier', 'normal');
    doc.setFontSize(8);
    doc.text(`${fechaHoraImpresion}`, 10, altoPagina - 8);

    const nombreArchivo = `Receta_${receta.nombrePaciente.replace(/\s+/g, '_')}.pdf`;
    doc.save(nombreArchivo);
  });
}



  convertirImagenABase64(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg'));
      };
      img.onerror = reject;
      img.src = url;
    });
  }
}
