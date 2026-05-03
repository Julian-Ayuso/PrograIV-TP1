import { Injectable, signal } from '@angular/core';
import { User } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  user = signal<User | null>(null);

  getUser() {
    const userString = localStorage.getItem('user');
    if (userString){
      return JSON.parse(userString) as User;
    }
    return null;
  }

  register(user:User){
    localStorage.setItem('user', JSON.stringify(user));
    this.user.set(user)
  }

  cerrarSesion(){
    localStorage.removeItem('user');
    this.user.set(null)
  }

  isLoggedIn(){
    return this.user() !==null;
  }

  getUserSignal(){
    return this.user;
  }

  getUserRole(){
    const user = this.getUser();
    return user ? user.role : null;
  }
}
