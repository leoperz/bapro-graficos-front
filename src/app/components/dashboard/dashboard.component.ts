import { Component, OnInit} from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Router } from '@angular/router';
import { WebsocketService } from 'src/app/services/websocket.service';
import { ProviderService } from 'src/app/services/provider.service';
import AOS from 'aos';
import { Observable } from 'rxjs';
import * as moment from 'moment';







@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
 
  usuariosActivosAux: string[] = ['pepe', 'javier', 'roberto', 'sergio', 'daiana', 'belen', 'nancy', 'milton', 'federico', 'malena','pepe', 'javier', 'roberto', 'sergio', 'daiana', 'belen', 'nancy', 'milton', 'federico', 'malena', 'pepe', 'javier', 'roberto', 'sergio', 'daiana', 'belen', 'nancy', 'milton', 'federico', 'malena'];
  usuariosActivos: Observable<any>;
  usuarioLogueado:any={};
  urlGetImagen = 'http://localhost:5500/obtenerImagen/';
  identity: any;
  altaIncidente:boolean = false;
  listaIncidentes: boolean = false;
  listaInicidentesAsignados: boolean = false;
  listaInicidentesRechazados: boolean = false;
  incidentesNuevos:number=0;
  incidentesResueltos:number=0;
  incidentesAsignados:number=0;
  incidentesTotales:number=0;
  porcentaje=35;
  notificaciones:any[]=[];
  count:number=0;
  

  constructor(private _ls: LocalStorageService, private _r : Router,
              private _ws: WebsocketService, private _p : ProviderService ) {
                AOS.init();
   
                this.usuarioLogueado = this._ls.getIdentity();
                this.incidentesPorEstado();
                this._p.conditionNotifications({_id:this.usuarioLogueado._id}).subscribe(
                  (data:[])=>{
                    this.notificaciones=data;
                    this.count=data.length;
                  }
                );
                
                
                
   
   
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
  
  
       

   this._ws.esucucharEvento('mensaje-sala-srv').subscribe(
     (data:any)=>{
       data.fecha=moment().locale('es').format("MMMM DD, YYYY HH:mm:ss"); 
       data.usuario = this.identity._id
       this.notificaciones.push(data);
       this.count++;
       this.guardarNotificaciones(data);
     }
   );



   this.usuariosActivos = this._ws.esucucharEvento('usuarios-activos');
   this._ws.esucucharEvento('mensaje-privado-srv').subscribe(
     data=>{
       console.log("mensaje privado",data);
     }
   );
   this._ws.esucucharEvento('incidente-asignado').subscribe(
     data=>{console.log(data)}
   );
   
   this.identity = this._ls.getIdentity();
   this.escucharEvento();
     
   
   
   
  }

  enviarMensaje(){
    
    this._r.navigateByUrl('/mensaje');
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

  mostrarListaIncidentesAsignados($element){
    this.listaInicidentesAsignados = true;
    setTimeout(() => {
      $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    }, 300);
  }


  mostrarListaIncidentesRechazados($element){
    this.listaInicidentesRechazados = true;
    setTimeout(() => {
      $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    }, 300);
  }




  cerrarIncidente(respuesta:any){
    this.altaIncidente = respuesta;
  }

  cerrarListaIncidentes(respuesta:any){
    this.listaIncidentes = respuesta;
  }

  cerrarListaIncidentesAsignados(respuesta:any){
    this.listaInicidentesAsignados = respuesta;
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

  chat(item:any){
    
    this._ws.emit('mensaje', item);
  }

  limpiarNotificaciones(){
    this.notificaciones=[];
    this.count=0;
  }

  guardarNotificaciones(payload:any){
    this._p.guardarNotificacion(payload).subscribe(
      data=>{
        console.log(data);
      }
    );
  }

  notificacion(item:any){
    if(item.mensaje=="Se ha asignado un nuevo incidente al equipo"){
      document.getElementById("asignados").click();
      let aux = this.notificaciones.indexOf(item);
      this.notificaciones.splice(aux,1);
      this.count--;
      //ahora debo marcarlo como leido en la base de datos.
      this._p.modificarNotificacion(item).subscribe();
    }
    
  }
}








