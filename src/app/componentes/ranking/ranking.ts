import { Component, OnInit } from '@angular/core';
import { Supabase } from '../../servicios/supabase';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ranking',
  imports: [CommonModule],
  templateUrl: './ranking.html',
  styleUrl: './ranking.css',
})
export class Ranking implements OnInit {
  constructor(public Servicio: Supabase) {}

  juegoSeleccionado: string = "jueguini";

  ngOnInit() {
    this.Servicio.traerPuntajes("jueguini");
  }

  cargarRanking(tabla: string) {
    this.juegoSeleccionado = tabla;
    this.Servicio.traerPuntajes(tabla);
  }
}