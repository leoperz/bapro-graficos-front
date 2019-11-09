import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { ProviderService } from 'src/app/services/provider.service';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import * as alertify from 'alertifyjs';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import {FileUploader} from 'ng2-file-upload';
import * as moment from 'moment';
import { HttpClient} from '@angular/common/http';


const uri = 'http://localhost:5500/adjuntarArchivoMultiple';


@Component({
  selector: 'app-incidente',
  templateUrl: './incidente.component.html',
  styleUrls: ['./incidente.component.css']
})
export class IncidenteComponent implements OnInit {
  
  uploader:FileUploader = new FileUploader({url:uri});
  adjuntos:any = [];
  equipos:[] = [];
  mostrar:boolean = false;
  _idEquipo: Number;
  json:any = {_idEquipos:"", _idIncidente:""};
  
  @Output() appIncidente = new EventEmitter();
  filesToUpload: Array<File>;
  public cerrar : boolean = false;
  registerForm: FormGroup;

  constructor(private _p: ProviderService, private fb: FormBuilder,
    private _ls : LocalStorageService, private http: HttpClient) {
      
      this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any)=>{
        this.adjuntos.push(JSON.parse(response));
      
      }
    
      this.registerForm = this.fb.group({
      titulo:['', Validators.required],
      descripcion: ['', Validators.required],
      numeroSpring: [''],
      transaccion:[''],
      fecha_primer_reclamo: ['']
    });

    
  }

  ngOnInit() {
  }

  cerrarComponente(){
    
    this.appIncidente.emit(false);
  }

  private getEquipos(){
    this._p.getEquipos().subscribe(
      (data:any)=>{
        this.equipos = data;
        this.mostrar=true;
      }
      
    );
  }


  private subirArchivos(){
    return new Promise((resolve, reject)=>{
      this.uploader.uploadAll();
      
      resolve(true);
    });
  }


  guardarIncidente(form:any){


   this.subirArchivos().then(
     ()=>{
    
    
    setTimeout(() => {
      
     
     
      console.log("asi queda adjuntos", this.adjuntos)
      let payload: any = {};
      let array:string[]=[];
      payload.titulo = form.titulo;
      payload.numeroSpring = form.numeroSpring;
      payload.descripcion = form.descripcion;
      payload.transaccion = form.transaccion;
      payload.fecha_primer_reclamo = form.fecha_primer_reclamo;
      payload.estado = "nuevo";
      
      for(let item of this.uploader.queue){
        array.push(moment().date()+'-'+moment().month()+'-'+moment().year()+'.'+ item.file.name);
      }


      payload.adjunto = array;

      this._p.guardarIncidente(payload).subscribe(
        (data:any)=>{
          console.log("asi viene data",data);
          setTimeout(() => {
            document.getElementById('btnOculto').click();
            this.http.get('http://localhost:5500/generarGraficosMensuales').subscribe((data:any)=>{});
            this.json._idIncidente = data._id;
            
            
            
          }, 500);
         
         

        },
        err=>{
         
          let mensaje = err.error.messagge;
          alertify.alert('Mensaje', mensaje);
        },
        ()=>{
         
          this.registerForm.reset();
          
          document.getElementsByName("borrar").forEach((value:any)=>{
            value.click();
          });
           
          
          
        }
      );


    }, 1000);
    
     }
   ).catch(
     (err)=>{
       console.log(err)
     }
   ); 
    
    
  }

  asignar():void{
    
    
    if(this._idEquipo == null){
      alertify.alert('Mensaje', "Debe informar el nombre del equipo");
      return;
    }
    this.json._idEquipo= this._idEquipo;
    
    this._p.asignarIncidente(this.json).subscribe(
      data=>{
        alertify.alert('Mensaje', "incidente asignado correctamente");
        this.mostrar = false;
        
      }, 
      error=>{
        alertify.alert('Error', error);
      }
    );
  }
}
