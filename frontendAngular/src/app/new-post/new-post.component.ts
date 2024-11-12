import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Importar FormsModule para usar two-way binding ngModel
import { Router } from '@angular/router';  // Importar Router para redirigir
import { urlBackend } from '../config';  // Asegúrate de que este archivo contiene la URL del backend
import { AuthService } from '../auth.service';
declare var bootstrap: any;  // Declara Bootstrap como variable global


@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.css'
})
export class NewPostComponent {

  post: { file: any; content: string } = { file: null, content: '' };
  isLoading = false; // Nueva variable para controlar el estado de carga

  constructor(private authService: AuthService, private router: Router) { }

  async savePost() {
    this.isLoading = true;
    const username = this.authService.getUsername();
    const token = this.authService.getToken();

    if (!username || this.post.file == '' || this.post.content == '') {
      this.showWarningToast();
      this.isLoading = false;
      return;
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('content', this.post.content);
    if (this.post.file) {
      formData.append('image', this.post.file); // Asegúrate de que `post.file` sea un objeto File
    }

    try {
      const response = await fetch(`${urlBackend}/api/savepost`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`  // Incluir el token JWT en el encabezado de autorización
        },
        body: formData
      });

      if (response.ok) {
        this.showSuccessToast();
        // Simulación de la llamada al backend con un retraso
        await new Promise((resolve) => setTimeout(resolve, 500));
        // Resetear el formulario después de la publicación
        this.post.file = '';
        this.post.content = '';
        // Redirigir al dashboard después de guardar el post
        this.router.navigate(['/dashboard']);
      } else {
        this.showErrorToast();
      }
    } catch (error) {
      console.error('Error:', error);
      this.showErrorToast();
    } finally {
      this.isLoading = false;
    }

  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.post.file = file;
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
