import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {mustMatch} from './funcion';
import {ProviderService} from '../../services/provider.service';
import {Router} from '@angular/router';

import * as alertify from 'alertifyjs';


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
 
  constructor( private formBuilder: FormBuilder,
               private _provider: ProviderService,
               private _r: Router) {

                }

  ngOnInit() {
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
    tecnologias: this.registerForm.controls.tecnologias.value,
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



}



