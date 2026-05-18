import { Component, signal, ViewChild, ElementRef, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Supabase } from '../../servicios/supabase';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class Chat {

  @ViewChild('scrollContenedor') private scroll!: ElementRef;

  mensaje = signal('');
  usuarioActual = localStorage.getItem('nombreUsuario');

  constructor(public chatService: Supabase) {
    effect(() => {
      const disparador = this.chatService.mensajes(); 
      setTimeout(() => {
        this.hacerScroll();
      }, 60);
    });
  }

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

  private hacerScroll(): void {
    try {
      if (this.scroll) {
        const elemento = this.scroll.nativeElement;
        elemento.scrollTop = elemento.scrollHeight;
      }
    } catch (err) {
      console.error('Error al aplicar el scroll down:', err);
    }
  }
}