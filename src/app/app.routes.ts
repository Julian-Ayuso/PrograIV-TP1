import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./componentes/home/home').then(m => m.Home),
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadComponent: () => import('./componentes/home/home').then(m => m.Home),
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
        path: 'chat',
        loadComponent: () => import('./componentes/chat/chat').then(m => m.Chat)
    },
    {
        path: 'quiensoy',
        loadComponent: () => import('./componentes/quiensoy/quiensoy').then(m => m.Quiensoy),
    },
    {
        path: 'ranking',
        loadComponent: () => import('./componentes/ranking/ranking').then(m => m.Ranking),
    },
    {
        path: 'juegos',
        loadChildren: () =>
            import('./juegos/juegos-module')
            .then(m => m.JuegosModule)
    },
    {
        path: '**',
        loadComponent: () => import('./componentes/error/error').then(m => m.Error)
    }
];
