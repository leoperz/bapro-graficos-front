import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  identity:any ;
  token:string='';
  
  constructor() { 
    console.log("inicia el localStorage");
    if(localStorage.getItem('identity')){
      this.identity = JSON.parse(localStorage.getItem('identity'));
    }
    if(localStorage.getItem('token')){
      this.token = localStorage.getItem('token');
    }
  }

  
  getIdentity(){
    return this.identity;
  }

  getToken(){
    return this.token;
  }
}
