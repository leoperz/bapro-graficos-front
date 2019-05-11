import { Injectable, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ProviderService implements OnInit {

 

  constructor(private _http : HttpClient, private _l: LocalStorageService) { 
  
  }
  
 
  
  ngOnInit(): void {
   
  }

  url:string = 'http://localhost:5500/'

 

  guardarUsuario(json:any):any{
    console.log("el json que entra: ",json);
    return this._http.post(this.url+'guardarUsuario', json);
    
  }

  loguearUsuario(json:any){
    return this._http.post(this.url+'loguearUsuario', json);
  }

  actualizarUsuario(json:any){
    console.log("actualizarUsuario", json);
    return this._http.post(this.url+'actualizarUsuario', json);
  }

 
  guardarIncidente(json:any){
    
    let headers = new HttpHeaders({
      'Authorization':this._l.getToken()
    });
    
    return this._http.post(this.url+'altaIncidente',  json);
  }


  cantidadIncidentes(){
    return this._http.get(this.url+'cantidadIncidentes');
  }

  cantidadIncidentesPorEstado(){
    return this._http.get(this.url+'cantidadIncidentesPorEstado');
  }


}
