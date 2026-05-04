import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Supabase } from '../../servicios/supabase';

@Component({
  selector: 'app-registro',
  imports: [FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})

export class Registro {

  correoElectronico: string;
  clave: string;
  nombre: string = '';
  edad: number = 0;
  apellido: string = '';

  constructor(private router: Router, private supabase: Supabase){
    this.correoElectronico = '';
    this.clave = '';
  }

  async registrarUsuario(){
    const { data, error } = await this.supabase.registrar(this.correoElectronico,this.clave);

    if(error){
      console.error('Error: ', error.message);
    }else{
      console.log('User registrado:', data.user);
      this.supabase.guardarDatosUsuario(this.correoElectronico,this.nombre, this.edad, this.apellido, this.clave);
    }
  }
}

