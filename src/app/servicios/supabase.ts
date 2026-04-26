import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})

export class Supabase {

  clienteSupabase: SupabaseClient;

  constructor(private router:Router){
    this.clienteSupabase = createClient('https://pgxmilgtmiivkeiesuna.supabase.co','sb_publishable__axgKqVo0XHbVAGY5RUpKQ_qt0KSjCk');
  }

  // AUTH
  registrar(correo: string, clave: string){
    return this.clienteSupabase.auth.signUp({
      email: correo,
      password: clave,
    });
  }

  iniciarSesion(correo: string, clave:string){
    return this.clienteSupabase.auth.signInWithPassword({
      email: correo,
      password: clave,
    });
  }

  // BASE DE DATOS 

  guardarDatosUsuario(correoUsuario: string, usuarioNombre: string, usuarioEdad:number){
    this.clienteSupabase.from('usuariosTabla').insert([
      {email:correoUsuario,nombre: usuarioNombre, edad: usuarioEdad}
    ]).then(({ data, error }) => {
      if(error){
        console.error('Error: ',error.message);
      }else{
        this.router.navigate(['/home']);
      }
    });
  }

  obtenerDatosUsuario(){
    return this.clienteSupabase.from('usuariosTabla').select('*');
  }

}
