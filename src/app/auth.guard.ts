import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const isAuthenticated = this.authService.isLoggedIn();
    const userRole = this.authService.getUserRole(); // Ejemplo: 'PACIENTE' o 'MEDICO'

    if (!isAuthenticated) {
      this.router.navigate(['/login']);
      return false;
    }

    const path = route.routeConfig?.path;

    // Reglas específicas según ruta y rol
    if (path === 'dashboard' && userRole !== 'MEDICO') {
      this.router.navigate(['/no-access']);
      return false;
    }

    if (path === 'dashboard-paciente' && userRole !== 'PACIENTE') {
      this.router.navigate(['/no-access']);
      return false;
    }

    if (path === 'citas' && userRole !== 'PACIENTE') {
      this.router.navigate(['/no-access']);
      return false;
    }

    return true;
  }
}
