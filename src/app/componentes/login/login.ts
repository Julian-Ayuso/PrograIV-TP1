import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { Supabase } from '../../servicios/supabase';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  correoElectronico = '';
  clave = '';

  constructor(private router: Router, private supabase: Supabase){}

  async ingresoRapido() {
  const { data, error } = await this.supabase.iniciarSesion(
    'prueba321@prueba.com',
    '123456'
  );
  if (error){
      console.error('Error: ',error.message);
    }else{
      this.router.navigate(['/home']);
    }
  }

  async logout() {
    await this.supabase.cerrarSesion();
  }

  async ingresar(){
    const { data, error } = await this.supabase.iniciarSesion(this.correoElectronico,this.clave);

    if (error){
      console.error('Error: ',error.message);
    }else{
      this.router.navigate(['/home']);
    }
  }
}