import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { Supabase } from '../../servicios/supabase';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  correoElectronico = '';
  clave = '';
  mensajeError='';

  constructor(private cdr: ChangeDetectorRef, private router: Router, private supabase: Supabase){}


  async ingresoRapido() {
  const { data, error } = await this.supabase.iniciarSesion(
    'prueba321@prueba.com',
    '123456'
  );
  if (error){
      console.log(this.mensajeError)
    }else{
      await this.supabase.obtenerNombreBase('prueba321@prueba.com');
      this.router.navigate(['/home']);
    }
  }

  async logout() {
    await this.supabase.cerrarSesion();
  }

  async ingresar(){
    const { data, error } = await this.supabase.iniciarSesion(this.correoElectronico,this.clave);

    if (error){
      this.mensajeError = error.message;
      console.error('Error: ',error.message);
    }else{
      await this.supabase.obtenerNombreBase(this.correoElectronico);
      console.log()
      this.router.navigate(['/home']);
    }
  }
}