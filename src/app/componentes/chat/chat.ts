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

  @ViewChild('scrollContenedor') private miScrollContenedor!: ElementRef;

  mensaje = signal('');
  usuarioActual = localStorage.getItem('nombreUsuario');

  constructor(public chatService: Supabase) {
    effect(() => {
      // 1. Vinculamos el efecto al Signal de tus mensajes para que escuche sus cambios.
      // (Asegurate de que en tu servicio se llame 'mensajes', si es una función o propiedad común adaptalo)
      const disparador = this.chatService.mensajes(); 

      // 2. Le damos un micro-retraso con setTimeout para asegurar que el HTML 
      // ya terminó de dibujar el nuevo mensaje antes de calcular el scroll.
      setTimeout(() => {
        this.hacerScrollAlFinal();
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

  private hacerScrollAlFinal(): void {
    try {
      if (this.miScrollContenedor) {
        const elemento = this.miScrollContenedor.nativeElement;
        elemento.scrollTop = elemento.scrollHeight;
      }
    } catch (err) {
      console.error('Error al aplicar el scroll down:', err);
    }
  }
}