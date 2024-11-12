import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  @Input() isLoggedIn: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Suscríbete a los cambios de autenticación
    this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
      this.isLoggedIn = isAuthenticated;
    });
  }

  logout() {
    this.authService.logout();  // Llama al método de logout en AuthService para limpiar la sesión
    this.isLoggedIn = false;    // Actualiza el estado de autenticación
    this.router.navigate(['/']);  // Redirige al usuario a la página de inicio de sesión
  }

}
