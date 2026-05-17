import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-jueguini',
  imports: [CommonModule],
  templateUrl: './jueguini.html',
  styleUrl: './jueguini.css',
})
export class Jueguini {
  // El orden correcto que el jugador debe presionar (Botón 1, Botón 3, Botón 2, Botón 4)
  ORDEN_CORRECTO: number[] = [1, 3, 2, 4];
  
  // Lista donde guardamos los clics que va haciendo el usuario
  pasosJugador: number[] = [];
  
  mensajeEstado: string = 'Presioná los 4 botones en el orden secreto para ganar.';
  juegoTerminado: boolean = false;
  gano: boolean = false;

  presionarBoton(numeroBoton: number) {
    // Si ya terminó el juego, no hace nada al hacer clic
    if (this.juegoTerminado) return;

    // Guardamos el botón que tocó el usuario
    this.pasosJugador.push(numeroBoton);

    // Averiguamos qué paso de la secuencia está completando (0, 1, 2 o 3)
    const indiceActual = this.pasosJugador.length - 1;

    // Comparamos si el botón que tocó es el correcto para ese momento
    if (this.pasosJugador[indiceActual] !== this.ORDEN_CORRECTO[indiceActual]) {
      this.mensajeEstado = '¡Te equivocaste de orden! Intentalo de nuevo.';
      this.juegoTerminado = true;
      this.gano = false;
      return;
    }

    // Si llegó acá, el botón fue correcto. Revisamos si ya completó los 4 pasos
    if (this.pasosJugador.length === this.ORDEN_CORRECTO.length) {
      this.mensajeEstado = '¡Felicidades! Descubriste el orden correcto.';
      this.juegoTerminado = true;
      this.gano = true;
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
}
