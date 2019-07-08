import { Component, OnInit} from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Router } from '@angular/router';
import { WebsocketService } from 'src/app/services/websocket.service';
import { ProviderService } from 'src/app/services/provider.service';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
 
  
  usuarioLogueado:any={};
  urlGetImagen = 'http://localhost:5500/obtenerImagen/';
  identity: any;
  altaIncidente:boolean = false;
  listaIncidentes: boolean = false;
  incidentesNuevos:number=0;
  incidentesResueltos:number=0;
  incidentesAsignados:number=0;
  incidentesTotales:number=0;
  porcentaje=35;
  constructor(private _ls: LocalStorageService, private _r : Router,
              private _ws: WebsocketService, private _p : ProviderService ) {
   
                this.usuarioLogueado = this._ls.getIdentity();
                this.incidentesPorEstado();
                
                
   
   
   }

   //estados posibles
   //1-asigado
   //2-nuevo
   //3-resuelto

   private incidentesPorEstado(){
     this._p.cantidadIncidentesPorEstado().subscribe(
       (data:any)=>{
         
        for(let i of data){
          if(i._id =="asignado"){
            this.incidentesAsignados = i.count;
            this.incidentesTotales += this.incidentesAsignados;
          }if(i._id=="nuevo"){
            this.incidentesNuevos = i.count;
            this.incidentesTotales += this.incidentesNuevos;
          }if(i._id=="resuelto"){
            this.incidentesResueltos = i.count;
            this.incidentesTotales += this.incidentesResueltos;
          }
        };
       },
       error=>{

       }
     );
   }

  ngOnInit() {
   
   this.identity = this._ls.getIdentity();
   this.escucharEvento();
   
   
  }



  iraPerfil(){
    this._r.navigateByUrl('/perfil');
  }

  mostrarAltaIncidente($element){
    this.altaIncidente = true;
    setTimeout(() => {
      $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    }, 300);
   
  }


  mostrarListaIncidentes($element){
    this.listaIncidentes = true;
    setTimeout(() => {
      $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    }, 300);
    
  }

  /*iraListaIncidentes(){
    this._r.navigateByUrl('/listaIncidentes');
  }*/

  cerrarIncidente(respuesta:any){
    this.altaIncidente = respuesta;
  }

  cerrarListaIncidentes(respuesta:any){
    this.listaIncidentes = respuesta;
  }



  escucharEvento(){
    this._ws.esucucharEvento('cantidad-incidentes').subscribe(
      (data:any)=>{
        this.incidentesTotales = data;
        console.log("cantidad de incidentes nuevos (socket)",this.incidentesNuevos);
      },
      err=>{

      }
    );
  }

  escucharEventoIncidentesResueltos(){
    this._ws.esucucharEvento('incidentes-resueltos').subscribe(
      (data:any)=>{
        this.incidentesResueltos = data;
      }
    );
  }



  applyStyles(){
    const styles = {'width' : this.porcentaje+'%'};
    return styles;
  }
}







