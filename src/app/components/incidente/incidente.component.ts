import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { ProviderService } from 'src/app/services/provider.service';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import * as alertify from 'alertifyjs';
import { LocalStorageService } from 'src/app/services/local-storage.service';


@Component({
  selector: 'app-incidente',
  templateUrl: './incidente.component.html',
  styleUrls: ['./incidente.component.css']
})
export class IncidenteComponent implements OnInit {

  
  @Output() appIncidente = new EventEmitter();
  filesToUpload: Array<File>;
  public cerrar : boolean = false;
  registerForm: FormGroup;
  url = 'http://localhost:5500/';


  constructor(private _p: ProviderService, private fb: FormBuilder,
    private _ls : LocalStorageService) { 
    
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


  guardarIncidente(form:any){
    
    
    console.log(form);

    let payload: any = {};
    payload.titulo = form.titulo;
    payload.numeroSpring = form.numeroSpring;
    payload.descripcion = form.descripcion;
    payload.transaccion = form.transaccion;
    payload.fecha_primer_reclamo = form.fecha_primer_reclamo;
    payload.estado = "nuevo";
    console.log(payload.fecha_primer_reclamo)
   
    this._p.guardarIncidente(payload).subscribe(
      data=>{
        console.log(data);
      },
      error=>{
        let mensaje:string = error.error.messagge;
        console.log("este es el error:", error.error.messagge);
        alertify.alert('Mensaje', mensaje);
      },
      ()=>{
        alertify.alert('mensaje', 'Se ha dado de alta un nuevo incidente');
        setTimeout(() => {
          this.registerForm.reset();
        }, 50);
      }
    );
  }


  subirArchivo(fileInput:any){
    
    this.filesToUpload = <Array<File>>fileInput.target.files;
    if(this.filesToUpload){
      
      this.makeFileRequest(this.url+'adjuntarArchivo', [], this.filesToUpload)
      .then(
        (result:any)=>{
          console.log("asi queda result =>",result);
        }
      );
    }
  }



  makeFileRequest(url:string, params: Array<string>, files:Array<File>){
    let token = this._ls.getToken();
    return new Promise(function(resolve, reject){
      let formData:any = new FormData();
      let xhr = new XMLHttpRequest();
      for(let i = 0 ; i < files.length; i++){
        formData.append('image', files[i], files[i].name);
      }
      xhr.onreadystatechange = function(){
        if(xhr.readyState ==4){
          
          if(xhr.status == 200){
            resolve(JSON.parse(xhr.response));
          }else{
            reject(xhr.response);
          }
          
          
        }
      }   
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization',token);
      xhr.send(formData);
    });
  }




}
