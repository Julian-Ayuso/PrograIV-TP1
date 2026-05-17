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
  usuarioNombre: any = "";

  async logout() {
    await this.supabase.cerrarSesion();
  }

  async ngOnInit() {
    this.logueado = await this.supabase.logeado();
    this.usuarioNombre = localStorage.getItem('nombreUsuario');
    const { data } = await this.supabase.obtenerDatosUsuario();
    if (data) {
      this.usuarioNombre = localStorage.getItem('nombreUsuario');
    this.cdr.detectChanges()
  }
}
}
