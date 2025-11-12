import { FilterMedicamentosPipe } from './filter-medicamentos.pipe';

describe('FilterMedicamentosPipe', () => {
  it('create an instance', () => {
    const pipe = new FilterMedicamentosPipe();
    expect(pipe).toBeTruthy();
  });
});
