import { Injectable, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';
import { Subject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class ProviderService implements OnInit {

 private tecnologias$ = new Subject<any[]>();
 private equipos$ = new Subject<any[]>();
 url:string = 'http://localhost:5500/'
 listaTecnologias:any[] =[];
 listaEquipos:any[] = [];

  constructor(private _http : HttpClient, private _l: LocalStorageService) { 
  
  }
  
 
  
  ngOnInit(): void {
   
  }

  
test(){
  console.log('prueba');
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



  getEquiposMultiselect(){
    let array = [];
    this._http.get(this.url+'equipos').subscribe(
      (data:any[])=>{
        for(let {item,index} of data.map((item, index)=>({item ,index}))){
          array.push({name:item.nombre, alpha3Code:index+1, id:item._id});
        }
      }
    );
    return array;
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
    console.log(body);
   return this._http.post(this.url+'download', body, {
     responseType:'blob',
     headers: new HttpHeaders().append('Content-Type', 'application/json')
   });
 }


 descargarDocumento(file:string){
    return this._http.get(this.url+'descargarDocumento'+'/'+file);
 }




 setListaTecnologias(array:any[]){
  for(let item of array){
    this.listaTecnologias.push(item);
  }
  this.tecnologias$.next(this.listaTecnologias);
 }


 setListaEquipos(array:any[]){
  for(let item of array){
    this.listaEquipos.push(item);
    
  }
  
  this.equipos$.next(this.listaEquipos);
 }


 getUsuariosActivos(){
   return this._http.get(this.url+'usuariosActivos');
 }





 getTecnologias$(){
   return this.tecnologias$.asObservable();
 }

 getEquipos$(){
  return this.equipos$.asObservable();
}

getInicidentesAsigados(ids:any){
  
  return this._http.get(this.url+'incidentesAsignados'+'/'+ids);

}

getIncidentesRechazados(){
  return this._http.get(this.url+'incidentesRechazados');
}

getEquiposPorId(ids:string[]){
  
  return this._http.post(this.url+'getEquiposPorId', ids);
}

cambiarEstadoIncidente(id:string, estado:string){
  
  let payload = {
    id:id,
    estado:estado
  }
  return this._http.post(this.url+'cambiarEstadoIncidente',payload);
}

guardarRechazados(payload:any){
  console.log(payload);
  return this._http.post(this.url+'guardarRechazados', payload);
  
}

removerIncidenteAsignado(id){
  let payload = {
    id:id
  }
  return this._http.post(this.url+'removerIncidenteAsignado', payload);

  }
}




