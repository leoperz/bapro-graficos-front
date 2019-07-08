import { Injectable, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProviderService implements OnInit {

 private tecnologias$ = new Subject<any[]>();
 url:string = 'http://localhost:5500/'
 listaTecnologias:any[] =[];

  constructor(private _http : HttpClient, private _l: LocalStorageService) { 
  
  }
  
 
  
  ngOnInit(): void {
   
  }

  


 

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
    json.correo = this._l.getIdentity().correo;
    
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


  incidentesNuevos(){
    return this._http.get(this.url+'incidentesNuevos');
  }

  getEquipos(){
    return this._http.get(this.url+'equipos');
  }


  asignarIncidente(json:any){
    return this._http.post(this.url+'asignarIncidente', json);
  }

 obtenerImagen(archivo:string){
   console.log("llega al servicio: ", archivo);
   return this._http.get(this.url+'obtenerImagen'+'/'+archivo);
 }

 downloadFile(file:String){
   let body = {filename:file};

   return this._http.post(this.url+'download', body, {
     responseType:'blob',
     headers: new HttpHeaders().append('Content-Type', 'application/json')
   });
 }

 setListaTecnologias(array:any[]){
  for(let item of array){
    this.listaTecnologias.push(item);
  }
  this.tecnologias$.next(this.listaTecnologias);
 }

 getTecnologias$(){
   return this.tecnologias$.asObservable();
 }


}
