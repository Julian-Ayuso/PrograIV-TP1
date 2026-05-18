import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Supabase } from '../../servicios/supabase';

@Component({
  selector: 'app-jueguini',
  imports: [CommonModule, FormsModule],
  templateUrl: './jueguini.html',
  styleUrl: './jueguini.css',
})
export class Jueguini implements OnInit {
  orden: number[] = [1, 3, 2, 4];
  usuarioActual = localStorage.getItem('nombreUsuario');
  tiempoSegundos = signal(0);
  intervaloTiempo: any;
  pasosJugador: number[] = [];
  mensajeEstado: string = 'Presioná los 4 botones en el orden secreto para ganar.';
  juegoTerminado: boolean = false;
  gano: boolean = false;

  constructor(public rankingService: Supabase) {}

  ngOnInit(){
    this.tiempoSegundos.set(0);
    if (!this.juegoTerminado){
       this.iniciarTemporizador();
    }
  }

  presionarBoton(numeroBoton: number) {
    if (this.juegoTerminado) return;
    this.pasosJugador.push(numeroBoton);
    const indiceActual = this.pasosJugador.length - 1;
    if (this.pasosJugador[indiceActual] !== this.orden[indiceActual]) {
      this.mensajeEstado = '¡Te equivocaste de orden! Intentalo de nuevo.';
      this.juegoTerminado = true;
      this.gano = false;
      this.detenerTemporizador();
      return;
    }
    if (this.pasosJugador.length === this.orden.length) {
      this.mensajeEstado = '¡Felicidades! Descubriste el orden correcto.';
      this.juegoTerminado = true;
      this.gano = true;
      this.guardarEnBaseDatos();
      this.tiempoSegundos.set(0); 
    } else {
      this.mensajeEstado = `¡Bien! Llevás ${this.pasosJugador.length} de 4 pasos correctos.`;
    }
  }

  reiniciarJuego() {
    this.pasosJugador = [];
    this.mensajeEstado = 'Presioná los 4 botones en el orden secreto para ganar.';
    this.juegoTerminado = false;
    this.gano = false;
  }

  iniciarTemporizador() {
    this.detenerTemporizador();
    this.intervaloTiempo = setInterval(() => {
    this.tiempoSegundos.update(v => v + 1);
    }, 1000);
  }

  detenerTemporizador() {
    if (this.intervaloTiempo) {
      clearInterval(this.intervaloTiempo);
    }
  }

  async guardarEnBaseDatos() {
    const datosPartida = {
      usuario: this.usuarioActual,
      juego: 'jueguini',
      tiempoEstatico: this.tiempoSegundos(),
      fecha: new Date()
    };
    await this.rankingService.enviarPuntaje(datosPartida.juego, datosPartida.usuario, datosPartida.tiempoEstatico, datosPartida.fecha)
    console.log(datosPartida);
  }

}
