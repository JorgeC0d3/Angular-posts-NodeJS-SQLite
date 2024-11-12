import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Importar FormsModule para usar two-way binding
import { RouterModule, Router } from '@angular/router';
import { urlBackend } from '../config';  // Importa urlBackend desde el archivo de configuración
import { AuthService } from '../auth.service';
declare var bootstrap: any;  // Declara Bootstrap como variable global

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  user: {email: string; password: string } = { email: '', password: '' };  // Variable para almacenar el email y password
  isLoading = false; // Nueva variable para controlar el estado de carga

  constructor(private router: Router, private authService: AuthService) {}

  async loginUser() {

    this.isLoading = true; // Activar estado de carga
    // Simulación de la llamada al backend con un retraso
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (this.user.email == '' || this.user.password == '') {
      this.showWarningToast();
      this.isLoading = false;
      return;
    }

    const response = await fetch(`${urlBackend}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.user)
    })
    console.log(response.status);
    if (response.ok) {

      const data = await response.json();
      // Almacena el token y los datos del usuario en localStorage
      // Almacenar datos de usuario al iniciar sesión
      this.authService.setSession(data.token, data.username, this.user.email);

      //totast
      this.showSuccessToast();  // Llamar a la función para mostrar el toast
      this.user.email = "";
      this.user.password = "";
      
      // Simulación de redirección al dashboard con un retraso de 500ms
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Redirige al usuario a otra página (ej., dashboard)
      this.router.navigate(['/dashboard']);

    } else {
      this.showErrorToast();
    }

    this.isLoading = false; // Desactivar estado de carga

  }


  showSuccessToast() {
    const toastElement = document.getElementById('successToast');
    const toast = new bootstrap.Toast(toastElement!);  // Inicializar el toast de Bootstrap
    toast.show();  // Mostrar el toast
  }

  showErrorToast() {
    const toastElement = document.getElementById('errorToast');
    const toast = new bootstrap.Toast(toastElement!);  // Inicializar el toast de Bootstrap
    toast.show();  // Mostrar el toast
  }

  showWarningToast() {
    const toastElement = document.getElementById('warningToast');
    const toast = new bootstrap.Toast(toastElement!);  // Inicializar el toast de Bootstrap
    toast.show();  // Mostrar el toast
  }

}
