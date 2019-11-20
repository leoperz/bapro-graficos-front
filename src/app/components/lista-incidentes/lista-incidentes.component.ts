import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { ProviderService } from 'src/app/services/provider.service';
import * as alertify from 'alertifyjs';
import { WebsocketService } from 'src/app/services/websocket.service';
import { HttpClient } from '@angular/common/http';
import {saveAs} from 'file-saver';



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
  _idEquipo:Number;
  adjuntos:any = [];
  element: HTMLElement;
  fechaAux : string;
  

  
  
  constructor(private _p : ProviderService, private _w : WebsocketService, private _http : HttpClient,
                ) {
    this.incidentesNuevos();
    
    
   }

  ngOnInit() {
    
    this._p.getEquipos().subscribe(
      (data:[])=>{
        this.equipos = data;
      }
    );
    this.escucharEvento();
    this._w.esucucharEvento('mensaje-sala-srv').subscribe(
      (data:any)=>{
        this.incidentes = data.incidentes;
      }
    );
  }



  cargarDatos(item:any) {
    this.incidente = item;
    this.fechaAux = item.fechaAlta.dia+'/'+item.fechaAlta.mes+'/'+item.fechaAlta.anio;
    
    }
  

  cerrarComponente(){
    this.appListaIncidentes.emit(false);
  }


  incidentesNuevos(){
    
    this._p.incidentesNuevos().subscribe(
      (data:[])=>{
       
        this.incidentes = data;
       
       
      },
      error=>{
        console.log(error);
      }
  

    );
  }

  asignarIncidente(_idIncidente:string){
    let payload = {
      _idIncidente : _idIncidente,
      _idEquipo : this._idEquipo
    };

    this._p.asignarIncidente(payload).subscribe(
      data=>{
        alertify.alert('Mensaje', 'Incidente asignado correctamente');
        this.incidentesNuevos();
        
        let objeto={
          mensaje:'Se ha asignado un nuevo incidente al equipo',
          sala: payload._idEquipo,
          incidentes:this.incidentes
        }
        
        this._w.emit('mensaje-sala', objeto);
        
      

      },
      error=>{
        console.log(error);
        alertify.alert('Mensaje', 'No se ha podido asignar el incidente');
      }
    );
    

   


    
  }



escucharEvento(){
  this._w.esucucharEvento('incidentes-nuevos').subscribe(
    data=>{
      //ejecuto nuevamente la busqueda de los incidentes nuevos
      console.log(data);
      this.incidentes = [];
      this.incidentesNuevos();
    }
  );
}


download(incidente:any){
  
  for(let i of incidente.adjunto){

    this._p.downloadFile(i).subscribe(
      data=> saveAs(data, i),
      error=> console.log(error)
    );

  }
  
  
  }
  






}
