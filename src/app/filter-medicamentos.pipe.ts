import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterMedicamentos'
})
export class FilterMedicamentosPipe implements PipeTransform {
  transform(medicamentos: any[], filtro: string): any[] {
    if (!medicamentos || !Array.isArray(medicamentos)) return [];
    if (!filtro) return medicamentos;

    return medicamentos.filter(m =>
      m.nombreComercial.toLowerCase().includes(filtro.toLowerCase())
    );
  }
}
