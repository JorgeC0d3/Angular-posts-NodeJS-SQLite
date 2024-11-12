import { Component, OnInit } from '@angular/core';
import { urlBackend } from '../config';
import { AuthService } from '../auth.service';
import { PostCardComponent } from '../post-card/post-card.component';
declare var bootstrap: any;  // Declara Bootstrap como variable global

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [PostCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  posts: any[] = [];
  url = urlBackend;
  username: string | null = '';  // Inicializa con un tipo null para verificar si no hay usuario

  constructor(private authService: AuthService) { }

  async getPosts(){
    const response = await fetch(`${urlBackend}/api/posts`);
    const data = await response.json();
    this.posts = data;
    console.log(this.posts);
  }

  async deletePost(postId: string){
    try {
      const token = this.authService.getToken();
      const response = await fetch(`${urlBackend}/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        this.posts = this.posts.filter(post => post.id !== postId);  // Eliminar el post de la lista local
        console.log('Post deleted successfully');
        this.showSuccessToast(); 
      } else {
        console.error('Failed to delete post');
        this.showErrorToast();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      this.showErrorToast();
    }
  }

  ngOnInit(): void {
    this.getPosts();
    this.username = this.authService.getUsername();
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

}
