import { Component, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Supabase } from '../../servicios/supabase';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  constructor(private supabase: Supabase, private cdr: ChangeDetectorRef){}

  logueado:boolean = false;

  async logout() {
    await this.supabase.cerrarSesion();
  }

  nombre:string='';

  async ngOnInit() {
    this.logueado = await this.supabase.logeado();
    const { data } = await this.supabase.obtenerDatosUsuario();
    if (data) {
      this.nombre = data[0].nombre;
    this.cdr.detectChanges()
  }
}
}
