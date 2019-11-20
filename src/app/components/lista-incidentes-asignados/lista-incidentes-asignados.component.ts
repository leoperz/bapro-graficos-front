import { Component, OnInit, OnDestroy, Output, EventEmitter} from '@angular/core';
import { ProviderService } from 'src/app/services/provider.service';
import { Subject } from 'rxjs';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import {saveAs} from 'file-saver';
import * as alertify from 'alertifyjs';



@Component({
  selector: 'app-lista-incidentes-asignados',
  templateUrl: './lista-incidentes-asignados.component.html',
  styleUrls: ['./lista-incidentes-asignados.component.css']
})
export class ListaIncidentesAsignadosComponent implements OnInit, OnDestroy{

@Output() appListaIncidentesAsignados = new EventEmitter();

prompt:string;
dtOptions: DataTables.Settings = {};
dtTriggers: Subject<any> = new Subject();
flag:string="";
equipos:any;
_idEquipo:string = "";
identity:string[]=[];
array:any[]=[];
incidente:any = {
  titulo:"",
  descripcion:"",
  fechaAlta:{
    dia:"",
    mes:"",
    anio:""
  },
  fechaAparicion:{
    dia:"",
    mes:"",
    anio:""
  },
  adjunto:[],
  usuario:{
    nombre:""
  }
  
}


  constructor(private _p: ProviderService, private _ls: LocalStorageService ) {}

  ngOnInit() {
    this.identity = this._ls.getIdentity().equipo;
    
    
    

    if(this.identity.length > 1){
     
     this._p.getEquiposPorId(this.identity).subscribe((result:any)=>{
       
       this.equipos = result;
       
        });

        

    
      
        document.getElementById('btnOculto').click();
      
      
    }
    
    
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      language:{
        search:"Buscar",
        zeroRecords:"No hay informacion disponible",
        lengthMenu:"Mostrar _MENU_ por pagina",
        info:"Mostrando pagina _PAGE_ de _PAGES_",
        infoEmpty:"No hay mas registros",
        infoFiltered:"(Resultado de un total de _MAX_ registros)",
        paginate:{
          first:"Primero",
          last:"Ultimo",
          next:"Sig",
          previous:"Ant"
        }
      },
      
      
     
    };

   
       
  }

  ngOnDestroy(): void {
    
    this.dtTriggers.unsubscribe();
  }


  cerrarComponente(){
    
    this.appListaIncidentesAsignados.emit(false);
  }

  cargarTabla(){
    this._p.getInicidentesAsigados(this._idEquipo).subscribe((data:[])=>{
      this.array = data;
      
    });
    
  }

  private removerInicidente(id){
    console.log('entro en removerIncidente', id);
    this._p.removerIncidenteAsignado(id).subscribe(
      (data:any)=>{
        this.array = data;
      }
    );
  }

  verIncidente(item:any){

    this.incidente = item.incidente;
    console.log(this.incidente);
    document.getElementById('btnOculto2').click();
  }

  download(array:[]){
    for(let item of array ){
      this._p.downloadFile(item).subscribe(
        data=> saveAs(data, item),
        error=> console.log(error)
      );
    }
    
  }

  enviarMensaje(item:any){
    this.myPromise().then((response)=>{
      
    let payload = {
      motivo: response,
      incidente: item.incidente._id,
      equipo: item.equipo._id
    }
    this._p.guardarRechazados(payload).subscribe((data=>{
      console.log(data);
      this._p.cambiarEstadoIncidente(item.incidente, 'rechazado').subscribe(
        data=>{console.log(data)},
        error=>{console.log(error)}
      );
    }));
    this.removerInicidente(item._id);
    

    }).catch(error=>{
      console.log(error);
    });
    
   
   
  }


  myPromise(){
   return new Promise((resolve, reject)=>{
    alertify.prompt('Rechazar Incidente', 'Motivo del rechazo', 'mensaje', (evt, value)=>{
      this.prompt = value;
      
      resolve(value);
    }, ()=>{
      reject("cancelo");
    });
   });
  }




  

}
