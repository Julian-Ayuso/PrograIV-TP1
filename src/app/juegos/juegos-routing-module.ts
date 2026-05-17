import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Ahorcado } from './ahorcado/ahorcado';
import { MayorMenor } from './mayor-menor/mayor-menor';
import { Preguntados } from './preguntados/preguntados';
import { Jueguini } from './jueguini/jueguini';

const routes: Routes = [

  {
    path: 'ahorcado',
    component: Ahorcado
  },
  {
    path: 'mayor-menor',
    component: MayorMenor
  },
  {
    path: 'preguntados',
    component: Preguntados
  },
  {
    path: 'jueguini',
    component: Jueguini
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JuegosRoutingModule {}

