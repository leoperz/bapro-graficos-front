import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {mustMatch} from '../login/funcion';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ProviderService } from 'src/app/services/provider.service';
import * as alertify from 'alertifyjs';
import {Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuariosActivos: Observable<any>;
  filesToUpload: Array<File>;
  identity:any;
  token:any;
  url = 'http://localhost:5500/';
  urlGetImagen = 'http://localhost:5500/obtenerImagen/';
  dropdownList = [];
  settings = {};
  dropdownSettings={};
  itemList:any = [];
  opciones = {};
  itemSeleccionado=[];
 
  selectedItems = [];
  registerForm: FormGroup;
  submitted = false;
  equipos$: Observable<any[]>;

  constructor(private _ls: LocalStorageService, private fb: FormBuilder, 
              private _p: ProviderService, private _r: Router , private http: HttpClient,
              private _ws : WebsocketService) {

               
    this.identity = _ls.getIdentity();
    
    this.token = _ls.getToken();

    
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      numeroLegajo: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      equipos:[''],
      tecnologias:[''],
      password: ['', Validators.required],
      confirmpassword: ['', Validators.required]
    },
    {
      validator: mustMatch('password', 'confirmpassword')
    }
    );
    
    
   }

   ngOnInit(): void {
     
    this.usuariosActivos = this._ws.esucucharEvento('usuarios-activos');
      this.itemList = this._p.getEquiposMultiselect();
      

        this.opciones = {
          text: "Selecciona uno o mas",
          selectAllText: 'Selecionar Todos',
          unSelectAllText: 'Deseleccionar',
          classes: "myclass custom-class",
          primaryKey: "alpha3Code",
          labelKey: "name",
          enableSearchFilter: true,
          searchPlaceholderText:'Buscar',
          searchBy: ['name']
      };  
   

    
    this.dropdownList = [
      { item_id: 1, item_text: 'Mule' },
      { item_id: 2, item_text: 'Javascript' },
      { item_id: 3, item_text: '.net' },
      { item_id: 4, item_text: 'Cobol' },
      
    ];

    

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Seleccionar todo',
      unSelectAllText: 'Deseleccionar',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      searchPlaceholderText:'Buscar'
    };
  }





  //como se modifica el usuario es necesario volver a crear en el localstorage
  //el identity y el token.
  actualizarUsuario(form:any){
  let auxiliar: any = {};
  // no puedo saber los datos del form 


  auxiliar.nombre = form.nombre == "" ? this.identity.nombre : form.nombre;
  auxiliar.apellido = form.apellido =="" ? this.identity.apellido : form.apellido;
  auxiliar.numeroLegajo = form.numeroLegajo == "" ? this.identity.numeroLegajo : form.numeroLegajo;
  auxiliar.correo = form.correo == "" ? this.identity.correo : form.correo; 
  auxiliar.tecnologias = this.selectedItems.length >0 ? this.selectedItems : this.identity.tecnologias;
  auxiliar.equipos = this.itemSeleccionado.length >0 ? this.itemSeleccionado : this.identity.equipo;
  
  

  if(form.password != ""){
    auxiliar.password = form.password;
  
  }
  
  this._p.actualizarUsuario(auxiliar).subscribe(
    
    (result:any)=>{
      

       //Hay que generar de nuevo el identity y el token.
       if(localStorage.getItem('identity')){
        localStorage.removeItem('identity');
      }
      if(localStorage.getItem('token')){
        localStorage.removeItem('token');
      }
      localStorage.setItem('identity',JSON.stringify(result.usuario));
      localStorage.setItem('token', JSON.stringify(result.token));
    }, 
    error=>{
      alertify.alert('Mensaje', error.error.messagge);
    }, 
    ()=>{
      alertify.alert('Mensaje', 'se han guardado los cambios');
     
      
    }
  );
    
    
    
    
    
  }
  

  
  subirArchivo(fileInput:any){
   
    this.filesToUpload = <Array<File>>fileInput.target.files;
    if(this.filesToUpload){
      
      this.makeFileRequest(this.url+'subirImagen/'+this.identity._id, [], this.filesToUpload)
      .then(
        (result:any)=>{
          
          // hay que actualizar identity y el localStorage
          this.identity.imagen = result.imagen;
          
          if(localStorage.getItem('identity')){
            localStorage.removeItem('identity');
            localStorage.setItem('identity', JSON.stringify(this.identity));
          }
        }
      );
    }
  }

  makeFileRequest(url:string, params: Array<string>, files:Array<File>){
    let token = this.token;
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



 iraDashboard(){
   this._r.navigateByUrl('/dashboard');
 }



}
