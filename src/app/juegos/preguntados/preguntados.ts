import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Supabase } from '../../servicios/supabase';

@Component({
  selector: 'app-preguntados',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './preguntados.html',
  styleUrl: './preguntados.css',
})
export class Preguntados implements OnInit, OnDestroy {

  private apiUrl = 'https://opentdb.com/api.php?amount=10&category=27&difficulty=easy&type=multiple'
  usuarioActual = localStorage.getItem('nombreUsuario');
  preguntas: any[] = [];
  tiempoSegundos = signal(0);
  intervaloTiempo: any;
  preguntasSimplificados: any[] = [];
  opciones: string[] = [];
  numPregunta: number = 0;
  aciertos: number = 0;
  errores: number = 0;
  maxErrores: number = 3;
  juegoTerminado: boolean = false;
  preguntaActual: any;


  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, public rankingService: Supabase) {}

  ngOnInit() {
  this.http.get<any>(this.apiUrl).subscribe({
    next: (res) => {
      this.preguntas = res.results;
      this.iniciarJuego();
      this.cdr.detectChanges();
    },
    error: (err) => console.error(err)
  });
  }

  ngOnDestroy() {
    this.juegoTerminado = false;
    this.detenerTemporizador();
    this.preguntaActual = true;
  }

  iniciarJuego() {
  this.aciertos = 0;
  this.errores = 0;
  this.numPregunta = 0;
  this.juegoTerminado = false;
  this.tiempoSegundos = signal(0); 
  this.preguntasSimplificados = this.preguntas.map(pregunta => ({
    nombre: pregunta.question,
    correcta: pregunta.correct_answer,
    incorrectas: pregunta.incorrect_answers
  }));
  console.log('Juegos de esta partida:', this.preguntasSimplificados);
  this.iniciarTemporizador();
  this.preguntaJuego();
}

  preguntaJuego() {
    if (this.errores >= this.maxErrores || this.numPregunta >= this.preguntasSimplificados.length) {
      this.finalizarPartida();
      return;
    }
    this.preguntaActual = this.preguntasSimplificados[this.numPregunta];
    this.generarOpciones(this.preguntaActual);
  }

  generarOpciones(preguntaActual: any) {
    console.log(preguntaActual.nombre)
    const correcta = preguntaActual.correcta;
    const incorrectas = preguntaActual.incorrectas;
    this.opciones = [correcta, ...incorrectas].sort(() => 0.5 - Math.random());
  }
  
  verificarRespuesta(opcionSeleccionada: string) {
  if (opcionSeleccionada === this.preguntaActual.correcta) { 
    this.aciertos++;
  } else {
    this.errores++;
  }
  this.numPregunta++;
  this.preguntaJuego();
}

  finalizarPartida() {
    this.juegoTerminado = true;
    this.detenerTemporizador();
    this.guardarEnBaseDatos();
    this.preguntaActual = false;
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
      juego: 'preguntados',
      tiempoEstatico: this.tiempoSegundos(),
      fecha: new Date()
    };
    await this.rankingService.enviarPuntaje(datosPartida.juego, datosPartida.usuario, datosPartida.tiempoEstatico, datosPartida.fecha)
    console.log(datosPartida);
  }
  
}