import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router'; // Importa RouterModule para enrutamiento
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppRoutingModule } from './app.routes'; // Tu módulo de enrutamiento
import { AuthService } from './auth.service'; // Ajusta el path si es necesario
import { CitasmedicasComponent } from './citasmedicas/citasmedicas.component';
import { DashboardPacienteComponent } from './dashboard-paciente/dashboard-paciente.component';
import { FilterMedicamentosPipe } from './filter-medicamentos.pipe';

@NgModule({
 declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    CitasmedicasComponent,
    DashboardPacienteComponent,
    FilterMedicamentosPipe 
    
  ],
  imports: [
    BrowserModule,
    FormsModule,      
    HttpClientModule,
    RouterModule,       
    AppRoutingModule ,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class AppModule { }
