import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';  // Asegúrate de tener un servicio de autenticación

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true; // Permite la navegación si el usuario está autenticado
    } else {
      this.router.navigate(['/']); // Redirige al login si no está autenticado
      return false;
    }
  }
}
