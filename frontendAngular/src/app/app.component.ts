import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
  isLoggedIn : boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Verifica si el usuario ha iniciado sesión
    this.isLoggedIn = this.authService.isAuthenticated();

    // Escucha eventos de navegación para actualizar el estado de autenticación
    this.router.events.subscribe(() => {
      this.isLoggedIn = this.authService.isAuthenticated();
    });
  }

}
