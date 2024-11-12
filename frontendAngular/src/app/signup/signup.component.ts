import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Importar FormsModule para usar two-way binding
import { RouterModule, Router } from '@angular/router';
import { urlBackend } from '../config';  // Importa urlBackend desde el archivo de configuración

declare var bootstrap: any;  // Declara Bootstrap como variable global

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  user: {username: string, email: string; password: string } = { username : '', email: '', password: '' };
  isLoading = false; // Nueva variable para controlar el estado de carga

  constructor(private router: Router) {}

  async signupUser(){
    this.isLoading = true; // Inicia el estado de carga

    if(this.user.username == '' || this.user.email == '' || this.user.password == ''){
      this.isLoading = false;
      this.showWarningToast(); // Mostrar un mensaje de advertencia
      return;
    }

    const response = await fetch(`${urlBackend}/api/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.user)
    })
    console.log(response.status);
    if (response.ok) {
      this.isLoading = false;
      this.showSuccessToast();
      this.user.username = '';
      this.user.email = '';
      this.user.password = '';
    }else{
      this.isLoading = false;
      this.showErrorToast();
    }
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
