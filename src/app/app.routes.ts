import { Routes } from '@angular/router';
import {loginGuard} from './guards/login-guard'

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./componentes/home/home').then(m => m.Home),
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadComponent: () => import('./componentes/home/home').then(m => m.Home),
        canActivate: [loginGuard]
    },
    {
        path: 'login',
        loadComponent: () => import('./componentes/login/login').then(m => m.Login)
    },
    {
        path: 'registro',
        loadComponent: () => import('./componentes/registro/registro').then(m => m.Registro)
    },
    
    {
        path: 'quiensoy',
        loadComponent: () => import('./componentes/quiensoy/quiensoy').then(m => m.Quiensoy),
    },
    {
        path: '**',
        loadComponent: () => import('./componentes/error/error').then(m => m.Error)
    }
];
