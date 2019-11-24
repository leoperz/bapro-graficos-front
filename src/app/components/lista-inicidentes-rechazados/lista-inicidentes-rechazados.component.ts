import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ProviderService } from 'src/app/services/provider.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Subject } from 'rxjs';
import { WebsocketService } from 'src/app/services/websocket.service';


@Component({
  selector: 'app-lista-inicidentes-rechazados',
  templateUrl: './lista-inicidentes-rechazados.component.html',
  styleUrls: ['./lista-inicidentes-rechazados.component.css']
})
export class ListaInicidentesRechazadosComponent implements OnInit {

  @Output() appListaIncidentesRechazados = new EventEmitter();
  
  
  item:any=null;
  array:any[]=[];
  payload:[]=[];
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
  _idEquipo:string = "";
  equipos:any;
  identity:string[]=[];
  dtOptions: DataTables.Settings = {};
  dtTriggers: Subject<any> = new Subject();


  constructor(private _p : ProviderService, private _ls: LocalStorageService, private _ws: WebsocketService ) { }

  ngOnInit() {
    this._ws.esucucharEvento('mensaje-general').subscribe(
      (data:[])=>{
        this.array = data;
      }
    );

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

    this.actualizarTabla();
 

  }



  cerrarComponente(){
    this.appListaIncidentesRechazados.emit(false);
  }

  guardarItem(item:any){
    this.item = item;
    document.getElementById("auxiliar").click();
  }

  delete(){
    if(this.item!=null){
      this._p.borrarIncidenteRechazado(this.item._id).subscribe(
        data=>{
          this.borrarElemento(this.item);
          this._ws.emit('mensaje', this.array);
        },
        error=>{
          console.log(error);
        }
      );
    }
  }

  actualizarTabla(){
    this._p.getIncidentesRechazados().subscribe(
      (data:[])=>{
        this.array = data;
        
      },
      error=>{
  
      }
    );
  }

  private borrarElemento(item:any){
    let i = this.array.indexOf(item);
    if(i != -1){
      this.array.splice(i, 1);
    }

  }
  

}
