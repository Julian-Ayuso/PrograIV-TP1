import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GithubService } from '../../servicios/github';

@Component({
  selector: 'app-quiensoy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiensoy.html',
})
export class Quiensoy {

  usuario: any;
  username: string = 'Julian-Ayuso';
  constructor(
    private githubService: GithubService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.buscarUsuario();
  }

  buscarUsuario() {
    this.githubService.getUser(this.username)
      .subscribe(data => {
        this.usuario = data;
        this.cdr.detectChanges();
      });
}
}