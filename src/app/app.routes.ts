// app.routes.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NoAccessComponent } from './no-access/no-access.component';
import { AuthGuard } from './auth.guard';
import { CitasmedicasComponent } from './citasmedicas/citasmedicas.component';
import { DashboardPacienteComponent } from './dashboard-paciente/dashboard-paciente.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'secciones', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'no-access', component: NoAccessComponent },
  { path: 'dashboard-paciente', component: DashboardPacienteComponent ,canActivate: [AuthGuard] },
  { path: 'citas', component: CitasmedicasComponent }, 
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' } 
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
