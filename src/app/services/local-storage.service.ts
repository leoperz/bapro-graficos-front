import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  identity:any ;
  token:string='';
  
  constructor() { 
   
  }

  
  getIdentity(){
    
    if(localStorage.getItem('identity')){
      
      this.identity = JSON.parse(localStorage.getItem('identity'));
    }
    return this.identity;
  }

  getToken(){
    if(localStorage.getItem('token')){
      this.token = localStorage.getItem('token');
      
  }
  return this.token;
}


}
