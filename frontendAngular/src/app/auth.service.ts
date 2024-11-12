import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  /*
  BehaviorSubject: Se usa en AuthService para emitir el estado de autenticación actual a los componentes suscritos.
  Suscripciones: AppComponent y NavbarComponent se suscriben a isAuthenticated$ para actualizar isLoggedIn cuando la sesión cambia.
  */
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  // Guardar datos del usuario
  setSession(token: string, username: string, email: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    localStorage.setItem('email', email);
  }

  // Verifica si el usuario está autenticado (por ejemplo, si existe un token en localStorage)
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }


  // Obtener datos del usuario
  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  getEmail(): string | null {
    return localStorage.getItem('email');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Borrar datos de sesión al cerrar sesión
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
  }

  // Comprobar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}
