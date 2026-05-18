import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { Supabase } from '../../servicios/supabase';

@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './ahorcado.html',
  styleUrls: ['./ahorcado.css']
})

export class Ahorcado implements OnInit, OnDestroy {
  usuarioActual = localStorage.getItem('nombreUsuario')
  bancoPalabras: string[] = ['ANGULAR', 'COMPONENTE', 'DIRECTIVA', 'INYECCION', 'TYPESCRIPT'];
  abecedario: string[] = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
  palabraSecreta: string = '';
  palabraOculta: string[] = [];
  letrasUsadas: Set<string> = new Set();
  intentosFallidos: number = 0;
  maxIntentos: number = 6;
  juegoTerminado: boolean = false;
  resultado: 'GANADO' | 'PERDIDO' | null = null;
  contadorLetras: number = 0;
  tiempoSegundos = signal(0)
  intervaloTiempo: any;

  constructor(public rankingService: Supabase) {}

  ngOnInit() {
    this.iniciarJuego();
  }

  ngOnDestroy() {
    this.detenerTemporizador();
  }

  iniciarJuego() {
    this.palabraSecreta = this.bancoPalabras[Math.floor(Math.random() * this.bancoPalabras.length)];
    this.palabraOculta = Array(this.palabraSecreta.length).fill('_');
    this.letrasUsadas.clear();
    this.intentosFallidos = 0;
    this.contadorLetras = 0;
    this.tiempoSegundos = signal(0);
    this.juegoTerminado = false;
    this.resultado = null;
    this.iniciarTemporizador();
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

  seleccionarLetra(letra: string) {
    if (this.letrasUsadas.has(letra) || this.juegoTerminado) return;
    this.letrasUsadas.add(letra);
    this.contadorLetras++;
    if (this.palabraSecreta.includes(letra)) {
      this.revelarLetra(letra);
    } else {
      this.intentosFallidos++;
    }
    this.verificarEstadoJuego();
  }

  revelarLetra(letra: string) {
    for (let i = 0; i < this.palabraSecreta.length; i++) {
      if (this.palabraSecreta[i] === letra) {
        this.palabraOculta[i] = letra;
      }
    }
  }

  verificarEstadoJuego() {
    if (!this.palabraOculta.includes('_')) {
      this.finalizarPartida('GANADO');
    } else if (this.intentosFallidos >= this.maxIntentos) {
      this.finalizarPartida('PERDIDO');
    }
  }

  finalizarPartida(resultado: 'GANADO' | 'PERDIDO') {
    this.juegoTerminado = true;
    this.resultado = resultado;
    this.detenerTemporizador();
    this.guardarEnBaseDatos();
  }

  async guardarEnBaseDatos() {
    const datosPartida = {
      usuario: this.usuarioActual,
      juego: 'ahorcado',
      tiempoEstatico: this.tiempoSegundos(),
      fecha: new Date()
    };
    await this.rankingService.enviarPuntaje(datosPartida.juego, datosPartida.usuario, datosPartida.tiempoEstatico, datosPartida.fecha)
    console.log(datosPartida);
  }
}