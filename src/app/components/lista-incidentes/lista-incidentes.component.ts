import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { ProviderService } from 'src/app/services/provider.service';





@Component({
  selector: 'app-lista-incidentes',
  templateUrl: './lista-incidentes.component.html',
  styleUrls: ['./lista-incidentes.component.css']
  
  
})
export class ListaIncidentesComponent implements OnInit {

  @Output() appListaIncidentes = new EventEmitter();
  incidentes:[] = [];
  urlGetImagen = 'http://localhost:5500/obtenerImagen/';
  incidente:any={};
  equipos:[] = [];
  
  
  constructor(private _p : ProviderService) {
    this.incidentesNuevos();
    
   }

  ngOnInit() {
    this._p.getEquipos().subscribe(
      (data:[])=>{
        this.equipos = data;
      }
    );
    
  }

  cargarDatos(item:any) {
    this.incidente = item;
    
    
   
    
  }
  

  cerrarComponente(){
    this.appListaIncidentes.emit(false);
  }


  incidentesNuevos(){
    
    this._p.incidentesNuevos().subscribe(
      (data:[])=>{
       
        if(data.length >0){
          for(let i of data){
            this.incidentes.push(i);
          }
        }
       
       
      },
      error=>{
        console.log(error);
      }
  

    );
  }

  verIncidente(item:any){
    console.log(item);
  }







}
