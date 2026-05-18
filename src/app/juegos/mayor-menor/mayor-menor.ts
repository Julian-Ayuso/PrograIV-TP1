import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Supabase } from '../../servicios/supabase';

@Component({
  selector: 'app-mayor-menor',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './mayor-menor.html',
  styleUrl: './mayor-menor.css'
})
export class MayorMenor implements OnInit {

  usuarioActual = localStorage.getItem('nombreUsuario');
  apiUrl = 'https://deckofcardsapi.com';
  deckId: string = '';
  cartaActual: any = null;
  cartaAnterior: any = null;
  cartasAcertadas = 0;
  cartasRestantes = 0;
  juegoTerminado = false;
  resultado: 'GANADO' | 'PERDIDO' | null = null;
  tiempoSegundos = signal(0);
  intervaloTiempo: any;

  private valoresCartas: { [key: string]: number } = {
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
    'JACK': 11,
    'QUEEN': 12,
    'KING': 13,
    'ACE': 14
  };

  constructor(private http: HttpClient,private cdr: ChangeDetectorRef, public rankingService: Supabase) {}

  ngOnInit() {
    this.iniciarJuego();
  }
  
  iniciarJuego() {
    this.cartasAcertadas = 0;
    this.tiempoSegundos = signal(0);
    this.juegoTerminado = false;
    this.resultado = null;
    this.cartaAnterior = null;
    this.cartaActual = null;
    this.http.get<any>(
      `${this.apiUrl}/api/deck/new/shuffle/?deck_count=1`
    ).subscribe({
      next: (res) => {
        console.log('Shuffle:', res);
        this.deckId = res.deck_id;
        this.cartasRestantes = res.remaining;
        this.iniciarTemporizador();
        this.obtenerCartaInicial();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  obtenerCartaInicial() {
    this.http.get<any>(
      `${this.apiUrl}/api/deck/${this.deckId}/draw/?count=1`
    ).subscribe({
      next: (res) => {
        this.cartaActual = res.cards[0];
        this.cartasRestantes = res.remaining;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
      }
    });
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

  apostar(eleccion: 'MAYOR' | 'MENOR') {
    if (this.juegoTerminado || !this.deckId) return;
    this.http.get<any>(
      `${this.apiUrl}/api/deck/${this.deckId}/draw/?count=1`
    ).subscribe({
      next: (res) => {
        this.cartaAnterior = this.cartaActual;
        this.cartaActual = res.cards[0];
        this.cartasRestantes = res.remaining;
        this.verificarEleccion(eleccion);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  verificarEleccion(eleccion: 'MAYOR' | 'MENOR') {
    const valorAnterior = this.valoresCartas[this.cartaAnterior.value];
    const valorActual = this.valoresCartas[this.cartaActual.value];
    const esMayor = valorActual >= valorAnterior;
    const esMenor = valorActual <= valorAnterior;
    if (
      (eleccion === 'MAYOR' && esMayor) ||
      (eleccion === 'MENOR' && esMenor)
    ) {
      this.cartasAcertadas++;
      this.verificarEstadoJuego();
    } else {
      this.finalizarPartida('PERDIDO');
    }
  }

  verificarEstadoJuego() {
    if (this.cartasRestantes === 0) {
      this.finalizarPartida('GANADO');
    }
  }

  finalizarPartida(resultado: 'GANADO' | 'PERDIDO') {
    this.juegoTerminado = true;
    this.resultado = resultado;
    this.detenerTemporizador();
    this.guardarEnBaseDatos();
    this.cdr.detectChanges();
  }

  async guardarEnBaseDatos() {
    const datosPartida = {
      usuario: this.usuarioActual,
      juego: 'Mayor-menor',
      tiempoEstatico: this.tiempoSegundos(),
      fecha: new Date()
    };
    await this.rankingService.enviarPuntaje(datosPartida.juego, datosPartida.usuario, datosPartida.tiempoEstatico, datosPartida.fecha)
    console.log(datosPartida);
  }
}