import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { ProviderService } from 'src/app/services/provider.service';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import * as alertify from 'alertifyjs';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import {FileUploader} from 'ng2-file-upload';
import * as moment from 'moment';


const uri = 'http://localhost:5500/adjuntarArchivoMultiple';


@Component({
  selector: 'app-incidente',
  templateUrl: './incidente.component.html',
  styleUrls: ['./incidente.component.css']
})
export class IncidenteComponent implements OnInit {
  
  uploader:FileUploader = new FileUploader({url:uri});
  adjuntos:any = [];
  
  
  
  @Output() appIncidente = new EventEmitter();
  filesToUpload: Array<File>;
  public cerrar : boolean = false;
  registerForm: FormGroup;

  constructor(private _p: ProviderService, private fb: FormBuilder,
    private _ls : LocalStorageService) {
      
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
        data=>{
          console.log(data);
        },
        err=>{
         
          let mensaje = err.error.messagge;
          alertify.alert('Mensaje', mensaje);
        },
        ()=>{
          setTimeout(() => {
            alertify.alert('Mensaje', 'se ha dado de alta un nuevo incidente');
          }, 1000);
          
          
          
          
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
}
