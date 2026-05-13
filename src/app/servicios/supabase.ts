import { Injectable, signal } from '@angular/core';
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

  async logeado(){
    const { data, error } = await this.clienteSupabase.auth.getSession();
    console.log(data)
    if (data.session) {
      return true;
    } else {
      return false;
    }
  }

  // AUTH correo, nombre, apellido, edad y contraseña.
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
  guardarDatosUsuario(correoUsuario: string, usuarioNombre: string, usuarioEdad:number, apellido:string, clave:string){
    this.clienteSupabase.from('usuariosTabla').insert([
      {email:correoUsuario,nombre: usuarioNombre, edad: usuarioEdad, apellido, clave}
    ]).then(({ data, error }) => {
      if(error){
        console.error('Error: ',error.message);
      }else{
        localStorage.setItem('nombreUsuario', usuarioNombre);
        this.router.navigate(['/home']);
      }
    });
  }

  obtenerDatosUsuario(){
    return this.clienteSupabase.from('usuariosTabla').select('*');
  }

  async obtenerNombreBase(email: string) {
    const { data, error } = await this.clienteSupabase
      .from('usuariosTabla')
      .select('nombre')
      .eq('email', email)
      .single();

    return localStorage.setItem('nombreUsuario', data?.nombre)
}

  async cerrarSesion() {
  const { error } = await this.clienteSupabase.auth.signOut();
   this.router.navigate(['/home']).then(() => {window.location.reload()})
  if (error) {console.error('Error al cerrar sesión:', error.message);}
}

  mensajes = signal<any[]>([]);

  async traerMensajes() {
    const { data } = await this.clienteSupabase
      .from('mensajes')
      .select('*')
      .order('fecha');
    this.mensajes.set(data || []);
  }

  escucharMensajes() {
    this.clienteSupabase
      .channel('chat-global')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mensajes'
        },
        (payload) => {
          this.mensajes.update(lista => [
            ...lista,
            payload.new
          ]);
        }
      )
      .subscribe();
  }

  async enviarMensaje(usuario: string, mensaje: string) {
    await this.clienteSupabase
      .from('mensajes')
      .insert({
        usuario,
        mensaje
      });
  }
}
