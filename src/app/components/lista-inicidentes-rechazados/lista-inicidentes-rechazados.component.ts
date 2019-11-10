import { Component, OnInit, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-lista-inicidentes-rechazados',
  templateUrl: './lista-inicidentes-rechazados.component.html',
  styleUrls: ['./lista-inicidentes-rechazados.component.css']
})
export class ListaInicidentesRechazadosComponent implements OnInit {

  @Output() appListaIncidentesRechazados = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }



  cerrarComponente(){
    this.appListaIncidentesRechazados.emit(false);
  }

}
