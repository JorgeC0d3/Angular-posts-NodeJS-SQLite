import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard'; // Importa el guard

export const routes: Routes = [

    {
        path: '',
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('./login/login.component').then(m => m.LoginComponent),
            },
            {
                path: 'register',
                loadComponent: () =>
                    import('./signup/signup.component').then(m => m.SignupComponent),
            },
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
                canActivate: [AuthGuard], // Agrega el guard de autenticación
            },
            {
                path: 'new-post',
                loadComponent: () =>
                    import('./new-post/new-post.component').then(m => m.NewPostComponent),
                canActivate: [AuthGuard], // Agrega el guard de autenticación
            }

        ]
    },
    {
        path: '**',
        redirectTo: '',
    },


];
