import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Supabase } from '../../servicios/supabase';
import { ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class Chat {

  mensaje = signal('');

  usuarioActual =
    localStorage.getItem('nombreUsuario');

  constructor(public chatService: Supabase, private cdr: ChangeDetectorRef) {}

  async ngOnInit() {

    await this.chatService.traerMensajes();

    this.chatService.escucharMensajes();
  }

  async enviar() {

    if (!this.mensaje().trim()) return;

    await this.chatService.enviarMensaje(
      this.usuarioActual!,
      this.mensaje()
    );

    this.mensaje.set('');
  }
}