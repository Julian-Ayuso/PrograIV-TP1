import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';

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


  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
  this.http.get<any>(this.apiUrl).subscribe({
    next: (res) => {
      this.preguntas = res.results; // Guardamos el gran universo de juegos acá
      this.iniciarJuego(); // Recién ahora arrancamos la primera partida
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
  // Reseteamos contadores para la nueva partida
  this.aciertos = 0;
  this.errores = 0;
  this.numPregunta = 0;
  this.juegoTerminado = false;
  this.tiempoSegundos.set(0); 
  // Mezclamos y tomamos 10 a partir de lo que ya tenemos guardado en memoria
  this.preguntasSimplificados = this.preguntas.map(pregunta => ({
    nombre: pregunta.question,
    correcta: pregunta.correct_answer,
    incorrectas: pregunta.incorrect_answers
  }));
  console.log('Juegos de esta partida:', this.preguntasSimplificados);
  // Lanzamos el flujo del juego
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
    // 1. Extraemos la correcta y el array de incorrectas
    console.log(preguntaActual.nombre)
    const correcta = preguntaActual.correcta;
    const incorrectas = preguntaActual.incorrectas;
    // 2. Combinamos todo en un único array
    // 3. Mezclamos el resultado final aleatoriamente
    this.opciones = [correcta, ...incorrectas].sort(() => 0.5 - Math.random());
  }
  
  verificarRespuesta(opcionSeleccionada: string) {
  // CORRECCIÓN: Agregar .correcta para comparar los strings
  if (opcionSeleccionada === this.preguntaActual.correcta) { 
    this.aciertos++;
  } else {
    this.errores++;
  }
  // Avanzar a la siguiente pregunta
  this.numPregunta++;
  this.preguntaJuego();
}

  finalizarPartida() {
    this.juegoTerminado = true;
    this.detenerTemporizador();
    this.preguntaActual = false;
    const datosPartida = {
      usuario: this.usuarioActual,
      juego: 'Pregunta2',
      preguntasAcertadas: this.aciertos,
      totalPreguntas: this.numPregunta,
      tiempoSegundos: this.tiempoSegundos,
      fecha: new Date()
    };
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
}