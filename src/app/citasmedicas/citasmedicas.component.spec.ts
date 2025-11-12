import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitasmedicasComponent } from './citasmedicas.component';

describe('CitasmedicasComponent', () => {
  let component: CitasmedicasComponent;
  let fixture: ComponentFixture<CitasmedicasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitasmedicasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitasmedicasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
