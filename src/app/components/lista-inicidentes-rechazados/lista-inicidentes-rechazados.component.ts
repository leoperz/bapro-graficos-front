import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ProviderService } from 'src/app/services/provider.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-lista-inicidentes-rechazados',
  templateUrl: './lista-inicidentes-rechazados.component.html',
  styleUrls: ['./lista-inicidentes-rechazados.component.css']
})
export class ListaInicidentesRechazadosComponent implements OnInit {

  @Output() appListaIncidentesRechazados = new EventEmitter();
  
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
  _idEquipo:string = "";
  equipos:any;
  identity:string[]=[];
  dtOptions: DataTables.Settings = {};
  dtTriggers: Subject<any> = new Subject();


  constructor(private _p : ProviderService, private _ls: LocalStorageService ) { }

  ngOnInit() {

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

    this.identity = this._ls.getIdentity().equipo;

    if(this.identity.length > 1){
     
      this._p.getEquiposPorId(this.identity).subscribe((result:any)=>{
        
        this.equipos = result;
        
         });
 
         
 
     
       
         document.getElementById('btnOculto').click();
       
       
     }

    this._p.getIncidentesRechazados().subscribe(
      (data:[])=>{
        this.array = data;
      },
      error=>{

      }
    );

  }



  cerrarComponente(){
    this.appListaIncidentesRechazados.emit(false);
  }

}
