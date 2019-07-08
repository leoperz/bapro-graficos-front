import { Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {mustMatch} from './funcion';
import {ProviderService} from '../../services/provider.service';
import {Router} from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as alertify from 'alertifyjs';
import { Observable } from 'rxjs';





@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Tecnologias!</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
    <ng-multiselect-dropdown
    [placeholder]="'seleccionar una o mas'"
    [data]="dropdownList"
    [(ngModel)]="selectedItems"
    [settings]="dropdownSettings">
      </ng-multiselect-dropdown>
    </div>
    <div class="modal-footer">
      <button id="close" type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Cerrar</button>
      <button type="button" class="btn btn-outline-primary" (click)="infoTec()" > Aceptar </button>
    </div>
  `
})
export class NgbdModalContent implements OnInit{

 
  dropdownList = [];
  dropdownSettings = {};
  selectedItems=[];
 
   ngOnInit(): void {

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
      allowSearchFilter: true
    };
   
  }
  


  constructor(public activeModal: NgbActiveModal, private _p: ProviderService) {
   
  }

  infoTec(){
    this._p.setListaTecnologias(this.selectedItems);
    document.getElementById('close').click();
  }


  
}




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  correo:string="";
  password:string="";
  registrado= true;
  registerForm: FormGroup;
  submitted = false;  
  recordame:any = false;
  tecnologias$: Observable<any[]>;
  tecnologias:any[]=[];
 
  constructor( private formBuilder: FormBuilder,
               private _provider: ProviderService,
               private _r: Router,
               private modalService: NgbModal ) {

                }










  ngOnInit() {
    this.tecnologias$ = this._provider.getTecnologias$();
    this.tecnologias$.subscribe(
      (data:any[])=>{
        
        if(data.length > 0){
          for(let item of data){
            console.log(item.item_text)
            this.tecnologias.push(item.item_text)
          }
        }
        let cadena:string = this.tecnologias.toString();
        document.getElementById('texto').setAttribute("value", cadena);
      }
      
      
    
      
      
      );
    
    
    
    
      this.registerForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      numeroLegajo: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      equipo:['', Validators.required],
      tecnologias:[''],
      password: ['', Validators.required],
      confirmpassword: ['', Validators.required]
    },
    {
      validator: mustMatch('password', 'confirmpassword')
    }
    );

    
  }

 

  get f(){
    return this.registerForm.controls;
  }

registrese(){
 if(this.registrado == true){
   this.registrado = false;
 }else{
   this.registrado = true;
 }
}


getRegistrado(){
  return this.registrado;
}

loguearUsuario(){
  console.log("entra en loguearUsuario");
  
  let json = {
    correo: this.correo,
    password: this.password
    
  };
  let identity:{} ={};
  let token:string = '';

  this._provider.loguearUsuario(json).subscribe(
    (result:any)=>{
    
      identity = result.usuario;
      token = result.token;
    },
    error=>{
      console.log("este es el mensaje del servidor",error.error.messagge);
      alertify.alert('Mensaje', error.error.messagge, ()=>{
        alertify.error('error');
      });
    },
    ()=>{

      // en el caso que este el check de recordar.
      // debo indicarlo en el identity.
      
      if(this.recordame){
        //agrego una propiedad al identity.
        (<any>identity).recordame= true;
      }else{
        (<any>identity).recordame=false;
      }
      
      
        localStorage.setItem('identity', JSON.stringify(identity));
        localStorage.setItem('token', token);
        alertify.alert('Mensaje', 'usuario logueado correctamente');
        this._r.navigateByUrl('/dashboard');
        this.correo = "";
        this.password = "";
      
    }
  );
}





onSubmit() {
  this.submitted = true;
  
  
  
  if (this.registerForm.invalid) {
    console.log("invalid form");
    return;
}

  let json= {
    nombre: this.registerForm.controls.nombre.value,
    apellido: this.registerForm.controls.apellido.value,
    equipo: this.registerForm.controls.equipo.value,
    numeroLegajo: this.registerForm.controls.numeroLegajo.value,
    correo: this.registerForm.controls.correo.value,
    tecnologias: this.tecnologias,
    password: this.registerForm.controls.password.value,
    imagen:'sin-foto.jpg'
  };

  this._provider.guardarUsuario(json).subscribe(
    result=>{
      console.log("resultado de guardarUsuario",result);
    }, 
    error=>{
      console.log(error);
      alertify.alert('Mensaje', 'ha ocurrido un error',()=>{alertify.error('error')});
    },
    ()=>{
      // si todo esta bien ruteamos a la pagina de login 
      console.log("todo fue ok");
      alertify.alert('Mensaje', 'Se ha registrado correctamente', ()=>{
        alertify.success('ok');
        this.registerForm.reset();
        this.registrese();

      });
      

    }
  );
  
}

open() {
  
  this.modalService.open(NgbdModalContent);
  
  
}



}



